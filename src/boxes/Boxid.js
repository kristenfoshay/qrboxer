import React, { useState, useEffect } from "react";
import QRBoxerApi from "../api/api";
import Moveid from "../moves/Moveid";

function Boxid({ box }) {

  const [boxid, setBoxid] = useState(null);

  useEffect(() => {
    async function getBoxesMove() {
      let boxid = await QRBoxerApi.getBox(box);
      setBoxid(boxid);
    }

    getBoxesMove();
  }, [box]);

  if (!boxid) return <p> Loading ... </p>;

  return (


    <div className="card-body">
      <Moveid box={boxid.id} room={boxid.room} move={boxid.move} />
    </div>

  );
}

export default Boxid;