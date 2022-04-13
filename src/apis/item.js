import api from './api';

export const getStatisticsRevenue = async (params) => {
  const res = await api({
    method: 'GET',
    url: '/items/statistics-revenues',
    params,
  });
  return res;
};

export const getTopSellingProducts = async (params) => {
  const res = await api({
    method: 'GET',
    url: '/items/top-selling-products',
    params,
  });
  return res;
};

export const getOverviewItems = async (params) => {
  const res = await api({
    method: 'GET',
    url: '/items/overviews',
    params,
  });
  return res;
};
