var router = require('express').Router();
const NodeCache = require("node-cache");
const storage = new NodeCache();

var balanceRoutes = function () {

    router.post('/api/deposit', function (req, res, next) {
        console.log("In /deposit... body = ", req.body);

        const data = { amount: req.body.amount, token: req.body.token };
        let beforeBalance = parseInt(storage.get(data.token)) || 0;
        console.log("old balance = ", beforeBalance);
        let newBalance = beforeBalance + parseInt(data.amount) || 0;
        console.log("new balance= ", newBalance);
        // persist new token balance
        storage.set(data.token, newBalance);
        res.status(200).send();

    });

    return router;

};

module.exports = balanceRoutes;