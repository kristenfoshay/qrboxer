import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./Login.css";

function LoginForm({ login }) {
  const history = useHistory();

  const INITIAL_STATE = {
    username: "",
    password: ""
  }
  const [formData, setFormData] = useState(INITIAL_STATE);


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
    setFormData(INITIAL_STATE)
    if (result.success) {
      history.push("/companies");
    }


  }

  return (
    <div className="Login">
   
      <Form onSubmit={handleSubmit}>
        <Form.Group size="lg" controlId="username">
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