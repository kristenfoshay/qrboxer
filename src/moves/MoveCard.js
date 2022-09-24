import React, { Component } from 'react';
import { Link } from "react-router-dom";
import "./MoveCard.css";
//import createbox

 class MoveCard extends Component {
  render() {
    const { id, location, date } = this.props;

  return (
      <Link className="MoveCard card" to={`/moves/${id}`}>
      <div className="moveCard">
        <div className="moveCard-location">
        <h3>{location} {date}</h3>
          </div>

          </div>
      </Link>
  );
}
 }

export default MoveCard;

//create another movecard that has createbox component in it