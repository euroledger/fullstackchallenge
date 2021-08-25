const http = require('http');
const cors = require('cors');
const path = require('path');
const { createTerminus } = require('@godaddy/terminus');
const express = require('express');
const bodyParser = require('body-parser');
const OPEN_ONLY = true;
// const balanceRoutes = require('./routes/balances');
// const NodeCache = require("node-cache");
// const storage = new NodeCache();
const storage = require('./storage')

var fs = require('fs');
var https = require('https');

require('dotenv').config();

var app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'build')))

// app.use('/', indexRouter);
// app.use('/api/deposit', balanceRoutes);

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/build/index.html'));
});

// API ENDPOINTS

app.post('/api/deposit', async function (req, res) {
    storage.updateBalance(req.body);
    const balances = storage.getAllBalances();
    res.status(200).send(balances);
});

app.post('/api/placeorder', async function (req, res) {
    storage.placeOrder(req.body);
    const orders = storage.getAllOrders();
    res.status(200).send(orders);
});


app.get('/api/getbalances', cors(), async function (req, res) {
    const balances = storage.getAllBalances();
    res.status(200).send(balances);
});

app.get('/api/getorders', cors(), async function (req, res) {
    console.log("in getorders...");
    const orders = storage.getAllOrders(OPEN_ONLY);
    res.status(200).send(orders);
});

app.post('/api/cancelorder', async function (req, res) {
    console.log("ORDER CANCEL: req.body = ", req.body)
    const orders = storage.cancelOrder(req.body.id);
    res.status(200).send(orders);
});


// for graceful closing
var server = http.createServer(app);
async function onSignal() {
    var webhookId = cache.get("webhookId");
    const p1 = await client.removeWebhook(webhookId);
    return Promise.all([p1]);
}
createTerminus(server, {
    signals: ['SIGINT', 'SIGTERM'],
    healthChecks: {},
    onSignal
});

const PORT = process.env.PORT || 3002;
var server = server.listen(PORT, async function () {
    console.log('Listening on port %d', server.address().port);
});