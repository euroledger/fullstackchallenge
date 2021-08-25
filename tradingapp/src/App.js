import React, { Component } from 'react';
import './button.css';
import orderItems from './components/Fields/order';
import depositItems from './components/Fields/deposit';
import NavBar from './components/NavBar';
import Form from './components/Form';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TabPanel from './components/TabPanel';
import GlobalCss from './components/Global';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import apiRoutes from './routes/apiRoutes';
const Moralis = require('moralis');

axios.defaults.baseURL = 'http://localhost:3002/';
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

const muiTheme = createMuiTheme({
    typography: {
        "fontFamily": `"Lato","Arial","Helvetica","FreeSans","sans-serif"`,
        "fontSize": 14,
        "fontWeightLight": 300,
        "fontWeightRegular": 400,
        "fontWeightMedium": 500
    }
});
const initState = {
    deposit: {
        amount: "",
        token: "",
        totalAmount: ""
    },
    order: {
        amount: "",
        token: "",
        buysell: "",
        price: "",
        status: "OPEN"
    },
    placedOrders: [],
    error: false,
    balances: [],
    rows: [],
    displayRows: [ // for testing
        {
            orderId: "0",
            token: "ETH",
            amount: "1000",
            side: "BUY",
            price: "23.6"
        },
        {
            orderId: "1",
            token: "ETH",
            amount: "1000",
            side: "BUY",
            price: "23.6"
        },
        {
            orderId: "2",
            token: "ETH",
            amount: "1000",
            side: "BUY",
            price: "23.6"
        },
        {
            orderId: "3",
            token: "ETH",
            amount: "1000",
            side: "BUY",
            price: "23.6"
        },
        {
            orderId: "4",
            token: "ETH",
            amount: "1000",
            side: "BUY",
            price: "23.6"
        },
        {
            orderId: "5",
            token: "ETH",
            amount: "1000",
            side: "BUY",
            price: "23.6"
        },
        {
            orderId: "6",
            token: "ETH",
            amount: "1000",
            side: "BUY",
            price: "23.6"
        },
        {
            orderId: "7",
            token: "ETH",
            amount: "1000",
            side: "BUY",
            price: "23.6"
        },
        {
            orderId: "8",
            token: "ETH",
            amount: "1000",
            side: "BUY",
            price: "23.6"
        },
        {
            orderId: "9",
            token: "ETH",
            amount: "1000",
            side: "BUY",
            price: "23.6"
        },
        {
            orderId: "10",
            token: "ETH",
            amount: "1000",
            side: "BUY",
            price: "23.6"
        },
        {
            orderId: "11",
            token: "ETH",
            amount: "1000",
            side: "BUY",
            price: "23.6"
        },
    ],
    balances_loaded: false,
    welcome_open: true,
    user_id: "",
    order_id: "",
    connected: false,
    collapse_open: false,
    value: 0 // initial tab selection
};
export class App extends Component {
    constructor(props) {
        super(props);
        this.state = initState;
    }

    setCollapseClosed() {
        this.setState({
            collapse_open: false,
            error: false
        });
    }

    onDeposit = async () => {
        const depositDetails = {
            amount: this.state.deposit.amount,
            token: this.state.deposit.token
        }
        const balances = await apiRoutes.deposit(depositDetails);

        console.log(">>> balances = ", balances);

        const tokenObj = balances.data.filter((elem) => {
            console.log(">>> depositDetails.token = ", depositDetails.token);
            console.log(">>> elem.token = ", elem.token);
            return elem.token === depositDetails.token;
        });

        console.log("Setting total amount to ", tokenObj[0])
        this.setState(prevState => ({
            deposit: {
                ...prevState.deposit, totalAmount: tokenObj[0].balance
            },
            balances: balances.data,
            collapse_open: true
        }));
    }

    resetError = () => {
        this.setState({
            collapse_open: true, // displays alert
            error: true
        });
    }

