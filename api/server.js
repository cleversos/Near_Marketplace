const express = require('express');
const transaction = require('./transaction');

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.post('/transactions', async (req, res) => {
    const results = await transaction.getTransactions(req.body.accountId);
    res.send(results);
});

const port = process.env.PORT || 3002;

app.listen(port, () => console.log(`Server running on port ${port}, http://localhost:${port}`));