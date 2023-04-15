import React from 'react';
import { Route, withRouter } from 'react-router-dom';
import { Location as HLocation } from 'history';
import { MAirtable } from './api/airtable-api';
import { Settings } from './components/Settings';
import { PageDebug } from './components/PageDebug';
import { PageNews } from './components/PageNews';
import PageUarw from './components/PageUarw';
import './App.scss';
import { MGXR_APP_REV, Names, Paths } from './consts';
import { Main } from './containers/Main';

MAirtable.init();

interface StateType {
  navEventKey: string | null,
  navDropdownTitle: string,
  navDropdownIsActive: boolean
}

class App extends React.Component<any, StateType> {

  constructor(props: any) {
    super(props);
    this.state = {
      navEventKey: Paths.MGXR,
      navDropdownTitle: 'Другое',
      navDropdownIsActive: false,
    };
  }

  locationHandleToNav(location: HLocation<unknown>) {
    const findOj = Names.values.find(el => {
      return el.link === location.pathname && el.group === 'dropdown-1';
    });
    this.setState({
      navEventKey: location.pathname,
      navDropdownTitle: findOj?.name || 'Другое',
      navDropdownIsActive: !!findOj,
    });
  }

  componentDidMount() {
    console.log('!!-!!-!! this.props {210308091043}\n', this.props); // del+
    this.locationHandleToNav(this.props.history.location);
    this.props.history.listen((location: HLocation<unknown>) => {
      this.locationHandleToNav(location);
    });
  }

  navSelectHandle = (eventKey: string | null) => {
    this.props.history.push(eventKey || Paths.MGXR);
  };

  render() {

    return (
      <div className="App">
        <Main
          rootEventKey={this.state.navEventKey}
          dropdownIsActive={this.state.navDropdownIsActive}
          dropdownTitle={this.state.navDropdownTitle}
          onSelect={this.navSelectHandle}
        >
          <Route path={Paths.MGXR} exact>
            <div>Проекты</div>
            {Names.aTagGet(Paths.UARW)}
            {Names.aTagGet(Paths.NEWS)}
            <div>Версия приложения: {MGXR_APP_REV}</div>
          </Route>
          <Route path={Paths.MGXR + Paths.SETTINGS} exact>
            <Settings/>
          </Route>
          <Route path={Paths.MGXR + Paths.DEBUG} exact>
            <PageDebug/>
          </Route>
          <Route path={Paths.NEWS} exact>
            {/* "Новости" */}
            <PageNews/>
          </Route>
          <Route path={Paths.UARW}>
            {/* "Карточки" */}
            <PageUarw/>
          </Route>
        </Main>
      </div>
    );
  }
}

export default withRouter(App);
