import {
  ERROR_CODE_PORTAL_SERVICE,
  ERROR_CODE_SYSTEM,
  SERVICE,
} from '@src/constants';

const PORTAL_ERROR_MESSAGE = {
  // ERROR CODE HOTLINE: 1500-1599
  [ERROR_CODE_PORTAL_SERVICE.HOTLINE_EXISTS]: 'hotlineExists',
  [ERROR_CODE_PORTAL_SERVICE.HOTLINE_NOT_FOUND]: 'hotlineNotFound',
  [ERROR_CODE_PORTAL_SERVICE.HOTLINE_LINKED_CAMPAIGN]: 'hotlineLinkedCampaign',
  // ERROR CODE PROVIDER SIPTRUNK: 2000-2099
  [ERROR_CODE_PORTAL_SERVICE.PROVIDER_SIPTRUNK_NAME_EXIST]: 'supplierNameExist',
  [ERROR_CODE_PORTAL_SERVICE.PROVIDER_SIPTRUNK_NOT_FOUND]: 'supplierNotFound',
  [ERROR_CODE_PORTAL_SERVICE.PROVIDER_SIPTRUNK_LINKED_HOTLINE]:
    'supplierLinkedHotline',
};

const PAYMENT_ERROR_MESSAGE = {};

const CALL_ERROR_MESSAGE = {};

const PUBLIC_API_ERROR_MESSAGE = {};

const getErrorMessage = (code, service) => {
  let message;

  switch (service) {
    case SERVICE.PORTAL:
      message = PORTAL_ERROR_MESSAGE[code];
      break;
    case SERVICE.PAYMENT:
      message = PAYMENT_ERROR_MESSAGE[code];
      break;
    case SERVICE.CALL:
      message = CALL_ERROR_MESSAGE[code];
      break;
    case SERVICE.PUBLIC_API:
      message = PUBLIC_API_ERROR_MESSAGE[code];
      break;
    default:
  }

  if (message) return message;

  switch (code) {
    case ERROR_CODE_SYSTEM.BAD_REQUEST:
      return 'badRequest';
    case ERROR_CODE_SYSTEM.UNAUTHORIZED:
      return 'unauthorized';
    case ERROR_CODE_SYSTEM.FORBIDDEN:
      return 'forbidden';
    case ERROR_CODE_SYSTEM.NOT_FOUND:
      return 'notFound';
    default:
      return 'serverError';
  }
};

export default getErrorMessage;
