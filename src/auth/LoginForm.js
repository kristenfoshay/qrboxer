import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./Login.css";
import Alert from 'react-bootstrap/Alert';

function LoginForm({ login }) {
  const history = useHistory();

  const INITIAL_STATE = {
    username: "",
    password: ""
  }
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [isValid, setIsValid] = useState(true);
  const [formErrors, setFormErrors] = useState([]);

  console.debug(
    "LoginForm",
    "login=", typeof login,
    "formData=", formData,
    "formErrors=", formErrors,
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(formData => ({
      ...formData,
      [name]: value
    }))
  };

  async function handleSubmit(event) {

    event.preventDefault();
    let result = await login(formData);
    console.log(result);
    setFormData(INITIAL_STATE)
    if (result.success) {
      history.push('/');
    } else {
      setIsValid(false);
      setFormErrors(result.errors);
    }

  }

  return (
    <div >
      <div> {isValid
        ? null
        : <Alert variant="danger">Oops! That password/username combo is invalid! </Alert>
      }

      </div>
      <br></br>
      <Form className="Login" onSubmit={handleSubmit}>
        <Form.Label>My Account</Form.Label>
        <br></br>
        <Form.Group size="md" controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control
            autoFocus
            type="username"
            name="username"
            id="username"
            placeholder="Username"
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group size="lg" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            onChange={handleChange}
          />
        </Form.Group>
        <br></br>
        <Button block="true" size="lg" type="submit" >
          Login
        </Button>
      </Form>

    </div>
  );
}

export default LoginForm;