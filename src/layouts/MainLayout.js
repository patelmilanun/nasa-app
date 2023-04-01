import { Outlet } from 'react-router-dom';
import { AppBar, Toolbar, Box } from '@mui/material';

export default function MainLayout() {
  return (
    <>
      <AppBar color="inherit">
        <Toolbar>
          <Box width="100%" textAlign="center">
            <img alt="logo" src="/static/logo.svg" />
          </Box>
        </Toolbar>
      </AppBar>
      <Box mt={15}>
        <Outlet />
      </Box>
    </>
  );
}
