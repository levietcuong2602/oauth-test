/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import ROUTES from '@src/constants/route';
import { Icon } from '@mui/material';

export const sidebarMenu = [
  {
    key: 'UsersManagement',
    heading: 'Users Management',
    icon: <Icon>analytics</Icon>,
    route: ROUTES.USERS,
    role: ['user'],
  },
  {
    key: 'RoleManagement',
    heading: 'Role Management',
    icon: <Icon>analytics</Icon>,
    route: ROUTES.ROLES,
    role: ['user'],
  },
  {
    key: 'ClientManagement',
    heading: 'Client Management',
    icon: <Icon>analytics</Icon>,
    route: ROUTES.CLIENTS,
    role: ['user'],
  },
  {
    key: 'PermisstionManagement',
    heading: 'Permisstion Management',
    icon: <Icon>assessment</Icon>,
    route: ROUTES.PERMISSIONS,
    role: ['user'],
  },
  // {
  //   key: "CustomerInsight",
  //   heading: "Customer Insight",
  //   icon: <Icon>insights</Icon>,
  //   role: ["user"],
  //   subMenu: [
  //     {
  //       key: "CRM",
  //       heading: "CRM",
  //       route: ROUTES.BUSINESS_ANALYTIC_DASHBOARD,
  //       role: ["user"],
  //     },
  //     {
  //       key: "CustomerAnalytics",
  //       heading: "Customer Analytics",
  //       route: ROUTES.SALE_ANALYTICS,
  //       role: ["user"],
  //     },
  //   ],
  // },
];
