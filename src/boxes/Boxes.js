import React, { useState, useEffect } from "react";
import QRBoxerApi from "../api/api";
import BoxCard from "./BoxCard";


function Boxes() {

  let [boxes, setBoxes] = useState(null);
  
  useEffect(() => {
    async function acquireBoxes() {
 
    let boxes = await QRBoxerApi.getBoxes();
    setBoxes(boxes);
  }
  acquireBoxes();  
}, []);

  if (!boxes) return <p> Loading ...</p>;

  return (
      <div className="Moves col-md-8 offset-md-2">
       
        {boxes.length
            ? (
                <div className="Moves-list">
                  {boxes.map(b => (
                      <BoxCard
                          key={b.id}
                          id={b.id}
                          description={b.description}
                          room={b.room}
                          move={b.move}
                      />
                  ))}
                </div>
            ) : (
                <p className="lead">Sorry, no results were found!</p>
            )}
      </div>
  );
}

export default Boxes;