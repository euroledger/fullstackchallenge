import React from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
import Typography from "@material-ui/core/es/Typography/Typography";
import Button from '@material-ui/core/Button';

const NavBar = ({ parent }) => {
    return (
        <AppBar position="static">
            <Toolbar style={{ backgroundColor: '#336699' }}>
                <img style={{ maxHeight: '40px', paddingRight: '30px' }} src="deversifi2.png" alt="logo" />
                <Typography variant="h6">
                    DeversiFi Full Stack Demo
                </Typography>
                <div style={{ flexGrow: 1 }}></div>
                <Button style={{ color: 'white' }} onClick={() => parent.connectWallet()}>
                    Connect to Wallet
                </Button>
            </Toolbar>
        </AppBar>
    )
};

export default NavBar
