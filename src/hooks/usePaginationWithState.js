import { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';

import { PAGINATION_LIMIT } from '@src/constants';
import { omitIsNil } from '@src/utils/omit';
import { useTranslation } from 'react-i18next';

const usePaginationWithState = (initData, apiFetch, allowCallApi = true) => {
  const [data, setData] = useState(initData);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasNext, setHasNext] = useState(true);
  const [searchParams, setSearchParams] = useState({
    pageNum: 1,
    limit: PAGINATION_LIMIT,
  });
  const [loading, setLoading] = useState(false);

  const { t } = useTranslation(['common']);
  const { enqueueSnackbar } = useSnackbar();

  const handleSearchParamsChange = (params) => {
    const newParams = { ...searchParams, ...params };
    omitIsNil(newParams, { deep: false });
    setCurrentPage(1);
    setHasNext(true);
    setSearchParams(newParams);
  };

  const handleCallApi = async (params) => {
    omitIsNil(params, { deep: false });
    try {
      setLoading(true);
      const response = await apiFetch(params);
      if (!response) return;

      setData(response.result.data);
      setTotal(response.result.pager.totalCount);
      setTotalPage(response.result.pager.lastPageNum);
      setHasNext(response.result.pager.hasNext);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      enqueueSnackbar(t(error.message), { variant: 'error' });
    }
  };

  const handleChangePage = async (page) => {
    setCurrentPage(page);
    const limit = PAGINATION_LIMIT;
    setSearchParams({ ...searchParams, pageNum: page, limit });
  };

  const handleLoadMore = async (page) => {
    if (!hasNext) return;

    const limit = PAGINATION_LIMIT;
    const params = omitIsNil(
      { ...searchParams, pageNum: page, limit },
      { deep: false },
    );

    try {
      const response = await apiFetch(params);
      if (!response) return;

      setData(response.result.data);
      setTotal(response.result.pager.totalCount);
      setTotalPage(response.result.pager.lastPageNum);
      setHasNext(response.result.pager.hasNext);

      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
    } catch (error) {
      enqueueSnackbar(t(error.message), { variant: 'error' });
    }
  };

  useEffect(() => {
    if (!allowCallApi) return;
    handleCallApi(searchParams);
  }, [searchParams, allowCallApi]);

  return {
    data,
    setData,
    currentPage,
    totalPage,
    total,
    limit: searchParams.limit,
    hasNext,
    onPageChange: handleChangePage,
    onLoadMore: handleLoadMore,
    searchParams,
    onParamsChange: handleSearchParamsChange,
    handleCallApi,
    loading,
    setLoading,
    setHasNext,
  };
};

export default usePaginationWithState;
