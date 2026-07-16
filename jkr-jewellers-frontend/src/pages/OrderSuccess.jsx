import { useNavigate, useSearchParams } from "react-router-dom";

import Header from "../components/Header/Header";
import Navbar from "../components/Navbar/Navbar";

import "./OrderSuccess.css";

function OrderSuccess() {

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const orderId = searchParams.get("orderId");

    return (

        <>
            <Header />
            <Navbar />

            <div className="order-success-page">

                <div className="success-icon">✓</div>

                <h1>Order Placed Successfully!</h1>

                <p>
                    {orderId
                        ? `Your order #${orderId} has been confirmed.`
                        : "Your order has been confirmed."}
                </p>

                <p className="success-subtext">
                    A confirmation email has been sent to you.
                </p>

                <div className="success-buttons">

                    <button
                        className="view-orders-btn"
                        onClick={() => navigate("/orders")}
                    >
                        View My Orders
                    </button>

                    <button
                        className="continue-shopping-btn"
                        onClick={() => navigate("/products")}
                    >
                        Continue Shopping
                    </button>

                </div>

            </div>

        </>

    );

}

export default OrderSuccess;