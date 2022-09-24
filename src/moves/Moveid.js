import React, { useState, useEffect } from "react";
//import { useParams } from "react-router-dom";
import QRBoxerApi from "../api/api";
//import BoxCardList from "../boxes/BoxCardList";
//import CreateaBox from "../boxes/CreateaBox";
import QRCode from "../boxes/QRCode";
import { Link } from "react-router-dom";


function Moveid({id, move}) {
 
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
       
        <div className="card-body">
          <h6 className="card-room">{moveid.room} {moveid.location} {moveid.date}</h6>
          <QRCode id={moveid.id}/>
          <p>{moveid.location} {moveid.date}</p>
          {/* might have to remove "year" */}
        </div>
      </Link>
  );
}

export default Moveid;