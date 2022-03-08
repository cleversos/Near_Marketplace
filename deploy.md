near create-account marketplace_test_1.xuguangxia.near --masterAccount xuguangxia.testnet --initialBalance 10

near deploy --accountId marketplace_test_1.xuguangxia.near --wasmFile out/market.wasm --initFunction new --initArgs '{"owner_id": "marketplace_test_1.xuguangxia.near"}'