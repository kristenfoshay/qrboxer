//import React, { useContext, useState } from "react";

import React, { Component } from 'react';
import { Link } from "react-router-dom";
import "./BoxCard.css";
//import UserContext from "../auth/UserContext";

function BoxCard({ id, room, description, move }) {
  console.debug("BoxCard");

  return (
    <Link className="BoxCard card" to={`/boxes/${id}`}>
       <div className="BoxCard"> 
        <div className="card-body">
          <h6 className="card-description">{description}</h6>
          <p>{move.year}</p>
          {/* might have to remove "year" */}
          <p>{room}</p>
        </div>
      </div>
      </Link>
  );
}


export default BoxCard;