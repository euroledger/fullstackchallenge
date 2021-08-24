const NodeCache = require("node-cache");
const cache = new NodeCache();

exports.updateBalance = (data) => {
    console.log("Updating balance for", data.token);

    let balances = this.getAllBalances();

    objIndex = balances === undefined ? -1 : balances.findIndex((obj => obj.token === data.token)) 

    console.log("objIndex =", objIndex);

    if (objIndex === -1) {
        // no balance for this token; add it to the collection
        const balanceObj = { token: data.token, balance: data.amount };
        balances = new Array(balanceObj);
        console.log("--> setting balances to ", balances);
        cache.set("balances", balances);
    } else {
        // already a balance for this token; update the amount and replace 
        // the balance object
        const balanceForToken = balances.filter((elem) => {
            return elem.token === data.token;
        });

        console.log("balanceForToken = ", balanceForToken);
        let beforeBalance = parseInt(balanceForToken[0].balance);
        console.log("-->old balance = ", beforeBalance);
        let newBalance = beforeBalance + parseInt(data.amount);
        console.log("-->new balance= ", newBalance);
        const balanceObj = { token: data.token, balance: newBalance };
        balances[objIndex] = balanceObj;

        console.log("--> setting balances to ", balances);
        cache.set("balances", balances);
    }

    return balances;
};

exports.getAllBalances = () => {
    console.log("get all balances");
    return cache.get("balances");
};

exports.placeOrder = (data) => {
    console.log("Placing order with following data:" , data);

    // get all orders from cache
    const orders = cache.get("orders");

    // get the highest order number (id) from the returned data set
    const newId = orders.length ? 0 : Math.max.apply(Math, orders.map(function(o) { return o.y; }))

    console.log("NEW ORDER ID = ", id);
    
    // push new order set with key (id + 1)
    orders.push(data);

    cache.set("orders", orders);
}