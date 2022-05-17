import ROUTES from '@src/constants/route';
import Login from '@src/pages/Login';
import ListRole from '@src/pages/Role/ListRole';
import ListUser from '@src/pages/User/ListUser';
import ListClient from '@src/pages/Client/ListClient';
import Home from '@src/pages/Home';

export default [
  {
    path: ROUTES.LOGIN,
    component: Login,
    exact: true,
    restricted: false,
    isPrivate: true,
  },
  {
    path: ROUTES.ROLES,
    component: ListRole,
    exact: true,
    restricted: false,
    isPrivate: true,
  },
  {
    path: ROUTES.USERS,
    component: ListUser,
    exact: true,
    restricted: false,
    isPrivate: true,
  },
  {
    path: ROUTES.CLIENTS,
    component: ListClient,
    exact: true,
    restricted: false,
    isPrivate: true,
  },
  {
    path: ROUTES.HOME,
    component: Home,
    exact: true,
    restricted: false,
    isPrivate: false,
  },
];
