const express = require('express');
const transaction = require('./transaction');
const cors = require('cors');

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
var corsOptions = {
    origin: 'http://13.231.24.204:3001',
    optionsSuccessStatus: 200 // For legacy browser support
}
app.use(cors(corsOptions));

app.post('/transactions_for_item', async (req, res) => {
    const results = await transaction.getTransactionsForItem(req.body.marketplace_account_id, req.body.nft_contract_id, req.body.token_id);
    res.send(results);
});

app.post('/transactions_for_collection', async (req, res) => {
    const results = await transaction.getTransactionsForCollection(req.body.marketplace_account_id, req.body.nft_contract_id);
    res.send(results);
});

app.post('/transactions_for_user', async (req, res) => {
    const results = await transaction.getTransactionsForUser(req.body.marketplace_account_id, req.body.user_account_id);
    res.send(results);
});

const port = process.env.PORT || 3002;

app.listen(port, () => console.log(`Server running on port ${port}, http://localhost:${port}`));