var pg = require('pg');
var { connect, keyStores } = require("near-api-js")

var connectionString = "postgres://public_readonly:nearprotocol@mainnet.db.explorer.indexer.near.dev/mainnet_explorer";
var pgClient = new pg.Client(connectionString);
pgClient.connect();

const homedir = require("os").homedir();
const CREDENTIALS_DIR = ".near-credentials";
const credentialsPath = require("path").join(homedir, CREDENTIALS_DIR);
const keyStore = new keyStores.UnencryptedFileSystemKeyStore(credentialsPath);

const config = {
    keyStore,
    networkId: "mainnet",
    nodeUrl: "https://rpc.mainnet.near.org",
    headers: {}
};

let collectionStats = []

const getTransactionsForItem  = async (marketplace_account_id, nft_contract_id, token_id, offset, count) => {
    try{
        var query = await pgClient.query("\
        select \
            date_trunc('minute', to_timestamp(receipt_included_in_block_timestamp/1000/1000/1000)) as time, \
            action_receipt_actions.*, \
            receipts.* \
        from \
            action_receipt_actions \
        join receipts \
        on receipts.receipt_id = action_receipt_actions.receipt_id \
        where \
            action_receipt_actions.args->>'method_name' = 'resolve_purchase' \
            and action_receipt_actions.args->'args_json'->'sale'->>'nft_contract_id' = '" + nft_contract_id + "' \
            and action_receipt_actions.args->'args_json'->'sale'->>'token_id' = '" + token_id + "' \
            and action_receipt_actions.receipt_predecessor_account_id = '" + marketplace_account_id + "' \
        order by time desc \
        limit " + count + " offset " + offset + " \
        ");
        // date_trunc('minute', to_timestamp(block_timestamp/1000/1000/1000)) as time, \
    
        // join transactions \
        // on transactions.converted_into_receipt_id = action_receipt_actions.receipt_id \
    
        // action_receipt_actions.args->'method_name' = 'resolve_purchase' \
        // and action_receipt_actions.args->'args_json'->'sale'->'nft_contract_id' = '" + nft_contract_id + "' \
        // and action_receipt_actions.args->'args_json'->'sale'->'token_id' = '" + token_id + "' \
        // and transactions.receiver_account_id = '" + marketplace_account_id + "' \
    
        return query.rows;
        // query.on("row", function(row,result){
        //     console.log(row, result);
        //     result.addRow(row);
            
        //     });
    } catch (error) {
        console.log(error)
        return [];
    }
}

const getTransactionsForCollection = async (marketplace_account_id, nft_contract_id, offset, count) => {
    try{
        var query = await pgClient.query("\
        select \
            date_trunc('minute', to_timestamp(receipt_included_in_block_timestamp/1000/1000/1000)) as time, \
            action_receipt_actions.*, \
            receipts.* \
        from \
            action_receipt_actions \
        join receipts \
        on receipts.receipt_id = action_receipt_actions.receipt_id \
        where \
            action_receipt_actions.args->>'method_name' = 'resolve_purchase' \
            and action_receipt_actions.args->'args_json'->'sale'->>'nft_contract_id' = '" + nft_contract_id + "' \
            and action_receipt_actions.receipt_predecessor_account_id = '" + marketplace_account_id + "' \
        order by time desc \
        limit " + count + " offset " + offset + " \
            ");
        return query.rows;
    } catch (error) {
        console.log(error)
        return [];
    }
}

const getTradingVolumeForCollection = async (marketplace_account_id, nft_contract_id, timestamp_start = "0", timestamp_end = (Date.now() + "000000")) => {
    console.log(marketplace_account_id, nft_contract_id, timestamp_start, timestamp_end);
    var query = await pgClient.query("\
    select \
        sum(SUBSTRING(action_receipt_actions.args->'args_json'->>'price', 0, length(action_receipt_actions.args->'args_json'->>'price') - 18)::float / 100000.0) as volume \
    from \
        action_receipt_actions \
    join receipts \
    on receipts.receipt_id = action_receipt_actions.receipt_id \
    where \
        action_receipt_actions.args->>'method_name' = 'resolve_purchase' \
        and action_receipt_actions.args->'args_json'->'sale'->>'nft_contract_id' = '" + nft_contract_id + "' \
        and action_receipt_actions.receipt_predecessor_account_id = '" + marketplace_account_id + "' \
        and receipt_included_in_block_timestamp >= " + timestamp_start + " \
        and receipt_included_in_block_timestamp <= " + timestamp_end + " \
    ");
    if(query.rows[0].volume == null)
        return {volume: 0.0};
    return {volume: query.rows[0].volume};
}

const getTransactionsForUser = async (marketplace_account_id, user_account_id, offset, count) => {
    try{
        var query = await pgClient.query("\
        select \
            date_trunc('minute', to_timestamp(receipt_included_in_block_timestamp/1000/1000/1000)) as time, \
            action_receipt_actions.*, \
            receipts.* \
        from \
            action_receipt_actions \
        join receipts \
        on receipts.receipt_id = action_receipt_actions.receipt_id \
        where \
            action_receipt_actions.args->>'method_name' = 'resolve_purchase' \
            and ( action_receipt_actions.args->'args_json'->'sale'->>'owner_id' = '" + user_account_id + "' \
            or action_receipt_actions.args->'args_json'->>'buyer_id' = '" + user_account_id + "' ) \
            and action_receipt_actions.receipt_predecessor_account_id = '" + marketplace_account_id + "' \
        order by time desc \
        limit " + count + " offset " + offset + " \
        ");
        return query.rows;
    } catch (error) {
        console.log(error)
        return [];
    }
}

