import React, { useState, useEffect } from 'react';
import { Button, Box, Grid } from '@mui/material';

import CustomTable from '@src/components/CustomTable';
import CustomDateRangePickerDay from '@src/components/CustomDateRangePickerDay';
import CustomSelect from '@src/components/CustomSelect';
import { useSearchParams } from '@src/hooks';

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
  onCreateItem,
  filters = [],
}) => {
  const [filterData, setFilterData] = useState({
    dateRange: [new Date(), new Date()],
  });
  const { addParams } = useSearchParams();

  useEffect(() => {
    filters.forEach((item) => {
      setFilterData({ ...filterData, [item.field]: item.default });
    });
  }, []);

  // eslint-disable-next-line no-unused-vars
  const [errors, setErrors] = useState({});

  const handleSelectChange = (item, value) => {
    addParams({ [item.field]: value });

    setFilterData({ ...filterData, [item.field]: value });
  };

  const handleChangeDateRange = (dateRange) => {
    setFilterData({ ...filterData, dateRange });
  };

  const handleRefreshDateRange = () => {};

  const handleAcceptDateRange = (dateRange) => {
    addParams({ start_time: dateRange[0], end_time: dateRange[1] });
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
      <ContainerHeaderStyle>
        <Grid className="filter_item" flex>
          {filters.map((item) => renderFilterComponent(item))}
        </Grid>
        <Button variant="outlined" onClick={onCreateItem}>
          Thêm mới
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
