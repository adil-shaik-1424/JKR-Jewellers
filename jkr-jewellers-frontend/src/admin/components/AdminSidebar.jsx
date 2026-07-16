import { NavLink } from "react-router-dom";
import "../css/AdminSidebar.css";

function AdminSidebar({ isOpen, onClose }) {

    return (

        <div className={`admin-sidebar ${isOpen ? "open" : ""}`}>

            <h2 className="sidebar-logo">
                JKR Admin
            </h2>

            <nav>

                <NavLink to="/admin/dashboard" className="sidebar-link" onClick={onClose}>
                    Dashboard
                </NavLink>

                <NavLink to="/admin/categories" className="sidebar-link" onClick={onClose}>
                    Categories
                </NavLink>

                <NavLink to="/admin/products" className="sidebar-link" onClick={onClose}>
                    Products
                </NavLink>

                <NavLink to="/admin/orders" className="sidebar-link" onClick={onClose}>
                    Orders
                </NavLink>

                <NavLink to="/admin/customers" className="sidebar-link" onClick={onClose}>
                    Customers
                </NavLink>

                <NavLink to="/admin/banners" className="sidebar-link" onClick={onClose}>
                    Settings
                </NavLink>

            </nav>

        </div>

    );

}

export default AdminSidebar;