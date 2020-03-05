import React, { useEffect, useState } from 'react';
import {HashRouter, Route, Switch, Redirect, BrowserRouter} from 'react-router-dom';
// import { renderRoutes } from 'react-router-config';
import { Provider } from "react-redux";
import jwtDecode from "jwt-decode";
import { connect } from "react-redux";

import store from "./store";
import {login, logout, setUser} from "./actions/authAction";
import {push} from "react-router-redux";

const loadingComponent = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;

// Pages
const Login = React.lazy(() => import('./views/Login'));
const DefaultLayout = React.lazy(() => import('./containers/DefaultLayout'));

const mapStateToProps = (state) => ({
  auth: state.auth,
});

const App = (props) => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (localStorage.jwtToken) {
      const token = localStorage.jwtToken;
      const decoded = jwtDecode(token);
      const currentTime = Date.now();
      if (decoded.exp < currentTime) {
        store.dispatch(logout())
          .then(() => {
            setLoading(false);
            store.dispatch(push('/login'));
          });
      } else {
        store.dispatch(setUser({ username: decoded.username }, token))
          .then(() => {
            setLoading(false);
          });
      }
    } else {
      setLoading(false);
    }
  }, []);


  const PrivateRoute = ({ component: Component, auth, ...others }) => {
    return (
      <Route
        {...others}
        render={ props => loading ? loadingComponent() : window._.isEmpty(auth.user) ? <Redirect to="/login" /> : <Component {...props} /> }
      />
    );
  };

  const EnhancedPrivateRoute = connect(mapStateToProps)(PrivateRoute);

  return (
    <Provider store={store}>
      <HashRouter>
        <React.Suspense fallback={loadingComponent()}>
        <Switch>
          <Switch>
            <Route path="/login" render={props => <Login {...props} />} />
            <Switch>
              <EnhancedPrivateRoute path="/" name="Home" component={DefaultLayout} {...props} />
            </Switch>
          </Switch>
        </Switch>
        </React.Suspense>
      </HashRouter>
    </Provider>
  );
};

export default App;
