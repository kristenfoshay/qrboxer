import React, { useState, useEffect } from "react";
import QRBoxerApi from "../api/api";
import { QRCodeCanvas } from "qrcode.react";


function QRCode({ id }) {

  let [box, setBox] = useState(null);


  useEffect(() => {
    async function getQRBoxes() {

      let box = await QRBoxerApi.getBox(id);
      console.log(box);
      setBox(box);
    }
    getQRBoxes();
  }, [id]);

  if (!box) return <p> Oops! Something went wrong! </p>;

  const qrcode = (
    <QRCodeCanvas
      id="qrCode"
      value={`/boxes/${id}`}
      size={150}
      bgColor={"white"}
      level={"H"}
    />
  );

  return (

    <div>
      <h1>Box QR Code:</h1>
      <br></br>
      {qrcode}
    </div>

  );
}

export default QRCode;