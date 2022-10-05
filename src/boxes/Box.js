import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import QRBoxerApi from "../api/api";
import ItemListBoxes from "../boxes/ItemListBoxes";
import CreateanItem from "../items/CreateanItem";
import Button from "react-bootstrap/Button";
import RemoveaBox from "../boxes/RemoveaBox.js";


function Box({ createitem, removebox }) {

  const { id } = useParams();
  const [box, setBox] = useState(null);

  useEffect(() => {
    async function acquireBox() {
      let box = await QRBoxerApi.getBox(id);
      setBox(box);
    }

    acquireBox();
  }, [id]);

  if (!box) return <p> Loading ... </p>;


  return (
    <div className="Box col-md-8 offset-md-2">

      <RemoveaBox id={id} removebox={removebox} />
      <br></br>
      <br></br>

      <Link to={`/boxes/${id}/print`}>
        <Button block="true" size="md" type="submit">Print Box Label</Button>
      </Link>

      <CreateanItem box={box.id} createitem={createitem} />
      <br></br>
      <h4>Items in this Box:</h4>
      <ItemListBoxes box={box.id} />
    </div>
  );
}

export default Box;

