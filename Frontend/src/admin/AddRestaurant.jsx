import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { toast } from "react-toastify";
import "./AddRestaurant.css";

export default function AddRestaurant() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        cuisine: "",
        rating: "",
        img: "",
        address: "",
        contactNumber: "",
        ownerId: 0
    });

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

            await api.post("/Admin/restaurants", payload);
            toast.success("Restaurant added successfully!");
            navigate("/admin/restaurants");
        } catch (err) {
            toast.error("Failed to add restaurant: " + (err.response?.data?.Message || err.message));
        }
    };

    return (
        <div className="add-wrapper">
            <div className="add-container">
                <h2 className="add-title">Add New Restaurant</h2>
                <p className="add-subtitle">Enter details to display on the customer app.</p>

                <form className="add-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Restaurant Name</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="e.g. Spicy Tandoor"
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
                                placeholder="e.g. North Indian"
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
                                placeholder="4.5"
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
                            placeholder="https://example.com/image.jpg"
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
                            placeholder="123, MG Road, Mumbai"
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
                                placeholder="+91-1234567890"
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
                                placeholder="1"
                                value={form.ownerId}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <button className="save-btn" type="submit">
                        Create Listing
                    </button>
                    <button className="cancel-btn" type="button" onClick={() => navigate('/admin/restaurants')}>
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
}