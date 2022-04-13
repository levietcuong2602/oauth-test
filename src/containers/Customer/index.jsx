/* eslint-disable no-unused-vars */
import React from 'react';
import {
  Box,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import SearchIcon from '@mui/icons-material/Search';
import Navbar from '../Layout/Navbar';
import { StyledCustomer } from './index.style';
import { customers } from './data';

const Customer = () => (
  <StyledCustomer>
    <Box mb={2}>
      <Navbar>
        <Autocomplete
          size="small"
          freeSolo
          id="combo-box-demo"
          options={customers}
          getOptionLabel={(customer) => customer.name}
          renderOption={(props, customer) => (
            <MenuItem key={customer.id} value={customer} {...props}>
              {customer.name}
            </MenuItem>
          )}
          renderInput={(params) => (
            <TextField
              className="text-field"
              {...params}
              placeholder="Nhập SĐT, Email, mã giao dịch hoặc ID đơn hàng"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
      </Navbar>
    </Box>
    Customer
  </StyledCustomer>
);

export default Customer;
