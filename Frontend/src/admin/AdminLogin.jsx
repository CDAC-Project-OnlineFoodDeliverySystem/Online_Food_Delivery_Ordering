import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button, Spinner } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import api from "../utils/api";
import { toast } from "react-toastify";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      toast.error("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/auth/login", {
        email: form.email,
        password: form.password
      });

      const { token, user } = response.data;

      if (user.role !== "ADMIN") {
        toast.error("Access denied. You are not an admin.");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("isAdminLoggedIn", "true");
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userEmail", user.email);
      toast.success(`Welcome back, ${user.firstname}!`);
      navigate("/admin/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid admin credentials.");
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
                  <h2 className="fw-bold text-dark">Admin Login</h2>
                  <p className="text-muted small">Platform Administration</p>
                </div>

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="email">
                    <Form.Label className="small fw-bold">Admin Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="admin@gmail.com"
                      value={form.email}
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
                      value={form.password}
                      onChange={handleChange}
                      required
                      className="py-2"
                    />
                  </Form.Group>

                  <Button variant="secondary" type="submit" className="w-100 py-2 fw-bold shadow-sm" disabled={loading}>
                    {loading ? <Spinner animation="border" size="sm" /> : "System Sign In"}
                  </Button>
                </Form>

                <div className="text-center mt-4">
                  <Link to="/signin" className="text-muted small text-decoration-none">Back to Customer Login</Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
