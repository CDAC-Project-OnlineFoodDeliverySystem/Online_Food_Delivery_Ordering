import React, { useState, useEffect } from "react";
import api from "../utils/api";
import { Table, Button, Form, Modal, Container, Spinner, Badge, Card, Alert } from "react-bootstrap";
import { toast } from "react-toastify";
import "./ManageMenu.css";

export default function ManageMenu() {
    const [restaurant, setRestaurant] = useState(null);
    const [menu, setMenu] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);
    const [editing, setEditing] = useState(false);
    const [newItem, setNewItem] = useState({ name: "", description: "", price: "", img: "" });
    const [editItem, setEditItem] = useState({ id: null, name: "", description: "", price: "", img: "" });

    const ownerId = localStorage.getItem("userId");

    useEffect(() => {
        fetchOwnerRestaurant();
    }, []);

    const fetchOwnerRestaurant = async () => {
        try {
            const res = await api.get(`/restaurants/owner/${ownerId}`);
            if (res.data.length > 0) {
                const myRes = res.data[0];
                setRestaurant(myRes);
                fetchMenu(myRes.id);
            } else {
                toast.info("No restaurant linked yet.");
                setLoading(false);
            }
        } catch (err) {
            toast.error("Error fetching restaurant");
            setLoading(false);
        }
    };

    const fetchMenu = async (restaurantId) => {
        try {
            const res = await api.get(`/restaurants/${restaurantId}`);
            setMenu(res.data.menu || []);
        } catch (err) {
            toast.error("Error fetching menu");
        } finally {
            setLoading(false);
        }
    };

    const handleAddItem = async (e) => {
        e.preventDefault();
        setAdding(true);
        try {
            const res = await api.post(`/restaurants/${restaurant.id}/menu`, {
                ...newItem,
                price: parseFloat(newItem.price)
            });
            setMenu([...menu, res.data]);
            setShowModal(false);
            setNewItem({ name: "", description: "", price: "", img: "" });
            toast.success("Item added successfully!");
        } catch (err) {
            toast.error("Failed to add menu item");
        } finally {
            setAdding(false);
        }
    };

    const handleEditItem = async (e) => {
        e.preventDefault();
        setEditing(true);
        try {
            const res = await api.put(`/restaurants/menu/${editItem.id}`, {
                name: editItem.name,
                description: editItem.description,
                price: parseFloat(editItem.price),
                img: editItem.img
            });
            setMenu(menu.map(item => item.id === editItem.id ? res.data : item));
            setShowEditModal(false);
            setEditItem({ id: null, name: "", description: "", price: "", img: "" });
            toast.success("Item updated successfully!");
        } catch (err) {
            toast.error("Failed to update menu item");
        } finally {
            setEditing(false);
        }
    };

    const openEditModal = (item) => {
        setEditItem({
            id: item.id,
            name: item.name,
            description: item.description,
            price: item.price.toString(),
            img: item.img || ""
        });
        setShowEditModal(true);
    };

    const handleDeleteItem = async (id) => {
        if (window.confirm("Delete this dish?")) {
            try {
                await api.delete(`/restaurants/menu/${id}`);
                setMenu(menu.filter(item => item.id !== id));
                toast.success("Dish removed");
            } catch (err) {
                toast.error("Delete failed");
            }
        }
    };

    if (loading) return <div className="text-center py-5"><Spinner animation="grow" variant="danger" /></div>;
    if (!restaurant) return <Container className="mt-5 text-center"><Alert variant="info">Please contact Admin to link your account to a restaurant.</Alert></Container>;

    return (
        <div className="manage-menu-page bg-light py-5" style={{ minHeight: '100vh' }}>
            <Container>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="fw-bold mb-0">Menu Management</h2>
                        <p className="text-muted">{restaurant.name} &bull; {menu.length} Items</p>
                    </div>
                    <Button variant="danger" className="signup-btn rounded-pill px-4 shadow-sm" onClick={() => setShowModal(true)}>
                        + Add New Dish
                    </Button>
                </div>

                <Card className="border-0 shadow-sm overflow-hidden">
                    <Table hover responsive className="mb-0 align-middle">
                        <thead className="bg-white">
                            <tr>
                                <th className="ps-4">Dish</th>
                                <th>Name</th>
                                <th style={{ width: '40%' }}>Description</th>
                                <th>Price</th>
                                <th className="text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {menu.length === 0 ? (
                                <tr><td colSpan="5" className="text-center py-5 text-muted">No items in menu. Add your first dish!</td></tr>
                            ) : (
                                menu.map((item) => (
                                    <tr key={item.id}>
                                        <td className="ps-4">
                                            <img src={item.img || "https://placehold.co/60x60"} className="item-thumb shadow-sm" alt={item.name} />
                                        </td>
                                        <td className="fw-bold">{item.name}</td>
                                        <td className="text-muted small">{item.description}</td>
                                        <td className="fw-bold text-success">₹ {item.price}</td>
                                        <td className="text-center">
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                className="rounded-pill px-3 me-2"
                                                onClick={() => openEditModal(item)}
                                            >
                                                Edit
                                            </Button>
                                            <Button variant="outline-danger" size="sm" className="rounded-pill px-3" onClick={() => handleDeleteItem(item.id)}>
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </Table>
                </Card>
            </Container>

            {/* ADD ITEM MODAL */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="fw-bold">New Menu Item</Modal.Title>
                </Modal.Header>
                <Modal.Body className="pt-3">
                    <Form onSubmit={handleAddItem}>
                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-bold">Name</Form.Label>
                            <Form.Control type="text" required placeholder="Dish Name" className="py-2" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-bold">Description</Form.Label>
                            <Form.Control as="textarea" rows={3} placeholder="Tell us about the dish..." className="py-2" value={newItem.description} onChange={(e) => setNewItem({ ...newItem, description: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-bold">Price (₹)</Form.Label>
                            <Form.Control type="number" required placeholder="0.00" className="py-2" value={newItem.price} onChange={(e) => setNewItem({ ...newItem, price: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-4">
                            <Form.Label className="small fw-bold">Image Link</Form.Label>
                            <Form.Control type="text" placeholder="https://..." className="py-2" value={newItem.img} onChange={(e) => setNewItem({ ...newItem, img: e.target.value })} />
                        </Form.Group>
                        <Button variant="danger" type="submit" className="w-100 py-2 signup-btn shadow-sm" disabled={adding}>
                            {adding ? "Adding..." : "Add to Menu"}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* EDIT ITEM MODAL */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="fw-bold">Edit Menu Item</Modal.Title>
                </Modal.Header>
                <Modal.Body className="pt-3">
                    <Form onSubmit={handleEditItem}>
                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-bold">Name</Form.Label>
                            <Form.Control
                                type="text"
                                required
                                placeholder="Dish Name"
                                className="py-2"
                                value={editItem.name}
                                onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-bold">Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Tell us about the dish..."
                                className="py-2"
                                value={editItem.description}
                                onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-bold">Price (₹)</Form.Label>
                            <Form.Control
                                type="number"
                                required
                                placeholder="0.00"
                                className="py-2"
                                value={editItem.price}
                                onChange={(e) => setEditItem({ ...editItem, price: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-4">
                            <Form.Label className="small fw-bold">Image Link</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="https://..."
                                className="py-2"
                                value={editItem.img}
                                onChange={(e) => setEditItem({ ...editItem, img: e.target.value })}
                            />
                        </Form.Group>
                        <Button
                            variant="primary"
                            type="submit"
                            className="w-100 py-2 signup-btn shadow-sm"
                            disabled={editing}
                        >
                            {editing ? "Updating..." : "Update Menu Item"}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
}
