import React from 'react';
import { useTranslation } from 'react-i18next';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import apis from '@src/apis';
import ContentBase from '@src/components/ContentBase';
import { usePaginationWithState } from '@src/hooks';
import { FILTER_TYPE } from '@src/constants';
import ListClientStyle from './index.style';

const ListClient = () => {
  const { t } = useTranslation(['client']);
  const {
    data: listClients,
    handleCallApi: fetchListClients,
    currentPage,
    total,
    totalPage,
    limit,
    loading,
    onPaginationChange,
    onParamsChange,
    searchParams,
  } = usePaginationWithState([], apis.client.getListClients);

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

  const clientHeaders = [
    {
      label: t('no'),
      valueName: 'no',
      align: 'left',
    },
    {
      label: t('clientName'),
      valueName: 'name',
      align: 'left',
    },
    {
      label: t('clientId'),
      valueName: 'clientId',
      align: 'left',
    },
    {
      label: t('grants'),
      valueName: 'grants',
      align: 'left',
    },
    {
      label: t('redirectUris'),
      valueName: 'redirectUris',
      align: 'left',
    },
    {
      label: t('action'),
      valueName: 'actions',
      align: 'center',
    },
  ];

  return (
    <ListClientStyle>
      <ContentBase
        items={listClients}
        headers={clientHeaders}
        actions={actions}
        onFetchData={fetchListClients}
        loading={loading}
        pagination={{
          page: currentPage,
          totalPages: totalPage,
          limit,
          total,
        }}
        onChangePagination={onPaginationChange}
        onParamsChange={onParamsChange}
        searchParams={searchParams}
        filters={[
          {
            field: 'dateRange',
            type: FILTER_TYPE.DATE_RANGE,
            default: [],
          },
        ]}
      />
    </ListClientStyle>
  );
};

export default ListClient;
