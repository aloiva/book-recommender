import React from 'react'
import { Link } from 'react-router-dom'
import { FiUsers, FiUserCheck, FiHome, FiSearch } from 'react-icons/fi'
import { CgUserList } from 'react-icons/cg'
import { GiSpellBook, GiBookshelf } from 'react-icons/gi'
import { MdOutlineStarRate } from 'react-icons/md'
import './styles/SideNav.css'

const SideNav = () => {
  function focusSearch(e) {
    const el = document.querySelector('.searchbar > .form > #search-input')
    el.focus();
    e.preventDefault();
  }

  return (

    <div>
      <div className="sidenav">
        <ul>
          <Link to='/' > <li title="home"> <FiHome /> </li></Link>
          <Link to='/switch_user'><li title="switch user"> <FiUsers /></li> </Link>
          <Link to='/recommender' > <li title='find books for you'> <CgUserList /> </li></Link>
          <Link to='/search' > <li title="search" onClick={(e) => focusSearch(e)}> <FiSearch /> </li></Link>
          <Link to='/ratings' > <li title='your book ratings'> <MdOutlineStarRate /> </li></Link>
          <Link to='/browse_genres' > <li title='browse by genres'> <GiSpellBook /> </li></Link>
          <Link to='/books' > <li title='get books in our dataset'> <GiBookshelf /> </li></Link>
        </ul>
      </div>
    </div>
  )
}

export default SideNav
