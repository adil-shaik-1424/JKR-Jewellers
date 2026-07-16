import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import CustomerDetailsModal from "../components/CustomerDetailsModal";
import adminApi from "../services/adminApi";
import "../css/AdminCustomers.css";

function AdminCustomers() {

    const [customers, setCustomers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedCustomerId, setSelectedCustomerId] = useState(null);

    useEffect(() => {
        loadCustomers();
    }, []);

    const loadCustomers = async () => {
        try {
            const response = await adminApi.get("/customers");
            setCustomers(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const viewCustomer = (customerId) => {
        setSelectedCustomerId(customerId);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedCustomerId(null);
    };

    return (
        <AdminLayout>
            <div className="customers-header">
                <h2>Customers</h2>
            </div>

            <table className="customers-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Orders</th>
                        <th>Total Spent</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {customers.length > 0 ? (
                        customers.map(customer => (
                            <tr key={customer.id}>
                                <td>{customer.id}</td>
                                <td>{customer.name}</td>
                                <td>{customer.email}</td>
                                <td>{customer.phone}</td>
                                <td>{customer.ordersCount}</td>
                                <td>₹ {customer.totalSpent}</td>
                                <td>
                                    <button
                                        className="view-btn"
                                        onClick={() => viewCustomer(customer.id)}
                                    >
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="no-data">
                                No Customers Found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {showModal && (
                <CustomerDetailsModal
                    customerId={selectedCustomerId}
                    closeModal={closeModal}
                />
            )}
        </AdminLayout>
    );
}

export default AdminCustomers;