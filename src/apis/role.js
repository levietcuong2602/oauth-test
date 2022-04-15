import { SERVICE } from '@src/constants';
import api from './api';

export const getListRoles = async (params) => {
  const res = await api({
    method: 'GET',
    url: '/api/admin/roles',
    params,
    source: SERVICE.PORTAL,
  });
  return res;
};
