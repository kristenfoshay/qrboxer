import React, {useState} from 'react';
import { useHistory } from 'react-router-dom';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./Signup.css";



function CreateMoveForm({signup}) {
  const history = useHistory();
  const INITIAL_STATE = {
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
  }
  const [formData, setFormData] = useState(INITIAL_STATE);

  const [formErrors, setFormErrors] = useState([]);

  console.debug(
      "SignupForm",
      "signup=", typeof signup,
      "formData=", formData,
      "formErrors=", formErrors,
  );

  function handleChange(evt) {
    const { name, value } = evt.target;
    setFormData(data => ({ ...data, [name]: value }));
  }

  async function handleSubmit(event) {

    event.preventDefault();
    let result = await signup(formData);

    if (result.success) {
      history.push("/");
    } else {
      setFormErrors(result.errors);
    }
  }

  return (
    <div class="form-group">
      <div>
        <h1>Create an Account</h1>
      </div>



      <Form onSubmit={handleSubmit}>
        
        <Form.Group className="ml-3">
          <Form.Label >Location you are moving to</Form.Label>
          <Form.Control
            type="location"
            name="location"
            id="location"
            value={formData.location}
            placeholder="Location"
            onChange={handleChange}
          />


        </Form.Group>

        <Form.Group className="ml-3">
          <Form.Label className="label">Month of your move</Form.Label>
          <Form.Control
            type="month"
            name="month"
            id="month"
            value={formData.month}
            placeholder="Month"
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="ml-3">
          <Form.Label>The year of your move</Form.Label>
          <Form.Control
            type="year"
            name="year"
            id="year"
            value={formData.year}
            placeholder="Year"
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

export default CreateMoveForm;