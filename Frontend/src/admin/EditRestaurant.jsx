import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../utils/api";
import "./AddRestaurant.css";

export default function EditRestaurant() {
  const { id } = useParams();
  const navigate = useNavigate();
  const restaurantId = parseInt(id);

  const [form, setForm] = useState({
    name: "",
    cuisine: "",
    rating: "",
    img: "",
    address: "",
    contactNumber: "",
    ownerId: 0
  });

  useEffect(() => {
    fetchRestaurant();
  }, [restaurantId]);

  const fetchRestaurant = async () => {
    try {
      const response = await api.get(`/Admin/restaurants/${restaurantId}`);
      const restaurant = response.data;
      setForm({
        name: restaurant.name,
        cuisine: restaurant.cuisine,
        rating: restaurant.rating.toString(),
        img: restaurant.img,
        address: restaurant.address || "",
        contactNumber: restaurant.contactNumber || "",
        ownerId: restaurant.ownerId || 0
      });
    } catch (err) {
      alert("Restaurant not found.");
      navigate("/admin/restaurants");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...form,
        rating: parseFloat(form.rating),
        ownerId: parseInt(form.ownerId)
      };

      await api.put(`/Admin/restaurants/${restaurantId}`, payload);
      alert("Restaurant updated successfully!");
      navigate("/admin/restaurants");
    } catch (err) {
      alert("Failed to update restaurant: " + (err.response?.data?.Message || err.message));
    }
  };

  // If data is not yet loaded, show a simple loading message
  if (!form.name) {
    return (
      <div className="add-wrapper">
        <div className="add-container">Loading...</div>
      </div>
    );
  }

  return (
    <div className="add-wrapper">
      <div className="add-container">
        <h2 className="add-title">Edit Restaurant</h2>
        <p className="add-subtitle">ID: {restaurantId} | Update the restaurant information below.</p>

        <form className="add-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Restaurant Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group half">
              <label>Cuisine Type</label>
              <input
                type="text"
                name="cuisine"
                value={form.cuisine}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group half">
              <label>Rating (0-5)</label>
              <input
                type="number"
                step="0.1"
                max="5"
                min="0"
                name="rating"
                value={form.rating}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Image URL</label>
            <input
              type="url"
              name="img"
              value={form.img}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group half">
              <label>Contact Number</label>
              <input
                type="text"
                name="contactNumber"
                value={form.contactNumber}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group half">
              <label>Owner ID</label>
              <input
                type="number"
                name="ownerId"
                value={form.ownerId}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button className="save-btn" type="submit">
            Update Listing
          </button>
          <button className="cancel-btn" type="button" onClick={() => navigate('/admin/restaurants')}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}