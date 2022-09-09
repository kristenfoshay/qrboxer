import React from "react";
import ItemCard from "./ItemCard";

function ItemCardList({ jobs }) {

  return (
      <div className="ItemCardList">
        {items.map(box => (
            <ItemCard
                key={item.id}
                id={item.id}
                room={item.description}
                description={item.image}
                box={item.box}
                // ItemCardList
            />
        ))}
      </div>
  );
}

export default ItemCardList;