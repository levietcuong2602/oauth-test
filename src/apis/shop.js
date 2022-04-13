import api from './api';

export const getListShops = async (params) => {
  const res = await api({
    method: 'GET',
    url: '/shops',
    params,
  });
  return res;
};
