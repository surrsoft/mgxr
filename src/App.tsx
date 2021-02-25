import React from 'react';
import './App.css';
import { RandomCardViewer } from './components/RandomCardViewer';
import { utilPathGet, LSApiKey, randomExcept, TpCard } from './utils/utils';
import { CardsB } from './api/cards-api';
import { Link, Route, Router, Switch } from 'react-router-dom';
import { createBrowserHistory } from "history";
import { MAirtable } from './api/airtable-api';
import { Settings } from './components/Settings';
import dayjs from 'dayjs';
import { PageDebug } from './components/PageDebug';
import { PageNews } from './components/PageNews';

const customHistory = createBrowserHistory();

MAirtable.init();

class App extends React.Component<any, any> {


  render() {

    return (
      <Router history={customHistory}>
        <div className="App">
          <div className="appRoutes">
            <Link to="/mgxr">Главная</Link>
            <Link to="/news">Новости</Link>
            <Link to="/settings">Настройки</Link>
            <Link to="/debug">Debug</Link>
          </div>
          <Switch>
            <Route path={utilPathGet()} exact>
              <div>Главная</div>
            </Route>
            <Route path={utilPathGet('settings')} exact>
              <Settings/>
            </Route>
            <Route path={utilPathGet('debug')} exact>
              <PageDebug/>
            </Route>
            <Route path={utilPathGet('news')} exact>
              <PageNews />
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
