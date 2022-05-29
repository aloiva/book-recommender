import React, { useState, useEffect } from 'react'
import { Carousel } from "react-responsive-carousel";
import { Link } from 'react-router-dom'
import "react-responsive-carousel/lib/styles/carousel.min.css";
import './styles/BookCarousel.css';

// nyt api

const BookCarausel = ({ fetchURL }) => {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(fetchURL);
                const json = await response.json();
                setBooks(json.results.books);
            } catch (error) {
                console.log("error", error);
            }
        };

        fetchData();
    }, []);
    // console.log(books);
    return (
        <div className="carousel-wrapper col-5">
            <Carousel autoPlay={true} >
                {books.map((book, index) => (
                    <div className="book" key={index}>
                        <div className="card-img-top"></div>
                        <img src={book.book_image} alt={book.title} className="card-image" />
                        <div className="card">
                            <div className="card-body">
                                <Link to={`/view/book?isbn=${book.isbns[0].isbn13}`}>
                                    <h5 className="card-title">
                                        {book.title}
                                    </h5>
                                </Link>
                                <p className="card-description">
                                    {book.description}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}

            </Carousel>
        </div>
    )
}

export default BookCarausel
