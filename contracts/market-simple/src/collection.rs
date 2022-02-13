use crate::*;
use near_sdk::promise_result_as_success;

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct CollectionLinks {
    pub discord: String,
    pub twitter: String,
    pub website: String,
    pub telegram: String,
    pub instagram: String,
    pub medium: String,
}

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct CollectionInfo {
    pub nft_contract_id: AccountId,
    pub token_type: String,
    pub name: String,
    pub isVerified: bool,
    pub bannerImageUrl: String,
    pub profileImageUrl: String,
    pub description: String,
    pub royalty: u64,
    pub links: CollectionLinks,
}

#[near_bindgen]
impl Contract {
    /// for add sale see: nft_callbacks.rs

    /// TODO remove without redirect to wallet? panic reverts
    #[payable]
    pub fn add_collection(&mut self,
        nft_contract_id: AccountId,
        token_type: String,
        name: String,
        isVerified: bool,
        bannerImageUrl: String,
        profileImageUrl: String,
        description: String,
        royalty: u64,
        discord: String,
        twitter: String,
        website: String,
        telegram: String,
        instagram: String,
        medium: String,
    ) {
        let sender_id = env::predecessor_account_id();
        let signer_id = env::signer_account_id();
        let nft_contract: AccountId = nft_contract_id.clone();
        assert_eq!(sender_id, signer_id, "Must be admin");
        let newCollection = CollectionInfo {
            name: name,
            isVerified: isVerified,
            bannerImageUrl: bannerImageUrl,
            profileImageUrl: profileImageUrl,
            description: description,
            royalty: royalty,
            nft_contract_id: nft_contract.clone(),
            token_type: token_type.clone(),
            links: CollectionLinks {
                discord: discord,
                twitter: twitter,
                website: website,
                telegram: telegram,
                instagram: instagram,
                medium: medium,
            },
        };
        let contract_and_token_type = format!("{}{}{}", nft_contract, DELIMETER, token_type);
        self.collections.insert(
            &contract_and_token_type,
            &newCollection);
    }

    pub fn edit_collection(&mut self,
        nft_contract_id: AccountId,
        token_type: String,
        name: String,
        isVerified: bool,
        bannerImageUrl: String,
        profileImageUrl: String,
        description: String,
        royalty: u64,
        discord: String,
        twitter: String,
        website: String,
        telegram: String,
        instagram: String,
        medium: String,
    ) {
        let sender_id = env::predecessor_account_id();
        let signer_id = env::signer_account_id();
        let nft_contract: AccountId = nft_contract_id.clone();
        assert_eq!(sender_id, signer_id, "Must be admin");
        let newCollection = CollectionInfo {
            name: name,
            isVerified: isVerified,
            bannerImageUrl: bannerImageUrl,
            profileImageUrl: profileImageUrl,
            description: description,
            royalty: royalty,
            nft_contract_id: nft_contract.clone(),
            token_type: token_type.clone(),
            links: CollectionLinks {
                discord: discord,
                twitter: twitter,
                website: website,
                telegram: telegram,
                instagram: instagram,
                medium: medium,
            },
        };
        let contract_and_token_type = format!("{}{}{}", nft_contract, DELIMETER, token_type);
        self.collections.insert(
            &contract_and_token_type,
            &newCollection);
    }

    pub fn get_collection(&mut self,
        nft_contract_id: AccountId,
        token_type: String) -> CollectionInfo{
        let nft_contract: AccountId = nft_contract_id.clone();
        let contract_and_token_type = format!("{}{}{}", nft_contract, DELIMETER, token_type);
        let temp = self.collections.get(&contract_and_token_type).unwrap();
        temp
    }
    
    pub fn delete_collection(&mut self,
        nft_contract_id: AccountId,
        token_type: String
    ) {
        let sender_id = env::predecessor_account_id();
        let signer_id = env::signer_account_id();
        let nft_contract: AccountId = nft_contract_id.clone();
        assert_eq!(sender_id, signer_id, "Must be admin");
        let contract_and_token_type = format!("{}{}{}", nft_contract, DELIMETER, token_type);
        self.collections.remove(&contract_and_token_type);
    }
}
