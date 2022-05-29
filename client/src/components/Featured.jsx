import React from 'react'
import './styles/Featured.css';
import requests from '../requests'
import BookCarousel from './BookCarousel';
import { HiOutlineArrowNarrowRight } from 'react-icons/hi'
import { AiOutlineDoubleRight } from 'react-icons/ai'
import { Link } from 'react-router-dom';


const Featured = () => {
  return (
    <div className="featured row">
      <div className="leftFeatured col-6">
        <div className="featuredText">
          <h1>best sellers</h1>
          <h3>for <span className="typing">you.</span></h3>
        </div>
        <div className="featuredBtns">
          <Link to='/recommender' >
            <button className="btn discover-btn">
              featured for you <AiOutlineDoubleRight />
            </button>
          </Link>
          <Link to="/browse_genres" >
            <button className="btn discover-btn">
              browse by genre <AiOutlineDoubleRight />
            </button>
          </Link>
        </div>
      </div>
      <BookCarousel fetchURL={requests["New York Times Best Sellers"]} />
    </div>
  )
}

export default Featured