    displayOpenOrders = (orders) => {
        console.log(orders);
        if (orders.data && orders.data.length > 0) {
            orders = orders.data.filter((elem) => {
                return elem.status === "OPEN";
            });
            this.setState({
                rows: orders,
            });
        }
    }

    cancelOrder = async (id) => {
        let orders = await apiRoutes.cancelOpenOrder({ id });
        // update table 
        this.displayOpenOrders(orders);
    }

    placeOrder = async () => {

        const objIndex = this.state.balances.findIndex((obj => obj.token === this.state.order.token));

        // ensure sufficient funds for this order
        if (parseInt(this.state.order.amount) > this.state.balances[objIndex].balance) {
            this.setState({
                collapse_open: true, // displays alert
                error: true
            });
            return;
        }
        const orderDetails = {
            amount: this.state.order.amount,
            token: this.state.order.token,
            side: this.state.order.buysell,
            price: this.state.order.price,
            status: this.state.order.status
        }

        const orders = await apiRoutes.placeOrder(orderDetails);

        // adjust available balance for this token

        // get new balance from server
        await this.getBalancesFromServer();

        this.setState(prevState => ({
            deposit: {
                ...prevState.deposit,
                totalAmount: this.state.balances[objIndex].balance
            },
        }));


        this.setState(prevState => ({
            placedOrders: {
                ...prevState.placedOrders, orders
            },
            collapse_open: true // displays success alert
        }));
    }

    setDepositFieldValue = (event) => {
        const { target: { name, value } } = event;

        if (event.target.name === "token") {
            this.updateAvailableBalance(value);
        }
        this.setState(prevState => ({
            deposit: {
                ...prevState.deposit, [name]: value
            }
        }));
    }

    updateAvailableBalance = (value) => {
        // token has changed -> reload the available balance

        // find the balance in the balances array for the correct token
        const objIndex = this.state.balances.length === 0 ? -1 : this.state.balances.findIndex((obj => obj.token === value))
        if (objIndex >= 0) {
            this.setState(prevState => ({
                deposit: {
                    ...prevState.deposit,
                    totalAmount: this.state.balances[objIndex].balance,
                    token: value
                }
            }));
        } else {
            this.setState(prevState => ({
                deposit: {
                    ...prevState.deposit,
                    totalAmount: 0,
                    token: value
                }
            }));
        }
    }
    setOrderFieldValue = (event) => {
        const { target: { name, value } } = event;

        if (event.target.name === "token") {
            this.updateAvailableBalance(value);
        }
        this.setState(prevState => ({
            order: {
                ...prevState.order, [name]: value
            }
        }));
    }

    signout = async () => {
        console.log("Disconnect...");
        await Moralis.User.logOut();
        this.setState({
            connected: false,
            welcome_open: true,
            user_id: ""
        });
    }

    connectWallet = async () => {
        if (this.state.connected) {
            this.signout();
            return;
        }

        // TODO put in env file
        Moralis.initialize("pigqCp2IxYOpK9wRAiAXRyppCYeb8R8jrdtC7BNU");
        Moralis.serverURL = "https://xztplbmsicup.moralisweb3.com:2053/server";

        console.log("done!");

        // see if user is already signed in
        var user = await Moralis.User.current();

        if (!user) {
            user = await Moralis.Web3.authenticate();

            // TODO if operation fails, throw error
        }

        if (user) {
            console.log(user);
            this.setState({
                connected: true,
                welcome_open: false,
                user_id: user.id
            });
        }
    }

    submitOrderLabel() {
        return "Submit Order";
    }

    getAcceptedLabelIssue(platform) {
        return "Deposit"
    }


    depositFundsButton() {
        return (<Button className="registerbutton"
            onClick={() => this.onDeposit()} >
            {this.getAcceptedLabelIssue("acme")}
        </Button>)
    }



    submitOrderButton() {
        // if (!this.state.acme.hospital_certificate_received) {
        return (
            <div style={{ marginTop: '10px', marginBottom: '20px' }}>
                <Button className="registerbutton"
                    onClick={() => this.placeOrder()} >
                    {this.submitOrderLabel()}
                </Button>
            </div>
        )
    }

