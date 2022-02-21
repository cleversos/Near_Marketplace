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
