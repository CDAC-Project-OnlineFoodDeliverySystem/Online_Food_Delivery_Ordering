import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import { toast } from "react-toastify";
import api from "../utils/api";
import "./Signup.css";

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "CUSTOMER" // Default role
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateForm = () => {
    let newErrors = {};
    const emailRegex = /\S+@\S+\.\S+/;
    const phoneRegex = /^\d{10}$/;

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!emailRegex.test(formData.email)) newErrors.email = "Invalid email format";

    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!phoneRegex.test(formData.phone)) newErrors.phone = "Phone must be 10 digits";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Min 6 characters required";

    if (!formData.confirmPassword) newErrors.confirmPassword = "Match password is required";
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const nameParts = formData.fullName.trim().split(" ");
      const firstname = nameParts[0];
      const lastname = nameParts.slice(1).join(" ") || "";

      const payload = {
        firstname,
        lastname,
        email: formData.email,
        password: formData.password,
        role: formData.role // Send selected role
      };

      setLoading(true);
      await api.post("/auth/register", payload);
      toast.success("Registration successful! Please login.");
      // Redirect based on role could be nice, but signin page routes them anyway
      navigate("/signin");
    } catch (err) {
      console.error("Registration error:", err);
      const serverMsg = err.response?.data?.message || JSON.stringify(err.response?.data) || "Registration failed.";
      toast.error(serverMsg);
      setErrors({ ...errors, server: serverMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper d-flex align-items-center justify-content-center py-5">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="auth-card p-4 shadow-lg border-0">
              <Card.Body>
                <div className="text-center mb-4">
                  <h2 className="fw-bold text-dark">Create Account</h2>
                  <p className="text-muted">Join FoodExpress and start ordering or selling!</p>
                </div>

                {errors.server && <Alert variant="danger" className="py-2 small text-center">{errors.server}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={12}>
                      <Form.Group className="mb-3" controlId="fullName">
                        <Form.Label className="small fw-bold">Full Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="fullName"
                          placeholder="Rahul Sharma"
                          value={formData.fullName}
                          onChange={handleChange}
                          isInvalid={!!errors.fullName}
                        />
                        <Form.Control.Feedback type="invalid">{errors.fullName}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="email">
                        <Form.Label className="small fw-bold">Email</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          placeholder="rahul.sharma@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          isInvalid={!!errors.email}
                        />
                        <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="phone">
                        <Form.Label className="small fw-bold">Phone Number</Form.Label>
                        <Form.Control
                          type="tel"
                          name="phone"
                          placeholder="9876543210"
                          value={formData.phone}
                          onChange={handleChange}
                          isInvalid={!!errors.phone}
                        />
                        <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={12}>
                      <Form.Group className="mb-3" controlId="role">
                        <Form.Label className="small fw-bold">I want to:</Form.Label>
                        <Form.Select
                          name="role"
                          value={formData.role}
                          onChange={handleChange}
                          className="shadow-none"
                        >
                          <option value="CUSTOMER">Order Food (Customer)</option>
                          <option value="RESTAURANT_OWNER">Sell Food (Restaurant Owner)</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="password">
                        <Form.Label className="small fw-bold">Password</Form.Label>
                        <Form.Control
                          type="password"
                          name="password"
                          placeholder="Min 6 characters"
                          value={formData.password}
                          onChange={handleChange}
                          isInvalid={!!errors.password}
                        />
                        <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-4" controlId="confirmPassword">
                        <Form.Label className="small fw-bold">Confirm Password</Form.Label>
                        <Form.Control
                          type="password"
                          name="confirmPassword"
                          placeholder="Re-enter password"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          isInvalid={!!errors.confirmPassword}
                        />
                        <Form.Control.Feedback type="invalid">{errors.confirmPassword}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Button variant="primary" type="submit" className="w-100 py-2 signup-btn shadow-sm mb-3" disabled={loading}>
                    {loading ? "Creating Account..." : "Register"}
                  </Button>
                </Form>

                <div className="text-center mt-3 small text-muted">
                  Already have an account? <Link to="/signin" className="text-primary fw-bold">Sign In</Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
