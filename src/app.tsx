import { Router, Route } from 'office-ui-fabric-react/lib/utilities/router';

// tslint:disable-next-line:no-unused-variable
import * as React from 'react';
import * as ReactDom from 'react-dom';

import HomePage from './pages/HomePage';

const indexElement: JSX.Element = (
  <Router>
    <Route component={ HomePage }>
      {/*
      <Route key='about' path='#about' component={ About} />
      <Route key='history' path='#history' component={ History } />
      <Route key='blog' path='#blog' component={ Blog } />
      */}
    </Route>
  </Router>
);

ReactDom.render(indexElement, document.getElementById('react-container'));
