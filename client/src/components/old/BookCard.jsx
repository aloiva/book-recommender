import React from 'react'
import { Link } from 'react-router-dom'
import requests from '../../requests'
import './styles/Row.css'

const BookCard = ({book}) => {
    return (
        <div className="book-card">
            <div className="book-image">
                {book.volumeInfo.hasOwnProperty('imageLinks') && book.volumeInfo.imageLinks.hasOwnProperty('thumbnail') && <img src={book.volumeInfo.imageLinks.thumbnail} alt="" />}
                {!book.volumeInfo.hasOwnProperty('imageLinks') && <img src="https://dhmckee.com/wp-content/uploads/2018/11/defbookcover-min.jpg" alt="" />}
            </div>
            <div className="book-title-author">
                {book.volumeInfo.hasOwnProperty('industryIdentifiers') && <Link to={`/view/book?isbn=${book.volumeInfo.industryIdentifiers[0].identifier}`}>
                    <h5 className="book-title" title={book.volumeInfo.title}>{requests.truncate(book.volumeInfo.title, 50)} </h5>
                </Link>}
                {book.volumeInfo.hasOwnProperty('authors') && <small className="book-authors" title={book.volumeInfo.authors}> {requests.truncate(requests.getauthors(book.volumeInfo.authors), 25)}</small>}

            </div>
        </div>
    )
}

export default BookCard
