var pg = require('pg');

var connectionString = "postgres://public_readonly:nearprotocol@testnet.db.explorer.indexer.near.dev/testnet_explorer";
var pgClient = new pg.Client(connectionString);
pgClient.connect();

module.exports = { getTransactions : async (contractId) => {
        var query = await pgClient.query("\
        select \
            date_trunc('minute', to_timestamp(block_timestamp/1000/1000/1000)) as time,\
            signer_account_id as signer,\
            receiver_account_id as receiver,\
            transaction_hash,\
            status\
        from \
            transactions\
        where\
            (receiver_account_id = '" + contractId + "') or\
            (signer_account_id = '" + contractId + "')\
        ");

        var result = [];
        for(let i=0; i<query.rows.length; i++){
            const row = query.rows[i];
            var data = await pgClient.query("\
            select \
                *\
            from \
                transaction_actions\
            where\
                (transaction_hash = '" + row.transaction_hash + "')\
            ");
            result.push({"hash_id" : row.transaction_hash, "hash_data": data.rows, "data": row});
        }
        return result;
        // query.on("row", function(row,result){
        //     console.log(row, result);
        //     result.addRow(row);
            
        //     });
    }
}