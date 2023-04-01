import {
  unstable_createMuiStrictModeTheme as createMuiTheme,
  responsiveFontSizes,
} from '@mui/material/styles';

const Theme = responsiveFontSizes(
  createMuiTheme({
    typography: {
      fontFamily: ['Inter'].join(','),
    },
  })
);

export default Theme;
