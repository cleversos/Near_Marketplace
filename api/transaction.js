var pg = require('pg');

var connectionString = "postgres://public_readonly:nearprotocol@testnet.db.explorer.indexer.near.dev/testnet_explorer";
var pgClient = new pg.Client(connectionString);
pgClient.connect();

module.exports = { getTransactionsForItem : async (marketplace_account_id, nft_contract_id, token_id, offset, count) => {
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
    },

    getTransactionsForCollection : async (marketplace_account_id, nft_contract_id, offset, count) => {
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
    },

    getTradingVolumeForCollection : async (marketplace_account_id, nft_contract_id, timestamp_start, timestamp_end) => {
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
    },

    getTransactionsForUser : async (marketplace_account_id, user_account_id, offset, count) => {
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
    },
}