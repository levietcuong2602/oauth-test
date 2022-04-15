import { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import snakecaseKeys from 'snakecase-keys';

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
      const response = await apiFetch(snakecaseKeys(params, { deep: true }));
      if (!response) return;

      setData(response.data.data);
      setTotal(response.data.pager.totalCount);
      setTotalPage(response.data.pager.lastPageNum);
      setHasNext(response.data.pager.hasNext);
      setLoading(false);
    } catch (error) {
      enqueueSnackbar(t(error.message), { variant: 'error' });
    }
    setLoading(false);
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
      const response = await apiFetch(snakecaseKeys(params, { deep: true }));
      if (!response) return;

      setData(response.data.data);
      setTotal(response.data.pager.totalCount);
      setTotalPage(response.data.pager.lastPageNum);
      setHasNext(response.data.pager.hasNext);

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
    onPaginationChange: handleChangePage,
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
