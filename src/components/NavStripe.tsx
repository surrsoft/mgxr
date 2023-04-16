import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { Paths } from '../consts';
import React from 'react';
import { NavStripeProps } from '../types/types';

export function NavStripe({ rootEventKey, onSelect, dropdownIsActive, dropdownTitle }: NavStripeProps) {
  return <div>
    <div className="appRoutes">
      <Container fluid>
        <Navbar collapseOnSelect expand="sm" bg="light" variant="light">
          <Navbar.Brand href={Paths.MGXR}>MGXR</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav
              variant="pills"
              className="mr-auto"
              defaultActiveKey={Paths.MGXR}
              activeKey={rootEventKey ?? undefined}
              onSelect={onSelect}
            >
              <Nav.Link eventKey={Paths.MGXR}>Главная</Nav.Link>
              <Nav.Link eventKey={Paths.UARW}>"Карточки"</Nav.Link>
              <Nav.Link eventKey={Paths.UARW2}>"Карточки2"</Nav.Link>
              <Nav.Link eventKey={Paths.NEWS}>"Новости"</Nav.Link>
              <Nav.Link eventKey={Paths.MGXR + Paths.SETTINGS}>Настройки</Nav.Link>
              <NavDropdown
                id="elem1224"
                title={dropdownTitle}
                active={dropdownIsActive}
              >
                <NavDropdown.Item eventKey={Paths.MGXR + Paths.DEBUG}>Debug</NavDropdown.Item>
                <NavDropdown.Item eventKey={Paths.MGXR + Paths.SOME}>Some</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </Container>
    </div>
  </div>;
}
