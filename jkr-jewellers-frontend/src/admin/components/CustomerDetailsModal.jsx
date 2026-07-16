import { useEffect, useState } from "react";
import adminApi from "../services/adminApi";
import "../css/CustomerDetailsModal.css";

function CustomerDetailsModal({ customerId, closeModal }) {

    const [customer, setCustomer] = useState(null);

    const [loading, setLoading] = useState(true);

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

        if (customerId) {

            loadCustomer();

        }

    }, [customerId]);

    const loadCustomer = async () => {

        setLoading(true);

        try {

            const response = await adminApi.get(
                `/customers/${customerId}`
            );

            setCustomer(response.data);

        }

        catch (error) {

            console.error(error);

            showPopup(
                "error",
                "Unable to load customer details."
            );

        }

        finally {

            setLoading(false);

        }

    };
    return (

    <div className="modal-overlay">

        {popup.open && (

            <div className={`popup ${popup.type}`}>

                {popup.message}

            </div>

        )}

        <div className="customer-modal">

            <h2>Customer Details</h2>

            {

                loading ?

                    <p className="customer-loading">

                        Loading...

                    </p>

                    :

                    customer && (

                        <>

                            <div className="customer-section">

                                <div className="customer-row">

                                    <span className="customer-label">

                                        Name

                                    </span>

                                    <span>

                                        {customer.name}

                                    </span>

                                </div>

                                <div className="customer-row">

                                    <span className="customer-label">

                                        Email

                                    </span>

                                    <span>

                                        {customer.email}

                                    </span>

                                </div>

                                <div className="customer-row">

                                    <span className="customer-label">

                                        Phone

                                    </span>

                                    <span>

                                        {customer.phone}

                                    </span>

                                </div>

                                <div className="customer-row">

                                    <span className="customer-label">

                                        Joined

                                    </span>

                                    <span>

                                        {

                                            customer.joinedDate

                                                ?

                                                new Date(
                                                    customer.joinedDate
                                                ).toLocaleDateString()

                                                :

                                                "-"

                                        }

                                    </span>

                                </div>

                                <div className="customer-row">

                                    <span className="customer-label">

                                        Total Orders

                                    </span>

                                    <span>

                                        {customer.ordersCount}

                                    </span>

                                </div>

                                <div className="customer-row">

                                    <span className="customer-label">

                                        Total Spent

                                    </span>

                                    <span>

                                        ₹ {customer.totalSpent}

                                    </span>

                                </div>

                            </div>

                            <div className="customer-section">

                                <h3>

                                    Addresses

                                </h3>

                                {

                                    customer.addresses &&
                                    customer.addresses.length > 0

                                        ?

                                        customer.addresses.map((address) => (

                                            <p
                                                key={address.id}
                                                className="address-text"
                                            >

                                                {address.addressLine1}

                                                {

                                                    address.addressLine2 &&

                                                    `, ${address.addressLine2}`

                                                }

                                                <br />

                                                {address.city},{" "}

                                                {address.state} -{" "}

                                                {address.pincode}

                                                <br />

                                                Phone: {address.phone}

                                            </p>

                                        ))

                                        :

                                        <p className="no-data-text">

                                            No addresses saved

                                        </p>

                                }

                            </div>

                            <div className="customer-section">

                                <h3>

                                    Order History

                                </h3>

                                <table className="customer-orders-table">

                                    <thead>

                                        <tr>

                                            <th>Order ID</th>

                                            <th>Date</th>

                                            <th>Status</th>

                                            <th>Amount</th>

                                        </tr>

                                    </thead>

                                    <tbody>

                                        {

                                            customer.orders &&
                                            customer.orders.length > 0

                                                ?

                                                customer.orders.map((order) => (

                                                    <tr key={order.orderId}>

                                                        <td>

                                                            #{order.orderId}

                                                        </td>

                                                        <td>

                                                            {

                                                                order.createdAt

                                                                    ?

                                                                    new Date(
                                                                        order.createdAt
                                                                    ).toLocaleDateString()

                                                                    :

                                                                    "-"

                                                            }

                                                        </td>

                                                        <td>

                                                            {order.status}

                                                        </td>

                                                        <td>

                                                            ₹ {order.totalAmount}

                                                        </td>

                                                    </tr>

                                                ))

                                                :

                                                <tr>

                                                    <td colSpan="4">

                                                        No orders yet

                                                    </td>

                                                </tr>

                                        }

                                    </tbody>

                                </table>

                            </div>

                        </>

                    )

            }

            <div className="modal-buttons">

                <button
                    type="button"
                    className="cancel-btn"
                    onClick={closeModal}
                >

                    Close

                </button>

            </div>

        </div>

    </div>

);

}

export default CustomerDetailsModal;