const depositItems = [
    {
        id: "user_id",
        label: "User ID",
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
];

export default depositItems;
