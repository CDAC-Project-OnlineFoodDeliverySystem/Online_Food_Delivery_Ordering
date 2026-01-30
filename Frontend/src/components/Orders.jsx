import React, { useState, useEffect } from "react";
import api from "../utils/api";
import { Table, Badge, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import "./Orders.css";

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            // 1. Get profile to find customerId
            const profileResponse = await api.get("/customers/profile");
            const customerId = profileResponse.data.id;

            // 2. Fetch orders for this customer
            const ordersResponse = await api.get(`/orders/customer/${customerId}`);
            setOrders(ordersResponse.data.reverse()); // Show latest first
        } catch (err) {
            toast.error("Failed to load orders");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case "PENDING": return <Badge bg="warning" text="dark">Pending</Badge>;
            case "CONFIRMED": return <Badge bg="primary">Confirmed</Badge>;
            case "DELIVERED": return <Badge bg="success">Delivered</Badge>;
            case "CANCELLED": return <Badge bg="danger">Cancelled</Badge>;
            default: return <Badge bg="secondary">{status}</Badge>;
        }
    };

    if (loading) return <div className="text-center mt-5"><h3>Loading your orders...</h3></div>;

    return (
        <div className="orders-container">
            <h2 className="orders-title">My Order History 📦</h2>

            {orders.length === 0 ? (
                <div className="no-orders text-center mt-5">
                    <p>You haven't placed any orders yet.</p>
                    <Button variant="primary" href="/home">Browse Food</Button>
                </div>
            ) : (
                <Table hover responsive className="orders-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Items</th>
                            <th>Total Amount</th>
                            <th>Status</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id}>
                                <td>#ORD-{order.id}</td>
                                <td>
                                    <ul className="order-items-list">
                                        {(order.items || order.orderItems || []).map((item, idx) => (
                                            <li key={idx}>{item.name} (x{item.quantity})</li>
                                        ))}
                                    </ul>
                                </td>
                                <td className="order-price">₹ {order.totalAmount}</td>
                                <td>{getStatusBadge(order.status)}</td>
                                <td>{order.orderDate ? new Date(order.orderDate).toLocaleDateString() : "Recently"}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </div>
    );
}