const fetchItems = async (collectionId) => {
    try {
      //get all listed sales in a collection from marketplace contract
      const rawAllSaleResult = await near.connection.provider.query({
        request_type: "call_function",
        account_id: CONTRACT_ACCOUNT_ID,
        method_name: "get_sales_by_nft_contract_id",
        args_base64: btoa(
          `{"nft_contract_id": "${collectionId}", "from_index": "0", "limit": 200}`
        ),
        finality: "optimistic",
      })
      const sales = JSON.parse(Buffer.from(rawAllSaleResult.result).toString())

      const saleTokens = []

      //get token obj for the tokens not gotten by batch fetch (if any)
      for (let i = 0; i < sales.length; i++) {
        const { token_id, token_type } = sales[i]
        let token = saleTokens.find(({ token_id: t }) => t === token_id)
        if (!token) {
          const tokenRawResult = await near.connection.provider.query({
            request_type: "call_function",
            account_id: collectionId,
            method_name: "nft_token",
            args_base64: btoa(`{"token_id": "${token_id}"}`),
            finality: "optimistic",
          })
          token = JSON.parse(Buffer.from(tokenRawResult.result).toString())
        }
        sales[i] = Object.assign(sales[i], token)
      }

      const items = sales?.map((result) => {
        return {
            attribute: item.attribute,
            image: item.metadata.media,
            name: item.metadata.title,
            collectionTitle: "",
            collectionId,
            tokenType: item.tokenType,
            createdAt: item.created_at,
            price: parseFloat(formatNearAmount(item.sale_conditions.near)),
            id: item.token_id,
            ownerId: item.owner_id,
          }
      })
      return items
    } catch (error) {
      console.log(error)
      return []
    }
}

const getCollections = async () => {
    try {
      // get collections from contract
      const rawResult = await near.connection.provider.query({
        request_type: "call_function",
        account_id: CONTRACT_ACCOUNT_ID,
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
      return []
    }
}

const CONTRACT_ACCOUNT_ID = "marketplace_test_1.xuguangxia.near"

async function intervalFunc() {
    let all = []
    const now = new Date()
    const oneDayDate = (now.getTime() - 1 * 24 * 60 * 60 * 1000).toString() + "000000"
    const twoDaysDate = (now.getTime() - 2 * 24 * 60 * 60 * 1000).toString() + "000000"
    const oneWeekDate = (now.getTime() - 7 * 24 * 60 * 60 * 1000).toString() + "000000"
    const twoWeeksDate = (now.getTime() - 14 * 24 * 60 * 60 * 1000).toString() + "000000"
    const nowString = now.getTime().toString() + "000000"
    const collections = await getCollections(CONTRACT_ACCOUNT_ID)
    try {
      for (let item of collections) {
        const values = await Promise.all([
          await fetchItems(item.collectionId),
          await getTradingVolumeForCollection(CONTRACT_ACCOUNT_ID, item.collectionId),
          await getTradingVolumeForCollection(CONTRACT_ACCOUNT_ID, item.collectionId, twoDaysDate, oneDayDate),
          await getTradingVolumeForCollection(CONTRACT_ACCOUNT_ID, item.collectionId, oneDayDate, nowString),
          await getTradingVolumeForCollection(CONTRACT_ACCOUNT_ID, item.collectionId, twoWeeksDate, oneWeekDate),
          await getTradingVolumeForCollection(CONTRACT_ACCOUNT_ID, item.collectionId, oneWeekDate, nowString),
        ])
        let newItems = values[0]

        let volumeDayPercent = 0
        if (parseFloat(values[2].volume) === 0.0) {
          volumeDayPercent = 100.0
        } else if (parseFloat(values[3].volume) === 0.0) {
          volumeDayPercent = -100.0
        } else {
          volumeDayPercent = (parseFloat(values[3].volume) - parseFloat(values[2].volume)) / parseFloat(values[2].volume) * 100
        }

        let volumeWeekPercent = 0
        if (parseFloat(values[4].volume) === 0.0) {
          volumeWeekPercent = 100.0
        } else if (parseFloat(values[5].volume) === 0.0) {
          volumeWeekPercent = -100.0
        } else {
          volumeWeekPercent = (parseFloat(values[5].volume) - parseFloat(values[4].volume)) / parseFloat(values[4].volume) * 100
        }

        let min = 0
        let itemLength = 0
        let sum = 0
        let avgPrice = "0"

        if (newItems.length !== 0) {
          newItems.sort(function (a, b) {
            return a.price - b.price
          })
          min = newItems[0].price
          itemLength = newItems.length
          sum = newItems.map(item => item?.price).reduce((prev, curr) => prev + curr, 0)
          avgPrice = (sum / itemLength).toFixed(2)
        }

        all.push({
          bannerImageUrl: item.bannerImageUrl,
          name: item.name,
          floorPrice: min,
          volumeTotal: values[1].volume,
          dailyVolume: values[3].volume,
          dailyChange: volumeDayPercent,
          weeklyVolume: values[5].volume,
          weeklyChange: volumeWeekPercent,
          count: itemLength,
          avgPrice: avgPrice
        })
      }
      collectionStats = all;
      console.log("Succeed Stat Fetching")
    } catch (error) {
      console.log("Error Occured")
    }
    setTimeout(intervalFunc, 10000);
}
  
const getStatsForAllCollections = async () => {
    return collectionStats;
}

let near;
connect(config).then((result) => {
    near = result;
    intervalFunc();
});

module.exports = { getTransactionsForItem: getTransactionsForItem,
    getTransactionsForCollection: getTransactionsForCollection,
    getTradingVolumeForCollection: getTradingVolumeForCollection,
    getStatsForAllCollections: getStatsForAllCollections,
    getTransactionsForUser: getTransactionsForUser
}