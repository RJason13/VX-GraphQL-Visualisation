import React, { FC, Suspense, useMemo } from 'react';
import DefaultLayout from 'layouts/Default/Default';
import { BrowserRouter, Redirect, Route, Switch as RouteSwitch } from "react-router-dom";
import ErrorLayout from 'layouts/Error';
import Loading from 'components/Loading';

import { Provider } from 'react-redux';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { ThemeProvider } from 'styled-components';
import Viewport from 'components/Viewport';
import { createMuiTheme, CssBaseline, responsiveFontSizes } from '@material-ui/core';
import store from 'state/store';
import { orange } from '@material-ui/core/colors';
import routes from './routes';


const ThemedLayout: FC = ({ children }) => {

  const theme = useMemo(() => {
      return responsiveFontSizes(
          createMuiTheme({
              palette: {
                type: 'light',
                primary: {
                    main: orange["A700"]
                },
                secondary: {
                    main: '#007fab'
                }
            },
              breakpoints: {
                values: {
                  xs: 0,
                  sm: 688,
                  md: 992,
                  lg: 1312,
                  xl: 1920
                }
              }
          })
      );
  }, []);

  return (
      <>
          <Viewport />
          <MuiThemeProvider theme={theme}>
              <ThemeProvider theme={theme}>
                  <CssBaseline />
                  {children}
              </ThemeProvider>
          </MuiThemeProvider>
      </>
  );
};

function App() {
  console.log(routes);
  return (
    <Provider store={store}>
        <ThemedLayout>
          <BrowserRouter>
            <DefaultLayout>
              <RouteSwitch>
                <Redirect from="/" to="/home" exact/>
                {routes.map((route, index) => <Route key={index} path={route.uri} component={() => {
                  const Component = route.component;
                  return <Suspense fallback={<Loading />} ><Component /></Suspense>;
                }}/>)}
                <Route path='/error-not-found' component={()=><ErrorLayout error={{statusCode: 404}} />}/>
                <Redirect to="/error-not-found" />
              </RouteSwitch>
            </DefaultLayout>
          </BrowserRouter>
        </ThemedLayout>
    </Provider>
  );
}

export default App;
