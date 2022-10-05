import React, { useContext } from "react";
import UserContext from "../UserContext";
import BoxesList from "../boxes/BoxesList";

function Boxes() {

    const { currentUser } = useContext(UserContext);

    let moves = currentUser.moves;

    return (
        <div className="Moves col-md-8 offset-md-2">
            <h1> My Boxes </h1>
            {moves.length
                ? (
                    <div className="Moves-list" style={{ height: 2000 }} >
                        {moves.map(m => (
                            <BoxesList id={m.id} location={m.location} date={m.date} />
                        ))}
                    </div>
                ) : (
                    <p className="lead">Sorry, no results were found!</p>
                )}
        </div>
    );
}

export default Boxes;