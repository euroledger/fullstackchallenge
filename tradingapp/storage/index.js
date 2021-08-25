const NodeCache = require("node-cache");
const cache = new NodeCache();

const setInitialBalancesCollection = (data) => {
    // no balance for this token; add it to the (new) collection
    const balanceObj = { token: data.token, balance: data.amount };
    balances = new Array(balanceObj);
    console.log("--> setting balances to ", balances);
    cache.set("balances", balances);
}

const updateBalancesCollection = (balances, data, index) => {    
    balances[index] = { token: data.token, balance: parseInt(balances[index].balance) + parseInt(data.amount)};

    console.log("--> setting balances to ", balances);
    cache.set("balances", balances);
}
exports.updateBalance = (update) => {
    console.log("Updating balance for", update.token);
    console.log("Amount to adjust = ", update.amount);

    let balances = this.getAllBalances();
    const objIndex = balances === undefined ? -1 : balances.findIndex((obj => obj.token === update.token))
    if (objIndex === -1) {
        setInitialBalancesCollection(update);
    } else {
        updateBalancesCollection(balances, update, objIndex);
    }
    return balances;
};

const getOrder = (id) => {
    const orders = getAllOrders();
    const orderToCancel = orders.filter((elem) => {
        return elem.id === data.id;
    });
    return orderToCancel;
}

exports.cancelOrder = (id) => {
    console.log("Cancelling order with following data:", data);

    let orders = getAllOrders();
    objIndex = orders === undefined ? -1 : balances.findIndex((obj => obj.id === id))

    if (objIndex === -1) {
        throw new Error("Order not found");
    }

    // change cancelled order to status 'CANCELLED'
    orders[objIndex].status = "CANCELLED";
    cache.set("orders", orders);
}

exports.getAllBalances = () => {
    let balances = cache.get("balances");
    return !balances ? new Array() : balances
};

const getAllOrders = () => {
    let orders = cache.get("orders");
    return !orders ? new Array() : orders
}

const getMaxOrderId = (orders) => {
    return orders === undefined ? 1 : orders.length === 0 ? 0 :  
        parseInt(orders.reduce((p, c) => p.orderId > c.orderId ? p : c).orderId) + 1;
}

exports.placeOrder = (data) => {
    console.log("Placing order with following data:", data);
    let orders = getAllOrders();
    const newId = getMaxOrderId(orders);
    console.log("NEW ORDER ID = ", newId);
    // push new order set with key (id + 1)
    data.orderId = newId;
    orders.push(data);
    cache.set("orders", orders);

    // update balance: deduct the amount of the order for this token
    this.updateBalance({
        amount: 0-parseInt(data.amount),
        token: data.token
    })
}

exports.getAllOrders = () => {
    console.log("get all orders");
    return cache.get("orders");
};