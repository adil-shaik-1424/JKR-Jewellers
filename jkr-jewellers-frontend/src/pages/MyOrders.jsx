import { useEffect, useState } from "react";
import api from "../services/api";

import Header from "../components/Header/Header";
import Navbar from "../components/Navbar/Navbar";
import BackButton from "../components/BackButton/BackButton";

import "./MyOrders.css";

function MyOrders() {

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const [popup, setPopup] = useState({
        open: false,
        type: "success",
        message: ""
    });

    useEffect(() => {
        fetchOrders();
    }, []);

    const showPopup = (type, message) => {

        setPopup({
            open: true,
            type,
            message
        });

        setTimeout(() => {
            setPopup(prev => ({
                ...prev,
                open: false
            }));
        }, 3000);

    };

    const fetchOrders = async () => {

        try {

            const response = await api.get("/orders");

            setOrders(response.data);

        } catch (error) {

            console.error(error);

            showPopup("error", "Unable to load your orders.");

        } finally {

            setLoading(false);

        }

    };

    const formatDate = (dateString) => {

        if (!dateString) return "";

        const date = new Date(dateString);

        return date.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });

    };

    return (

        <>
            {popup.open && (
                <div className={`popup ${popup.type}`}>
                    {popup.message}
                </div>
            )}

            <Header />
            <Navbar />
            <BackButton />

            <div className="orders-page">

                <h1>My Orders</h1>

                {

                    loading ?

                        <h3>Loading your orders...</h3>

                    : orders.length === 0 ?

                        <h3>No Orders Yet</h3>

                    :

                        orders.map((order) => (

                            <div
                                className="order-card"
                                key={order.orderId}
                            >

                                <div className="order-top">

                                    <h3>Order #{order.orderId}</h3>

                                    <p>{formatDate(order.createdAt)}</p>

                                    <span className={`status status-${order.status?.toLowerCase()}`}>
                                        {order.status}
                                    </span>

                                </div>

                                {

                                    order.items?.map((item) => (

                                        <div
                                            className="order-item"
                                            key={item.productId}
                                        >

                                            <h4>{item.productName}</h4>

                                            <p>
                                                Qty: {item.quantity} &nbsp;•&nbsp;
                                                ₹{item.priceAtPurchase} each
                                            </p>

                                        </div>

                                    ))

                                }

                                <div className="order-total">

                                    <h2>Total: ₹{order.totalAmount}</h2>

                                </div>

                            </div>

                        ))

                }

            </div>

        </>

    );

}

export default MyOrders;