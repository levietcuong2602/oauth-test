import { createTheme } from "@mui/material/styles";
import { COLOR, TRANSPARENT_COLOR } from "./color";

const theme = createTheme({
  palette: {
    primary: {
      main: COLOR.primary,
      dark: COLOR.primaryDark,
    },
    secondary: {
      main: COLOR.secondary,
    },
    error: {
      main: COLOR.danger,
    },
    warning: {
      main: COLOR.warning,
    },
    info: {
      main: COLOR.info,
    },
    success: {
      main: COLOR.success,
    },
    text: {
      primary: COLOR.secondary,
    },
    divider: COLOR.divider,
    background: {
      default: COLOR.background,
    },
  },
  shape: {
    borderRadius: 6,
  },
  typography: {
    fontFamily: "SF Pro Display",
    fontSize: 14,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: "bold",
        },
        contained: {
          boxShadow: "none",
        },
        containedPrimary: {
          color: COLOR.white,
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          color: COLOR.light,
        },
        indicator: {
          backgroundColor: COLOR.primary,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          "&$selected": {
            color: COLOR.primary,
          },
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        option: {
          // eslint-disable-next-line quotes
          '&[aria-selected="true"]': {
            backgroundColor: `${COLOR.primary} !important`,
            color: COLOR.white,
          },
          "&.Mui-focused": {
            backgroundColor: TRANSPARENT_COLOR.primary,
          },
        },
      },
    },
  },
});

export default theme;
