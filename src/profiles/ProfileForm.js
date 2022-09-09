import React, {useState, useContext} from "react";
import { useHistory } from "react-router-dom";
import Form from "react-bootstrap/Form";
import { Redirect } from "react-router";
import UserContext from "../UserContext";
import Button from "react-bootstrap/Button";
import QRBoxerApi from "../api/api";
import Alert from "../common/Alert";


function ProfileForm() {
  const history = useHistory();
  const { currentUser, setCurrentUser } = useContext(UserContext);
  console.log(currentUser);
 
  const INITIAL_STATE = {
    
    firstName: currentUser.firstName,
    lastName: currentUser.lastName,
    email: currentUser.email,
    username: currentUser.username,
    };
const [formData, setFormData] = useState(INITIAL_STATE);
const [saveConfirmed, setSaveConfirmed] = useState(false);
 if(!currentUser.username) {
    return <Redirect to="/login" />;
  }

  async function handleSubmit(evt) {
    evt.preventDefault();

    let profileData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
    };

    let username = formData.username;
    let updatedUser;

    try {
      updatedUser = await QRBoxerApi.saveProfile(username, profileData);
      if (updatedUser.success) {
        history.push("/moves");
      }    
    } catch (errors) {
      return;
    }

    setFormData(f => ({ ...f, password: "" }));
    setSaveConfirmed(true);

    // trigger reloading of user information throughout the site
    setCurrentUser(updatedUser);
  }

const handleChange = (event) => {
    const {name, value} = event.target;
    setFormData(formData => ({
        ...formData,
        [name]: value
    }))};


  return (
    <div class="form-group">
      <div>
        <h1>Edit Your Profile</h1>
      </div>

      <Form onSubmit={handleSubmit}>
        
        <Form.Group className="ml-3">
          <Form.Label >Username</Form.Label>
          <p class="form-control-plaintext">{currentUser.username}</p>

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

        {saveConfirmed
                  ?
                  <Alert type="success" messages={["Updated successfully."]} />
                  : null}

        <br></br>
        <Button block="true" size="lg" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
}



export default ProfileForm;