near create-account marketplace_test_12.xuguangxia.testnet --masterAccount xuguangxia.testnet --initialBalance 10

near deploy --accountId marketplace_test_12.xuguangxia.testnet --wasmFile out/market.wasm --initFunction new --initArgs '{"owner_id": "marketplace_test_12.xuguangxia.testnet"}'