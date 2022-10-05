import React, { useEffect, useState } from "react";
import { useHistory } from 'react-router-dom';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import QRBoxerApi from "../api/api";


function CreateanItem({ createitem, box }) {

  const history = useHistory();
  const INITIAL_STATE = {
    description: "",
    image: "",
    box: box
  }

  let [boxes, setBoxes] = useState(null);

  const [formData, setFormData] = useState(INITIAL_STATE);

  const [formErrors, setFormErrors] = useState([]);

  useEffect(() => {
    async function getBoxesItems() {

      let boxes = await QRBoxerApi.getBoxes();
      console.log(boxes);
      setBoxes(boxes);
    }
    getBoxesItems();
  }, []);

  if (!boxes) return <p> No Boxes yet! </p>;

  console.debug(
    "CreateItemForm",
    "createitem=", typeof createitem,
    "formData=", formData,
    "formErrors=", formErrors,
  );

  function handleChange(evt) {
    const { name, value } = evt.target;
    setFormData(data => ({ ...data, [name]: value }));
  }

  async function handleSubmit(event) {

    event.preventDefault();
    let result = await createitem(formData);

    if (result.success) {
      history.push("/");
    } else {
      setFormErrors(result.errors);
    }
  }

  return (
    <div className="form-group">
      <div>
        <h1>Create a new Item</h1>
      </div>

      <Form onSubmit={handleSubmit}>

        <Form.Group className="ml-3">
          <Form.Label >Description</Form.Label>
          <Form.Control
            type="description"
            name="description"
            id="description"
            value={formData.description}
            placeholder="Description of your Item"
            onChange={handleChange}
          />


        </Form.Group>

        <Form.Group className="ml-3">
          <Form.Label >Image</Form.Label>
          <Form.Control
            type="url"
            name="image"
            id="image"
            value={formData.image}
            placeholder="Image URL"
            onChange={handleChange}
          />


        </Form.Group>

        <Form.Group className="ml-3">
          <Form.Control
            type="hidden"
            name="box"
            id="box"
            value={box}
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

export default CreateanItem;