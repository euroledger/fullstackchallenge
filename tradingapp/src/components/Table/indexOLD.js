import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const StyledTableCell = withStyles(theme => ({
    head: {
        backgroundColor: 'rgb(46, 92, 184)',
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

const StyledTableRow = withStyles(theme => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.background.default,
        },
    },
}))(TableRow);

const useStyles = makeStyles({
    table: {
        minWidth: 700,
        overflowY: 'auto'
    },
});

const selectHandler = () => {
    console.log("WOO!")
}
export default function CustomizedTables({ rows }) {
    const classes = useStyles();
    return (
        <TableContainer style={{ height: 'auto', minHeight: '100px' }} component={Paper}>
            <Table stickyHeader className={classes.table} aria-label="customized table">
                <TableHead>
                    <TableRow hover={true} selected={true} onRowClick={() => selectHandler()}>
                        <StyledTableCell align="left">OrderId</StyledTableCell>
                        <StyledTableCell align="left">Token</StyledTableCell>
                        <StyledTableCell align="left">Amount</StyledTableCell>
                        <StyledTableCell align="left">Side</StyledTableCell>
                        <StyledTableCell align="left">Price</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map(row => (
                        <StyledTableRow key={row.orderId}>
                            <StyledTableCell align="left">{row.orderId}</StyledTableCell>
                            <StyledTableCell align="left">{row.token}</StyledTableCell>
                            <StyledTableCell align="left">{row.amount}</StyledTableCell>
                            <StyledTableCell align="left">{row.side}</StyledTableCell>
                            <StyledTableCell align="left">{row.price}</StyledTableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}