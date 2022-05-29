import React, { useEffect, useState } from 'react'
import requests from '../requests'
import GetBookCard from './GetBookCard'
import './styles/Recommender.css'

const Recommender = () => {
    const [books, setBooks] = useState([]);
    const [url, setURL] = useState(requests.fastapi.recommend(requests.currentUser.userID))
    // const [url, setURL] = useState(requests.fastapi.recommend("13552"))
    console.log(url);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(url);
                const json = await response.json();
                console.log(json.books)
                setBooks(json.books);
                // console.log(books);
            } catch (error) {
                console.log("error", error);
            }
        };

        fetchData();
    });
    console.log(books);

    if (books.length > 0) {
        return (
            <div className='recommender-book-container'>
                <h3 className='text-center'>Recommended books for the user:</h3>
                {books.map((book, index) => (
                    <GetBookCard isbn={book.ISBN} rating="0" />
                ))}
            </div>
        )
    }
    else {
        return (
            <div className='recommender-book-container'>
                <h3 className='text-center'>No receommendations found for the user. Please make sure you have interacted with the books and their ratings.</h3>
            </div>
        )
    }
}

export default Recommender
