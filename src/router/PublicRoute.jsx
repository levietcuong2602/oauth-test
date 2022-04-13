import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import ROUTE from '@src/constants/route';

const PublicRoute = ({ component: Component, restricted, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      restricted ? <Redirect to={ROUTE.HOME} /> : <Component {...props} />
    }
  />
);

export default PublicRoute;
