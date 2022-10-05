import React, { useState } from "react";
import { useHistory } from 'react-router-dom';
import Button from "react-bootstrap/Button";


function RemoveanItem({ removeitem, id }) {


  const history = useHistory();

  const [formErrors, setFormErrors] = useState([]);

  console.debug(
    "RemoveanItem",
    "removebox=", typeof removeitem,
    "formErrors=", formErrors,
  );


  async function handleSubmit(event) {

    event.preventDefault();
    let result = await removeitem(id);

    if (result.success) {
      history.push("/");
    } else {
      setFormErrors(result.errors);
    }
  }

  return (

    <Button block="true" size="md" type="submit" onClick={handleSubmit}>
      Delete This Item
    </Button>


  );
}

export default RemoveanItem;