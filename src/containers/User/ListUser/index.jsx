import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import queryString from 'query-string';
import { useLocation } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import apis from '@src/apis';
import ContentBase from '@src/components/ContentBase';
import { usePaginationWithLocation } from '@src/hooks';
import { FILTER_TYPE, STATUS_USER } from '@src/constants';
import ListUserStyle from './index.style';

const ListUser = () => {
  const { t } = useTranslation(['user']);
  const location = useLocation();
  const [dateRange, setDateRange] = useState([
    moment().startOf('month'),
    moment().endOf('month'),
  ]);

  const {
    data: listUsers,
    handleCallApi: fetchListUsers,
    currentPage,
    total,
    totalPage,
    limit,
    loading,
    onPaginationChange,
  } = usePaginationWithLocation([], apis.user.getListUsers);

  useEffect(() => {
    const searchParams = queryString.parse(location.search);
    const {
      startDate: startDateFromUrl = moment().startOf('month'),
      endDate: endDateFromUrl = moment().endOf('month'),
    } = searchParams;
    const [startDateValue, endDateValue] = dateRange;

    if (
      new Date(startDateFromUrl).valueOf() !==
        new Date(startDateValue).valueOf() ||
      new Date(endDateFromUrl).valueOf() !== new Date(endDateValue).valueOf()
    ) {
      setDateRange([new Date(startDateFromUrl), new Date(endDateFromUrl)]);
    }
  }, [location.search]);

  const handleUpdateItem = () => {
    // eslint-disable-next-line no-console
    console.log('update item');
  };

  const handleDeleteItem = () => {
    // eslint-disable-next-line no-console
    console.log('delete item');
  };

  const actions = [
    {
      key: 'edit',
      icon: <EditIcon />,
      onClick: (item) => handleUpdateItem(item),
    },
    {
      key: 'delete',
      icon: <DeleteIcon className="delete-icon" />,
      onClick: (item) => handleDeleteItem(item),
    },
  ];

  const userHeaders = [
    {
      label: t('no'),
      valueName: 'no',
      align: 'left',
    },
    {
      label: t('username'),
      valueName: 'username',
      align: 'left',
    },
    {
      label: t('walletAddress'),
      valueName: 'walletAddress',
      align: 'left',
    },
    {
      label: t('status'),
      valueName: 'status',
      align: 'left',
    },
    {
      label: t('action'),
      valueName: 'actions',
      align: 'center',
    },
  ];

  return (
    <ListUserStyle>
      <ContentBase
        items={listUsers.map((item) => ({
          ...item,
          status: item.status ? 'Active' : 'Deactive',
        }))}
        headers={userHeaders}
        actions={actions}
        onFetchData={fetchListUsers}
        loading={loading}
        pagination={{
          page: currentPage,
          totalPages: totalPage,
          limit,
          total,
        }}
        onChangePagination={onPaginationChange}
        filters={[
          {
            field: 'dateRange',
            type: FILTER_TYPE.DATE_RANGE,
            default: [],
          },
          {
            field: 'status',
            type: FILTER_TYPE.SELECT,
            default: null,
            placeholder: 'Chọn trạng thái',
            options: [
              {
                value: STATUS_USER.ACTIVE,
                label: 'Active',
              },
              {
                value: STATUS_USER.DEACTIVE,
                label: 'Deactive',
              },
            ],
          },
        ]}
      />
    </ListUserStyle>
  );
};

export default ListUser;
