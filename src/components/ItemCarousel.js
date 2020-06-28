import React, { useState, useEffect, useContext } from 'react';
import Carousel, { Dots } from '@brainhubeu/react-carousel';
import { Icon } from 'react-fa';
import '@brainhubeu/react-carousel/lib/style.css';
import { carouselStyle } from '../styles/itemCarousel';

export const ImageCarousel = () => {
    const [storedItem, setStoredItem] = useState({})
    const [images, setImages] = useState([]);
    const [thumbnails, setThumbnails] = useState([]);
    const [value, setValue] = useState(0);
    const classes = carouselStyle();

    console.log("item in Carousel", storedItem)

    const localStorageItem = async () => {
        const localStorageItem = await JSON.parse(localStorage.getItem('item')).itemSelection;
        setStoredItem(localStorageItem);
        console.log('storedItem', storedItem)

        console.log('localStorageItem', localStorageItem);
    };

    const setImageArrays = (item) => {
        console.log("item in setImageArrays", item)

        const getImages = item.images.map((image) => {
            console.log("images", images)

            return (
                <img src={image} className={classes.images} />
            );
        });

        const getThumbnails = item.images.map((image) => {
            console.log("thumbnails", thumbnails)

            return (
                <img src={image} className={classes.thumbnails} />
            );
        });

        setImages(getImages);
        setThumbnails(getThumbnails);
    };

    useEffect(() => {localStorageItem()}, []);

    useEffect(() => {if (storedItem.images) setImageArrays(storedItem)}, [storedItem]);

    const changeValue = (newValue) => {
        setValue(newValue);
    };

    return (
        <div className={classes.carousel}>
            {}
            <Carousel
                value={value}
                slides={images}
                onChange={changeValue}
                arrowLeft={<Icon name="chevron-left" className={classes.icons} />}
                arrowLeftDisabled={<Icon></Icon>}
                arrowRight={<Icon name="chevron-right" className={classes.icons} />}
                arrowRightDisabled={<Icon></Icon>}
                addArrowClickHandler={true}
                arrows={true}
            />
            <Dots 
                thumbnails={thumbnails} 
                value={value} 
                onChange={changeValue} 
                number={thumbnails.length} 
            />
        </div>
    );
};