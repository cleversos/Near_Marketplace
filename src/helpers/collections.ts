import { arrayBuffer } from "stream/consumers"

export const getCollections = async (provider, contractAccountId) => {
  try {
    // get collections from contract
    const rawResult: any = await provider.query({
      request_type: "call_function",
      account_id: contractAccountId,
      method_name: "get_collections",
      args_base64: btoa(`{}`),
      finality: "optimistic",
    })
    const results = JSON.parse(Buffer.from(rawResult.result).toString())

    return results.map((result) => {
      const {
        nft_contract_id,
        token_type,
        name,
        isVerified,
        bannerImageUrl,
        links,
        profileImageUrl,
        royalty,
        description,
        updated_at,
      } = result[1]
      return {
        collectionId: nft_contract_id,
        tokenType: token_type,
        name,
        isVerified,
        bannerImageUrl,
        links,
        profileImageUrl,
        royalty,
        description,
        updated_at
      }
    })
  } catch (error) {
    console.log(error)
  }
}

export const getUserTokensInACollection = async (
  collectionId,
  provider,
  accountId
) => {
  const rawResult: any = await provider.query({
    request_type: "call_function",
    account_id: collectionId,
    method_name: "nft_tokens_for_owner",
    args_base64: btoa(
      `{"account_id": "${accountId}", "from_index": "0", "limit": 200}`
    ),
    finality: "optimistic",
  })
  return JSON.parse(Buffer.from(rawResult.result).toString())
}

export const getAllSalesInCollection = async (
  provider,
  contractAccountId,
  collectionId
) => {
  const rawResult: any = await provider.query({
    request_type: "call_function",
    account_id: contractAccountId,
    method_name: "get_sales_by_nft_contract_id",
    args_base64: btoa(
      `{"nft_contract_id": "${collectionId}", "from_index": "0", "limit": 200}`
    ),
    finality: "optimistic",
  })
  const sales = JSON.parse(Buffer.from(rawResult.result).toString())
  return sales
}

export const getUserSalesInMarketplace = async (
  provider,
  contractAccountId,
  accountId
) => {
  const rawResult: any = await provider.query({
    request_type: "call_function",
    account_id: contractAccountId,
    method_name: "get_sales_by_owner_id",
    args_base64: btoa(
      `{"account_id": "${accountId}", "from_index": "0", "limit": 200}`
    ),
    finality: "optimistic",
  })
  const sales = JSON.parse(Buffer.from(rawResult.result).toString())

  const sale_id_map = new Map<string, Array<string>>();
  for (let sale of sales) {
    let id_array = sale_id_map.get(sale.nft_contract_id);
    if (id_array == undefined) {
      id_array = [];
    }
    id_array.push(sale.token_id);
    sale_id_map.set(sale.nft_contract_id, id_array);
  }

  let tokens = new Array();
  let key = sale_id_map.keys();
  for (let next = key.next(); next.value != null; next = key.next()) {
    const value = sale_id_map.get(next.value);
    const valueArray = value.map(element => {
      return '"' + element + '"'
    }).join();
    let tokensForCollection = [];
    try {
      const rawTokenResult: any = await provider.query({
        request_type: "call_function",
        account_id: next.value,
        method_name: "nft_tokens_batch",
        args_base64: btoa(
          `{"token_ids": [` + valueArray + `]}`
        ),
        finality: "optimistic",
      })
      tokensForCollection = JSON.parse(Buffer.from(rawTokenResult.result).toString())
    } catch (error) {
      for (let tokenId of value) {
        try {
          const rawTokenResult: any = await provider.query({
            request_type: "call_function",
            account_id: next.value,
            method_name: "nft_token",
            args_base64: btoa(
              `{"token_id": "` + tokenId + `"}`
            ),
            finality: "optimistic",
          })
          const tokenInfo = JSON.parse(Buffer.from(rawTokenResult.result).toString())
          tokensForCollection.push(tokenInfo)
        } catch (error) {
          console.log(error, tokenId, "error on nft_token")
        }
      }
    }
    for (let j = 0; j < tokensForCollection.length; j++) {
      tokens[tokens.length] = tokensForCollection[j];
    }
  }

  // merge sale listing with nft token data
  for (let i = 0; i < sales.length; i++) {
    const { token_id, nft_contract_id } = sales[i];
    let token = tokens.find(({ token_id: t }) => t === token_id);
    // don't have it in batch, go find token data
    if (!token) {
      const rawTokenResult: any = await provider.query({
        request_type: "call_function",
        account_id: nft_contract_id,
        method_name: "nft_token",
        args_base64: btoa(
          `{"token_id": "${token_id}", "from_index": "0", "limit": 200}`
        ),
        finality: "optimistic",
      })
      token = JSON.parse(Buffer.from(rawResult.result).toString())
    }
    sales[i] = Object.assign(sales[i], token);
  }
  return sales
}