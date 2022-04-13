import { useHistory, useLocation } from 'react-router-dom';
import queryString from 'query-string';

import { omitIsNil } from '@src/utils/omit';

const useSearchParams = () => {
  const location = useLocation();
  const history = useHistory();

  const addParams = (params) => {
    const searchParams = queryString.parse(location.search);
    const newSearchParams = { ...searchParams, ...params };
    omitIsNil(newSearchParams, { deep: false });
    const searchString = queryString.stringify(newSearchParams);
    history.replace({ search: searchString });
  };

  const removeParams = (...params) => {
    const listParamNames = [...params];
    if (!listParamNames) return;
    const searchParams = queryString.parse(location.search);

    listParamNames.forEach((param) => {
      delete searchParams[param];
    });

    const searchString = queryString.stringify(searchParams);
    history.replace({ search: searchString });
  };

  const removeAllParams = () => {
    history.replace({ search: null });
  };

  const replaceNewParams = (params) => {
    omitIsNil(params, { deep: false });
    const searchString = queryString.stringify(params);
    history.replace({ search: searchString });
  };

  return {
    addParams,
    removeParams,
    removeAllParams,
    replaceNewParams,
  };
};

export default useSearchParams;
