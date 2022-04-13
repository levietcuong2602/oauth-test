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
  FormControlLabel,
  Switch,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import CloseIcon from '@mui/icons-material/Close';

import CustomNumberInput from '@src/components/CustomInput/CustomNumberInput';
import apis from '@src/apis';

import { StyledCreatePackageCharge } from './index.style';

const CreatePackageCharge = ({ open, onClose, onReloadData, packageId }) => {
  const { t } = useTranslation(['packageCharge', 'common']);
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(true);
  const [packageCharge, setPackageCharge] = useState({});
  const [packageChargeData, setPackageChargeData] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialFields = (data) => {
    const { code, price = 0, percentPlus = 0 } = data;
    setPackageChargeData({
      code,
      price,
      percentPlus,
    });
  };

  useEffect(() => {
    if (!open) {
      setPackageCharge({});
      setPackageChargeData({});
      setErrors({});
      setLoading(true);
    }
  }, [open]);

  const fetchPackage = async () => {
    setLoading(true);

    try {
      const res = await apis.packageCharge.getPackageCharge(packageId);
      if (!res) throw new Error('serverError');

      setPackageCharge(res.result);
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

    if (packageId) {
      fetchPackage();
      return;
    }

    setLoading(false);
  }, [open, packageId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPackageChargeData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
  };

  const handleChangePrice = (value) => {
    setPackageChargeData((prev) => ({
      ...prev,
      price: +value,
    }));

    setErrors((prev) => ({
      ...prev,
      price: '',
    }));
  };

  const handleChangePercentPlus = (value) => {
    setPackageChargeData((prev) => ({
      ...prev,
      percentPlus: +value,
    }));

    setErrors((prev) => ({
      ...prev,
      percentPlus: '',
    }));
  };

  const handleChangeActive = (event) => {
    setPackageChargeData((prev) => ({
      ...prev,
      active: event.target.checked,
    }));
  };

  const handleClose = () => {
    onClose();
  };

  const validatePackageData = () => {
    const { code, price, percentPlus } = packageChargeData;

    let errorPackage = {};

    if (!code || !code.trim()) {
      errorPackage.code = 'fieldRequired';
    }

    if (price === undefined || price === '') {
      errorPackage.price = 'fieldRequired';
    }

    if (percentPlus === undefined || percentPlus === '') {
      errorPackage.percentPlus = 'fieldRequired';
    }

    errorPackage = { ...errors, ...errorPackage };

    const checkExistError = Object.values(errorPackage).find((err) => err);
    if (checkExistError) {
      setErrors(errorPackage);
      return false;
    }

    return true;
  };

  const handleCreate = async () => {
    if (!validatePackageData()) return;

    setIsSubmitting(true);

    try {
      let res;
      if (!packageId) {
        res = await apis.packageCharge.createPackageCharge(packageChargeData);
      } else {
        res = await apis.packageCharge.updatePackageCharge(
          packageId,
          packageChargeData,
        );
      }

      if (!res) throw new Error('serverError');
      enqueueSnackbar(
        t(packageId ? 'updatePackageSuccess' : 'createPackageSuccess'),
        { variant: 'success' },
      );
      onReloadData();
    } catch (error) {
      enqueueSnackbar(t(`common:::${error.message}`), { variant: 'error' });
    }

    setIsSubmitting(false);
  };

  const handleReset = () => {
    if (packageId) {
      initialFields(packageCharge);
    } else {
      setPackageChargeData({});
    }
    setErrors({});
  };

  return (
    <Drawer anchor="right" open={open}>
      <StyledCreatePackageCharge>
        <Box className="header">
          <Typography className="text">
            {packageId ? t('editPackage') : t('createPackage')}
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
                <Typography className="title">Key</Typography>
                <TextField
                  className="dashed-border"
                  variant="outlined"
                  fullWidth
                  size="small"
                  placeholder={t('keyPlaceholder')}
                  name="code"
                  value={packageChargeData.code || ''}
                  onChange={handleChange}
                  helperText={errors.code && t(`common:::${errors.code}`)}
                  error={Boolean(errors.code)}
                />
              </Box>
              <Box className="item">
                <Typography className="title">{`${t(
                  'price',
                )} (VND)`}</Typography>
                <CustomNumberInput
                  className="number-input dashed-border mr-18"
                  onChange={handleChangePrice}
                  value={
                    packageChargeData.price !== undefined
                      ? packageChargeData.price
                      : null
                  }
                  min={0}
                  helperText={errors.price && t(`common:::${errors.price}`)}
                  error={Boolean(errors.price)}
                />
              </Box>
              <Box className="item">
                <Typography className="title">{`${t(
                  'preferential',
                )} (%)`}</Typography>
                <CustomNumberInput
                  className="number-input dashed-border mr-18"
                  onChange={handleChangePercentPlus}
                  value={
                    packageChargeData.percentPlus !== undefined
                      ? packageChargeData.percentPlus
                      : null
                  }
                  min={0}
                  max={100}
                  helperText={
                    errors.percentPlus && t(`common:::${errors.percentPlus}`)
                  }
                  error={Boolean(errors.percentPlus)}
                />
              </Box>
              <Box className="item">
                <FormControlLabel
                  className="form-control-label"
                  checked={packageChargeData.active || false}
                  onChange={handleChangeActive}
                  control={<Switch color="primary" />}
                  label={t('status')}
                  labelPlacement="start"
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
                {packageId ? t('update') : t('createNow')}
              </LoadingButton>
              <Button variant="outlined" onClick={handleReset}>
                {t('reset')}
              </Button>
            </Box>
          </Box>
        )}
      </StyledCreatePackageCharge>
    </Drawer>
  );
};

export default CreatePackageCharge;
