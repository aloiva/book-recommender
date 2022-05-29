import React from 'react'
import "./styles/AsideBar.css"

const Sidebar = ({props}) => {
  return (
    <div className="asidebar">
        <h2>Browse these sections..</h2>
        <ul>
          <li><a href="#row1">Row1</a></li>
          <li><a href="#row2">Row2</a></li>
          <li><a href="#row3">Row3</a></li>
        </ul>
    </div >
  )
}

export default Sidebar
