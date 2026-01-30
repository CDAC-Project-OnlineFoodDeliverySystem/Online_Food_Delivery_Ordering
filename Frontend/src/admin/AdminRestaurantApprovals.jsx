import React, { useState, useEffect } from "react";
import api from "../utils/api";
import { Table, Button, Badge, Card, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";

export default function AdminRestaurantApprovals() {
    const [pendingRestaurants, setPendingRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPending();
    }, []);

    const fetchPending = async () => {
        try {
            const res = await api.get("/restaurants/pending");
            setPendingRestaurants(res.data);
        } catch (err) {
            console.error("Error fetching pending restaurants", err);
            // toast.error("Failed to load pending requests");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            // Send raw string as body, with correct Content-Type if needed, 
            // but standard Spring @RequestBody String expects just the string or JSON string. 
            // Safe bet: send simple string with text/plain or just standard axios default.
            // Actually, axios sends JSON by default. Let's send it as a simple string but handle backend acceptance.
            // The backend expects @RequestBody String status.

            await api.put(`/restaurants/status/${id}`, status, {
                headers: { "Content-Type": "text/plain" }
            });

            toast.success(`Restaurant ${status.toLowerCase()} successfully!`);
            setPendingRestaurants(pendingRestaurants.filter(r => r.id !== id));
        } catch (err) {
            toast.error("Failed to update status");
            console.error(err);
        }
    };

    if (loading) return <div className="text-center py-5"><Spinner animation="border" /></div>;

    return (
        <div className="p-4">
            <h2 className="mb-4">📢 Pending Restaurant Approvals</h2>
            {pendingRestaurants.length === 0 ? (
                <p className="text-muted">No pending approvals at the moment.</p>
            ) : (
                <Card className="shadow-sm border-0">
                    <Table hover responsive className="mb-0 align-middle">
                        <thead className="bg-light">
                            <tr>
                                <th>Restaurant</th>
                                <th>Owner ID</th>
                                <th>Cuisine</th>
                                <th>Address</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendingRestaurants.map((restaurant) => (
                                <tr key={restaurant.id}>
                                    <td>
                                        <div className="d-flex align-items-center">
                                            {restaurant.img && <img src={restaurant.img} alt="" style={{ width: 40, height: 40, borderRadius: '50%', marginRight: 10, objectFit: 'cover' }} />}
                                            <span className="fw-bold">{restaurant.name}</span>
                                        </div>
                                    </td>
                                    <td>{restaurant.ownerId}</td>
                                    <td><Badge bg="info">{restaurant.cuisine}</Badge></td>
                                    <td className="small text-muted" style={{ maxWidth: '200px' }}>{restaurant.address}</td>
                                    <td>
                                        <Button
                                            variant="success"
                                            size="sm"
                                            className="me-2"
                                            onClick={() => handleStatusUpdate(restaurant.id, "APPROVED")}
                                        >
                                            Approve
                                        </Button>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleStatusUpdate(restaurant.id, "REJECTED")}
                                        >
                                            Reject
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card>
            )}
        </div>
    );
}
