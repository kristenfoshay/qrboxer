import React, { useState, useEffect } from "react";
import QRBoxerApi from "../api/api";
import User from "../users/User";
//import Form from "react-bootstrap/Form";
//import { useHistory } from "react-router-dom";
import MoveCard from "./MoveCard";
// import Dropdown from 'react-bootstrap/Dropdown';
// import DropdownButton from 'react-bootstrap/DropdownButton';
 //import { Link } from "react-router-dom";


function Moves({createmove}) {
  
  let [moves, setMoves] = useState(null);
  //let history = useHistory();

//   function handleSelect() {
//      let id = document.getElementById("selectedmove").value;
//      history.push(`/moves/${id}`);
//    }

  useEffect(() => {
    async function getMovesBoxes() {
 
    let moves = await QRBoxerApi.getMoves();
    console.log(moves);
    setMoves(moves);
  }
  getMovesBoxes();  
}, []);

  if (!moves) return <p> No Moves yet! </p>;

  return (
    
    

                // <DropdownButton id="dropdown-item-button" title="Move">
                // {moves.map(move => (
                //   <Link to={`/moves/${move.id}`}>
                //         <Dropdown.Item as="button">
                //             {move.location}
                //             <br></br>
                //             {move.date}
                //             </Dropdown.Item>
                //             </Link>
                //     ))}
                // </DropdownButton>

                // Tanzu Cloud Native // https://tanzu.vmware.com/
                //REACT ROUTER for ROUTING version 6
                //EVENT HANDLING // https://reactjs.org/docs/handling-events.html
                //onchange or onclick event handler

          //       <Form.Group controlId="custom-select">
          //       <Form.Label>Your Move Location/Date</Form.Label>
          //       <Form.Control as="select" id="selectedmove" onchange={handleSelect()} className="rounded-0 shadow">
          //            <option className="d-none" value="">
          //                 Select Move
          //            </option>
          //            {moves.map(move => (
                       
          //                 <option key={move.id} value={move.id}>{move.location} {move.date}</option>
                          
          //            ))}
          //       </Form.Control>
          //  </Form.Group>

          <div className="Moves col-md-8 offset-md-2">
           {moves.length
               ? (
                
                   <div className="Moves-list">
                    <User createmove={createmove} />
                    <br></br>
                    <br></br>
                    <h1> My Moves </h1>
                     {moves.map(m => (
                         <MoveCard
                             key={m.id}
                             id={m.id}
                             location={m.location}
                             date={m.date}
                         />
                     ))}
                   </div>
               ) : (
                   <p className="lead">Sorry, no results were found!</p>
               )}
         </div>
  );
}

export default Moves;