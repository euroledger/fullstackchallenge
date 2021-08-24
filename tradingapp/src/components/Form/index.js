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
import './form.css';
import Spinner from '../Spinner';
import Collapse from '@material-ui/core/Collapse';
import CloseIcon from '@material-ui/icons/Close';
import Alert from '@material-ui/lab/Alert';
import IconButton from '@material-ui/core/IconButton';


const Form = ({ parent, items, loading, card, title, action, rows, collapse_open }) => {
    const useStyles = makeStyles((theme) => ({
        formControl: {
            margin: 0,
            minWidth: 150,

        },
        selectEmpty: {
            marginTop: theme.spacing(2),
        },
    }));

    const getTable = () => {
        if (action === "matcher") {
            return (
                <Table rows={rows}></Table>
            );
        }
    }

    const getButton = () => {
        if (action === "deposit") {
            return parent.depositFundsButton();
        } else if (action === "order") {
            return parent.submitOrderButton();
        }
    }

    const getWidth = () => {
        return '650px';
    }
    const getHeight = () => {
        return 'auto';
    }

    const getLogo = () => {
        if (action === "visit") {
            return (
                <img style={{ marginLeft: '202px', height: '107px', width: '149px', marginBottom: '24px' }} src='food.jpg' alt="" />
            )
        }
        else if (action === "patient") {
            return (
                <img style={{ marginLeft: '194px', height: '98px', width: '165px' }} src='nsh.jpg' alt="" />
            )
        }
        else if (action === "result") {
            return (
                <img style={{ marginLeft: '237px', height: '98px', width: '165px' }} src='nurse.jpg' alt="" />
            )
        }
        else if (action === "matcher") {
            return (
                <img style={{ marginLeft: '438px', height: '98px', width: '165px' }} src='trace.jpg' alt="" />
            )
        }
        else if (action === "vaccine") {
            return (
                <img style={{ marginLeft: '165px', height: '98px', width: '165px' }} src='nurse.jpg' alt="" />
            )
        }
        else if (action === "immunity") {
            return (
                <img style={{ marginLeft: '165px', height: '98px', width: '165px' }} src='immunity.jpg' alt="" />
            )
        }
    }

    const getDivStyle = () => {
        if (action === "policy") {
            return ({ display: 'flex', marginBottom: '7px' })
        } else if (action === "result") {
            return ({ display: 'flex', marginBottom: '-3px' })
        }
    }

    const setFieldValue = (event) => {
        if (action === "deposit") {
            parent.setDepositFieldValue(event);
        } else if (action === "placeorder") {
            parent.setDepositFieldValue(event);
        } 
    }

    const classes = useStyles();

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

    const getFields = () => {
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
                    <div style={{marginBottom: "20px"}}>
                        <Typography variant="h5" style={{ flexGrow: 1 }}>
                            <div style={{ display: 'flex', marginBottom: '20px' }}>
                                <div style={{ marginBottom: '20px' }}>
                                    {title}
                                </div>
                                <div>
                                    {getLogo()}
                                </div>
                            </div>
                        </Typography>
                    </div>

                    <Spinner active={loading}></Spinner>
                    {getFields()}
                    {getTable()}
                    < div style={{ marginTop: '50px' }}>
                        {getButton()}
                    </div >
                    <div style={{ display: 'flex', marginBottom: '20px', height: '17px', marginLeft: 'auto' }}>
                        <p style={{ marginRight: '50px' }}>Token: {getToken()}</p>
                        <p style={{ marginRight: '50px' }}>Amount: {getBalance()}</p>
                    </div>
                    <Collapse in={collapse_open} style={{
                        position: 'absolute',
                        top: '40%',
                        left: '38%',
                        width: '25rem'
                    }}>
                        <Alert
                            severity="success"
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
                            Balance Has Been Successfully Updated!
                        </Alert>
                    </Collapse>
                </div>
            </Paper>
        </div>
    );
}

export default Form;