import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { GrNext, GrPrevious } from 'react-icons/gr'
import requests from '../requests'
import GetBookCard from './GetBookCard'
import { Link } from 'react-router-dom'
import './styles/AllRatings.css'


const AllRatings = () => {

    // fucntion to get 5 star equivalent of 10 star data
    function getHalved(rate) {
        return Math.ceil(Number(rate) / 2);
    }
    const [ratings, setRatings] = useState([]);

    // retrieving url for the api to send get request for all ratings
    const [url, setURL] = useState(requests.fastapi.ratings(requests.currentUser.userID))

    // retrive books that the current user has rated
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(url);
                const json = await response.json();
                // console.log(json);
                setRatings(json.result);
                // console.log(ratings);
            } catch (error) {
                console.log("error", error);
            }
        };

        fetchData();
    }, []);
    
    // calls the reusable getbookcard component to get card for every book with their isbn and rating
    // console.log(ratings[0].isbn, getHalved(ratings[0].rating));
    return (
        <div className='all-ratings card-deck'>
            {ratings.map((rat, index) => (
                <GetBookCard isbn={rat.isbn} rating={getHalved(rat.rating)} key={index} />
            ))}
        </div>)
}

export default AllRatings
