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
        // "fontFamily": `"Roboto", "Helvetica", "Arial", sans-serif`,
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
    placedOrders: {
        orders: []
    },
    welcome_open: true, // QUACK TEMP FOR TESTING

    user_id: "",
    order_id: "",

    connected: false, // QUACK TEMP FOR TESTING

    register: false,
    register_form_open: false,
    login: false,
    // login_form_open: false,
    firstname: '',
    lastname: '',
    email: '',
    connection_name: sessionStorage.getItem("name"),
    country: '',
    collapse_open: false,
    login_loading: false,
    userData: {},
    value: 0
};
export class App extends Component {

    constructor(props) {
        super(props);
        this.state = initState;
    }

    setCollapseClosed() {
        this.setState({
            collapse_open: false
        });
    }

    onDeposit = async () => {
        const depositDetails = {
            userId: this.state.user_id,
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
            collapse_open: true
        }));
    }

    onDeposit = async () => {
        const depositDetails = {
            userId: this.state.user_id,
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
            collapse_open: true
        }));
    }

    placeOrder = async () => {
        const orderDetails = {
            amount: this.state.order.amount,
            token: this.state.order.token,
            side: this.state.order.buysell,
            price: this.state.order.price
        }

        const orders = await apiRoutes.placeOrder(orderDetails);

        console.log(">>> orders = ", orders);
       
        this.setState(prevState => ({
            placedOrders: {
                ...prevState.placedOrders, orders
            },
            collapse_open: true
        }));
    }

    setDepositFieldValue = (event) => {
        const { target: { name, value } } = event;

        this.setState(prevState => ({
            deposit: {
                ...prevState.deposit, [name]: value
            }
        }));
    }

    setOrderFieldValue = (event) => {
        const { target: { name, value } } = event;

        this.setState(prevState => ({
            deposit: {
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

            // TODO check authenticate succeeded here
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


    getInitialAcceptedLabel() {
        return (this.state.acme.credential_accepted ? "Create Policy" : "Awaiting Acceptance...");
    }

    getAcceptedLabelRevoke(platform) {
        return (this.state[platform].credential_accepted ? "Cancel Policy" : "Awaiting Acceptance...");
    }

    submitOrderLabel() {
        return "Submit Order";
    }

    getAcceptedLabelIssue(platform) {
        return "Deposit"
    }

    getVerifyDisabled(platform) {
        return (this.state[platform].has_been_revoked || !(this.state[platform].verification_accepted));
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
                    onClick={() => this.submitOrder()} >
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

    handleChange = (event, newValue) => {
        this.setState({ value: newValue });
    };

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
                                <p> Click on Authenticate to connect to your metamask wallet.

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
                                    collapse_open={false}>
                                </Form>
                            </TabPanel>
                            <TabPanel value={this.state.value} index={2}>

                            </TabPanel>
                        </div>
                    </Paper>
                </div >
            </ThemeProvider >
        )
    }
}