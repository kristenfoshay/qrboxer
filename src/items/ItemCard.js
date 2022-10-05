import React from 'react';
import { Link } from "react-router-dom";
import "./ItemCard.css";

function ItemCard({ id, description, image, box }) {
  console.debug("ItemCard");

  console.log({ image });

  return (
    <Link className="ItemCard card" to={`/items/${id}`}>

      <div style={{ height: 'fit-content', width: 650, padding: '1rem', float: 'left' }}>
        <h6 className="card-description">{description}</h6>
        <div style={{
          height: 200, width: 200, margin: 'auto',
          backgroundImage: `url(${image})`,
          backgroundSize: '100% 100%',
          objectFit: 'fill'

        }}></div>

      </div>

    </Link>
  );
}


export default ItemCard;