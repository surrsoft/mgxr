import React from 'react';
import { Route, Router, Switch, withRouter } from 'react-router-dom';
import { Location as HLocation } from "history";
import { MAirtable } from './api/airtable-api';
import { Settings } from './components/Settings';
import { PageDebug } from './components/PageDebug';
import { PageNews } from './components/PageNews';
import PageUarw from './components/PageUarw';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import './App.scss';
import { Names, Paths } from './consts';

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
    console.log('!!-!!-!! this.props {210308091043}\n', this.props); // del+
    this.locationHandleToNav(this.props.history.location);
    this.props.history.listen((location: HLocation<unknown>) => {
      this.locationHandleToNav(location)
    })
  }

  navSelectHandle = (eventKey: string | null) => {
    this.props.history.push(eventKey || Paths.MGXR);
  }

  fnMain = () => {
    return <div>
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
                <Nav.Link eventKey={Paths.MGXR + Paths.SETTINGS}>Настройки</Nav.Link>
                <NavDropdown
                  id="elem1224"
                  title={this.state.navDropdownTitle}
                  active={this.state.navDropdownIsActive}
                >
                  <NavDropdown.Item eventKey={Paths.MGXR + Paths.DEBUG}>Debug</NavDropdown.Item>
                  <NavDropdown.Item eventKey={Paths.MGXR + Paths.SOME}>Some</NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        </Container>
      </div>

    </div>
  }

  render() {

    return (
      <div className="App">

        {/* // --- */}
        <Route path={Paths.MGXR}>
          {this.fnMain()}
        </Route>
        <Route path={Paths.MGXR} exact>
          <div>Проекты</div>
          {Names.aTagGet(Paths.UARW)}
          {Names.aTagGet(Paths.NEWS)}
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
      </div>
    );
  }
}

export default withRouter(App);
