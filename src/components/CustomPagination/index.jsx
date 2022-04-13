import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pagination, Box, Typography } from '@mui/material';
import { StyledCustomPagination } from './index.style';

const CustomPagination = ({
  currentPage,
  limit,
  total,
  onChangePagination,
}) => {
  const { t } = useTranslation(['common']);
  const totalPages = Math.ceil(total / limit);

  if (total <= limit) return <div />;

  return (
    <StyledCustomPagination>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        mt={2}
      >
        <Typography className="pagination-text">
          {t('paginationText', {
            total,
          })}
        </Typography>
        <Pagination
          color="primary"
          className="pagination"
          page={currentPage}
          count={totalPages}
          onChange={(e, page) => onChangePagination(page)}
        />
      </Box>
    </StyledCustomPagination>
  );
};

export default CustomPagination;
