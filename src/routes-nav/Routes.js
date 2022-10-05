import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Homepage from "../homepage/Homepage";
import Moves from "../moves/Moves";
import Boxes from "../boxes/Boxes";
import Items from "../items/Items";
import Box from "../boxes/Box";
import PrintLabel from "../boxes/Printlabel";
import Move from "../moves/Move";
import User from "../users/User";
import Item from "../items/Item";
import LoginForm from "../auth/LoginForm";
import ProfileForm from "../profiles/ProfileForm";
import SignupForm from "../auth/SignupForm";


function Routes({ login, signup, createmove, createbox, createitem, removebox, removeitem }) {

  return (
    <div className="pt-5">
      <Switch>

        <Route exact path="/">
          <Homepage />
        </Route>

        <Route exact path="/login">
          <LoginForm login={login} />
        </Route>

        <Route exact path="/signup">
          <SignupForm signup={signup} />
        </Route>

        <Route exact path="/moves">
          <Moves createmove={createmove} />
        </Route>

        <Route exact path="/boxes">
          <Boxes />
        </Route>

        <Route exact path="/items">
          <Items />
        </Route>

        <Route exact path="/users/:username">
          <User createmove={createmove} />
        </Route>

        <Route exact path="/moves/:id">
          <Move createbox={createbox} />

        </Route>

        <Route exact path="/boxes/:id">
          <Box createitem={createitem} removebox={removebox} />
        </Route>

        <Route exact path="/boxes/:id/print">
          <PrintLabel />
        </Route>

        <Route exact path="/items/:id">
          <Item removeitem={removeitem} />
        </Route>

        <Route path="/profile">
          <ProfileForm />
        </Route>

        <Redirect to="/" />
      </Switch>
    </div>
  );
}

export default Routes;