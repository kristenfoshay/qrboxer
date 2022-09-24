import React from "react";
import MoveCard from "./MoveCard";

function MoveCardList({ moves }) {

  return (
      <div className="MoveCardList">
        {moves.map(move => (
            <MoveCard
                key={move.id}
                id={move.id}
                location={move.location}
                date={move.date}
                // ItemCardList
            />
        ))}
      </div>
  );
}

export default MoveCardList;