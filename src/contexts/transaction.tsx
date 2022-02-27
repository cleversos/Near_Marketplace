import { connect, keyStores, transactions } from "near-api-js"

const keyStore = new keyStores.BrowserLocalStorageKeyStore();

// NOTE: we're using the archival rpc to look back in time for a specific set
// of transactions. For a full list of what nodes are available, visit:
// https://docs.near.org/docs/develop/node/intro/node-types
const config = {
    keyStore,
    networkId: "testnet",
    nodeUrl: "https://rpc.testnet.near.org",
    headers: {}
};

export async function getTransactions(accountId) {
    const getAPI = async () => {
        const API = 'http://localhost:3002/transactions';
        const result = await fetch(API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                accountId: accountId
            })
        });
        return (await result.json())
    };
    const result = await getAPI();
    console.log(result);
    let transactions = [];
    for (let i = 0; i < result.length; i++) {
        const record = result[i];
        for (let j = 0; j < record.hash_data.length; j++) {
            if (record.hash_data[j].args.method_name == "offer") {
                transactions.push(record);
                break;
            }
        }
    }
    console.log(transactions);
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

async function getBlockByID(blockID) {
    const near = await connect(config);
    const blockInfoByHeight = await near.connection.provider.block({
        blockId: blockID,
    });
    return blockInfoByHeight;
}
