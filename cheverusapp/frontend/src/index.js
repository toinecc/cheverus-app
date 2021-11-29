import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Auth from './components/Auth.js';
import { CookiesProvider, useCookies } from 'react-cookie';
import { CustomHeader, CustomFooter } from './components/PageElements';
import { Layout } from 'antd';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

const { Content } = Layout;

function Router() {
  const [token] = useCookies(['cheverus-token']);

  return (
    <React.StrictMode>
      <CookiesProvider>
        <BrowserRouter>
          <Layout>
            <CustomHeader />
            <Content className="main-content">
              <Switch>
                <Route exact path="/">
                  <Redirect to={{ pathname: '/app' }} />
                </Route>
                <Route exact path="/app">
                  <Redirect to={{ pathname: '/app/auth/' }} />
                </Route>
                <Route exact path="/app/auth/">
                  <Auth />
                </Route>
                <Route path="/app/dartdevil/">
                  {token['cheverus-token'] ? (
                    <App />
                  ) : (
                    <Redirect to={{ pathname: '/app' }} />
                  )}
                </Route>
              </Switch>
            </Content>
            <CustomFooter />
          </Layout>
        </BrowserRouter>
      </CookiesProvider>
    </React.StrictMode>
  );
}

ReactDOM.render(<Router />, document.getElementById('root'));
