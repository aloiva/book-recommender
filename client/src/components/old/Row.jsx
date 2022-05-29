import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

function toDecimal(isbn13) {
  return isbn13.toFixed();
}

const Row = ({ type }) => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/books");
        const json = await response.json();
        setBooks(json[`${type}`]);
        console.log(books);
      } catch (error) {
        console.log("error", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={`row`} id={`${type}`}>
      {/* heading of the row */}
      <div className="row-heading">
        <h3>{type}</h3>
      </div>
      {/* books */}
      <div className="books">
        {books.map((book) => (
          <div className="book">
            {/* image */}
            <div className="book-image">
            <img src={book.image_url} alt="" />
            </div>
            {/* title and author */}
            <div className="book-title">
              <h2>{book.original_title}</h2>
              <small>{book.authors}</small> <br />
            </div>
            <div className="book-description">
              <span className="right">isbn: {book.isbn}</span> <br />
              <span className="left">published: {book.original_publication_year}</span>
            </div>
              <button><a href="">Read More</a> </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// Row.propTypes = {
//   type: String
// }

export default Row;
