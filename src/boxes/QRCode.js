import React, { useState, useEffect } from "react";
//import React from "react";
import QRBoxerApi from "../api/api";
// import MoveCard from "./MoveCard";
// import Dropdown from 'react-bootstrap/Dropdown';
// import DropdownButton from 'react-bootstrap/DropdownButton';
// import { Link } from "react-router-dom";



function QRCode({id}) {

  let [box, setBox] = useState(null);
  
  useEffect(() => {
    async function getQRBoxes() {
 
    let box = await QRBoxerApi.getBox(id);
    console.log(box);
    setBox(box);
  }
  getQRBoxes();  
}, [id]);

  if (!box) return <p> Oops! Something went wrong! </p>;

  return (
    
<img src="https://chart.googleapis.com/chart?cht=qr&amp;chs=100x100&amp;choe=UTF-8&amp;chl=`/boxes/${box.id}`"></img>
  


  );
}

export default QRCode;