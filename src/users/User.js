import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import QRBoxerApi from "../api/api";
import MoveCardList from "../moves/MoveCardList";


function User() {
  const { username } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function getUserMoves() {
      let user = await QRBoxerApi.getCurrentUser(username);
      setUser(user);
    }

    getUserMoves();
  }, [username]);

  if (!user) return <p> Loading ... </p>;

  return (
      <div className="User col-md-8 offset-md-2">
        <h4>Welcome Back {user.username}!</h4>
        <h3>Pick a move to see your boxes!</h3>
        <MoveCardList moves={user.moves} />
      </div>
  );
}

export default User;