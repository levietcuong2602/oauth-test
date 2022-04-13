import * as React from 'react';
import { styled } from '@mui/material/styles';
import {
  Box,
  Icon,
  InputAdornment,
  TextField,
  IconButton,
} from '@mui/material';
import { LocalizationProvider, DateRangePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import MuiDateRangePickerDay from '@mui/lab/DateRangePickerDay';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

import { StyledCustomDateRangePicker } from './index.style';

const DateRangePickerDay = styled(MuiDateRangePickerDay)(
  ({ theme, isHighlighting, isStartOfHighlighting, isEndOfHighlighting }) => ({
    ...(isHighlighting && {
      borderRadius: 0,
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
      '&:hover, &:focus': {
        backgroundColor: theme.palette.primary.dark,
      },
    }),
    ...(isStartOfHighlighting && {
      borderTopLeftRadius: '50%',
      borderBottomLeftRadius: '50%',
    }),
    ...(isEndOfHighlighting && {
      borderTopRightRadius: '50%',
      borderBottomRightRadius: '50%',
    }),
  }),
);

export default function CustomDateRangePickerDay({
  dateRange,
  onChangeDateRange,
  shouldShowRefreshButton,
  onRefreshDateRange,
  onAcceptDateRange,
}) {
  const startInputRef = React.useRef();
  const endInputRef = React.useRef();

  const renderWeekPickerDay = (date, dateRangePickerDayProps) => (
    <DateRangePickerDay {...dateRangePickerDayProps} />
  );

  return (
    <StyledCustomDateRangePicker>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
      >
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateRangePicker
            displayStaticWrapperAs="desktop"
            label="date range"
            startText="Start date"
            endText="End date"
            inputFormat="dd/MM/yyyy"
            value={dateRange}
            onChange={(newValue) => onChangeDateRange(newValue)}
            onAccept={onAcceptDateRange}
            renderDay={renderWeekPickerDay}
            renderInput={(startProps, endProps) => (
              <>
                <TextField
                  inputRef={startInputRef}
                  {...startProps}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => {
                            startInputRef.current.focus();
                          }}
                        >
                          <CalendarTodayIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Box sx={{ mx: 2 }}> to </Box>
                <TextField
                  {...endProps}
                  inputRef={endInputRef}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => {
                            endInputRef.current.focus();
                          }}
                        >
                          <CalendarTodayIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </>
            )}
          />
        </LocalizationProvider>
        {shouldShowRefreshButton && (
          <IconButton
            aria-label="refresh"
            className="reset-button"
            onClick={onRefreshDateRange}
          >
            <Icon>sync</Icon>
          </IconButton>
        )}
      </Box>
    </StyledCustomDateRangePicker>
  );
}
