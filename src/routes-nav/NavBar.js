import React, {useContext} from 'react';
import { Link, NavLink } from 'react-router-dom';
import UserContext from "../UserContext";
import "./Nav.css";

function NavBar({ logout }) {
  const { currentUser } = useContext(UserContext);
 
  console.log(currentUser);
 

  function loggedOut(){
    return (
        <nav className="Nav">
          <NavLink exact to="/">Home</NavLink>
          <NavLink exact to="/login">Login</NavLink>
        </nav>
    );
  }

  function loggedIn(){
    return (
        <nav className="Nav">
          <NavLink exact to="/">Home</NavLink>
          <NavLink exact to="/moves">Moves</NavLink>
          <NavLink exact to="/boxes">Boxes</NavLink>
          <NavLink exact to="/items">Items</NavLink>
          <NavLink exact to="/profile">Profile</NavLink>
            <NavLink exact to="/" onClick={logout}>Logout</NavLink>
            
        </nav>
    );
  }
  
  return (
    <nav className="Nav">
      <Link to="/">
        QRBoxer
      </Link>
      {currentUser ? loggedIn() : loggedOut()}
    </nav>
);
}

export default NavBar;