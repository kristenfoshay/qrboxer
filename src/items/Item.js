import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import QRBoxerApi from "../api/api";



function Item() {
  const { id } = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    async function acquireItems() {
      let item = await QRBoxerApi.getItem(id);
      setItem(item);
    }

    acquireItems();
  }, [id]);

  if (!box) return <p> Loading ... </p>;

  return (
      <div className="Item col-md-8 offset-md-2">
        <h4>{item.description}</h4>
        <p>{item.image}</p>
        <p>{item.box}</p>
        
      </div>
  );
}

export default Item;