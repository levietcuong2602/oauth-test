import { FormControl, FormHelperText, Select } from '@mui/material';
import React from 'react';
import { StyledMenuItem, StyledPlaceholder } from './index.style';

export const NONE_VALUE = 'none';

const CustomSelect = ({
  className = '',
  placeholder = '',
  options = [],
  value,
  onChange,
  helperText,
  error,
}) => {
  const handleChange = (event) => {
    if (onChange) onChange(event.target.value);
  };

  return (
    <FormControl error={error} fullWidth>
      <Select
        className={className}
        size="small"
        variant="outlined"
        defaultValue={NONE_VALUE}
        renderValue={(selected) => {
          if (selected === NONE_VALUE) {
            return <StyledPlaceholder>{placeholder}</StyledPlaceholder>;
          }

          const item = options.find((e) => e.value === selected);
          return item.label;
        }}
        value={value || NONE_VALUE}
        onChange={handleChange}
      >
        {options.map((option, index) => (
          <StyledMenuItem key={index.toString()} value={option.value}>
            {option.label}
          </StyledMenuItem>
        ))}
      </Select>
      {error && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default CustomSelect;
