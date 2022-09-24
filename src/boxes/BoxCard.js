//import React, { useContext, useState } from "react";

import React from 'react';
import { Link } from "react-router-dom";
import "./BoxCard.css";
import QRCode from "./QRCode";
//import UserContext from "../auth/UserContext";

function BoxCard({ id, room, move, location, date }) {
  console.debug("BoxCard");

  return (
    <Link className="BoxCard card" to={`/boxes/${id}`}>
       
        <div className="card-body">
          <h6 className="card-room">{room} {location} {date}</h6>
          <QRCode id={id}/>
          <p>{location} {date}</p>
          {/* might have to remove "year" */}
        </div>
      </Link>
  );
}


export default BoxCard;