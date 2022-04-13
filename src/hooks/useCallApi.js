import { useState } from 'react';
import { useSnackbar } from 'notistack';

import { delay } from '@src/utils/delay';

const useCallApi = (initData, apiCaller, delayTime) => {
  const { enqueueSnackbar } = useSnackbar();

  const [data, setData] = useState(initData);
  const [loading, setLoading] = useState(true);

  const handleCallApi = async (...args) => {
    try {
      setLoading(true);
      const response = await apiCaller(...args);
      setData(response.results.data);
      if (delayTime) {
        await delay(delayTime);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  };

  return { data, setData, apiCaller: handleCallApi, loading };
};

export default useCallApi;
