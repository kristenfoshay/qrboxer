import React, {useState} from 'react';
import { useHistory } from 'react-router-dom';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./Signup.css";



function SignupForm({signup}) {
  const history = useHistory();
  const INITIAL_STATE = {
    username: "",
    password: "",
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
          <Form.Label >Username</Form.Label>
          <Form.Control
            type="username"
            name="username"
            id="username"
            value={formData.username}
            placeholder="Username"
            onChange={handleChange}
          />


        </Form.Group>

        <Form.Group className="ml-3">
          <Form.Label className="label">Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            id="email"
            value={formData.email}
            placeholder="Email"
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="ml-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            id="password"
            value={formData.password}
            placeholder="Password"
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

export default SignupForm;