    startLoader() {
        this.setState({
            loading: true
        });
    }

    handleChange = async (event, newValue) => {
        // tab change -> clear the balance and token fields
        if (newValue === 2) {
            console.log("Getting Open Orders...");
            let orders = await apiRoutes.orders();
            this.displayOpenOrders(orders);
        }
        this.setState(prevState => ({
            deposit: {
                ...prevState.deposit,
                totalAmount: "",
                token: ""
            },
            value: newValue,
            error: false,
            collapse_open: false
        }));
    };

    async getBalancesFromServer() {
        let balances = await apiRoutes.balances();
        console.log(">>>>> Balances = ", balances.data)
        this.setState({
            balances: balances.data,
            balances_loaded: true
        });
    }

    // get all balances once on initial load
    async componentDidMount() {
        if (!this.state.balances_loaded) {
            await this.getBalancesFromServer();
        }
    }

    render() {
        let web = sessionStorage.getItem("waitingForacmeUserData");
        if (web === "true") {
            this.acmeGetUserData();
        }
        const card = this.state;


        const a11yProps = (index) => {
            return {
                id: `simple-tab-${index}`,
                'aria-controls': `simple-tabpanel-${index}`,
            };
        }

        const getTabDisplay = () => {
            return this.state.welcome_open ? 'none' : 'block';
        }

        const getWelcomeDisplay = () => {
            return this.state.welcome_open ? 'block' : 'none';
        }

        return (
            <ThemeProvider muiTheme={muiTheme}>
                <div >
                    <GlobalCss></GlobalCss>
                    <NavBar parent={this}></NavBar>

                    <Paper style={{
                        height: '657px',
                        backgroundImage: `url(${"defi2.jpg"})`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center center",
                        backgroundSize: "cover",
                        backgroundAttachment: "fixed",
                        backgroundColor: 'rgba(255, 255, 255, 0.5)',
                        flexGrow: 1
                    }}>
                        <div style={{ display: getWelcomeDisplay() }} className="welcomepanel">
                            <div style={{ borderBottom: '1px solid white' }}>
                                <p>Welcome to DeversiFi Trading App Demo</p>
                            </div>
                            <div style={{ marginTop: '35px' }}>
                                <p> Click on 'Connect to Wallet' to connect to your metamask wallet.

                                </p>
                            </div>
                        </div>
                        <div style={{ display: getTabDisplay() }}>
                            <Tabs
                                value={this.state.value}
                                onChange={this.handleChange}
                                TabIndicatorProps={{ style: { background: '#fff' } }}
                                initialSelectedIndex="1"
                                centered
                            >
                                <Tab label="Deposit Funds" {...a11yProps(0)} />
                                <Tab label="Submit Order" {...a11yProps(1)} />
                                <Tab label="View Orders" {...a11yProps(2)} />
                            </Tabs>
                            <TabPanel value={this.state.value} index={0}>
                                <Form
                                    parent={this}
                                    items={depositItems}
                                    loading={false}
                                    card={this.state}
                                    title={"Deposit Funds"}
                                    action={"deposit"}
                                    collapse_open={this.state.collapse_open}>
                                </Form>
                            </TabPanel>
                            <TabPanel value={this.state.value} index={1}>
                                <Form
                                    parent={this}
                                    items={orderItems}
                                    loading={false}
                                    card={this.state}
                                    title={"Submit Order"}
                                    action={"placeorder"}
                                    collapse_open={this.state.collapse_open}>
                                </Form>
                            </TabPanel>
                            <TabPanel value={this.state.value} index={2}>
                                <Form
                                    parent={this}
                                    items={undefined}
                                    loading={false}
                                    card={this.state}
                                    title={"Open Orders"}
                                    action={"vieworders"}
                                    rows={this.state.rows}>
                                </Form>
                            </TabPanel>
                        </div>
                    </Paper>
                </div >
            </ThemeProvider >
        )
    }
}