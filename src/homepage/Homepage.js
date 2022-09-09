import React, { Component } from 'react';
import Button from "react-bootstrap/Button";


class Homepage extends Component {
  //static contextType = UserContext;

  render() {
    //const currUser = this.context;
    return (
      <div>
        <h1>QRBoxer</h1>
        <p>Moving made easier!</p>
        <Button block="true" size="md" href="/login">
          Login
        </Button>
        <br></br>
        <br></br>
        <Button block="true" size="md" href="/signup">
          Signup
        </Button>

      </div>
    );
  }
}

export default Homepage;