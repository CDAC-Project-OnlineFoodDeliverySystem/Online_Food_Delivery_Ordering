import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../utils/api";
import "./AdminDashboard.css";
import AdminRestaurantApprovals from "./AdminRestaurantApprovals";

export default function AdminDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const [restaurantCount, setRestaurantCount] = useState(0);
  const [stats, setStats] = useState({ activeOrders: 0, totalRevenue: 0, pendingTasks: 0 });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // 1. Get Restaurant Count
      const resRestaurants = await api.get("/Admin/restaurants");
      setRestaurantCount(resRestaurants.data.length);

      // 2. Get Order Stats (Revenue, Active Orders)
      const resOrderStats = await api.get("/orders/stats");

      // 3. Get Pending Approvals Count
      const resPending = await api.get("/restaurants/pending");

      setStats({
        activeOrders: resOrderStats.data.activeOrders,
        totalRevenue: resOrderStats.data.totalRevenue,
        pendingTasks: resPending.data.length
      });

    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const isActive = (path) => location.pathname === path ? "active" : "";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/signin");
  };

  return (
    <div className="admin-wrapper">
      <div className="admin-sidebar">
        <div className="admin-logo">FOOD ADMIN</div>

        <ul className="admin-menu">
          <li>
            <Link to="/admin/dashboard" className={isActive("/admin/dashboard")}>
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/admin/approvals" className={isActive("/admin/approvals")}>
              Approvals 🚨
            </Link>
          </li>
          <li>
            <Link to="/admin/restaurants" className={isActive("/admin/restaurants")}>
              Manage Restaurants
            </Link>
          </li>
          <li>
            <Link to="/admin/add-restaurant" className={isActive("/admin/add-restaurant")}>
              Add Restaurant
            </Link>
          </li>
          <li style={{ marginTop: "auto" }}>
            <button className="admin-logout-btn" onClick={handleLogout}>
              Logout 🚪
            </button>
          </li>
        </ul>
      </div>

      <div className="admin-main">
        <h1 className="admin-header-title">Welcome Back, Admin!</h1>
        <p className="admin-subtext">Here is what's happening in your food delivery service.</p>

        <div className="admin-cards">
          {location.pathname === "/admin/approvals" ? (
            <AdminRestaurantApprovals />
          ) : (
            <>
              <div className="admin-card" style={{ borderLeftColor: "#4f46e5" }}>
                <h3>Total Restaurants</h3>
                <p>{restaurantCount}</p>
              </div>

              <div className="admin-card" style={{ borderLeftColor: "#10b981" }}>
                <h3>Active Orders</h3>
                <p>{stats.activeOrders}</p>
              </div>

              <div className="admin-card" style={{ borderLeftColor: "#f59e0b" }}>
                <h3>Pending Tasks</h3>
                <p>{stats.pendingTasks}</p>
              </div>

              <div className="admin-card" style={{ borderLeftColor: "#ef4444" }}>
                <h3>Total Revenue</h3>
                <p>₹ {stats.totalRevenue.toLocaleString()}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}