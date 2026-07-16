import { useNavigate } from "react-router-dom";

import Header from "../components/Header/Header";
import Navbar from "../components/Navbar/Navbar";

import "./PaymentFailed.css";

function PaymentFailed() {

    const navigate = useNavigate();

    return (

        <>
            <Header />
            <Navbar />

            <div className="payment-failed-page">

                <div className="failed-card">

                    <div className="failed-icon">
                        ❌
                    </div>

                    <h1>Payment Failed</h1>

                    <p>

                        Unfortunately your payment could not be completed.

                    </p>

                    <ul>

                        <li>Payment Cancelled</li>

                        <li>Bank Declined the Transaction</li>

                        <li>Network Issue</li>

                    </ul>

                    <div className="failed-buttons">

                        <button
                            onClick={() => navigate("/checkout")}
                        >
                            Retry Payment
                        </button>

                        <button
                            onClick={() => navigate("/orders")}
                        >
                            My Orders
                        </button>

                        <button
                            onClick={() => navigate("/")}
                        >
                            Continue Shopping
                        </button>

                    </div>

                </div>

            </div>

        </>

    );

}

export default PaymentFailed;