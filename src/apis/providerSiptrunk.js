import { SERVICE } from '@src/constants';
import api from './api';

export const getListProviderSiptrunks = async (params) => {
  const res = await api({
    method: 'GET',
    url: '/provider-siptrunks',
    params,
    source: SERVICE.PORTAL,
  });
  return res;
};

export const createProviderSiptrunk = async (data) => {
  const res = await api({
    method: 'POST',
    url: '/provider-siptrunks',
    data,
    source: SERVICE.PORTAL,
  });
  return res;
};

export const updateProviderSiptrunk = async (id, data) => {
  const res = await api({
    method: 'PUT',
    url: `/provider-siptrunks/${id}`,
    data,
    source: SERVICE.PORTAL,
  });
  return res;
};

export const getProviderSiptrunk = async (id) => {
  const res = await api({
    method: 'GET',
    url: `/provider-siptrunks/${id}`,
    source: SERVICE.PORTAL,
  });
  return res;
};

export const deleteProviderSiptrunk = async (id) => {
  const res = await api({
    method: 'DELETE',
    url: `/provider-siptrunks/${id}`,
    source: SERVICE.PORTAL,
  });
  return res;
};
