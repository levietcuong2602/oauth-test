import api from './api';

export const getListClients = async (params) => {
  const res = await api({
    method: 'GET',
    url: '/api/admin/clients',
    params,
  });
  return res;
};
