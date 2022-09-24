import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import QRBoxerApi from "../api/api";
import BoxCardList from "../boxes/BoxCardList";
import CreateaBox from "../boxes/CreateaBox";


function Move({createbox}) {
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
        <p>{move.date}</p>
        <CreateaBox move={move.id} createbox={createbox}/>
        <BoxCardList boxes={move.boxes} location={move.location} date={move.date} />
      </div>
  );
}

export default Move;