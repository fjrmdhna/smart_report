import React from 'react';
import { Container } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-4 mt-4">
      <Container className="text-center">
        <p>© {new Date().getFullYear()} Smart Reporting. All rights reserved.</p>
      </Container>
    </footer>
  );
};

export default Footer;
