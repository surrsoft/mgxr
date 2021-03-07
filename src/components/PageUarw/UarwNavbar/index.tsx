import { Component } from 'react';
import './styles.scss';
import { Nav, Navbar } from 'react-bootstrap';
import { Names, Paths } from '../../../consts';
import customHistory from '../../../m-history';

class Props {

}

class State {

}

export class UarwNavbar extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  private onSelectHandle = (eventKey: string | null) => {
    console.log('!!-!!-!! eventKey {210307205839}\n', eventKey); // del+
    customHistory.push(eventKey || '');
  };

  render() {
    return <>
      <Navbar>
        <Navbar.Brand href={Paths.UARW}>UARW</Navbar.Brand>
        <Nav onSelect={this.onSelectHandle}>
          <Nav.Link eventKey={Paths.UARW_SETTINGS}>{Names.nameGet(Paths.UARW_SETTINGS)}</Nav.Link>
          <Nav.Link eventKey={Paths.UARW_ABOUT}>{Names.nameGet(Paths.UARW_ABOUT)}</Nav.Link>
        </Nav>
      </Navbar>
    </>
  }
}
