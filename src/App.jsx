import React from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { SnackbarProvider } from 'notistack';
import store from './redux/store';
import AppRouter from './router';
import theme from './styles/theme';

const App = () => (
  <ThemeProvider theme={theme}>
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <SnackbarProvider maxSnack={3}>
        <Provider store={store}>
          <AppRouter />
        </Provider>
      </SnackbarProvider>
    </LocalizationProvider>
  </ThemeProvider>
);

export default App;
