import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import {GrNext, GrPrevious} from 'react-icons/gr'
import requests from '../requests'
import { Link } from 'react-router-dom'
import './styles/AllBooks.css'

//uses fastapi to get list of all books present in the database used

const AllBooks = () => {
    const navigate = useNavigate();

    // to get the current page
    const [getParams, setParams] = useSearchParams();
    let page = 1;
    if (getParams.get('page')) {
        page = getParams.get('page');
    }

    //button to navigate to the next page
    function nextPage() {
        let next = Number(page) + 1;
        navigate(`/books?page=${next}`);
        window.location.reload();
    }

    // button to navigate to the previous page
    function prevPage() {
        let prev = Number(page) - 1;
        navigate(`/books?page=${prev}`);
        window.location.reload();
    }

    // get api url to get all books in the page
    const [url, seturl] = useState(requests.fastapi.books(`${page}`))
    const [books, setBooks] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(url);
                const json = await response.json();
                // console.log(json);
                    setBooks(json);
                // console.log(books);
            } catch (error) {
                console.log("error", error);
            }
        };

        fetchData();
    }, []);
    
    return (
        <div className='all-books card-deck'> 
            {books.map((book, index) => (
                <div className="book-card col-md-9 offset-md-5 card" key={index}>
                    <div className="book-image">
                        <img className='card-image-top' src={book["ImageURLM"]} alt={book["BookTitle"]} />
                    </div>
                    <div className="book-title-author card-body">
                        <Link to={`/view/book?isbn=${book.ISBN}`}>
                            <h5 className="book-title card-title" title={book.BookTitle}>{book.BookTitle} </h5>
                        </Link>
                        <small className="book-authors card-title" title={book.BookAuthor}> {book.BookAuthor}</small>
                    </div>
                </div>
            ))}
            <button className="btn nextbtn" onClick={(e)=> nextPage()}> <GrNext /> </button>
            <button className="btn prevbtn" onClick={(e)=> prevPage()}> <GrPrevious /> </button>
        </div>
    )
}

export default AllBooks
