import React, { useState, useEffect } from "react";
import QRBoxerApi from "../api/api";
import ItemListBoxes from "../boxes/ItemListBoxes";

function BoxesListItems({ id }) {

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
        <ItemListBoxes
          box={box.id}
        />
      ))}
    </div>
  );
}

export default BoxesListItems;