import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import camelcase from 'camelcase';
import { useSnackbar } from 'notistack';
import queryString from 'query-string';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';

import { ALL, HOTLINE_STATUS, HOTLINE_TYPE } from '@src/constants';
import CustomTable from '@src/components/CustomTable';
import Popup from '@src/components/Popup';
import apis from '@src/apis';
import { usePagination, useSearchParams } from '@src/hooks';
import debounce from '@src/utils/debounce';

import Navbar from '../Layout/Navbar';
import { StyledHotline, StyledMenuItem } from './index.style';
import CreateHotline from '../CreateHotline';
import CreateSupplier from '../CreateSupplier';

const HOTLINE_TAB = {
  LIST_HOTLINE: 0,
  LIST_SUPPLIER: 1,
};

const TabPanel = (props) => {
  const { children, value, index, id, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={id}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box className="tab-panel">
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

const Hotline = () => {
  const { t } = useTranslation(['hotline']);
  const { enqueueSnackbar } = useSnackbar();

  const location = useLocation();

  const { addParams, removeParams, replaceNewParams } = useSearchParams();

  const [search, setSearch] = useState('');
  const [tab, setTab] = useState(HOTLINE_TAB.LIST_HOTLINE);
  const [filter, setFilter] = useState({});
  const [showCreateHotline, setShowCreateHotline] = useState(false);
  const [hotlineId, setHotlineId] = useState();
  const [showCreateSupplier, setShowCreateSupplier] = useState(false);
  const [supplierId, setSupplierId] = useState();
  const [showConfirmDeleteSupplier, setShowConfirmDeleteSupplier] =
    useState(false);
  const [supplierSelected, setSupplierSelected] = useState();
  const [showConfirmDeleteHotline, setShowConfirmDeleteHotline] =
    useState(false);
  const [hotlineSelected, setHotlineSelected] = useState();

  const {
    data: suppliers,
    currentPage: currentPageSupplier,
    currentSize: limitSupplier,
    total: totalSupplier,
    onChangePage: onPageChangeSupplier,
    handleCallApi: handleCallApiSupplier,
    params: supplierParams,
    loading: loadingSuppliers,
  } = usePagination([], apis.providerSiptrunk.getListProviderSiptrunks, [
    'tab',
    'type',
    'isPublic',
  ]);

  const {
    data: hotlines,
    currentPage: currentPageHotline,
    currentSize: limitHotline,
    total: totalHotline,
    onChangePage: onPageChangeHotline,
    handleCallApi: handleCallApiHotline,
    params: hotlineParams,
    loading: loadingHotlines,
  } = usePagination([], apis.hotline.getListHotlines, ['tab']);

  useEffect(() => {
    const searchParams = queryString.parse(location.search);
    const { search: searchValue = '', type, isPublic } = searchParams;
    setSearch(searchValue);

    let hotlineStatus;

    if (isPublic === 'true') {
      hotlineStatus = HOTLINE_STATUS.PUBLIC;
    } else if (isPublic === 'false') {
      hotlineStatus = HOTLINE_STATUS.NOT_PUBLIC;
    }

    setFilter((prevState) => ({
      ...prevState,
      type,
      status: hotlineStatus,
    }));
  }, [location.search]);

  const handleDebounceInputSearch = (params) => {
    if (params.search === '') {
      removeParams('search');
      return;
    }
    addParams({ ...params, page: 1 });
  };

  const handleSearchChange = (event) => {
    const { value } = event.target;
    setSearch(value);
    debounce(handleDebounceInputSearch)({ search: value });
  };

  const handleChangeTab = (event, newValue) => {
    onPageChangeHotline(1);
    onPageChangeSupplier(1);
    setTab(newValue);
  };

  const handleChangeHotlineType = (event) => {
    const { value } = event.target;
    if (!value || value === ALL) {
      const { status } = filter;

      let isPublic;
      if (status) isPublic = status === HOTLINE_STATUS.PUBLIC;

      const params = { isPublic, page: 1 };
      if (search.trim()) {
        params.search = search.trim();
      }

      replaceNewParams(params);
    } else {
      addParams({ type: value, page: 1 });
    }
    setFilter({ ...filter, type: value });
  };

  const handleChangeStatus = (event) => {
    const { value } = event.target;
    if (!value || value === ALL) {
      const params = { type: filter.type, page: 1 };

      if (search.trim()) {
        params.search = search.trim();
      }

      replaceNewParams(params);
    } else {
      addParams({ isPublic: value === HOTLINE_STATUS.PUBLIC, page: 1 });
    }
    setFilter({ ...filter, status: value });
  };

  const handleOpenCreateHotline = (id) => {
    setHotlineId(id);
    setShowCreateHotline(true);
  };

  const handleCloseCreateHotline = () => {
    setHotlineId();
    setShowCreateHotline(false);
  };

  const handleReloadHotline = () => {
    handleCloseCreateHotline();
    handleCallApiHotline(hotlineParams);
  };

  const handleOpenCreateSupplier = (id) => {
    setSupplierId(id);
    setShowCreateSupplier(true);
  };

  const handleCloseCreateSupplier = () => {
    setSupplierId();
    setShowCreateSupplier(false);
  };

  const handleReloadSupplier = () => {
    handleCloseCreateSupplier();

    handleCallApiSupplier(supplierParams);
  };

  const handleAdd = () => {
    if (tab === HOTLINE_TAB.LIST_HOTLINE) {
      handleOpenCreateHotline();
    } else {
      handleOpenCreateSupplier();
    }
  };

  const handleUpdateItem = (item) => {
    if (tab === HOTLINE_TAB.LIST_HOTLINE) {
      handleOpenCreateHotline(item.id);
    } else {
      handleOpenCreateSupplier(item.id);
    }
  };

  const handleOpenConfirmDeleteHotline = (hotline) => {
    setHotlineSelected(hotline);
    setShowConfirmDeleteHotline(true);
  };

  const handleCloseConfirmDeleteHotline = () => {
    setHotlineSelected();
    setShowConfirmDeleteHotline(false);
  };

  const handleOpenConfirmDeleteSupplier = (supplier) => {
    setSupplierSelected(supplier);
    setShowConfirmDeleteSupplier(true);
  };

  const handleCloseConfirmDeleteSupplier = () => {
    setSupplierSelected();
    setShowConfirmDeleteSupplier(false);
  };

  const handleDeleteItem = (item) => {
    if (tab === HOTLINE_TAB.LIST_HOTLINE) {
      handleOpenConfirmDeleteHotline(item);
    } else {
      handleOpenConfirmDeleteSupplier(item);
    }
  };

  const handleConfirmDeleteHotline = async () => {
    handleCloseConfirmDeleteHotline();

    try {
      const res = await apis.hotline.deleteHotline(hotlineSelected.id);
      if (!res) throw new Error('serverError');

      enqueueSnackbar(t('deleteHotlineSuccess'), { variant: 'success' });

      const pageNum = currentPageHotline;
      if (hotlines.length <= 1 && pageNum !== 1) {
        onPageChangeHotline(pageNum - 1);
      } else {
        await handleCallApiHotline({
          ...hotlineParams,
          pageNum,
        });
      }
    } catch (error) {
      enqueueSnackbar(t('deleteHotlineFail'), { variant: 'error' });
    }
  };

  const handleConfirmDeleteSupplier = async () => {
    handleCloseConfirmDeleteSupplier();

    try {
      const res = await apis.providerSiptrunk.deleteProviderSiptrunk(
        supplierSelected.id,
      );
      if (!res) throw new Error('serverError');

      enqueueSnackbar(t('deleteSupplierSuccess'), { variant: 'success' });

      const pageNum = currentPageSupplier;
      if (suppliers.length <= 1 && pageNum !== 1) {
        onPageChangeSupplier(pageNum - 1);
      } else {
        await handleCallApiSupplier({
          ...supplierParams,
          pageNum,
        });
      }
    } catch (error) {
      enqueueSnackbar(t('deleteSupplierFail'), { variant: 'error' });
    }
  };

  const hotlineHeads = [
    {
      label: t('hotlineNumber'),
      valueName: 'sipNumber',
      align: 'left',
    },
    {
      label: t('hotlineType'),
      valueName: 'hotlineTypeDisplay',
      align: 'left',
    },
    {
      label: t('mobileNetworkOperator'),
      valueName: 'mobileNetworkOperator',
      align: 'left',
    },
    {
      label: t('supplier'),
      valueName: 'provider.name',
      align: 'left',
    },
    {
      label: t('createdAt'),
      valueName: 'createdAtDisplay',
      align: 'left',
    },
    {
      label: t('status'),
      valueName: 'hotlineStatusDisplay',
      align: 'center',
    },
    {
      label: t('edit'),
      valueName: 'actions',
      align: 'center',
    },
  ];

  const supplierHeads = [
    {
      label: t('supplierName'),
      valueName: 'name',
      align: 'left',
    },
    {
      label: t('representative'),
      valueName: 'nameContact',
      align: 'left',
    },
    {
      label: t('address'),
      valueName: 'addressContact',
      align: 'left',
    },
    {
      label: t('contactNumber'),
      valueName: 'phoneContact',
      align: 'left',
    },
    {
      label: 'IP',
      valueName: 'ip',
      align: 'left',
    },
    {
      label: 'PORT',
      valueName: 'port',
      align: 'left',
    },
    {
      label: t('edit'),
      valueName: 'actions',
      align: 'center',
    },
  ];

  const actions = [
    {
      icon: <EditIcon />,
      onClick: (item) => handleUpdateItem(item),
    },
    {
      icon: <DeleteIcon className="delete-icon" />,
      onClick: (item) => handleDeleteItem(item),
    },
  ];

  const renderHotlineType = (type) => t(camelcase(HOTLINE_TYPE[type]));

  const renderHotlineStatus = (status) => t(camelcase(HOTLINE_STATUS[status]));

  const tabs = [
    {
      id: 'list-hotline',
      value: HOTLINE_TAB.LIST_HOTLINE,
      label: 'listHotline',
      component: (
        <CustomTable
          items={hotlines.map((hotline) => ({
            ...hotline,
            hotlineTypeDisplay: renderHotlineType(hotline.type),
            hotlineStatusDisplay: renderHotlineStatus(
              hotline.isPublic
                ? HOTLINE_STATUS.PUBLIC
                : HOTLINE_STATUS.NOT_PUBLIC,
            ),
            createdAtDisplay: moment(hotline.createdAt).format(
              'HH:mm DD-MM-YYYY',
            ),
          }))}
          heads={hotlineHeads}
          actions={actions}
          pagination={{
            page: currentPageHotline,
            totalPages: Math.ceil(totalHotline / limitHotline),
            limit: limitHotline,
            total: totalHotline,
          }}
          onChangePagination={onPageChangeHotline}
          loading={loadingHotlines}
        />
      ),
    },
    {
      id: 'list-supplier',
      value: HOTLINE_TAB.LIST_SUPPLIER,
      label: 'listSupplier',
      component: (
        <CustomTable
          items={suppliers}
          heads={supplierHeads}
          actions={actions}
          pagination={{
            page: currentPageSupplier,
            totalPages: Math.ceil(totalSupplier / limitSupplier),
            limit: limitSupplier,
            total: totalSupplier,
          }}
          onChangePagination={onPageChangeSupplier}
          loading={loadingSuppliers}
        />
      ),
    },
  ];

  const renderTitleButton = () => {
    if (tab === HOTLINE_TAB.LIST_HOTLINE) return t('createHotline');
    return t('addNewSupplier');
  };

  return (
    <StyledHotline>
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

      <Typography className="heading-text">
        {t('hotlineAdministrator')}
      </Typography>

      {tab === HOTLINE_TAB.LIST_HOTLINE && (
        <Grid container spacing={2} className="filter">
          <Grid item sm={4} md={3}>
            <TextField
              size="small"
              className="text-field"
              variant="outlined"
              value={filter.type || ''}
              select
              fullWidth
              label={t('hotlineType')}
              onChange={handleChangeHotlineType}
            >
              <StyledMenuItem value={ALL}>{t('all')}</StyledMenuItem>
              {Object.values(HOTLINE_TYPE).map((script, index) => (
                <StyledMenuItem key={index.toString()} value={script}>
                  {renderHotlineType(script)}
                </StyledMenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item sm={4} md={3}>
            <TextField
              size="small"
              className="text-field"
              variant="outlined"
              value={filter.status || ''}
              select
              fullWidth
              label={t('status')}
              onChange={handleChangeStatus}
            >
              <StyledMenuItem value={ALL}>{t('all')}</StyledMenuItem>
              {Object.values(HOTLINE_STATUS).map((status, index) => (
                <StyledMenuItem key={index.toString()} value={status}>
                  {renderHotlineStatus(status)}
                </StyledMenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      )}

      <div className="tab-container">
        <Tabs
          value={tab}
          onChange={handleChangeTab}
          classes={{
            indicator: 'indicator',
          }}
        >
          {tabs.map((item) => (
            <Tab
              label={t(item.label)}
              classes={{ root: 'tab-root', selected: 'tab-selected' }}
              id={item.id}
            />
          ))}
        </Tabs>
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
        >
          <Button
            variant="contained"
            startIcon={<AddCircleIcon />}
            onClick={handleAdd}
          >
            {renderTitleButton()}
          </Button>
        </Box>
      </div>

      {tabs.map((item, index) => (
        <TabPanel value={tab} index={index}>
          {item.component}
        </TabPanel>
      ))}

      <CreateHotline
        open={showCreateHotline}
        hotlineId={hotlineId}
        onClose={handleCloseCreateHotline}
        onReloadData={handleReloadHotline}
      />

      <CreateSupplier
        open={showCreateSupplier}
        supplierId={supplierId}
        onClose={handleCloseCreateSupplier}
        onReloadData={handleReloadSupplier}
      />

      <Popup
        open={showConfirmDeleteSupplier}
        onClose={handleCloseConfirmDeleteSupplier}
        onOk={handleConfirmDeleteSupplier}
        okMessage={t('deleteSupplier')}
        title={t('areYouSureDeleteSupplier', {
          name: supplierSelected && supplierSelected.name,
        })}
      />

      <Popup
        open={showConfirmDeleteHotline}
        onClose={handleCloseConfirmDeleteHotline}
        onOk={handleConfirmDeleteHotline}
        okMessage={t('deleteHotline')}
        title={t('areYouSureDeleteHotline', {
          hotline: hotlineSelected && hotlineSelected.sipNumber,
        })}
      />
    </StyledHotline>
  );
};

export default Hotline;
