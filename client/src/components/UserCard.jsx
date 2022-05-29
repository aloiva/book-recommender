import React from 'react'
import user from '../assets/user.png'
import requests from '../requests'

// returning a singular user card

const UserCard = ({ userid, username, index }) => {
    // function to set current user once click event is received
    function switchUser()  {
        requests.setuser(index, userid, username);
    }
    
    return (
        <div className="col col-sm-2">
            <div className='card user-card' onClick={(e)=> switchUser()}>
                <img src={user} alt="" className="card-image-top" />
                <div class="card-body">
                    <h3 class="card-title text-center"> {username} </h3>
                </div>
            </div>
        </div>
    )
}

export default UserCard
