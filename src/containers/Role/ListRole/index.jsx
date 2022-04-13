import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import ContentBase from '@src/components/ContentBase';
import ListRoleStyle from './index.style';

const ListRole = () => {
  const { t } = useTranslation(['role']);
  // eslint-disable-next-line no-unused-vars
  const [listRole] = useState([]);

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
      valueName: 'rolName',
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
        key={1}
        items={listRole}
        headers={roleHeaders}
        actions={actions}
      />
    </ListRoleStyle>
  );
};

export default ListRole;
