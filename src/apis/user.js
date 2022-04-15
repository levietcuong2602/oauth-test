import api from './api';

export const getListUsers = async (params) => {
  const res = await api({
    method: 'GET',
    url: '/api/admin/users',
    params,
  });
  return res;
};
