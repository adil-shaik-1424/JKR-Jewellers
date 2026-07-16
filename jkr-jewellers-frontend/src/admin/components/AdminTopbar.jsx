import { useNavigate } from "react-router-dom";
import "../css/AdminTopbar.css";

function AdminTopbar({ onToggleSidebar }) {

    const navigate = useNavigate();

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("role");

        navigate("/admin/login");

    };

    return (

        <header className="admin-topbar">

            <div className="topbar-left">

                <button
                    className="sidebar-toggle-btn"
                    onClick={onToggleSidebar}
                    aria-label="Toggle sidebar"
                >
                    ☰
                </button>

                <h2>JKR Jewellers Admin Panel</h2>

            </div>

            <button
                onClick={handleLogout}
                className="logout-btn"
            >
                Logout
            </button>

        </header>

    );

}

export default AdminTopbar;