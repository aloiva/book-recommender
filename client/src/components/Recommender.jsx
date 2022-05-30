import React, { useEffect, useState } from 'react'
import requests from '../requests'
import Rating from './Rating'
import { Link } from 'react-router-dom'
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
    }, []);
    console.log(books);

    if (books.length > 0) {
        return (
            <div className='recommender-book-container'>
                <h3 className='text-center'>Recommended books for the user:</h3>
                <div className="card-wrap">

                    {books.map((book, index) => (
                        <div className="book" key={index}>
                            <div className="image-container">
                                <div className="book-image card-img-top">
                                    <img src={book.medium_icon} alt="" />
                                </div>
                                <div className="rating">
                                    <Rating isbn={book.ISBN} userid={requests.currentUser.userID} rated="0" />
                                </div>

                            </div>
                            <div className="meta-container card-body">
                                <div className="book-title-author">

                                    <div className="book-title card-title text-center">
                                        <Link to={`/view/book?isbn=${book.ISBN}`}>
                                            <h1>{book.title} </h1>
                                        </Link>
                                    </div>
                                    <div className="book-author card-title text-center">
                                        <h4> {book.author} </h4>
                                    </div>
                                </div>
                                <div className="search-terms card-text text-center">
                                    <h6>Publishers: {book.Publisher}</h6>
                                    <h6>current ISBN: {`${book.ISBN}`}</h6>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
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
