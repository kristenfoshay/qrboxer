import React, { useContext } from "react";
import User from "../users/User";
import MoveCard from "./MoveCard";
import UserContext from "../UserContext";

function Moves({ createmove }) {

  const { currentUser } = useContext(UserContext);
  let moves = currentUser.moves;


  if (!moves) return <p> No Moves yet! </p>;

  return (

    <div className="Moves col-md-8 offset-md-2">
      <User createmove={createmove} />
      <br></br>
      <br></br>
      <h1> My Moves </h1>
      {moves.length
        ? (

          <div className="Moves-list">

            {moves.map(m => (
              <MoveCard
                key={m.id}
                id={m.id}
                location={m.location}
                date={m.date}
              />
            ))}
          </div>
        ) : (
          <p className="lead">Sorry, no results were found!</p>
        )}
    </div>
  );
}

export default Moves;