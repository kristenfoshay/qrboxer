import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import QRBoxerApi from "../api/api";
import MoveId from "../moves/Moveid.js"

function PrintLabel() {

  const { id } = useParams();
  const [box, setBox] = useState(null);

  useEffect(() => {
    async function acquireBox() {
      let box = await QRBoxerApi.getBox(id);
      setBox(box);
    }

    acquireBox();
  }, [id]);

  if (!box) return <p> Loading ... </p>;


  return (
    <div className="Box col-md-8 offset-md-2">

      <MoveId room={box.room} id={box.id} move={box.move} />

    </div>
  );
}

export default PrintLabel;