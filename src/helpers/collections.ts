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
      `{"account_id": "${accountId}", "from_index": "0", "limit": 100}`
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
      `{"nft_contract_id": "${collectionId}", "from_index": "0", "limit": 50}`
    ),
    finality: "optimistic",
  })
  const sales = JSON.parse(Buffer.from(rawResult.result).toString())
  return sales
}
