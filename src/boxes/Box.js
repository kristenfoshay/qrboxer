import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import QRBoxerApi from "../api/api";
import ItemCardList from "../items/ItemCardList";


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
        <h4>{box.location}</h4>
        <p>{box.year}</p>
        <p>{box.month}</p>
        <ItemCardList items={box.items} />
      </div>
  );
}

export default Box;