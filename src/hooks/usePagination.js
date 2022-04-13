/* eslint-disable no-param-reassign */
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';

import { omitIsNil } from '@src/utils/omit';
import { delay } from '@src/utils/delay';
import { ALL, PAGINATION_LIMIT } from '@src/constants';
import useSearchParams from './useSearchParams';

const usePagination = (
  initData,
  apiFetch,
  ignoreParams = [],
  delayTime = 500,
) => {
  const { t } = useTranslation(['common']);
  const { enqueueSnackbar } = useSnackbar();

  const [data, setData] = useState(initData);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const { addParams } = useSearchParams();

  const parseSearch = (searchString) => {
    const options = queryString.parse(searchString);
    const { page = '1', size = PAGINATION_LIMIT, ...searchParams } = options;
    const pageNumber = parseInt(page, 10);
    const sizeNumber = parseInt(size, 10);
    const currentPage = pageNumber >= 0 ? pageNumber : 1;
    const currentSize =
      sizeNumber >= PAGINATION_LIMIT ? sizeNumber : PAGINATION_LIMIT;
    const pageNum = currentPage;
    const limit = currentSize;

    ignoreParams.forEach((el) => {
      if (searchParams[el]) delete searchParams[el];
    });

    return {
      currentPage,
      currentSize,
      searchParams: { ...searchParams, pageNum, limit },
    };
  };

  const getCurrentInfo = () => {
    const { currentPage, currentSize } = parseSearch(location.search);
    return { currentPage, currentSize };
  };

  const handleCallApi = async (params) => {
    Object.keys(params).forEach((key) => {
      if (params[key] === ALL) {
        delete params[key];
      }
    });
    omitIsNil(params, { deep: false });
    try {
      setLoading(true);
      const response = await apiFetch(params);
      if (!response) {
        setLoading(false);
        return;
      }
      await delay(delayTime);
      setData(response.result.data);
      setTotal(response.result.pager.totalCount);
    } catch (error) {
      enqueueSnackbar(t(error.message), { variant: 'error' });
    }
    setLoading(false);
  };

  const handleChangePage = async (page) => {
    addParams({ page });
  };

  const handleChangeSize = async (size) => {
    addParams({ size });
  };

  useEffect(() => {
    const { searchParams } = parseSearch(location.search);
    handleCallApi(searchParams);
  }, [location]);

  return {
    data,
    setData,
    currentPage: getCurrentInfo().currentPage,
    currentSize: getCurrentInfo().currentSize,
    total,
    setTotal,
    onChangePage: handleChangePage,
    onChangeSize: handleChangeSize,
    handleCallApi,
    params: parseSearch(location.search).searchParams,
    loading,
  };
};

export default usePagination;
