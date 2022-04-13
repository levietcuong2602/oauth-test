import React from 'react';
import { Box, IconButton, Icon, TextField } from '@mui/material';
import { DatePicker, DateTimePicker, TimePicker } from '@mui/lab';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { DATE_TIME_PICKER_TYPES } from '@src/constants';
import {
  StyledCustomDatePickerRange,
  StyledCustomDatePicker,
} from './index.style';

const CustomDatePicker = ({
  type,
  selectedDate,
  handleChangeDate,
  minDate,
  maxDate,
}) => (
  <StyledCustomDatePicker>
    {type === DATE_TIME_PICKER_TYPES.DATE && (
      <DatePicker
        value={selectedDate}
        onChange={handleChangeDate}
        inputFormat="dd/MM/yyyy"
        renderInput={(params) => <TextField {...params} size="small" />}
        InputAdornmentProps={{ position: 'start' }}
        minDate={minDate}
        maxDate={maxDate}
      />
    )}
    {type === DATE_TIME_PICKER_TYPES.TIME && (
      <TimePicker
        value={selectedDate}
        onChange={handleChangeDate}
        inputFormat="HH:mm"
        renderInput={(params) => <TextField {...params} size="small" />}
        InputAdornmentProps={{ position: 'start' }}
        minTime={minDate}
        maxTime={maxDate}
        ampm={false}
      />
    )}
    {type === DATE_TIME_PICKER_TYPES.DATE_TIME && (
      <DateTimePicker
        value={selectedDate}
        onChange={handleChangeDate}
        inputFormat="HH:mm - dd/MM/yyyy"
        renderInput={(props) => <TextField {...props} />}
        InputAdornmentProps={{ position: 'start' }}
        minDateTime={minDate}
        maxDateTime={maxDate}
        ampm={false}
      />
    )}
  </StyledCustomDatePicker>
);

const CustomDatePickerRange = ({
  isRefresh = true,
  type = DATE_TIME_PICKER_TYPES.DATE_TIME,
  startDate = new Date(),
  endDate = new Date(),
  handleChangeStartDate,
  handleChangeEndDate,
  handleRefresh,
  minDate,
  maxDate,
}) => (
  <StyledCustomDatePickerRange>
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="center"
      alignItems="center"
    >
      <CustomDatePicker
        type={type}
        selectedDate={startDate}
        handleChangeDate={handleChangeStartDate}
        minDate={minDate && new Date(minDate)}
        maxDate={endDate && new Date(endDate)}
      />
      <ArrowForwardIosIcon className="arrow-icon" />
      <CustomDatePicker
        type={type}
        selectedDate={endDate}
        handleChangeDate={handleChangeEndDate}
        minDate={startDate && new Date(startDate)}
        maxDate={maxDate && new Date(maxDate)}
      />
      {isRefresh && (
        <IconButton
          aria-label="refresh"
          className="reset-button"
          onClick={handleRefresh}
        >
          <Icon>sync</Icon>
        </IconButton>
      )}
    </Box>
  </StyledCustomDatePickerRange>
);

export default CustomDatePickerRange;
