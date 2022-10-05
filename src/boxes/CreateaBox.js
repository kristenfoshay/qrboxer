import React, { useState } from "react";
import { useHistory } from 'react-router-dom';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";


function CreateaBox({ createbox, move }) {

  const history = useHistory();
  const INITIAL_STATE = {
    room: "",
    move: move
  }

  const [formData, setFormData] = useState(INITIAL_STATE);

  const [formErrors, setFormErrors] = useState([]);

  console.debug(
    "CreateBoxForm",
    "createbox=", typeof createbox,
    "formData=", formData,
    "formErrors=", formErrors,
  );

  function handleChange(evt) {
    const { name, value } = evt.target;
    setFormData(data => ({ ...data, [name]: value }));
  }

  async function handleSubmit(event) {

    event.preventDefault();
    let result = await createbox(formData);

    if (result.success) {
      history.push("/");
    } else {
      setFormErrors(result.errors);
    }
  }

  return (
    <div className="form-group">
      <div>
        <h1>Create a New Box</h1>
      </div>

      <Form onSubmit={handleSubmit}>

        <Form.Group className="ml-3">
          <Form.Label >Room</Form.Label>
          <Form.Control
            type="room"
            name="room"
            id="room"
            value={formData.room}
            placeholder="Room"
            onChange={handleChange}
          />

        </Form.Group>

        <Form.Group className="ml-3">
          <Form.Control
            type="hidden"
            name="move"
            id="move"
            value={move}
            onChange={handleChange}
          />

        </Form.Group>

        <br></br>
        <Button block="true" size="lg" type="submit">
          Submit
        </Button>
      </Form>
    </div>

  );
}

export default CreateaBox;