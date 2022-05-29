import React from 'react'
import Row from './Row'
import { requests } from '../requests'
import "./styles/Rows.css";

const Rows = () => {
  const genres = requests.genres;

  return (
    <div className="rows">
      {genres.map((title, index) => ( 
        <Row title={`${title}`} fetchURL={requests.googleapi.genre(`${title}`)} key={index} />
      ))
      }
    </div>
  )
}

export default Rows
