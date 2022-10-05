import React, { useState } from "react";
import { useHistory } from 'react-router-dom';
import Button from "react-bootstrap/Button";


function RemoveaBox({ removebox, id }) {


  const history = useHistory();

  const [formErrors, setFormErrors] = useState([]);

  console.debug(
    "RemoveaBox",
    "removebox=", typeof removebox,
    "formErrors=", formErrors,
  );

  async function handleSubmit(event) {

    event.preventDefault();
    let result = await removebox(id);

    if (result.success) {
      history.push("/boxes");
    } else {
      setFormErrors(result.errors);
    }
  }

  return (

    <Button block="true" size="md" type="submit" onClick={handleSubmit}>
      Delete This Box
    </Button>


  );
}

export default RemoveaBox;