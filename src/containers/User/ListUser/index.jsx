import React from 'react';
import { useTranslation } from 'react-i18next';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import apis from '@src/apis';
import ContentBase from '@src/components/ContentBase';
import { usePaginationWithState } from '@src/hooks';
import { FILTER_TYPE, STATUS_USER } from '@src/constants';
import ListUserStyle from './index.style';

const ListUser = () => {
  const { t } = useTranslation(['user']);
  const {
    data: listUsers,
    handleCallApi: fetchListUsers,
    currentPage,
    total,
    totalPage,
    limit,
    loading,
    onPaginationChange,
    onParamsChange,
    searchParams,
  } = usePaginationWithState([], apis.user.getListUsers);

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
        onParamsChange={onParamsChange}
        searchParams={searchParams}
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
