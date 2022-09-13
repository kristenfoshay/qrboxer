import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import QRBoxerApi from "../api/api";
import MoveCardList from "../moves/MoveCardList";


function User() {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function getUserMoves() {
      let user = await QRBoxerApi.getCurrentUser(username);
      setUser(user);
    }

    getUserMoves();
  }, [id]);

  if (!user) return <p> Loading ... </p>;

  return (
      <div className="Move col-md-8 offset-md-2">
        <h4>{user.username}</h4>
        <MoveCardList moves={user.moves} />
      </div>
  );
}

export default User;