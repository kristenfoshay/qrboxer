import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Homepage from "../homepage/Homepage";
import Moves from "../moves/Moves";
import Boxes from "../boxes/Boxes";
import Items from "../items/Items";
import Box from "../boxes/Box";
import Move from "../moves/Move";
import User from "../users/User";
import Item from "../items/Item";
import LoginForm from "../auth/LoginForm";
import ProfileForm from "../profiles/ProfileForm";
import SignupForm from "../auth/SignupForm";


function Routes({ login, signup }) {

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
            <Moves />
          </Route>

          <Route exact path="/boxes">
            <Boxes />
          </Route>

          <Route exact path="/items">
            <Items />
          </Route>

          <Route exact path="/users/:id">
            <User />
          </Route>

          <Route exact path="/moves/:id">
            <Move/>
          </Route>

          <Route exact path="/boxes/:id">
            <Box />
          </Route>

          <Route exact path="/items/:id">
            <Item />
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