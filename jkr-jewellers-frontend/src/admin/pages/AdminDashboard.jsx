import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import adminApi from "../services/adminApi";
import "../css/AdminDashboard.css";

function AdminDashboard() {

    const [stats, setStats] = useState({
        totalProducts: 0,
        totalCategories: 0,
        totalCustomers: 0,
        totalOrders: 0,
        revenue: 0,
        recentOrders: []
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {

        try {
            const response = await adminApi.get("/dashboard");
            setStats(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }

    };

    const statusClass = (status) => {
        switch (status) {
            case "DELIVERED": return "status-badge status-delivered";
            case "SHIPPED": return "status-badge status-shipped";
            case "CONFIRMED": return "status-badge status-confirmed";
            case "CANCELLED": return "status-badge status-cancelled";
            default: return "status-badge status-pending";
        }
    };

    return (
        <AdminLayout>

            <h1>Dashboard</h1>

            <div className="dashboard-cards">

                <div className="dashboard-card">
                    <h3>Total Products</h3>
                    <p>{stats.totalProducts}</p>
                </div>

                <div className="dashboard-card">
                    <h3>Total Categories</h3>
                    <p>{stats.totalCategories}</p>
                </div>

                <div className="dashboard-card">
                    <h3>Total Customers</h3>
                    <p>{stats.totalCustomers}</p>
                </div>

                <div className="dashboard-card">
                    <h3>Total Orders</h3>
                    <p>{stats.totalOrders}</p>
                </div>

                <div className="dashboard-card">
                    <h3>Revenue</h3>
                    <p>₹ {stats.revenue}</p>
                </div>

            </div>

            <div className="recent-orders-section">

                <h2>Recent Orders</h2>

                <div className="table-scroll-wrap">

                <table className="recent-orders-table">

                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Date</th>
                            <th>Total</th>
                            <th>Status</th>
                        </tr>
                    </thead>

                    <tbody>

                        {loading ? (
                            <tr>
                                <td colSpan="5" className="no-data">Loading...</td>
                            </tr>
                        ) : stats.recentOrders && stats.recentOrders.length > 0 ? (
                            stats.recentOrders.map((order) => (
                                <tr key={order.orderId}>
                                    <td>#{order.orderId}</td>
                                    <td>{order.customerName}</td>
                                    <td>
                                        {order.orderDate
                                            ? new Date(order.orderDate).toLocaleDateString()
                                            : "-"}
                                    </td>
                                    <td>₹ {order.totalAmount}</td>
                                    <td>
                                        <span className={statusClass(order.orderStatus)}>
                                            {order.orderStatus}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="no-data">No Recent Orders</td>
                            </tr>
                        )}

                    </tbody>

                </table>

                </div>

            </div>

        </AdminLayout>
    );

}

export default AdminDashboard;