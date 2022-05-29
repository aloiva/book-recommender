import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from 'react-router-dom'
import './styles/Rating.css'
import requests from '../requests'

// a reusable component to display rating and when clicked, send a post request to the server to post the rating

const Star = ({ selected = false, onClick = f => f }) => (
    <div className={selected ? "star selected" : "star"} onClick={onClick} />
);

const Rating = ({ isbn, rated }) => {
    // set number of stars as received in the props
    const [rating, setRating] = useState(rated);

    function sendRating(rating) {
        console.log("rating: ", rating);
        // creating an object to send to the api
        let to_send = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "userID": `${requests.currentUser.userID}`,
                "isbnValue": `${isbn}`,
                "userRating": rating
            })
        };
        fetch(requests.fastapi.postrating(), to_send)
            .then(response => response.json())
            .then(data => console.log(data));
        

    }

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const response = await fetch(requests.fastapi.rating(requests.currentUser.userID, isbn));
    //             const json = await response.json();
    //             // console.log(json);
    //             if (json.rating !== 0)
    //                 setRating(json.rating);
    //         } catch (error) {
    //             console.log("error", error);
    //         }
    //     };

    //     fetchData();
    // }, []);


    return (
        <div className="star-rating">
            {[...Array(5)].map((n, i) => (
                <Star
                    key={i}
                    selected={i < rating}
                    onClick={() => { setRating(i + 1); sendRating(i + 1); }}
                />
            ))}
        </div>
    );
};

export default Rating
