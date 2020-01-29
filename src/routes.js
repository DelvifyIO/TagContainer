import React from 'react';
import Index from './views/Index';
import Tags from './views/Tags';

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/', exact: true, name: 'Index', component: Index },
  { path: '/tags/:clientId', exact: true, name: 'Tags', component: Tags },
];

export default routes;
