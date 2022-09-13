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
                year={move.year}
                month={move.month}
                // ItemCardList
            />
        ))}
      </div>
  );
}

export default MoveCardList;