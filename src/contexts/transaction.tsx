import { connect, keyStores, transactions } from "near-api-js"

const keyStore = new keyStores.BrowserLocalStorageKeyStore();

// NOTE: we're using the archival rpc to look back in time for a specific set
// of transactions. For a full list of what nodes are available, visit:
// https://docs.near.org/docs/develop/node/intro/node-types
const config = {
    keyStore,
    networkId: "mainnet",
    nodeUrl: "https://rpc.mainnet.near.org",
    headers: {}
};

export async function getTransactionsForItem(marketplace_account_id, nft_contract_id, token_id, offset = 0, count = 10) {
    const getAPI = async () => {
        const API = 'http://13.231.24.204:3002/transactions_for_item';
        const result = await fetch(API, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                marketplace_account_id: marketplace_account_id,
                nft_contract_id: nft_contract_id,
                token_id: token_id,
                offset: offset,
                count: count
            })
        });
        return (await result.json())
    };
    const result = await getAPI();
    return result;
    // const near = await connect(config);

    // const accountInfo = await near.connection.provider.query({
    //     request_type: "view_account",
    //     finality: "final",
    //     account_id: accountId,
    // });
    // console.log(accountInfo)

    // // creates an array of block hashes for given range
    // const blockArr = [];
    // var blockData = await near.connection.provider.block({
    //     finality: "final",
    // });

    // let blockHash = blockData.header.hash;

    // for(let i=0; i<10; i++){
    //     const currentBlock = await getBlockByID(blockHash);
    //     blockArr.push(currentBlock.header.hash);
    //     blockHash = currentBlock.header.prev_hash;
    // }

    // // returns block details based on hashes in array
    // const blockDetails = await Promise.all(
    //     blockArr.map((blockId) =>
    //     near.connection.provider.block({
    //         blockId,
    //     })
    //     )
    // );

    // // returns an array of chunk hashes from block details
    // const chunkHashArr = blockDetails.flatMap((block) =>
    //     block.chunks.map(({ chunk_hash }) => chunk_hash)
    // );

    // //returns chunk details based from the array of hashes
    // const chunkDetails = await Promise.all(
    //     chunkHashArr.map(chunk => near.connection.provider.chunk(chunk))
    // );

    // // checks chunk details for transactions
    // // if there are transactions in the chunk we
    // // find ones associated with passed accountId
    // const transactions = chunkDetails.flatMap((chunk) =>
    //     (chunk.transactions || []).filter((tx) => {
    //         let transaction = Object(tx);
    //         if(transaction.signer_id == accountId){
    //             return tx;
    //         }
    //         if(transaction.receiver_id == accountId){
    //             return tx;
    //         }
    //     })
    // );
    // console.log("MATCHING TRANSACTIONS: ", transactions);
}

export async function getTransactionsForCollection(marketplace_account_id, nft_contract_id, offset = 0, count = 10) {
    const getAPI = async () => {
        const API = 'http://13.231.24.204:3002/transactions_for_collection';
        const result = await fetch(API, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                marketplace_account_id: marketplace_account_id,
                nft_contract_id: nft_contract_id,
                offset: offset,
                count: count
            })
        });
        return (await result.json())
    };
    const result = await getAPI();
    console.log(result);
    return result;
}

export async function getTradingVolumeForCollection(marketplace_account_id, nft_contract_id, timestamp_start = "0", timestamp_end = Date.now() + "000000") {
    console.log(timestamp_start);
    const getAPI = async () => {
        const API = 'http://13.231.24.204:3002/tradingvolume_for_collection';
        const result = await fetch(API, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                marketplace_account_id: marketplace_account_id,
                nft_contract_id: nft_contract_id,
                timestamp_start: timestamp_start,
                timestamp_end: timestamp_end
            })
        });
        return (await result.json())
    };
    const result = await getAPI();
    return result;
}

export async function getCollectionStat() {
    const getAPI = async () => {
        const API = 'http://13.231.24.204:3002/stats_for_all_collection';
        const result = await fetch(API, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
            })
        });
        return (await result.json())
    };
    const result = await getAPI();
    return result;
}

export async function getTransactionsForUser(marketplace_account_id, user_account_id, offset = 0, count = 10) {
    const getAPI = async () => {
        const API = 'http://13.231.24.204:3002/transactions_for_user';
        const result = await fetch(API, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                marketplace_account_id: marketplace_account_id,
                user_account_id: user_account_id,
                offset: offset,
                count: count
            })
        });
        return (await result.json())
    };
    const result = await getAPI();
    return result;
}

async function getBlockByID(blockID) {
    const near = await connect(config);
    const blockInfoByHeight = await near.connection.provider.block({
        blockId: blockID,
    });
    return blockInfoByHeight;
}
