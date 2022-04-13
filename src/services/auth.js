import api from '@src/apis/api';
import { setCookie } from '@src/utils/cookie';

const handleReceivingTokens = (tokens) => {
  api.defaults.headers.common.Authorization = `Bearer ${tokens.token}`;

  setCookie('accessToken', tokens.token);
  setCookie('refreshToken', tokens.refreshToken);
};

export { handleReceivingTokens };
