import React, { useCallback, Suspense, useEffect } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Container } from 'reactstrap';
import Header from './Header';

// sidebar nav config
// routes config
import routes from '../../routes';

const DefaultLayout = () => {
    const loading = useCallback(() => <div className="animated fadeIn pt-1 text-center">Loading...</div>, []);

    useEffect(() => {
        document.body.classList.add("index-page");
        document.body.classList.add("sidebar-collapse");
        document.documentElement.classList.remove("nav-open");
        window.scrollTo(0, 0);
        document.body.scrollTop = 0;
        return function cleanup() {
            document.body.classList.remove("index-page");
            document.body.classList.remove("sidebar-collapse");
        };
    });
    return (
        <div className="app">
            <div className="clear-filter position-absolute container-fluid" filter-color="navy" style={{ minHeight: '100vh' }}>
                <Suspense  fallback={loading}>
                    <Header />
                </Suspense>
                <div className="app-body">
                    <Container fluid style={{ paddingTop: '80px' }}>
                        <Suspense fallback={loading}>
                            <Switch>
                                {routes.map((route, idx) => {
                                    return route.component ? (
                                        <Route
                                            key={idx}
                                            path={route.path}
                                            exact={route.exact}
                                            name={route.name}
                                            render={props => (
                                                <route.component {...props} />
                                            )} />
                                    ) : (null);
                                })}
                            </Switch>
                        </Suspense>
                    </Container>
                </div>
            </div>
        </div>
    );
}

export default DefaultLayout;
