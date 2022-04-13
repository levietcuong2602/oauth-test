import React, { useEffect } from 'react';
import { BrowserRouter, Switch, Redirect } from 'react-router-dom';
import nprogress from 'nprogress';
import 'nprogress/nprogress.css';

import ROUTE from '@src/constants/route';
import Layout from '@src/containers/Layout';

import appRoutes from './appRoutes';

import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';

const PrivateApp = () => {
  const privateRoutes = appRoutes.filter((route) => route.isPrivate);

  return (
    <Layout>
      <Switch>
        {privateRoutes.map((privateRoute) => (
          <PrivateRoute
            path={privateRoute.path}
            component={privateRoute.component}
            exact
            key={privateRoute.path}
          />
        ))}
        <Redirect to={ROUTE.HOME} />
      </Switch>
    </Layout>
  );
};

const AppRouter = () => {
  if (!nprogress.isStarted()) nprogress.start();

  useEffect(() => {
    nprogress.done();
  });

  // if (true) {
  //   return (
  //     <Box
  //       height="100vh"
  //       display="flex"
  //       justifyContent="center"
  //       alignItems="center"
  //     >
  //       <CircularProgress color="primary" />
  //     </Box>
  //   );
  // }

  const publicRoutes = appRoutes.filter((route) => !route.isPrivate);

  return (
    <BrowserRouter>
      <Switch>
        {publicRoutes.map((publicRoute) => (
          <PublicRoute
            key={publicRoute.path}
            exact
            path={publicRoute.path}
            component={publicRoute.component}
            restricted={publicRoute.restricted}
          />
        ))}
        <PrivateRoute component={PrivateApp} />
      </Switch>
    </BrowserRouter>
  );
};

export default AppRouter;
