import React from 'react';
import { utilPathGet } from './utils/utils';
import { NavLink, Route, Router, Switch } from 'react-router-dom';
import { createBrowserHistory } from "history";
import { MAirtable } from './api/airtable-api';
import { Settings } from './components/Settings';
import { PageDebug } from './components/PageDebug';
import { PageNews } from './components/PageNews';
import { PageUarw } from './components/PageUarw';
import { Button } from 'react-bootstrap';
import './App.scss';

const customHistory = createBrowserHistory();

MAirtable.init();

class App extends React.Component<any, any> {

  render() {

    return (
      <Router history={customHistory}>
        <div className="App">
          <div className="appRoutes">
            <NavLink to="/mgxr" activeClassName="active-link">Главная</NavLink>
            <NavLink to="/uarw" activeClassName="active-link">"Карточки"</NavLink>
            <NavLink to="/news" activeClassName="active-link">"Новости"</NavLink>
            <NavLink to="/settings" activeClassName="active-link">Настройки</NavLink>
            <NavLink to="/debug" activeClassName="active-link">Debug</NavLink>
          </div>
          {/* // --- */}
          <Switch>
            <Route path={utilPathGet()} exact>
              <div>Главная</div>
              <Button>111</Button>
            </Route>
            <Route path={utilPathGet('settings')} exact>
              <Settings/>
            </Route>
            <Route path={utilPathGet('debug')} exact>
              <PageDebug/>
            </Route>
            <Route path={utilPathGet('news')} exact>
              <PageNews/>
            </Route>
            <Route path={utilPathGet('uarw')} exact>
              <PageUarw/>
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
