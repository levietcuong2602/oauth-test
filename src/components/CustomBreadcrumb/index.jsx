import React from 'react';
import { Link } from 'react-router-dom';
import { Typography } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { StyledBreadcrumbs } from './index.style';

const CustomBreadcrumb = ({ crumbs = [] }) => (
  <StyledBreadcrumbs
    separator={<NavigateNextIcon fontSize="small" />}
    aria-label="breadcrumb"
  >
    {crumbs.map(({ path, name }, index) => {
      if (index === crumbs.length - 1) {
        return <Typography className="text">{name}</Typography>;
      }

      return (
        <Link key={index.toString()} href={path}>
          <Typography>{name}</Typography>
        </Link>
      );
    })}
  </StyledBreadcrumbs>
);

export default CustomBreadcrumb;
