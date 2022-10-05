import React, { useState, useEffect } from "react";
import BoxCard from "./BoxCard";
import QRBoxerApi from "../api/api";

function BoxesList({ id, location, date }) {

  const [boxes, setBoxes] = useState(null);

  useEffect(() => {
    async function getMoveBoxes() {
      let boxes = await QRBoxerApi.getBoxesbyMove(id);
      console.log(boxes);
      setBoxes(boxes);
    }

    getMoveBoxes();
  }, [id]);

  if (!boxes) return <p> {id} </p>;

  return (
    <div className="BoxCardList">
      {boxes.map(box => (
        <BoxCard
          key={box.id}
          id={box.id}
          room={box.room}
          move={box.move}
          location={location}
          date={date}
        />
      ))}
    </div>
  );
}

export default BoxesList;