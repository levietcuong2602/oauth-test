import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import {
  Drawer,
  Box,
  IconButton,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import CloseIcon from '@mui/icons-material/Close';

import apis from '@src/apis';
import { IP_REGEX, PHONE_NUMBER_REGEX, PORT_REGEX } from '@src/utils/regex';

import { StyledCreateSupplier } from './index.style';

const CreateSupplier = ({ open, onClose, onReloadData, supplierId }) => {
  const { t } = useTranslation(['hotline', 'common']);
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(true);
  const [supplier, setSupplier] = useState({});
  const [supplierData, setSupplierData] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialFields = (data) => {
    const { name, phoneContact, nameContact, addressContact, ip, port } = data;
    setSupplierData({
      name,
      phoneContact,
      nameContact,
      addressContact,
      ip,
      port,
    });
  };

  useEffect(() => {
    if (!open) {
      setSupplier({});
      setSupplierData({});
      setErrors({});
      setLoading(true);
    }
  }, [open]);

  const fetchSupplier = async () => {
    setLoading(true);

    try {
      const res = await apis.providerSiptrunk.getProviderSiptrunk(supplierId);
      if (!res) throw new Error('serverError');

      setSupplier(res.result);
      initialFields(res.result);
    } catch (error) {
      enqueueSnackbar(t(`common:::${error.message}`), {
        variant: 'error',
      });
    }

    setLoading(false);
  };

  useEffect(() => {
    if (!open) return;

    if (supplierId) {
      fetchSupplier();
      return;
    }

    setLoading(false);
  }, [open, supplierId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSupplierData((prev) => ({
      ...prev,
      [name]: value,
    }));

    let errorMessage = '';
    if (
      value &&
      ((name === 'phoneContact' && !PHONE_NUMBER_REGEX.test(value)) ||
        (name === 'ip' && !IP_REGEX.test(value)) ||
        (name === 'port' && !PORT_REGEX.test(value)))
    ) {
      errorMessage = 'invalidValue';
    }

    setErrors((prev) => ({
      ...prev,
      [name]: errorMessage,
    }));
  };

  const handleClose = () => {
    onClose();
  };

  const validateAppData = () => {
    const { name, ip, port } = supplierData;

    let errorApp = {};

    if (!name || !name.trim()) {
      errorApp.name = 'fieldRequired';
    }

    if (!ip || !ip.trim()) {
      errorApp.ip = 'fieldRequired';
    }

    if (!port || !port.trim()) {
      errorApp.port = 'fieldRequired';
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

    try {
      let res;
      if (!supplierId) {
        res = await apis.providerSiptrunk.createProviderSiptrunk(supplierData);
      } else {
        res = await apis.providerSiptrunk.updateProviderSiptrunk(
          supplierId,
          supplierData,
        );
      }

      if (!res) throw new Error('serverError');
      enqueueSnackbar(
        t(supplierId ? 'updateSupplierSuccess' : 'createSupplierSuccess'),
        { variant: 'success' },
      );
      onReloadData();
    } catch (error) {
      enqueueSnackbar(t(`common:::${error.message}`), { variant: 'error' });
    }

    setIsSubmitting(false);
  };

  const handleReset = () => {
    if (supplierId) {
      initialFields(supplier);
    } else {
      setSupplierData({});
    }
    setErrors({});
  };

  return (
    <Drawer anchor="right" open={open}>
      <StyledCreateSupplier>
        <Box className="header">
          <Typography className="text">
            {supplierId ? t('editSupplier') : t('createSupplier')}
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
                <Typography className="title">{t('supplierName')}</Typography>
                <TextField
                  variant="outlined"
                  fullWidth
                  size="small"
                  placeholder={t('supplierNamePlaceholder')}
                  name="name"
                  value={supplierData.name || ''}
                  onChange={handleChange}
                  helperText={errors.name && t(`common:::${errors.name}`)}
                  error={Boolean(errors.name)}
                />
              </Box>
              <Box className="item">
                <Typography className="title">{t('address')}</Typography>
                <TextField
                  variant="outlined"
                  fullWidth
                  size="small"
                  placeholder={t('addressPlaceholder')}
                  name="addressContact"
                  value={supplierData.addressContact || ''}
                  onChange={handleChange}
                />
              </Box>
              <Box className="item">
                <Typography className="title">{t('hotlineNumber')}</Typography>
                <TextField
                  variant="outlined"
                  fullWidth
                  size="small"
                  placeholder={t('hotlineNumberPlaceholder')}
                  name="phoneContact"
                  value={supplierData.phoneContact || ''}
                  onChange={handleChange}
                  helperText={
                    errors.phoneContact && t(`common:::${errors.phoneContact}`)
                  }
                  error={Boolean(errors.phoneContact)}
                />
              </Box>
              <Box className="item">
                <Typography className="title">{t('representative')}</Typography>
                <TextField
                  variant="outlined"
                  fullWidth
                  size="small"
                  placeholder={t('representativePlaceholder')}
                  name="nameContact"
                  value={supplierData.nameContact || ''}
                  onChange={handleChange}
                />
              </Box>
              <Box className="item">
                <Typography className="title">IP</Typography>
                <TextField
                  variant="outlined"
                  fullWidth
                  size="small"
                  placeholder={t('ipPlaceholder')}
                  name="ip"
                  value={supplierData.ip || ''}
                  onChange={handleChange}
                  helperText={errors.ip && t(`common:::${errors.ip}`)}
                  error={Boolean(errors.ip)}
                />
              </Box>
              <Box className="item">
                <Typography className="title">PORT</Typography>
                <TextField
                  variant="outlined"
                  fullWidth
                  size="small"
                  placeholder={t('portPlaceholder')}
                  name="port"
                  value={supplierData.port || ''}
                  onChange={handleChange}
                  helperText={errors.port && t(`common:::${errors.port}`)}
                  error={Boolean(errors.port)}
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
                {supplierId ? t('update') : t('createNow')}
              </LoadingButton>
              <Button variant="outlined" onClick={handleReset}>
                {t('reset')}
              </Button>
            </Box>
          </Box>
        )}
      </StyledCreateSupplier>
    </Drawer>
  );
};

export default CreateSupplier;
