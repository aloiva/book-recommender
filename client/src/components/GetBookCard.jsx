import React, { useState, useEffect } from 'react'
import requests from '../requests'
import Rating from './Rating'

//takes isbn and rating as props. 

const GetBookCard = ({ isbn, rating }) => {
    // gets url for the google api query search for current isbn
    const fetchURL = requests.googleapi.isbn(isbn);
    const [books, setBooks] = useState([]);
    // console.log(fetchURL);

    //gets the books pertaining to the isbn and sets them to the state "books"
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(fetchURL);
                const json = await response.json();
                if (json.totalItems !== 0)
                    setBooks(json.items);
                else setBooks({});
            } catch (error) {
                console.log("error", error);
            }
        };
        fetchData();
    }, [fetchURL]);

    // if any books around found, return a card with the book and rating received in the props else return a blank card
    if (books.length > 0) {
        return (
            <div className="book-card-container card col-6">
                {books.map((book, index) => (
                    <div className="book" key={index}>
                        <div className="image-container">
                            <div className="book-image card-img-top">
                                {book.volumeInfo.hasOwnProperty('imageLinks') && book.volumeInfo.imageLinks.hasOwnProperty('thumbnail') && <img src={book.volumeInfo.imageLinks.thumbnail} alt="" />}
                                {!book.volumeInfo.hasOwnProperty('imageLinks') && <img src="https://dhmckee.com/wp-content/uploads/2018/11/defbookcover-min.jpg" alt="" />}
                            </div>
                            <div className="rating">
                                <Rating isbn={isbn} userid={requests.currentUser.userID} rated={rating} />
                            </div>

                        </div>
                        <div className="meta-container card-body">
                            <div className="book-title-author">

                                <div className="book-title card-title">
                                    <h1>{book.volumeInfo.title} </h1>
                                </div>
                                <div className="book-author card-title">
                                    {book.volumeInfo.hasOwnProperty('authors') && <h4 className="book-authors">{requests.getauthors(book.volumeInfo.authors)} </h4>}
                                </div>
                            </div>
                            <div className="book-description card-text">
                                <h5>Description:</h5>
                                <p>{book.volumeInfo.description}</p>
                            </div>
                            <div className="search-terms card-text">
                                <h5>Identifiers:</h5>
                                {book.volumeInfo.hasOwnProperty('industryIdentifiers') && book.volumeInfo.industryIdentifiers.map((isbn, index) => (
                                    <div className="isbn" key={index}>
                                        <p>
                                            {`${isbn.type}: ${isbn.identifier} `}
                                        </p>
                                    </div>
                                ))}
                                <div className="isbn" key={index}>
                                    <p>
                                        current ISBN: {`${isbn}`}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )
    }
    else {
        return (
            <div className="book-card-container">
                <h3>No book listed for isbn: {`${isbn}`}</h3>
            </div>
        )
    }
}

export default GetBookCard
