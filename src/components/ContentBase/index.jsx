import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Box,
  Grid,
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

import CustomTable from '@src/components/CustomTable';
import CustomDateRangePickerDay from '@src/components/CustomDateRangePickerDay';
import CustomSelect from '@src/components/CustomSelect';

import { FILTER_TYPE } from '@src/constants';
import ContentBaseStyle, { ContainerHeaderStyle } from './index.style';

const ContentBase = ({
  items = [],
  headers = [],
  actions = [],
  loading = false,
  pagination = {
    page: 1,
    totalPages: 1,
    limit: 10,
    total: 0,
  },
  onChangePagination,
  onParamsChange,
  searchParams,
  onFetchData,
  onCreateItem,
  filters = [],
}) => {
  // eslint-disable-next-line no-console
  const { t } = useTranslation(['common']);
  const [filterData, setFilterData] = useState({
    dateRange: [new Date(), new Date()],
  });

  // eslint-disable-next-line no-unused-vars
  const [errors, setErrors] = useState({});

  const handleSearchChange = (e) => {
    const search = e.target.value;
    onParamsChange({ search });
    onFetchData({ ...searchParams, search });
  };

  const handleSelectChange = (item, value) => {
    onParamsChange({ [item.field]: value });
    onFetchData({ ...searchParams, [item.field]: value });

    setFilterData({ ...filterData, [item.field]: value });
  };

  const handleChangeDateRange = (dateRange) => {
    setFilterData({ ...filterData, dateRange });
  };

  const handleRefreshDateRange = () => {};

  const handleAcceptDateRange = (dateRange) => {
    // eslint-disable-next-line no-console
    onParamsChange({ start_time: dateRange[0], end_time: dateRange[1] });
    onFetchData({
      ...searchParams,
      start_time: dateRange[0],
      end_time: dateRange[1],
    });
  };

  const renderFilterComponent = (item) => {
    switch (item.type) {
      case FILTER_TYPE.SELECT:
        return (
          <Box className="item">
            <CustomSelect
              key={item.type}
              placeholder={item.placeholder}
              options={item.options}
              value={filterData[item.field]}
              onChange={(value) => handleSelectChange(item, value)}
              helperText={errors.type}
              error={Boolean(errors.type)}
            />
          </Box>
        );
      case FILTER_TYPE.DATE_RANGE:
        return (
          <CustomDateRangePickerDay
            key={item.type}
            dateRange={filterData.dateRange}
            onChangeDateRange={handleChangeDateRange}
            shouldShowRefreshButton={false}
            onRefreshDateRange={handleRefreshDateRange}
            onAcceptDateRange={handleAcceptDateRange}
          />
        );
      default:
        break;
    }

    return null;
  };

  return (
    <ContentBaseStyle>
      <Box mb={1}>
        <TextField
          className="filter_search"
          size="small"
          placeholder="Nhập thông tin tìm kiếm"
          value={filterData.search}
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
      </Box>
      <ContainerHeaderStyle>
        <Grid className="filter_item" flex>
          {filters.map((item) => renderFilterComponent(item))}
        </Grid>
        <Button
          variant="contained"
          onClick={onCreateItem}
          startIcon={<AddCircleOutlineIcon />}
        >
          {t('addNew')}
        </Button>
      </ContainerHeaderStyle>
      <CustomTable
        items={items}
        heads={headers}
        actions={actions}
        pagination={pagination}
        onChangePagination={onChangePagination}
        loading={loading}
      />
    </ContentBaseStyle>
  );
};

export default ContentBase;
