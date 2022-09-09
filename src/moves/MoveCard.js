import React, { Component } from 'react';
import { Link } from "react-router-dom";
import "./MoveCard.css";

 class MoveCard extends Component {
  render() {
    const { location, month, year } = this.props;

  return (
      <Link className="MoveCard card" to={`/moves/${id}`}>
      <div className="moveCard">
        <div className="moveCard-location">
            <h3>{location}</h3>
          </div>
          <div className="moveCard-year">
            {year}
          </div>
          <div className="moveCard-month">
            {month}
          </div>
          </div>
      </Link>
  );
}
 }

export default MoveCard;