import { SERVICE } from '@src/constants';
import api from './api';

export const getListHotlines = async (params) => {
  const res = await api({
    method: 'GET',
    url: '/hotlines',
    params,
    source: SERVICE.PORTAL,
  });
  return res;
};

export const createHotline = async (data) => {
  const res = await api({
    method: 'POST',
    url: '/hotlines',
    data,
    source: SERVICE.PORTAL,
  });
  return res;
};

export const updateHotline = async (id, data) => {
  const res = await api({
    method: 'PUT',
    url: `/hotlines/${id}`,
    data,
    source: SERVICE.PORTAL,
  });
  return res;
};

export const getHotline = async (id) => {
  const res = await api({
    method: 'GET',
    url: `/hotlines/${id}`,
    source: SERVICE.PORTAL,
  });
  return res;
};

export const deleteHotline = async (id) => {
  const res = await api({
    method: 'DELETE',
    url: `/hotlines/${id}`,
    source: SERVICE.PORTAL,
  });
  return res;
};
