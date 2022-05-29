import React from 'react'
import Row  from './Row'
import "./styles/Rows.css";

const Rows = () => {
  return (
    <div className="rows">
      <Row type="row1" />
      <Row type="row2" />
      <Row type="row3" />
    </div>
  )
}

export default Rows
