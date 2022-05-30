import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom'
import "./styles/SearchBar.css";
import "bootstrap/dist/css/bootstrap.min.css";
import requests from '../requests'
import SearchPage from './SearchPage'
import { RiMapPinTimeLine, RiCalendar2Line, RiSearchLine, RiUser3Fill } from 'react-icons/ri'

Date.prototype.toShortFormat = function () {
  let monthNames = ["Jan", "Feb", "Mar", "Apr",
    "May", "Jun", "Jul", "Aug",
    "Sep", "Oct", "Nov", "Dec"];

  return `${this.getDate()} ${monthNames[this.getMonth()]} ${this.getFullYear()}`;
}

const SearchBar = () => {
  var [date, setDate] = useState(new Date());
  const navigate = useNavigate();

  function handleSearch(e) {
    if (e.keyCode === 13) {
      console.log(e.target.value);
      navigate(`/search?q=${e.target.value}`);
      // window.location.reload();
      e.target.value = "";
    }
  }

  useEffect(() => {
    var timer = setInterval(() => setDate(new Date()), 1000);
    return function cleanup() {
      clearInterval(timer);
    };
  });

  return (
    <nav className="searchbar nav">

      {/* <Link to='/search'> */}
      <div class="form">
        <input
          type="text"
          class="form-control form-input"
          id="search-input"
          placeholder="Search anything..."
          onKeyUp={(e) => handleSearch(e)}
        />
        <RiSearchLine />
      </div>
      {/* </Link> */}

      <div>
        <ul className="redirectlinks nav">
          <li className="nav-item">
            <a href="#">Documentation</a>
          </li>
          <li className="nav-item">
            <a href="https://github.com/aloiva/book-recommender">GitHub</a>
          </li>
        </ul>
        <ul className="datetime nav">
          <li className="nav-item"><RiCalendar2Line /> &nbsp;{date.toShortFormat()}</li>
          <li className="nav-item"><RiMapPinTimeLine /> &nbsp; {date.toLocaleTimeString()}</li>
        </ul>
        <ul className="currentuser nav">
          <Link to='/switch_user' ><li className="nav-item"><RiUser3Fill /> &nbsp; Current User: {`${requests.currentUser.userName}`} </li></Link>
        </ul>
      </div>
    </nav>
  );
};

export default SearchBar;
