import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter, Route, Link, Switch } from 'react-router-dom';

import { Home } from './pages/Home';
import { Oekaki } from './pages/Oekaki';
import { Viewer } from './pages/Viewer';


ReactDOM.render(
  <BrowserRouter basename={process.env.REACT_APP_PUBLIC_URL}>
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/oekaki">Oekaki</Link>
          </li>
          <li>
            <Link to="/viewer">Viewer</Link>
          </li>
        </ul>
      </nav>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/oekaki" component={Oekaki} />
        <Route path="/viewer" component={Viewer} />
      </Switch>
    </div>
  </BrowserRouter>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
