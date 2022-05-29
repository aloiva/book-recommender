import React from 'react'
import './styles/SwitchUser.css'
import UserCard from './UserCard'
import requests from '../requests'

// returns a card for every user and allows them to change

const SwitchUser = () => {
  return (
    <div className="switch-user row">
      {[...Array(5)].map(
        (e, i) => (
          <UserCard username={requests.userNamesList[`${i + 1}`]} userid={requests.userIDsList[`${i + 1}`]} index={i + 1} key={i} />
        )
      )}
    </div>
  );
}

export default SwitchUser;
