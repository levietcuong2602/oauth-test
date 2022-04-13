import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import camelcase from 'camelcase';
import { useSnackbar } from 'notistack';
import { LoadingButton } from '@mui/lab';
import {
  Drawer,
  Box,
  IconButton,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import {
  HOTLINE_STATUS,
  HOTLINE_TYPE,
  MOBILE_NETWORK_OPERATOR,
} from '@src/constants';
import { PHONE_NUMBER_REGEX } from '@src/utils/regex';
import apis from '@src/apis';
import CustomSelect from '@src/components/CustomSelect';

import { StyledCreateHotline } from './index.style';

const CreateHotline = ({ open, onClose, onReloadData, hotlineId }) => {
  const { t } = useTranslation(['hotline', 'common']);

  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(true);
  const [hotline, setHotline] = useState({});
  const [hotlineData, setHotlineData] = useState({});
  const [errors, setErrors] = useState({});
  const [suppliers, setSuppliers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialFields = (data) => {
    const {
      sipNumber,
      type,
      mobileNetworkOperator,
      providerSiptrunkId,
      isPublic,
    } = data;

    setHotlineData({
      sipNumber,
      type,
      mobileNetworkOperator,
      providerSiptrunkId,
      status: isPublic ? HOTLINE_STATUS.PUBLIC : HOTLINE_STATUS.NOT_PUBLIC,
    });
  };

  useEffect(() => {
    if (!open) {
      setHotline({});
      setHotlineData({});
      setErrors({});
      setLoading(true);
    }
  }, [open]);

  const fetchData = async (id) => {
    setLoading(true);

    try {
      const providerRes =
        await apis.providerSiptrunk.getListProviderSiptrunks();
      if (!providerRes) throw new Error('serverError');

      const {
        result: { data },
      } = providerRes;

      setSuppliers(data);

      if (id) {
        const hotlineRes = await apis.hotline.getHotline(id);
        if (!hotlineRes) throw new Error('serverError');

        setHotline(hotlineRes.result);
        initialFields(hotlineRes.result);
      }
    } catch (error) {
      enqueueSnackbar(t(`common:::${error.message}`), {
        variant: 'error',
      });
    }

    setLoading(false);
  };

  useEffect(() => {
    if (!open) return;

    fetchData(hotlineId);
  }, [open, hotlineId]);

  useEffect(() => {
    if (!open) return;

    setLoading(false);
  }, [open, hotlineId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHotlineData((prev) => ({
      ...prev,
      [name]: value,
    }));

    let errorMessage = '';
    if (value && name === 'sipNumber' && !PHONE_NUMBER_REGEX.test(value)) {
      errorMessage = 'invalidValue';
    }

    setErrors((prev) => ({
      ...prev,
      [name]: errorMessage,
    }));
  };

  const handleSelectChange = (name, value) => {
    setHotlineData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
  };

  const handleClose = () => {
    onClose();
  };

  const validateAppData = () => {
    const {
      sipNumber,
      type,
      mobileNetworkOperator,
      providerSiptrunkId,
      status,
    } = hotlineData;

    let errorApp = {};

    if (!sipNumber || !sipNumber.trim()) {
      errorApp.sipNumber = 'fieldRequired';
    }

    if (!type) {
      errorApp.type = 'fieldRequired';
    }

    if (!mobileNetworkOperator) {
      errorApp.mobileNetworkOperator = 'fieldRequired';
    }

    if (!providerSiptrunkId) {
      errorApp.providerSiptrunkId = 'fieldRequired';
    }

    if (!status) {
      errorApp.status = 'fieldRequired';
    }

    errorApp = { ...errors, ...errorApp };

    const checkExistError = Object.values(errorApp).find((err) => err);
    if (checkExistError) {
      setErrors(errorApp);
      return false;
    }

    return true;
  };

  const handleCreate = async () => {
    if (!validateAppData()) return;
    setIsSubmitting(true);

    const { status, ...data } = hotlineData;
    data.isPublic = status === HOTLINE_STATUS.PUBLIC;

    try {
      let res;
      if (!hotlineId) {
        res = await apis.hotline.createHotline(data);
      } else {
        res = await apis.hotline.updateHotline(hotlineId, data);
      }

      if (!res) throw new Error('serverError');
      enqueueSnackbar(
        t(hotlineId ? 'updateHotlineSuccess' : 'createHotlineSuccess'),
        { variant: 'success' },
      );
      onReloadData();
    } catch (error) {
      enqueueSnackbar(t(`common:::${error.message}`), { variant: 'error' });
    }

    setIsSubmitting(false);
  };

  const handleReset = () => {
    if (hotlineId) {
      initialFields(hotline);
    } else {
      setHotlineData({});
    }
    setErrors({});
  };

  const renderHotlineType = (value) => t(camelcase(value));

  const renderHotlineStatus = (value) => t(camelcase(value));

  const renderMobileNetworkOperator = (value) => t(camelcase(value));

  return (
    <Drawer anchor="right" open={open}>
      <StyledCreateHotline>
        <Box className="header">
          <Typography className="text">
            {hotlineId ? t('editHotline') : t('createHotline')}
          </Typography>
          <IconButton
            aria-label="close"
            className="btn-close"
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        {loading && (
          <Box display="flex" justifyContent="center">
            <CircularProgress color="primary" />
          </Box>
        )}
        {!loading && (
          <Box>
            <Box className="content">
              <Box className="item">
                <Typography className="title">{t('hotlineNumber')}</Typography>
                <TextField
                  variant="outlined"
                  fullWidth
                  size="small"
                  placeholder={t('hotlineNumberPlaceholder')}
                  name="sipNumber"
                  value={hotlineData.sipNumber || ''}
                  onChange={handleChange}
                  helperText={
                    errors.sipNumber && t(`common:::${errors.sipNumber}`)
                  }
                  error={Boolean(errors.sipNumber)}
                />
              </Box>
              <Box className="item">
                <Typography className="title">{t('hotlineType')}</Typography>
                <CustomSelect
                  placeholder={t('chooseHotlineType')}
                  options={Object.keys(HOTLINE_TYPE).map((key) => {
                    const value = HOTLINE_TYPE[key];
                    return {
                      value,
                      label: renderHotlineType(value),
                    };
                  })}
                  value={hotlineData.type}
                  onChange={(value) => handleSelectChange('type', value)}
                  helperText={errors.type && t(`common:::${errors.type}`)}
                  error={Boolean(errors.type)}
                />
              </Box>
              <Box className="item">
                <Typography className="title">
                  {t('mobileNetworkOperator')}
                </Typography>
                <CustomSelect
                  placeholder={t('chooseMobileNetworkOperator')}
                  options={Object.keys(MOBILE_NETWORK_OPERATOR).map((key) => {
                    const value = MOBILE_NETWORK_OPERATOR[key];
                    return {
                      value,
                      label: renderMobileNetworkOperator(value),
                    };
                  })}
                  value={hotlineData.mobileNetworkOperator}
                  onChange={(value) =>
                    handleSelectChange('mobileNetworkOperator', value)
                  }
                  helperText={
                    errors.mobileNetworkOperator &&
                    t(`common:::${errors.mobileNetworkOperator}`)
                  }
                  error={Boolean(errors.mobileNetworkOperator)}
                />
              </Box>
              <Box className="item">
                <Typography className="title">{t('supplier')}</Typography>
                <CustomSelect
                  placeholder={t('chooseSupplier')}
                  options={suppliers.map(({ id, name }) => ({
                    value: id,
                    label: name,
                  }))}
                  value={hotlineData.providerSiptrunkId}
                  onChange={(value) =>
                    handleSelectChange('providerSiptrunkId', value)
                  }
                  helperText={
                    errors.providerSiptrunkId &&
                    t(`common:::${errors.providerSiptrunkId}`)
                  }
                  error={Boolean(errors.providerSiptrunkId)}
                />
              </Box>
              <Box className="item">
                <Typography className="title">{t('status')}</Typography>
                <CustomSelect
                  placeholder={t('chooseStatus')}
                  options={Object.keys(HOTLINE_STATUS).map((key) => {
                    const value = HOTLINE_STATUS[key];
                    return {
                      value,
                      label: renderHotlineStatus(value),
                    };
                  })}
                  value={hotlineData.status}
                  onChange={(value) => handleSelectChange('status', value)}
                  helperText={errors.status && t(`common:::${errors.status}`)}
                  error={Boolean(errors.status)}
                />
              </Box>
            </Box>

            <Box className="actions">
              <LoadingButton
                onClick={handleCreate}
                loading={isSubmitting}
                loadingPosition="start"
                variant="contained"
              >
                {hotlineId ? t('update') : t('createNow')}
              </LoadingButton>
              <Button variant="outlined" onClick={handleReset}>
                {t('reset')}
              </Button>
            </Box>
          </Box>
        )}
      </StyledCreateHotline>
    </Drawer>
  );
};

export default CreateHotline;
