import React, { useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import './styles/SearchPage.css'
import requests from '../requests'
import Row from './Row'


const SearchPage = () => {
    const [getParams, setParams] = useSearchParams();
    // const navigate = useNavigate();
    let query = getParams.get("q");
    let urls = [];

    // const inputfield = document.querySelector('.searchbar > .form > #search-input')
    // console.log(inputfield);

    // inputfield.addEventListener('keydown', (e) => {
    //     if (e.keyCode === 13) {
    //         query = getParams.get("q");
    //         console.log(query);

    //     }
    // })

    // useEffect(() => {
        // console.log(query);
        if (query)
            query = query.replaceAll(' ', '+')
        urls = [];

        urls.push(requests.googleapi.query(query));
        urls.push(requests.googleapi.bytitle(query));
        urls.push(requests.googleapi["byauthor"](query));
        urls.push(requests.googleapi.isbn(query));
        // console.log(urls[0]);
    // });

    console.log(urls);
    return (
        <div className="search-results">
            <h3 className='text-center'>search term: {query}</h3>
            <Row title="search-by-query" fetchURL={urls[0]} />
            <Row title="search-by-title" fetchURL={urls[1]} />
            <Row title="search-by-author" fetchURL={urls[2]} />
            <Row title="search-by-isbn" fetchURL={urls[3]} />
        </div>
    )
}

export default SearchPage
