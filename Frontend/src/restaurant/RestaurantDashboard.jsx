import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Spinner, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../utils/api";
import "./RestaurantDashboard.css";

export default function RestaurantDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ menuCount: 0, orderCount: 0, status: "" });
  const [restaurantName, setRestaurantName] = useState("");
  const [loading, setLoading] = useState(true);

  const ownerId = localStorage.getItem("userId");
  const userEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const resRes = await api.get(`/restaurants/owner/${ownerId}`);
      if (resRes.data.length > 0) {
        const res = resRes.data[0];
        setRestaurantName(res.name);

        const detailedRes = await api.get(`/restaurants/${res.id}`);
        const mCount = detailedRes.data.menuItems?.length || 0;
        // In case the backend doesn't return menuItems directly in the simple GET
        // or if we rely on the object field 'menu'.
        // Let's use menu from the first call if available or detailed one.

        const ordRes = await api.get(`/orders/restaurant/${res.id}`);
        const oCount = ordRes.data.length;

        setStats({
          menuCount: res.menu ? res.menu.length : mCount, // Fallback logic
          orderCount: oCount,
          status: res.status // Capture status from backend
        });
      } else {
        // No restaurant found
        setRestaurantName("");
      }
    } catch (err) {
      console.error("Error fetching dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out successfully");
    navigate("/restaurant/login");
  };

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <Spinner animation="border" variant="danger" />
    </div>
  );

  // 1. NO RESTAURANT FOUND -> Show Create Form
  if (!restaurantName) {
    return (
      <Container className="py-5 text-center">
        <Card className="p-5 shadow-lg border-0" style={{ maxWidth: "600px", margin: "0 auto" }}>
          <h2 className="mb-4">🏠 Create Your Restaurant</h2>
          <p className="text-muted mb-4">You are registered as a Restaurant Owner, but you haven't set up your restaurant yet.</p>
          <CreateRestaurantForm ownerId={ownerId} onSuccess={fetchDashboardData} />
          <Button variant="link" className="text-danger mt-3" onClick={handleLogout}>Log Out</Button>
        </Card>
      </Container>
    );
  }

  // 2. STATUS IS PENDING -> Show Pending Message
  if (stats.status === "PENDING") {
    return (
      <Container className="py-5 text-center">
        <Card className="p-5 shadow border-0 bg-light">
          <h1 className="display-4 text-warning">⏳</h1>
          <h2 className="mt-3">Approval Pending</h2>
          <p className="lead text-muted mt-3">
            Your restaurant <strong>{restaurantName}</strong> is waiting for Admin approval.
            <br />
            You will be able to manage your menu once approved.
          </p>
          <Button variant="outline-primary" onClick={fetchDashboardData} className="mt-4">
            Check Status
          </Button>
          <Button variant="link" className="text-danger mt-3" onClick={handleLogout}>Log Out</Button>
        </Card>
      </Container>
    );
  }

  // 3. APPROVED -> Show Full Dashboard
  return (
    <div className="owner-dashboard-wrapper py-5">
      <Container>
        <div className="dashboard-header mb-5 text-center">
          <h1 className="fw-bold text-dark mb-2">🍽️ {restaurantName} Dashboard</h1>
          <p className="text-muted lead">Welcome back, <strong>{userEmail}</strong></p>
          <Badge bg="success" className="px-3 py-2">VERIFIED OWNER</Badge>
        </div>

        <Row className="justify-content-center g-4">
          <Col md={4}>
            <Card className="dashboard-stat-card border-0 shadow-sm text-center p-4 h-100">
              <Card.Body>
                <div className="stat-icon mb-3">📋</div>
                <Card.Title className="fw-bold h4 mb-3">Manage Menu</Card.Title>
                <Card.Text className="text-muted mb-4">You have <strong>{stats.menuCount}</strong> dishes listed in your menu.</Card.Text>
                <Button variant="outline-danger" className="w-100 fw-bold rounded-pill" onClick={() => navigate("/restaurant/menu")}>
                  Go to Menu
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="dashboard-stat-card border-0 shadow-sm text-center p-4 h-100">
              <Card.Body>
                <div className="stat-icon mb-3">📦</div>
                <Card.Title className="fw-bold h4 mb-3">Inbound Orders</Card.Title>
                <Card.Text className="text-muted mb-4">Total orders received to date: <strong>{stats.orderCount}</strong></Card.Text>
                <Button variant="danger" className="w-100 signup-btn fw-bold rounded-pill" onClick={() => navigate("/restaurant/orders")}>
                  View Orders
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="dashboard-stat-card border-0 shadow-sm text-center p-4 h-100 opacity-75">
              <Card.Body>
                <div className="stat-icon mb-3">🟢</div>
                <Card.Title className="fw-bold h4 mb-3">Store Status</Card.Title>
                <Card.Text className="text-muted mb-4">Currently Open for Orders. Manage your schedule.</Card.Text>
                <Button variant="secondary" className="w-100 fw-bold rounded-pill" disabled onClick={() => toast.info("Coming soon!")}>
                  Manage Status
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <div className="text-center mt-5 pt-4">
          <Button variant="link" className="text-danger fw-bold text-decoration-none" onClick={handleLogout}>
            Sign Out from Dashboard 🚪
          </Button>
        </div>
      </Container>
    </div>
  );
}

// Sub-component for Creating Restaurant
function CreateRestaurantForm({ ownerId, onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    address: "",
    contactNumber: "",
    cuisine: "",
    img: "",
    rating: 4.5
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = { ...form, ownerId: parseInt(ownerId) };
      await api.post("/restaurants", payload);
      toast.success("Restaurant created! Waiting for approval.");
      onSuccess();
    } catch (err) {
      console.error(err);
      toast.error("Failed to create restaurant.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="text-start">
      <div className="mb-3">
        <label className="form-label">Restaurant Name</label>
        <input type="text" className="form-control" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
      </div>
      <div className="mb-3">
        <label className="form-label">Cuisine Type</label>
        <input type="text" className="form-control" placeholder="e.g. Indian, Italian" required value={form.cuisine} onChange={e => setForm({ ...form, cuisine: e.target.value })} />
      </div>
      <div className="mb-3">
        <label className="form-label">Address</label>
        <input type="text" className="form-control" required value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
      </div>
      <div className="mb-3">
        <label className="form-label">Contact Number</label>
        <input type="text" className="form-control" required value={form.contactNumber} onChange={e => setForm({ ...form, contactNumber: e.target.value })} />
      </div>
      <div className="mb-3">
        <label className="form-label">Image URL</label>
        <input type="text" className="form-control" placeholder="https://..." required value={form.img} onChange={e => setForm({ ...form, img: e.target.value })} />
      </div>
      <Button variant="danger" type="submit" className="w-100" disabled={submitting}>
        {submitting ? "Creating..." : "Create Restaurant"}
      </Button>
    </form>
  );
}
