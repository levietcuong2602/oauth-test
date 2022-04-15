import React from 'react';
import { useTranslation } from 'react-i18next';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import apis from '@src/apis';
import ContentBase from '@src/components/ContentBase';
import { usePaginationWithState } from '@src/hooks';
import ListRoleStyle from './index.style';

const ListRole = () => {
  const { t } = useTranslation(['role']);

  const {
    data: listRoles,
    handleCallApi: fetchListRoles,
    onParamsChange,
    searchParams,
    currentPage,
    total,
    totalPage,
    limit,
    loading,
    onPaginationChange,
  } = usePaginationWithState([], apis.role.getListRoles);

  const handleUpdateItem = () => {};

  const handleDeleteItem = () => {};

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

  const roleHeaders = [
    {
      label: t('no'),
      valueName: 'no',
      align: 'left',
    },
    {
      label: t('roleName'),
      valueName: 'name',
      align: 'left',
    },
    {
      label: t('default'),
      valueName: 'isDefault',
      align: 'left',
    },
    {
      label: t('action'),
      valueName: 'actions',
      align: 'center',
    },
  ];

  return (
    <ListRoleStyle>
      <ContentBase
        items={listRoles.map((item) => ({
          ...item,
          isDefault: item.isDefault ? 'Có' : 'Không',
        }))}
        headers={roleHeaders}
        actions={actions}
        onFetchData={fetchListRoles}
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
      />
    </ListRoleStyle>
  );
};

export default ListRole;
