import React, { useEffect, useState } from "react";
import { useHistory } from 'react-router-dom';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
//import { useParams } from "react-router-dom";
//import Dropdown from 'react-bootstrap/Dropdown';
//import DropdownButton from 'react-bootstrap/DropdownButton';
import QRBoxerApi from "../api/api";
//import QRCode from "./QRCode";
//import "./Signup.css";

function CreateaBox({createbox, move}) {

 
  const history = useHistory();
  const INITIAL_STATE = {
    room: "",
    move: move
  }

  let [moves, setMoves] = useState(null);

  const [formData, setFormData] = useState(INITIAL_STATE);

  const [formErrors, setFormErrors] = useState([]);

  useEffect(() => {
    async function getMovesBoxes() {
 
    let moves = await QRBoxerApi.getMoves();
    console.log(moves);
    setMoves(moves);
  }
  getMovesBoxes();  
}, []);

  if (!moves) return <p> No Moves yet! </p>;

  

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

        {/* <Form.Group action="#">
      <Form.Label>Your Move Location/Date</Form.Label>
      
      {moves.map(move => (
        <select>
                         <option key={move.id} type="move" id="move" name="move" value={move.id} onChange={handleChange}> {move.id} {move.location} {move.date} </option>
                         </select>
                    ))}
      
      <input type="submit" value="Submit" />
</Form.Group> */}

                {/* <Form.Group controlId="custom-select">
               <Form.Label>Your Move Location/Date</Form.Label>
               <Form.Control as="select" className="rounded-0 shadow">
                    <option className="d-none" value="">
                         Select A Move
                    </option>
                    {moves.map(move => (
                         <option key={move.id} type="move" id="move" name="move" value={move.id} onChange={handleChange}> {move.id} {move.location} {move.date} </option>
                    ))}
               </Form.Control>
          </Form.Group> */}

        <br></br>
        <Button block="true" size="lg" type="submit">
          Submit
        </Button>
      </Form>
    </div>

  );
}

export default CreateaBox;