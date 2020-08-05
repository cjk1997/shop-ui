import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { Layout } from '../config/Layout';
import { inventoryStyle } from '../styles/inventory';
import { Typography } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Rating from '@material-ui/lab/Rating';
import { UpdateInventory } from '../components/UpdateInventory';

export const Inventory = () => {
    const { inventory, getInventory } = useContext(ShopContext);
    const classes = inventoryStyle();

    const setSelectedItem = (itemSelection) => {
        localStorage.removeItem('item');
        localStorage.setItem('item', JSON.stringify({ itemSelection }));
    };

    const inventoryItems = inventory.map((item) => {
        return (
            <TableRow className={classes.row}>
                <TableCell onClick={() => setSelectedItem(item)}>
                    <Link to={`/item`} style={{ textDecoration: 'none', color: 'inherit' }} >
                        {item.item}
                    </Link>
                </TableCell>
                <TableCell>{item.brand}</TableCell>
                <TableCell>${item.price}</TableCell>
                <TableCell>
                    {/* <Box className={classes.box} component="fieldset" mb={3} borderColor="transparent"> */}
                    <Rating className={classes.rating} name="read-only" value={item.star_rating} precision={0.5} readOnly />
                    {/* </Box> */}
                </TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>
                    <UpdateInventory item={item} />
                </TableCell>
            </TableRow>
        );
    });

    return (
        <>
            <Layout>
                <div className={classes.inventoryRoot}>
                    <div className={classes.title}>
                        <Typography variant="h4" style={{ paddingTop: '40px', paddingBottom: '60px'}}>
                            Inventory
                        </Typography>
                    </div>
                    <TableContainer className={classes.table} component={Paper}>
                        <Table >
                            <TableHead>
                                <TableRow>
                                    <TableCell>Item</TableCell>
                                    <TableCell>Brand</TableCell>
                                    <TableCell>Price</TableCell>
                                    <TableCell>Rating</TableCell>
                                    <TableCell>Quantity</TableCell>
                                    <TableCell className={classes.editDeleteHead}></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {inventoryItems}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </Layout>
        </>
    );
};