import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import queryString from 'query-string';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';

import CustomBreadcrumb from '@src/components/CustomBreadcrumb';
import CustomTable from '@src/components/CustomTable';
import { formatNumber } from '@src/utils/formatNumber';

import Navbar from '../Layout/Navbar';
import { StyledPackageCharge } from './index.style';
import { packages } from './data';
import CreatePackageCharge from '../CreatePackageCharge';

const PackageCharge = () => {
  const { t } = useTranslation(['packageCharge']);

  const location = useLocation();

  const [search, setSearch] = useState('');
  const [showCreatePackage, setShowCreatePackage] = useState(false);
  const [packageId, setPackageId] = useState();
  useState(false);

  useEffect(() => {
    const searchParams = queryString.parse(location.search);
    const { search: searchValue = '' } = searchParams;
    setSearch(searchValue);
  }, [location.search]);

  const handleSearchChange = (event) => {
    const { value } = event.target;
    setSearch(value);
  };

  const handleOpenCreatePackage = (id) => {
    setPackageId(id);
    setShowCreatePackage(true);
  };

  const handleCloseCreatePackage = () => {
    setPackageId();
    setShowCreatePackage(false);
  };

  const handleReloadPackage = () => {
    handleCloseCreatePackage();
    // TODO: reload data
  };

  const heads = [
    {
      label: t('no'),
      valueName: 'no',
      align: 'left',
    },
    {
      label: 'key',
      valueName: 'code',
      align: 'left',
    },
    {
      label: t('price'),
      valueName: 'priceDisplay',
      align: 'left',
    },
    {
      label: t('preferential'),
      valueName: 'preferentialDisplay',
      align: 'left',
    },
    {
      label: t('status'),
      valueName: 'statusDisplay',
      align: 'left',
    },
    {
      label: t('actions'),
      valueName: 'actions',
      align: 'center',
    },
  ];

  const actions = [
    {
      icon: <EditIcon />,
      onClick: (item) => handleOpenCreatePackage(item.id),
    },
    {
      icon: <DeleteIcon className="delete-icon" />,
      onClick: () => {},
    },
  ];

  const renderStatusDisplay = (active) => (
    <Typography className={`status ${active && 'status-active'}`}>
      {active ? t('activated') : t('notActivated')}
    </Typography>
  );

  return (
    <StyledPackageCharge>
      <Box mb={1}>
        <Navbar>
          <TextField
            className="search-text-field"
            size="small"
            placeholder={t('placeholder')}
            value={search}
            onChange={handleSearchChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Navbar>
      </Box>

      <Box className="heading-container" display="flex" alignItems="center">
        <Typography className="heading-text">
          {t('packageAdministrator')}
        </Typography>
        <Divider className="divider" orientation="vertical" flexItem />
        <CustomBreadcrumb
          crumbs={[
            { path: '', name: t('order') },
            { path: '', name: t('denominationAdministrator') },
          ]}
        />
      </Box>

      <Box
        display="flex"
        flexDirection="row"
        justifyContent="end"
        alignItems="center"
        mb={1}
      >
        <Button
          variant="contained"
          startIcon={<AddCircleIcon />}
          onClick={() => handleOpenCreatePackage()}
        >
          {t('addNewPackage')}
        </Button>
      </Box>

      <CustomTable
        items={packages.map((item) => ({
          ...item,
          priceDisplay: `${formatNumber(item.price)} VND`,
          preferentialDisplay: t('percentPlus', { percent: item.percentPlus }),
          statusDisplay: renderStatusDisplay(item.active),
        }))}
        heads={heads}
        actions={actions}
        disablePagination
        reorderable
      />

      <CreatePackageCharge
        open={showCreatePackage}
        packageId={packageId}
        onClose={handleCloseCreatePackage}
        onReloadData={handleReloadPackage}
      />
    </StyledPackageCharge>
  );
};

export default PackageCharge;
