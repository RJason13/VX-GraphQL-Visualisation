import React, { FC, Suspense } from 'react';
import DefaultLayout from 'layouts/Default/Default';
import { BrowserRouter, Redirect, Route, Switch as RouteSwitch } from "react-router-dom";
import ErrorLayout from 'layouts/Error';
import Loading from 'components/Loading';

import { Provider } from 'react-redux';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { ThemeProvider } from 'styled-components';
import Viewport from 'components/Viewport';
import { CssBaseline } from '@material-ui/core';
import store from 'state/store';
import routes from './routes';
import useResponsiveMuiTheme from 'hooks/useResponsiveMuiTheme';
import { getApolloClient } from 'utils/apolloClient';
import { ApolloProvider } from '@apollo/client';

const apolloClient = getApolloClient();
const ThemedLayout: FC = ({ children }) => {

  const theme = useResponsiveMuiTheme();

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
  return (
    <ApolloProvider client={apolloClient}>
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
    </ApolloProvider>
  );
}

export default App;
