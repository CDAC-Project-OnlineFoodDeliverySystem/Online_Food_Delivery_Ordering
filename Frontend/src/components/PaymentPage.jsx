import React, { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { toast } from "react-toastify";
import { CartContext } from "../context/CartContext.jsx";
import { Container, Card, Form, Button, Alert, Spinner } from "react-bootstrap";

export default function PaymentPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { clearCart } = useContext(CartContext);

    // State from navigation
    const { orderData, paymentMethod, totalAmount } = location.state || {};

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // Simulation Inputs
    const [inputs, setInputs] = useState({});

    if (!orderData) {
        return <div className="text-center mt-5">No Order Data Found. Please going back to cart.</div>;
    }

    const handleInputChange = (e) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value });
    }

    const handlePayment = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Simulate Payment Delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            // 2. Place Order in Backend
            const finalPayload = {
                ...orderData,
                status: "PLACED" // Ensure initial status is PLACED
            };

            await api.post("/orders", finalPayload);

            // 3. Show Success
            setSuccess(true);
            clearCart();

            // Auto redirect after showing message
            setTimeout(() => {
                navigate("/orders");
            }, 4000);

        } catch (err) {
            console.error(err);
            toast.error("Payment Failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <Container className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
                <div className="text-center">
                    <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🎉🛵</div>
                    <h2 className="text-success mb-3">Order Placed Successfully!</h2>
                    <h4 className="text-primary mb-4">A Delivery Partner has been assigned.</h4>
                    <p className="text-muted">Redirecting to your orders...</p>
                </div>
            </Container>
        );
    }

    return (
        <Container className="py-5" style={{ maxWidth: "600px" }}>
            <h2 className="mb-4 text-center">Complete Your Payment</h2>
            <Card className="shadow-sm border-0">
                <Card.Header className="bg-white fw-bold">
                    Payment Method: <span className="text-primary">{paymentMethod}</span>
                </Card.Header>
                <Card.Body className="p-4">
                    <div className="mb-4 text-center">
                        <h5 className="text-muted">Total Amount</h5>
                        <h1 className="fw-bold">₹ {totalAmount}</h1>
                    </div>

                    <Form onSubmit={handlePayment}>
                        {/* Render fields based on Payment Method */}
                        {paymentMethod === 'Card' && (
                            <>
                                <Form.Group className="mb-3">
                                    <Form.Label>Card Number</Form.Label>
                                    <Form.Control required type="text" placeHolder="XXXX XXXX XXXX XXXX" maxLength="19" />
                                </Form.Group>
                                <div className="d-flex gap-3">
                                    <Form.Group className="mb-3 flex-fill">
                                        <Form.Label>Expiry</Form.Label>
                                        <Form.Control required type="text" placeHolder="MM/YY" maxLength="5" />
                                    </Form.Group>
                                    <Form.Group className="mb-3 flex-fill">
                                        <Form.Label>CVV</Form.Label>
                                        <Form.Control required type="password" placeHolder="123" maxLength="3" />
                                    </Form.Group>
                                </div>
                                <Form.Group className="mb-3">
                                    <Form.Label>Card Holder Name</Form.Label>
                                    <Form.Control required type="text" placeHolder="Name on card" />
                                </Form.Group>
                            </>
                        )}

                        {paymentMethod === 'UPI' && (
                            <Form.Group className="mb-3">
                                <Form.Label>UPI ID</Form.Label>
                                <Form.Control required type="text" placeHolder="username@bank" />
                                <Form.Text className="text-muted">
                                    We will send a payment request to this ID.
                                </Form.Text>
                            </Form.Group>
                        )}

                        {paymentMethod === 'COD' && (
                            <Alert variant="info" className="text-center">
                                Please keep <strong>₹ {totalAmount}</strong> cash ready for the delivery partner.
                            </Alert>
                        )}

                        <Button
                            variant="success"
                            size="lg"
                            type="submit"
                            className="w-100 mt-3"
                            disabled={loading}
                        >
                            {loading ? <><Spinner size="sm" animation="border" /> Processing...</> : `Pay ₹ ${totalAmount}`}
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}
