import React, { useContext } from "react";
//import React from "react";
//import MoveCardList from "../moves/MoveCardList";
import CreateMoveForm from "../moves/CreateMoveForm";
import UserContext from "../UserContext";

function User({createmove}) {
  const { currentUser } = useContext(UserContext);
 
  console.log(currentUser);


  return (
      <div className="User col-md-8 offset-md-2">
        {/* <h1>Welcome Back {currentUser.username}!</h1> */}
        <br></br>
        <br></br>
        <CreateMoveForm username={currentUser.username} createmove={createmove} />

      </div>
  );
}

export default User;