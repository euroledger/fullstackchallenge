# Case Study: Full Stack Coding Challenge

This case study demos a small expressjs server with an in-memory data store (node-cache), and a react front end which has forms for depositing [crypto] funds, placing [crypto] orders and viewing open orders.

To install and run the demo, clone the repo and run

`npm install`

Then to run the server, cd to `tradingapp` and type

`npm run start`

This will bring up both the express back end and the react front end (in localhost:3000)

The first part of the case study is to authenticate the MetaMask user; this is done using the Moralis library which provides a wrapper around the web3 library.

See function
`connectWallet` in the App.js file.

To sign in, you must have multimask installed in the browser. Then click on "Connect to Wallet" and when asked by the Metamask notification, click on "Sign".

You stay signed in unless you click on "Sign Out".

# Improvements

1. Avoid bringing back collections and processing on client side (eg balances); do this at back end
2. Needs some unit tests (esp. server side)
3. Needs more validation (at form level and on back end) and error handling


