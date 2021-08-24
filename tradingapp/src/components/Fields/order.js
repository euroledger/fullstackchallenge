const orderItems = [
    {
        id: "order_id",
        label: "Order Number",
        disabled: true
    },
    {
        id: "amount",
        label: "Amount",
        disabled: false
    },
    {
        id: "token",
        label: "Token",
        type: "dropdown",
        menuItems: [
            "ETH",
            "USDT",
            "DVF"
        ],
        disabled: false
    },
    {
        id: "buysell",
        label: "Buy/Sell",
        type: "dropdown",
        menuItems: [
            "BUY",
            "SELL"
        ],
        disabled: false
    },
    {
        id: "price",
        label: "Price",
        disabled: false
    },

];

export default orderItems;
