import React, { useState, useEffect } from "react";
import api from "../utils/api";
import { Table, Badge, Form, Container, Card, Spinner, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";
import "./RestaurantOrders.css";

export default function RestaurantOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(null);
    const ownerId = localStorage.getItem("userId");

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const resRes = await api.get(`/restaurants/owner/${ownerId}`);
            if (resRes.data.length > 0) {
                const restaurantId = resRes.data[0].id;
                const ordRes = await api.get(`/orders/restaurant/${restaurantId}`);
                setOrders(ordRes.data.reverse());
            }
        } catch (err) {
            toast.error("Error fetching orders");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        setUpdating(orderId);
        try {
            await api.patch(`/orders/${orderId}/status?status=${newStatus}`);
            setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
            toast.success(`Success: Order is now ${newStatus}`);
        } catch (err) {
            toast.error("Status update failed");
        } finally {
            setUpdating(null);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case "PENDING": return <Badge bg="warning" text="dark" className="rounded-pill px-3">Pending</Badge>;
            case "CONFIRMED": return <Badge bg="primary" className="rounded-pill px-3">Confirmed</Badge>;
            case "DELIVERED": return <Badge bg="success" className="rounded-pill px-3">Delivered</Badge>;
            case "CANCELLED": return <Badge bg="danger" className="rounded-pill px-3">Cancelled</Badge>;
            default: return <Badge bg="secondary" className="rounded-pill px-3">{status}</Badge>;
        }
    };

    if (loading) return <div className="text-center py-5"><Spinner animation="border" variant="danger" /></div>;

    return (
        <div className="res-orders-page bg-light py-5" style={{ minHeight: '100vh' }}>
            <Container>
                <div className="mb-4">
                    <h2 className="fw-bold mb-0">Order Management 📝</h2>
                    <p className="text-muted">Track and fulfill incoming customer orders</p>
                </div>

                {orders.length === 0 ? (
                    <Card className="border-0 shadow-sm text-center py-5">
                        <Card.Body>
                            <h4 className="text-muted">No orders found yet.</h4>
                        </Card.Body>
                    </Card>
                ) : (
                    <Card className="border-0 shadow-sm overflow-hidden">
                        <Table hover responsive className="mb-0 align-middle">
                            <thead className="bg-white">
                                <tr>
                                    <th className="ps-4">Order ID</th>
                                    <th>Items</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                    <th className="text-center">Set Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order.id}>
                                        <td className="ps-4 fw-bold text-primary">#ORD-{order.id}</td>
                                        <td>
                                            <ul className="list-unstyled mb-0 small text-muted">
                                                {(order.items || order.orderItems || []).map((item, idx) => (
                                                    <li key={idx}><span className="text-dark fw-bold">{item.quantity}x</span> {item.name}</li>
                                                ))}
                                            </ul>
                                        </td>
                                        <td className="fw-bold">₹ {order.totalAmount}</td>
                                        <td>{getStatusBadge(order.status)}</td>
                                        <td className="text-center" style={{ width: '200px' }}>
                                            <Form.Select
                                                size="sm"
                                                value={order.status}
                                                disabled={updating === order.id}
                                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                className="status-select rounded-pill shadow-sm"
                                            >
                                                <option value="PENDING">PENDING</option>
                                                <option value="CONFIRMED">CONFIRMED</option>
                                                <option value="DELIVERED">DELIVERED</option>
                                                <option value="CANCELLED">CANCELLED</option>
                                            </Form.Select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Card>
                )}
            </Container>
        </div>
    );
}
