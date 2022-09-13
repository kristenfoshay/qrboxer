import React, { useState, useEffect } from "react";
import QRBoxerApi from "../api/api";
import MoveCard from "./MoveCard";


function Moves() {

  let [moves, setMoves] = useState(null);
  
  useEffect(() => {
    async function getMovesBoxes() {
 
    let moves = await QRBoxerApi.getMoves();
    console.log(moves);
    setMoves(moves);
  }
  getMovesBoxes();  
}, []);

  if (!moves) return <p> Loading ...</p>;

  return (
      <div className="Moves col-md-8 offset-md-2">
       
        {moves.length
            ? (
                <div className="Moves-list">
                  {moves.map(m => (
                      <MoveCard
                          key={m.id}
                          id={m.id}
                          location={m.location}
                          month={m.month}
                          year={m.year}
                      />
                  ))}
                </div>
            ) : (
                <p className="lead">Sorry, no results were found!</p>
            )}
      </div>
  );
}

export default Moves;