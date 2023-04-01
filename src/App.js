import Router from 'routes';
import { ThemeProvider } from '@mui/material/styles';
import Theme from './Theme';
import store from 'store';
import { Provider } from 'react-redux';

function App() {
  return (
    <ThemeProvider theme={Theme}>
      <Provider store={store}>
        <Router />
      </Provider>
    </ThemeProvider>
  );
}

export default App;
