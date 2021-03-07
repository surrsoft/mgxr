import React from 'react';
import { Route, Router, Switch } from 'react-router-dom';
import { Location as HLocation } from "history";
import { MAirtable } from './api/airtable-api';
import { Settings } from './components/Settings';
import { PageDebug } from './components/PageDebug';
import { PageNews } from './components/PageNews';
import { PageUarw } from './components/PageUarw';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import './App.scss';
import { utilPathGet } from './utils/app-utils';
import { Names, Paths } from './consts';
import customHistory from './m-history';
import { UarwSettings } from './components/PageUarw/UarwSettings';
import { UarwAbout } from './components/PageUarw/UarwAbout';

MAirtable.init();

interface State {
  navEventKey: string | null,
  navDropdownTitle: string,
  navDropdownIsActive: boolean
}

class App extends React.Component<any, State> {

  constructor(props: any) {
    super(props);
    this.state = {
      navEventKey: Paths.MGXR,
      navDropdownTitle: 'Другое',
      navDropdownIsActive: false
    }
  }

  locationHandleToNav(location: HLocation<unknown>) {
    const findOj = Names.values.find(el => {
      return el.link === location.pathname && el.group === 'dropdown-1';
    });
    this.setState({
      navEventKey: location.pathname,
      navDropdownTitle: findOj?.name || 'Другое',
      navDropdownIsActive: !!findOj
    })
  }

  componentDidMount() {
    this.locationHandleToNav(customHistory.location);
    customHistory.listen((location: HLocation<unknown>) => {
      this.locationHandleToNav(location)
    })
  }

  navSelectHandle = (eventKey: string | null) => {
    customHistory.push(eventKey || Paths.MGXR);
  }

  render() {

    return (
      <Router history={customHistory}>
        <div className="App">
          <div className="appRoutes">
            <Container fluid>
              <Navbar collapseOnSelect expand="sm" bg="light" variant="light">
                <Navbar.Brand href={Paths.MGXR}>MGXR</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
                <Navbar.Collapse id="responsive-navbar-nav">
                  <Nav
                    variant="pills"
                    className="mr-auto"
                    defaultActiveKey={Paths.MGXR}
                    activeKey={this.state.navEventKey}
                    onSelect={this.navSelectHandle}
                  >
                    <Nav.Link eventKey={Paths.MGXR}>Главная</Nav.Link>
                    <Nav.Link eventKey={Paths.UARW}>"Карточки"</Nav.Link>
                    <Nav.Link eventKey={Paths.NEWS}>"Новости"</Nav.Link>
                    <Nav.Link eventKey={Paths.SETTINGS}>Настройки</Nav.Link>
                    <NavDropdown
                      id="elem1224"
                      title={this.state.navDropdownTitle}
                      active={this.state.navDropdownIsActive}
                    >
                      <NavDropdown.Item eventKey={Paths.DEBUG}>Debug</NavDropdown.Item>
                      <NavDropdown.Item eventKey={Paths.SOME}>Some</NavDropdown.Item>
                    </NavDropdown>
                  </Nav>
                </Navbar.Collapse>
              </Navbar>
            </Container>
          </div>
          {/* // --- */}
          <Switch>
            <Route path={utilPathGet()} exact>
              <div>Проекты</div>
              {Names.aTagGet(Paths.UARW)}
              {Names.aTagGet(Paths.NEWS)}
            </Route>
            <Route path={utilPathGet('settings')} exact>
              <Settings/>
            </Route>
            <Route path={utilPathGet('debug')} exact>
              <PageDebug/>
            </Route>
            <Route path={utilPathGet('news')} exact>
              {/* "Новости" */}
              <PageNews/>
            </Route>
            <Route path={utilPathGet('uarw')} exact>
              {/* "Карточки" */}
              <PageUarw/>
            </Route>
            <Route path={Paths.UARW_SETTINGS} exact component={UarwSettings}/>
            <Route path={Paths.UARW_ABOUT} exact component={UarwAbout}/>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
