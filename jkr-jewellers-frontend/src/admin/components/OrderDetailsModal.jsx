import { useEffect, useState } from "react";
import adminApi from "../services/adminApi";
import "../css/OrderDetailsModal.css";

function OrderDetailsModal({ orderId, closeModal, refreshOrders }) {

    const [order, setOrder] = useState(null);
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    // ---------- Custom Popup ----------
    const [popup, setPopup] = useState({
        show: false,
        type: "",
        message: ""
    });

    const showPopup = (type, message) => {
        setPopup({
            show: true,
            type,
            message
        });

        setTimeout(() => {
            setPopup({
                show: false,
                type: "",
                message: ""
            });
        }, 2500);
    };
    // -------------------------------

    useEffect(() => {
        if (orderId) {
            loadOrder();
        }
    }, [orderId]);

    const loadOrder = async () => {

        setLoading(true);

        try {

            const response = await adminApi.get(`/orders/${orderId}`);

            setOrder(response.data);

            setStatus(response.data.orderStatus);

        } catch (error) {

            console.error(error);

            showPopup("error", "Unable to load order details.");

        } finally {

            setLoading(false);

        }

    };

    const updateStatus = async () => {

        setUpdating(true);

        try {

            await adminApi.put(

                `/orders/${orderId}/status`,

                null,

                {
                    params: { status }
                }

            );

            showPopup("success", "Order status updated successfully");

            if (refreshOrders) {

                refreshOrders();

            }

            setTimeout(() => {

                closeModal();

            }, 1200);

        } catch (error) {

            console.error(error);

            showPopup("error", "Unable to update order status.");

        } finally {

            setUpdating(false);

        }

    };

    return (

        <div className="modal-overlay">

            <div className="order-modal">

                {/* ---------- Popup ---------- */}
                {popup.show && (
                    <div className={`custom-popup ${popup.type}`}>
                        {popup.message}
                    </div>
                )}

                <h2>Order Details</h2>

                {loading ? (
                    <p className="order-loading">Loading...</p>
                ) : order && (
                    <> 
                        <div className="order-section">

                            <div className="order-row">
                                <span className="order-label">Order ID</span>
                                <span>#{order.orderId}</span>
                            </div>

                            <div className="order-row">
                                <span className="order-label">Order Date</span>
                                <span>
                                    {order.orderDate
                                        ? new Date(order.orderDate).toLocaleString()
                                        : "-"}
                                </span>
                            </div>

                            <div className="order-row">
                                <span className="order-label">Total Amount</span>
                                <span>₹ {order.totalAmount}</span>
                            </div>

                            <div className="order-row">
                                <span className="order-label">Payment Status</span>
                                <span>{order.paymentStatus}</span>
                            </div>

                        </div>

                        <div className="order-section">

                            <h3>Customer</h3>

                            <div className="order-row">
                                <span className="order-label">Name</span>
                                <span>{order.customerName}</span>
                            </div>

                            <div className="order-row">
                                <span className="order-label">Email</span>
                                <span>{order.customerEmail}</span>
                            </div>

                            <div className="order-row">
                                <span className="order-label">Phone</span>
                                <span>{order.customerPhone}</span>
                            </div>

                        </div>

                        {order.shippingAddress && (

                            <div className="order-section">

                                <h3>Shipping Address</h3>

                                <p className="address-text">

                                    {order.shippingAddress.addressLine1}

                                    {order.shippingAddress.addressLine2 &&
                                        `, ${order.shippingAddress.addressLine2}`}

                                    <br />

                                    {order.shippingAddress.city},
                                    {" "}
                                    {order.shippingAddress.state}
                                    {" - "}
                                    {order.shippingAddress.pincode}

                                    <br />

                                    Phone: {order.shippingAddress.phone}

                                </p>

                            </div>

                        )}

                        <div className="order-section">

                            <h3>Products Ordered</h3>

                            <table className="order-items-table">

                                <thead>

                                    <tr>
                                        <th>Image</th>
                                        <th>Product</th>
                                        <th>Qty</th>
                                        <th>Price</th>
                                    </tr>

                                </thead>

                                <tbody>

                                    {order.products && order.products.length > 0 ? (

                                        order.products.map((item, index) => (

                                            <tr key={index}>

                                                <td>
                                                    {item.productImage ? (
                                                        <img
                                                            src={item.productImage}
                                                            alt={item.productName}
                                                            className="order-item-thumbnail"
                                                        />
                                                    ) : (
                                                        <span className="order-item-no-image">No image</span>
                                                    )}
                                                </td>

                                                <td>
                                                    {item.productName}
                                                    <div className="order-item-id">ID: {item.productId}</div>
                                                </td>

                                                <td>{item.quantity}</td>

                                                <td>₹ {item.priceAtPurchase}</td>

                                            </tr>

                                        ))

                                    ) : (

                                        <tr>

                                            <td colSpan="4">

                                                No products found

                                            </td>

                                        </tr>

                                    )}

                                </tbody>

                            </table>

                        </div>

                        <div className="order-section">

                            <h3>Update Order Status</h3>

                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >

                                <option value="PENDING">Pending</option>
                                <option value="CONFIRMED">Confirmed</option>
                                <option value="SHIPPED">Shipped</option>
                                <option value="DELIVERED">Delivered</option>
                                <option value="CANCELLED">Cancelled</option>

                            </select>

                        </div>

                    </>

                )}

                <div className="modal-buttons">

                    <button
                        type="button"
                        className="cancel-btn"
                        onClick={closeModal}
                    >
                        Close
                    </button>

                    <button
                        type="button"
                        className="save-btn"
                        onClick={updateStatus}
                        disabled={loading || updating}
                    >
                        {updating ? "Updating..." : "Update Status"}
                    </button>

                </div>

            </div>

        </div>

    );

}

export default OrderDetailsModal;