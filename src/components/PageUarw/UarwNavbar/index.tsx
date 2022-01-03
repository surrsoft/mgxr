import { Component } from 'react';
import './styles.scss';
import { Nav, Navbar } from 'react-bootstrap';
import { Names, Paths } from '../../../consts';
import { withRouter } from 'react-router-dom';

class State {

}

class UarwNavbar extends Component<any, State> {
  constructor(props: any) {
    super(props);
  }

  private onSelectHandle = (eventKey: string | null) => {
    this.props.history.push(eventKey || '');
  };

  render() {
    const {path} = this.props.match;
    return <>
      <Navbar>
        <Navbar.Brand href={'#' + path}>UARW</Navbar.Brand>
        <Nav onSelect={this.onSelectHandle}>
          <Nav.Link eventKey={path}>Главная</Nav.Link>
          <Nav.Link eventKey={path + Paths.UARW_SETTINGS}>{Names.nameGet(Paths.UARW_SETTINGS)}</Nav.Link>
          <Nav.Link eventKey={path + Paths.UARW_ABOUT}>{Names.nameGet(Paths.UARW_ABOUT)}</Nav.Link>
          <Nav.Link eventKey={path + Paths.UARW_SETTINGS_2}>Settings-2</Nav.Link>
        </Nav>
      </Navbar>
    </>
  }
}

export default withRouter(UarwNavbar);
