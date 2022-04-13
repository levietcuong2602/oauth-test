import React, { useMemo } from 'react';
import NumberFormat from 'react-number-format';
import { Box, InputAdornment } from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';

import { StyledTextField } from './index.style';

const NumberFormatCustom = React.forwardRef((props, ref) => {
  const { onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator
      isNumericString
    />
  );
});

const CustomNumberInput = ({
  className = '',
  value,
  onChange,
  min,
  max,
  ...props
}) => {
  const increase = () => {
    if (max !== undefined && value >= max) return;
    onChange(1 + value);
  };

  const decrease = () => {
    if (min !== undefined && value <= min) return;
    onChange(value - 1);
  };

  const handleChange = (event) => {
    onChange(event.target.value);
  };

  const handleBlur = () => {
    if (value > max) {
      onChange(max);
      return;
    }

    if (value < min) {
      onChange(min);
    }
  };

  const displayValue = useMemo(() => {
    if (value === null || value === undefined) return '';
    return value;
  }, [value]);

  return (
    <StyledTextField
      className={className}
      size="small"
      variant="outlined"
      value={displayValue}
      onChange={handleChange}
      onBlur={handleBlur}
      {...props}
      InputProps={{
        startAdornment: (
          <InputAdornment position="end">
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
            >
              <RemoveIcon onClick={decrease} className="icon-input" />
            </Box>
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="start">
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
            >
              <AddIcon onClick={increase} className="icon-input" />
            </Box>
          </InputAdornment>
        ),
        inputComponent: NumberFormatCustom,
      }}
    />
  );
};

export default CustomNumberInput;
