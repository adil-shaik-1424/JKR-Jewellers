import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";
import "../css/AdminLayout.css";

function AdminLayout({ children }) {

    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (

        <div className="admin-layout">

            <AdminSidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {sidebarOpen && (
                <div
                    className="admin-sidebar-backdrop"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <div className="admin-main">

                <AdminTopbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

                <div className="admin-page">

                    {children}

                </div>

            </div>

        </div>

    );

}

export default AdminLayout;