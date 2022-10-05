import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import QRBoxerApi from "../api/api";
import Boxid from "../boxes/Boxid";
import RemoveanItem from "../RemoveanItem.js";


function Item({ removeitem }) {
  const { id } = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    async function acquireItems() {
      let item = await QRBoxerApi.getItem(id);
      setItem(item);
    }

    acquireItems();
  }, [id]);

  if (!item) return <p> Loading ... </p>;

  return (

    <div className="card-body">
      <RemoveanItem id={id} removeitem={removeitem} />
      <br></br>
      <br></br>
      <h6 className="card-description">{item.description}</h6>
      <div style={{ height: 'content-fit', width: 'content-fit', marginLeft: '250px' }}>
        <div style={{
          height: 200, width: 200, marginLeft: '16px',
          backgroundImage: `url(${item.image})`,
          backgroundSize: '100% 100%',
          objectFit: 'fill'

        }}></div>

        <br></br>
        <Boxid box={item.box} />
      </div>
    </div>
  );
}

export default Item;