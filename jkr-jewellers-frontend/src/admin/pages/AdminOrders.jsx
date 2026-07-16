import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import OrderDetailsModal from "../components/OrderDetailsModal";
import adminApi from "../services/adminApi";
import "../css/AdminOrders.css";

function AdminOrders() {

    const [orders, setOrders] = useState([]);

    const [showModal, setShowModal] = useState(false);

    const [selectedOrderId, setSelectedOrderId] = useState(null);

    const [popup, setPopup] = useState({
        open: false,
        type: "success",
        message: ""
    });

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

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {

        try {

            const response = await adminApi.get("/orders");

            setOrders(response.data);

        }

        catch (error) {

            console.error(error);

            showPopup("error", "Unable to load orders.");

        }

    };

    const viewOrder = (orderId) => {

        setSelectedOrderId(orderId);

        setShowModal(true);

    };

    const closeModal = () => {

        setShowModal(false);

        setSelectedOrderId(null);

    };

    const statusClass = (status) => {

        switch (status) {

            case "DELIVERED":
                return "status-badge status-delivered";

            case "SHIPPED":
                return "status-badge status-shipped";

            case "CONFIRMED":
                return "status-badge status-confirmed";

            case "CANCELLED":
                return "status-badge status-cancelled";

            default:
                return "status-badge status-pending";

        }

    };

    const paymentClass = (status) => {

        switch (status) {

            case "SUCCESS":
                return "payment-badge payment-success";

            case "FAILED":
                return "payment-badge payment-failed";

            default:
                return "payment-badge payment-pending";

        }

    };
    return (

    <AdminLayout>

        {popup.open && (

            <div className={`popup ${popup.type}`}>

                {popup.message}

            </div>

        )}

        <div className="orders-header">

            <h1>Orders</h1>

        </div>

        <table className="orders-table">

            <thead>

                <tr>

                    <th>Order ID</th>

                    <th>Customer</th>

                    <th>Date</th>

                    <th>Total</th>

                    <th>Payment</th>

                    <th>Status</th>

                    <th>Actions</th>

                </tr>

            </thead>

            <tbody>

                {

                    orders.length > 0 ?

                        orders.map((order) => (

                            <tr key={order.orderId}>

                                <td>

                                    #{order.orderId}

                                </td>

                                <td>

                                    {order.customerName}

                                </td>

                                <td>

                                    {

                                        order.orderDate

                                            ?

                                            new Date(order.orderDate).toLocaleDateString()

                                            :

                                            "-"

                                    }

                                </td>

                                <td>

                                    ₹ {order.totalAmount}

                                </td>

                                <td>

                                    <span className={paymentClass(order.paymentStatus)}>

                                        {order.paymentStatus}

                                    </span>

                                </td>

                                <td>

                                    <span className={statusClass(order.orderStatus)}>

                                        {order.orderStatus}

                                    </span>

                                </td>

                                <td>

                                    <button
                                        className="view-order-btn"
                                        onClick={() => viewOrder(order.orderId)}
                                    >

                                        View

                                    </button>

                                </td>

                            </tr>

                        ))

                        :

                        <tr>

                            <td
                                colSpan="7"
                                className="no-orders"
                            >

                                No Orders Found

                            </td>

                        </tr>

                }

            </tbody>

        </table>

        {

            showModal &&

            <OrderDetailsModal

                orderId={selectedOrderId}

                closeModal={closeModal}

                refreshOrders={loadOrders}

            />

        }

    </AdminLayout>

);

}

export default AdminOrders;