import { useAccount } from 'wagmi'
import { Container, Navbar, Offcanvas, Nav, Button } from "react-bootstrap";
import styled from 'styled-components';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const ContainerW75 = styled(Container)`
  @media(min-width: 768px) {
    width: 75% !important;
  }
`;

export default function Header() {
  return(
    <Navbar bg="light" expand={false} className="mb-1 shadow">
      <ContainerW75 fluid>
        <Navbar.Toggle aria-controls={`offcanvasNavbar-false-${false}`} />
        <Navbar.Brand href="#">
          <img src="https://drive.google.com/uc?export=view&id=1ZY92ntjH1UWEW4-61cRL1p-L1J_O4ac8" className="img-fluid w-75" />
        </Navbar.Brand>
        <div className='d-none d-sm-block'>
          <ConnectButton />
        </div>
        <Navbar.Offcanvas
          id={`offcanvasNavbar-false-${false}`}
          aria-labelledby={`offcanvasNavbarLabel-false-${false}`}
          placement="start"
        >
          <Offcanvas.Header closeButton>
          <Offcanvas.Title id={`offcanvasNavbarLabel-false-${false}`}>Tulum Dao</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="justify-content-end flex-grow-1 pe-3">
              <Nav.Link href="/home">Home</Nav.Link>
              <Nav.Link href="/investment">Investment</Nav.Link>
              <Nav.Link href="/dashboard">Dashboard</Nav.Link>
              <Nav.Link href="/marketplace">Marketplace</Nav.Link>
            </Nav>
            <div className='d-block d-sm-none m-0 mt-1'>
              <ConnectButton />
            </div>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </ContainerW75>
    </Navbar>
  );
}