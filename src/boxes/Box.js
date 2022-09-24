import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import QRBoxerApi from "../api/api";
import ItemCardList from "../items/ItemCardList";
import QRCode from "../boxes/QRCode";


function Box() {
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
<QRCode/>
        <h4>{box.room}</h4>
        <p>{box.move}</p>
        <ItemCardList items={box.items} />
      </div>
  );
}

export default Box;

