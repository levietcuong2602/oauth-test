import ROUTES from '@src/constants/route';
import Login from '@src/pages/Login';
import ListRole from '@src/pages/Role/ListRole';

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
    component: ListRole,
    exact: true,
    restricted: false,
    isPrivate: true,
  },
];
