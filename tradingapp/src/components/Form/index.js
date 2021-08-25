import React from 'react';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Typography from "@material-ui/core/es/Typography/Typography";
import { TextField } from "@material-ui/core";
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Table from '../Table';
import Collapse from '@material-ui/core/Collapse';
import CloseIcon from '@material-ui/icons/Close';
import Alert from '@material-ui/lab/Alert';
import IconButton from '@material-ui/core/IconButton';


const Form = ({ parent, items, card, title, action, rows, collapse_open }) => {
    const useStyles = makeStyles((theme) => ({
        formControl: {
            margin: 0,
            minWidth: 150,

        },
        selectEmpty: {
            marginTop: theme.spacing(2),
        },
    }));

    const getButton = () => {
        if (action === "deposit") {
            return parent.depositFundsButton();
        } else if (action === "placeorder") {
            return parent.submitOrderButton();
        }
    }

    const getWidth = () => {
        return '750px';
    }
    const getHeight = () => {
        if (action === "vieworders") {
            return '540px';
        }
        return "auto";
    }

  
    const setFieldValue = (event) => {
        if (action === "deposit") {
            parent.setDepositFieldValue(event);
        } else if (action === "placeorder") {
            parent.setOrderFieldValue(event);
        }
    }

    const classes = useStyles();

    const handleClick = async (id) => {
        await parent.cancelOrder(id);
    }

    const getTable = () => {
        if (action === "vieworders") {
            return (
                <Table rows={rows} handler={handleClick}></Table>
            );
        }
    }

    const getMenuItems = (menuItems) => {
        return menuItems.map(item =>
            <MenuItem value={item}>{item}</MenuItem>
        )
    }

    const getToken = () => {
        return card.deposit.token;
    }

    const getBalance = () => {
        return card.deposit.totalAmount;
    }

    const getSeverity = () => {
        if (action === "placeorder" && card.error) {
            return "error";
        }
        return "success";
    }

    const getAlert = () => {
        if (action === "deposit") {
            return "Balance Has Been Successfully Updated!";
        } else if (action === "placeorder") {
            if (card.error) {
                return "Insufficient available balance for this order";
            }
            else {
                return "Order Successfully Placed!";
            }
        }

    }

    const getLabels = () => {
        if (action === "vieworders") {
            return;
        }
        return (
            <div style={{ display: 'flex', marginBottom: '20px', height: '17px', marginLeft: 'auto' }}>
                <p style={{ marginRight: '50px' }}>Token: {getToken()}</p>
                <p style={{ marginRight: '50px' }}>Available Balance: {getBalance()}</p>
            </div>
        );
    }
    const getFields = () => {
        if (!items)
            return;
        return items.map(item => {
            if (item.type === "dropdown") {
                return (
                    <FormControl className={classes.formControl}>
                        <InputLabel id="simple-select-label">{item.label}</InputLabel>
                        <Select
                            name={item.id}
                            value={card[item.id]}
                            onChange={setFieldValue}
                        >
                            {getMenuItems(item.menuItems)}
                        </Select>
                    </FormControl>
                )
            } else {
                return (
                    <TextField
                        name={item.id}
                        disabled={item.disabled}
                        label={item.label}
                        value={card[item.id]}
                        onChange={setFieldValue}
                    />
                )

            }
        });
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', height: getHeight(), opacity: 0.9 }}>
            <Paper style={{ display: 'flex', maxWidth: '1000px', width: getWidth() }}>
                <div style={{ display: 'flex', padding: '24px 24px', flexDirection: 'column', width: '100%' }}>
                    <div style={{ marginBottom: "20px" }}>
                        <Typography variant="h5" style={{ flexGrow: 1 }}>
                            <div style={{ display: 'flex', marginBottom: '20px' }}>
                                <div style={{ marginBottom: '20px' }}>
                                    {title}
                                </div>
                            </div>
                        </Typography>
                    </div>
                    {getFields()}
                    {getTable()}
                    < div style={{ marginTop: '50px' }}>
                        {getButton()}
                    </div >
                    {getLabels()}
                    <Collapse in={collapse_open} style={{
                        position: 'absolute',
                        top: '40%',
                        left: '38%',
                        width: '25rem'
                    }}>
                        <Alert
                            severity={getSeverity()}
                            action={
                                <IconButton
                                    aria-label="close"
                                    color="inherit"
                                    size="small"
                                    onClick={() => {
                                        parent.setCollapseClosed()
                                    }}
                                >
                                    <CloseIcon fontSize="inherit" />
                                </IconButton>
                            }
                        >
                            {getAlert()}
                        </Alert>
                    </Collapse>
                </div>
            </Paper>
        </div>
    );
}

export default Form;