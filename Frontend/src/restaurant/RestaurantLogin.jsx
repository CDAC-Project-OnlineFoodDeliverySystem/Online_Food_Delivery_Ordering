import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button, Spinner } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../utils/api";

export default function RestaurantLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/auth/login", { email, password });
      const { token, user } = response.data;

      if (user.role !== "RESTAURANT_OWNER") {
        toast.error("Access denied. You are not a restaurant owner.");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userEmail", user.email);
      localStorage.setItem("userId", user.id);
      localStorage.setItem("restaurantLoggedIn", "true");

      toast.success("Welcome back, Chef! 👨‍🍳");
      setTimeout(() => navigate("/restaurant/dashboard"), 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid restaurant credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={4}>
            <Card className="auth-card p-4">
              <Card.Body>
                <div className="text-center mb-4">
                  <h2 className="fw-bold text-dark">Restaurant Login</h2>
                  <p className="text-muted small">Manage your kitchen operations</p>
                </div>

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="email">
                    <Form.Label className="small fw-bold">Business Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="restaurant@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="py-2"
                    />
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="password">
                    <Form.Label className="small fw-bold">Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="py-2"
                    />
                  </Form.Group>

                  <Button variant="danger" type="submit" className="w-100 py-2 signup-btn shadow-sm" disabled={loading}>
                    {loading ? <Spinner animation="border" size="sm" /> : "Sign In to Dashboard"}
                  </Button>
                </Form>

                <div className="text-center mt-4 small">
                  <p className="mb-1 text-muted">
                    Are you a customer? <Link to="/signin" className="text-primary fw-bold">Customer Login</Link>
                  </p>
                  <Link to="/admin/login" className="text-muted text-decoration-none">Platform Admin? Admin Login</Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
