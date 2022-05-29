import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import requests from '../requests'
import Rating from './Rating'
import GetBookCard from './GetBookCard'
import './styles/ViewBook.css'

// uses googleapi to view a book and a request to the local database to get its rating

const ViewBook = () => {
  //function to get 5 star equivalent for the data stored out of 10
  function getHalved(rate) {
    console.log(Math.ceil(Number(rate) / 2));
    return (Math.ceil(Number(rate) / 2));
  }

  //isbn is retrived from the url query parameters
  const [getParams, setParams] = useSearchParams();
  const [rating, setRating] = useState(0)
  let isbn = getParams.get("isbn");

  // retrieving api url to send a get request to find rating at
  const [url, setURL] = useState(requests.fastapi.rating(requests.currentUser.userID, isbn));
  console.log(url);

  //retrieving rating for the book through api 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(requests.fastapi.rating(requests.currentUser.userID, isbn));
        const json = await response.json();
        // console.log(json);
        if (json.rating !== 0)
          setRating(getHalved(json.rating));
      } catch (error) {
        console.log("error", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="view-book-container">
      <GetBookCard isbn={isbn} rating={rating} />
    </div>
  )
}

export default ViewBook
