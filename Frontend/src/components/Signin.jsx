import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import { toast } from "react-toastify";
import api from "../utils/api";
import "./Signin.css";

export default function Signin() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from || "/home";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!email || !password) {
      toast.error("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/auth/login", { email, password });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userId", response.data.user.id);
        toast.success("Login Successful!");

        if (response.data.user.role === "ADMIN") {
          localStorage.setItem("isAdminLoggedIn", "true");
          navigate("/admin/dashboard");
        } else if (response.data.user.role === "RESTAURANT_OWNER") {
          localStorage.setItem("restaurantLoggedIn", "true");
          navigate("/restaurant/dashboard");
        } else {
          navigate(redirectPath);
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper d-flex align-items-center justify-content-center">
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={4}>
            <Card className="auth-card p-4 shadow-lg border-0">
              <Card.Body>
                <div className="text-center mb-4">
                  <h2 className="fw-bold text-dark">Welcome Back</h2>
                  <p className="text-muted">Sign in to continue ordering</p>
                </div>

                {error && <Alert variant="danger" className="py-2 small text-center">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="email">
                    <Form.Label className="small fw-bold">Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="py-2"
                    />
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="password">
                    <Form.Label className="small fw-bold">Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      placeholder="Enter password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="py-2"
                    />
                  </Form.Group>

                  <Button variant="primary" type="submit" className="w-100 py-2 signup-btn shadow-sm mb-3" disabled={loading}>
                    {loading ? "Signing in..." : "Sign In"}
                  </Button>
                </Form>

                <div className="text-center mt-3 small">
                  <p className="mb-1 text-muted">
                    Don't have an account? <Link to="/signup" className="text-primary fw-bold">Sign Up</Link>
                  </p>
                  <hr className="my-3" />
                  <div className="d-flex flex-column gap-1">
                    <Link to="/admin/login" className="text-muted text-decoration-none">Are you an Admin?</Link>
                    <Link to="/restaurant/login" className="text-muted text-decoration-none">Are you a Restaurant Owner?</Link>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
