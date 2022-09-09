import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import QRBoxerApi from "../api/api";
import BoxCardList from "../boxes/BoxCardList";


function Move() {
  const { id } = useParams();
  const [move, setMove] = useState(null);

  useEffect(() => {
    async function getMoveBoxes() {
      let move = await QRBoxerApi.getMove(id);
      setMove(move);
    }

    getMoveBoxes();
  }, [id]);

  if (!move) return <p> Loading ... </p>;

  return (
      <div className="Move col-md-8 offset-md-2">
        <h4>{move.location}</h4>
        <p>{move.year}</p>
        <p>{move.month}</p>
        <BoxCardList boxes={move.boxes} />
      </div>
  );
}

export default Move;