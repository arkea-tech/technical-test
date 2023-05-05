import React from "react";
import { Route, Switch } from "react-router-dom";

import Organization from "./list";
import OrganizationView from "./view";

export default () => {
  return (
    <Switch>
      <Route path="/organization/:id" component={OrganizationView} />
      <Route path="/" component={Organization} />
    </Switch>
  );
};
