import React, { useState, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { HomeLayout } from '../config/HomeLayout';
import { ImageCarousel } from '../components/HomeCarousel';
import { homeStyle } from '../styles/home';

export const Home = () => {
    const { inventory, getInventory } = useContext(ShopContext);
    const classes = homeStyle();

    return (
        <>
            <HomeLayout>
                <div className={classes.body}>
                    <div className={classes.header}>
                        <div className={classes.title}>
                            <div className={classes.utensils}>

                            </div>
                        </div>
                        {/* <div className={classes.homeCarousel}>
                            <ImageCarousel />
                        </div> */}
                    </div>
                </div>
            </HomeLayout>
        </>
    );
};