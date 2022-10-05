import React, { useState, useEffect } from "react";
import QRBoxerApi from "../api/api";
import QRCode from "../boxes/QRCode";
import { Link } from "react-router-dom";


function Moveid({ room, id, move }) {

  const [moveid, setMoveid] = useState(null);

  useEffect(() => {
    async function getMoveBoxes() {
      let moveid = await QRBoxerApi.getMove(move);
      setMoveid(moveid);
    }

    getMoveBoxes();
  }, [move]);

  if (!moveid) return <p> Loading ... </p>;

  return (
    <Link className="BoxCard card" to={`/boxes/${id}`}>
      <div className="card-body" style={{ height: 600, width: 300, float: 'left' }}>
        <h6 className="card-room">Room: {room}
          <br></br>
          <br></br>
          Destination: {moveid.location}
          <br></br>
          <br></br>
          Move Date: {moveid.date}</h6>
        <QRCode id={moveid.id} />
      </div>
    </Link>
  );
}

export default Moveid;