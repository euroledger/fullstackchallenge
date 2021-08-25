import React from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
import Typography from "@material-ui/core/es/Typography/Typography";
import Button from '@material-ui/core/Button';


const getButtonLabel = (state) => {
    if (state.connected) {
        return "Sign Out";
    } else {
        return "Connect to Wallet";
    }
}
const NavBar = ({ parent }) => {
    return (
        <AppBar position="static">
            <Toolbar style={{ backgroundColor: '#0c091f' }}>
                {/* <img style={{ maxHeight: '40px', paddingRight: '30px' }} src="deversifi2.png" alt="logo" /> */}
                <Typography variant="h6">
                    Full Stack Demo
                </Typography>
                <div style={{ flexGrow: 1 }}></div>
                <Button style={{ color: 'white' }} onClick={() => parent.connectWallet()}>
                    {getButtonLabel(parent.state)}
                </Button>
            </Toolbar>
        </AppBar>
    )
};

export default NavBar
