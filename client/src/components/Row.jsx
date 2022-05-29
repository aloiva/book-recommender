import React, { useState, useEffect } from 'react'
import Slider from 'react-slick'
import { Link } from 'react-router-dom'
import requests from '../requests'
import './styles/Row.css'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function CustomNextArrow(props) {
    const { className, style, onClick } = props;
    return (
        <div
            className={className}
            style={{ ...style, display: "block", width: "100px", height: "50%", position: "absolute", top: "20%" }}
            onClick={onClick}
        />
    );
}

function CustomPrevArrow(props) {
    const { className, style, onClick } = props;
    return (
        <div
            className={className}
            style={{ ...style, display: "block", width: "40px", height: "50%", background: "rgba(143, 121, 121, 0.484)", display: "flex", alignItems: "center", position: "absolute", left: "-40px", borderRadius: "20px" }}
            onClick={onClick}
        />
    );
}

const Row = ({ title, fetchURL, auto }) => {
    const config = {
        focusOnSelect: true,
        infinite: true,
        slidesToShow: 5,
        slidesToScroll: 1,
        speed: 800,
        autoplay: `${auto}`,
        autoplaySpeed: 3900,
        pauseOnHover: true,
        nextArrow: <CustomNextArrow className="custom-next-arrow" />,
        prevArrow: <CustomPrevArrow classname='custom-prev-arrow' />
    };
    const [settings, setSettings] = useState(config);
    const [books, setBooks] = useState([]);
    // console.log("received title ", title, " refeieved url ", fetchURL);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(fetchURL);
                const json = await response.json();
                // console.log(json);
                if (json.totalItems > 0)
                    setBooks(json.items);
                else setBooks({});
                // console.log(books);
            } catch (error) {
                console.log("error", error);
            }
        };

        fetchData();
    }, []);

    // if (JSON.stringify(books) === '{}') {
    //     console.log(books, "is empty at ", title);
    // } else {
    //     console.log(books, "is not at ", title);
    // }

    if (JSON.stringify(books) !== '{}') {
        return (
            <div id={title} className="book-row">
                <h2>{title}</h2>
                <div className="slider">
                    <Slider {...settings}>
                        {books.map((book, index) => (
                            <div className="book-card" key={index}>
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
                        ))}
                    </Slider>
                </div>
            </div>
        )
    }
    else {
        return (
            <div className="book-row">
                <h2>{title}</h2>
                <div className="book-title">No Data Found</div>
            </div>
        )
    }
}

export default Row
