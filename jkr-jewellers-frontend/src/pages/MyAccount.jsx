import { useNavigate } from "react-router-dom";

import Header from "../components/Header/Header";
import Navbar from "../components/Navbar/Navbar";
import BackButton from "../components/BackButton/BackButton";

import { logout } from "../services/auth";

import {
    FaUser,
    FaBoxOpen,
    FaMapMarkerAlt,
    FaKey,
    FaSignOutAlt
} from "react-icons/fa";

import "./MyAccount.css";

function MyAccount() {

    const navigate = useNavigate();

    const handleLogout = () => {

    logout();

    window.location.href = "/";

};

    return (

        <>
            <Header />
            <Navbar />
            <BackButton />

            <div className="account-page">

                <h1>My Account</h1>

                <div className="account-grid">

                    <div
                        className="account-card"
                        onClick={() => navigate("/profile")}
                    >
                        <FaUser className="account-icon" />

                        <h3>My Profile</h3>

                        <p>
                            View and update your personal details.
                        </p>

                    </div>

                    <div
                        className="account-card"
                        onClick={() => navigate("/orders")}
                    >
                        <FaBoxOpen className="account-icon" />

                        <h3>My Orders</h3>

                        <p>
                            Track your jewellery orders.
                        </p>

                    </div>

                    <div
                        className="account-card"
                        onClick={() => navigate("/addresses")}
                    >
                        <FaMapMarkerAlt className="account-icon" />

                        <h3>My Addresses</h3>

                        <p>
                            Manage delivery addresses.
                        </p>

                    </div>

                    <div
                        className="account-card"
                        onClick={() => navigate("/change-password")}
                    >
                        <FaKey className="account-icon" />

                        <h3>Change Password</h3>

                        <p>
                            Update your account password.
                        </p>

                    </div>

                    <div
                        className="account-card logout-card"
                        onClick={handleLogout}
                    >
                        <FaSignOutAlt className="account-icon" />

                        <h3>Logout</h3>

                        <p>
                            Sign out from your account.
                        </p>

                    </div>

                </div>

            </div>

        </>

    );

}

export default MyAccount;