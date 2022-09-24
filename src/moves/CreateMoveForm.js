import React, {useState, useContext} from 'react';
import { useHistory, Redirect } from 'react-router-dom';
import UserContext from "../UserContext";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./Moves.css";



function CreateMoveForm({username,createmove}) {
  const history = useHistory();
  const { currentUser } = useContext(UserContext);
  const INITIAL_STATE = {
    location: "",
    date: "",
    username: username
  }
  const [formData, setFormData] = useState(INITIAL_STATE);

  const [formErrors, setFormErrors] = useState([]);
  console.debug(
    "CreateMoveForm",
    "createmoveform=", typeof createmove,
    "formData=", formData,
    "formErrors=", formErrors,
);
  //const [saveConfirmed, setSaveConfirmed] = useState(false);
 if(!currentUser.username) {
    return <Redirect to="/login" />;
  }



  async function handleSubmit(event) {

    event.preventDefault();
    let result = await createmove(formData);

    if (result.success) {
      history.push("/moves");
    } else {
      setFormErrors(result.errors);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData(data => ({ ...data, [name]: value }));
  }

  return (
    <div class="form-group">
      
        <h2>Create a New Move</h2>
      
<br></br>


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
          <Form.Label className="label">Date of your move</Form.Label>
          <Form.Control
            type="date"
            name="date"
            id="date"
            value={formData.date}
            placeholder="Date"
            onChange={handleChange}
          />
        </Form.Group>



        <Form.Group className="ml-3">
          <Form.Control
            type="hidden"
            name="username"
            id="username"
            value={username}
            onChange={handleChange}
          />
        </Form.Group>

        <br></br>
        <br></br>
        <Button block="true" size="lg" type="submit">
          Submit
        </Button>
      </Form>
    </div>

  );
}

export default CreateMoveForm;