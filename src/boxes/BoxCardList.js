import React from "react";
import BoxCard from "./BoxCard";

function BoxCardList({ jobs }) {

  return (
      <div className="BoxCardList">
        {boxes.map(box => (
            <BoxCard
                key={box.id}
                id={box.id}
                room={box.room}
                description={box.description}
                move={box.move}
                // ItemCardList
            />
        ))}
      </div>
  );
}

export default BoxCardList;