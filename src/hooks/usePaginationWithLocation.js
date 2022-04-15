import queryString from 'query-string';
import { useSnackbar } from 'notistack';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import snakecaseKeys from 'snakecase-keys';

import { PAGINATION_LIMIT } from '../constants';
import { omitIsNil } from '../utils/omit';
import useSearchParams from './useSearchParams';

const usePaginationWithLocation = (initData, apiFetch) => {
  const [data, setData] = useState(initData);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [totalPage, setTotalPage] = useState(1);
  const [hasNext, setHasNext] = useState(true);
  const [limit] = useState(PAGINATION_LIMIT);

  const location = useLocation();
  const { addParams } = useSearchParams();
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();

  const parseSearch = (searchString) => {
    const options = queryString.parse(searchString);
    const { pageNum = '1', ...searchParams } = options;
    const pageNumber = parseInt(pageNum, 10);
    const currentPage = pageNumber >= 1 ? pageNumber : 1;

    return { currentPage, searchParams: { ...searchParams, pageNum, limit } };
  };

  const getCurrentPage = () => {
    const { currentPage } = parseSearch(location.search);
    return currentPage;
  };

  const getParams = () => {
    const { searchParams } = parseSearch(location.search);
    return searchParams;
  };

  const handleCallApi = async (params) => {
    omitIsNil(params, { deep: false });
    try {
      setLoading(true);
      const response = await apiFetch(snakecaseKeys(params, { deep: true }));
      if (!response) return;

      setData(response.data.data);
      setTotal(response.data.pager.totalCount);
      setTotalPage(response.data.pager.lastPageNum);
      setHasNext(response.data.pager.hasNext);
    } catch (error) {
      enqueueSnackbar(t(error.message), { variant: 'error' });
    }

    setLoading(false);
  };

  const handleChangePagination = async (pageNum) => {
    addParams({ pageNum });
  };

  useEffect(() => {
    const { searchParams } = parseSearch(location.search);
    handleCallApi(searchParams);
    // eslint-disable-next-line
  }, [location]);

  return {
    data,
    setData,
    currentPage: getCurrentPage(),
    totalPage,
    total,
    limit,
    setTotal,
    onPaginationChange: handleChangePagination,
    handleCallApi,
    loading,
    hasNext,
    setHasNext,
    params: getParams(),
  };
};

export default usePaginationWithLocation;
