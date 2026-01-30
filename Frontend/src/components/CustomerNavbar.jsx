import React from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import "./CustomerNavbar.css";

const CustomerNavbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  const handleLogout = () => {
    localStorage.clear();
    alert("Logged out successfully!");
    navigate("/signin");
  };

  return (
    <Navbar bg="white" expand="lg" sticky="top" className="custom-navbar shadow-sm py-3">
      <Container>
        <Navbar.Brand as={Link} to="/home" className="fw-bold fs-3 text-primary brand-logo">
          <span className="logo-icon">🍔</span> FoodExpress
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="customer-nav" />

        <Navbar.Collapse id="customer-nav">
          <Nav className="ms-auto align-items-center">
            <Nav.Link as={NavLink} to="/home" className="mx-2 nav-item-link">
              Home
            </Nav.Link>

            <Nav.Link as={NavLink} to="/cart" className="mx-2 nav-item-link">
              Cart
            </Nav.Link>

            {!isLoggedIn ? (
              <>
                <Nav.Link as={NavLink} to="/signin" className="mx-2 nav-item-link">
                  Login
                </Nav.Link>
                <Button as={Link} to="/signup" variant="primary" className="ms-3 signup-btn rounded-pill px-4">
                  Register
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={NavLink} to="/orders" className="mx-2 nav-item-link">
                  Orders
                </Nav.Link>
                <Button
                  variant="outline-danger"
                  className="ms-3 logout-btn rounded-pill px-4"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomerNavbar;
