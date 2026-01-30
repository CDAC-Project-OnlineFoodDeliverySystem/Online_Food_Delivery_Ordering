import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import "./ManageRestaurants.css";

export default function ManageRestaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await api.get("/Admin/restaurants");
      setRestaurants(response.data);
    } catch (err) {
      console.error("Error fetching admin restaurants:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this restaurant?")) {
      try {
        await api.delete(`/Admin/restaurants/${id}`);
        setRestaurants(restaurants.filter((item) => item.id !== id));
      } catch (err) {
        alert("Failed to delete restaurant: " + (err.response?.data?.Message || err.message));
      }
    }
  };

  // Filter logic
  const filteredRestaurants = restaurants.filter(
    (res) =>
      res.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.cuisine.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="manage-wrapper">
      <div className="manage-header">
        <div>
          <h2 className="manage-title">Manage Restaurants</h2>
          <p className="admin-subtext">View, edit, or delete your listings.</p>
        </div>

        <Link to="/admin/add-restaurant">
          <button className="add-btn">+ Add New</button>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="search-bar-container">
        <input
          type="text"
          placeholder="Search by name or cuisine..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="restaurant-grid">
        {filteredRestaurants.length > 0 ? (
          filteredRestaurants.map((res) => (
            <div className="restaurant-card-admin" key={res.id}>
              <div className="card-img-wrapper">
                <img src={res.img} alt={res.name} className="admin-res-img" />
                <span className="rating-badge">★ {res.rating}</span>
              </div>

              <div className="admin-res-info">
                <h3>{res.name}</h3>
                <p className="cuisine-tag">{res.cuisine}</p>
              </div>

              <div className="admin-res-actions">
                <Link to={`/admin/edit-restaurant/${res.id}`} style={{ flex: 1 }}>
                  <button className="edit-btn">Edit</button>
                </Link>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(res.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-data">No restaurants found.</p>
        )}
      </div>
    </div>
  );
}