import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Form, InputGroup, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../utils/api";
import "./CustomerHome.css";

export default function CustomerHome() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await api.get("/restaurants");
      setRestaurants(response.data);
    } catch (err) {
      toast.error("Failed to fetch restaurants.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewMenu = (id) => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      toast.warning("Please login to continue 🍽️");
      setTimeout(() => navigate("/signin"), 1000);
    } else {
      navigate(`/menu/${id}`);
    }
  };

  const filteredRestaurants = restaurants.filter(
    (res) =>
      res.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (res.cuisine && res.cuisine.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
      <Spinner animation="border" variant="primary" />
    </div>
  );

  return (
    <div className="home-page">
      {/* HERO SECTION */}
      <div className="hero-section text-center py-5 mb-5 bg-white shadow-sm">
        <Container>
          <h1 className="display-4 fw-bold mb-3">Delicious Food, Delivered To You</h1>
          <p className="lead text-muted mb-4">Discover the best restaurants in your city</p>
          <Row className="justify-content-center">
            <Col md={6}>
              <InputGroup className="shadow-sm rounded-pill overflow-hidden">
                <Form.Control
                  placeholder="Search for restaurants or cuisines..."
                  className="border-0 py-3 px-4"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button variant="primary" className="px-4">Search</Button>
              </InputGroup>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="pb-5">
        <h3 className="fw-bold mb-4">Popular Restaurants</h3>
        <Row>
          {filteredRestaurants.length > 0 ? (
            filteredRestaurants.map((res) => (
              <Col key={res.id} sm={6} md={4} lg={3} className="mb-4">
                <Card className="restaurant-card h-100 border-0 shadow-sm transition-hover">
                  <div className="overflow-hidden" style={{ height: '180px' }}>
                    <Card.Img
                      variant="top"
                      src={res.img || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500"}
                      className="h-100 w-100 object-fit-cover"
                    />
                  </div>
                  <Card.Body className="d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <Card.Title className="fw-bold mb-0 text-truncate" style={{ maxWidth: '70%' }}>{res.name}</Card.Title>
                      <span className="badge bg-success">⭐ {res.rating || '4.0'}</span>
                    </div>
                    <Card.Text className="text-muted small mb-3">{res.cuisine || "Multi-cuisine"}</Card.Text>
                    <Button
                      variant="outline-primary"
                      className="mt-auto w-100 fw-bold border-2 rounded-pill"
                      onClick={() => handleViewMenu(res.id)}
                    >
                      View Menu
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <Col className="text-center py-5">
              <h4 className="text-muted">No restaurants found 😔</h4>
            </Col>
          )}
        </Row>
      </Container>
    </div>
  );
}
