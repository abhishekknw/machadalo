import React from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';

import LayoutContainer from './../containers/LayoutContainer';
import { MANAGE_SUPPLIER } from '../constants/routes.constants';
import ManageSupplier from '../ManageSupplier/ManageSupplier';

export default function Routes() {
  // let userInfo = JSON.parse(localStorage.getItem('userInfo'))
  let userInfo = 'BUSINESS';
  return (
    <Router>
      <Switch>
        {/* <Route path="/r" component={PagesRoutes} /> */}
        <Route path={MANAGE_SUPPLIER} component={ManageSupplier} />
        <Route path="/r" component={LayoutContainer} />
        <Route path="*">
          <Redirect to="/r/404" />
        </Route>
      </Switch>
    </Router>
  );
}
