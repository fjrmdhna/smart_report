import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import logo from './Indosat_Ooredoo_Hutchison.png'; 
import './Navbar.css';

const MyNavbar = () => {
  return (
    <Navbar expand="lg" className="custom-navbar">
      <Container>
        <Navbar.Brand href="/" className="navbar-brand-custom">
          <img
            src={logo}
            alt="Indosat Logo"
            className="navbar-logo"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="navbar-links">
            <Nav.Link href="/">Dashboard</Nav.Link>
            <Nav.Link href="/notification">Notification</Nav.Link>
            <Nav.Link href="/planning">Planning</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MyNavbar;
