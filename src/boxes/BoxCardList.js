import React from "react";
import BoxCard from "./BoxCard";

function BoxCardList({ boxes, location, date }) {

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

export default BoxCardList;