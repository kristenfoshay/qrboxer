//import React, { useContext, useState } from "react";

import React, { Component } from 'react';
import { Link } from "react-router-dom";
import "./ItemCard.css";
//import UserContext from "../auth/UserContext";

function ItemCard({ id, room, description, move }) {
  console.debug("ItemCard");

  return (
    <Link className="ItemCard card" to={`/items/${id}`}>
       <div className="ItemCard"> 
        <div className="card-body">
          <h6 className="card-description">{description}</h6>
          <p>{image}</p>
          {/* might have to remove "year" */}
          <p>{box}</p>
        </div>
      </div>
      </Link>
  );
}


export default ItemCard;