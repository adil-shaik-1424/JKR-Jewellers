import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./../css/AdminLogin.css";

function AdminLogin() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [submitting, setSubmitting] = useState(false);
    const submittingRef = useRef(false);

    const [popup, setPopup] = useState({
        open: false,
        type: "success",
        message: ""
    });

    const navigate = useNavigate();

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

    const handleLogin = async (e) => {

        e.preventDefault();

        if (submittingRef.current) return;
        submittingRef.current = true;
        setSubmitting(true);

        try {

            const response = await api.post("/auth/login", {

                email,
                password

            });

            if (response.data.role !== "ADMIN") {

                showPopup(
                    "error",
                    "You are not authorized to access Admin Panel."
                );

                return;

            }

            localStorage.setItem("token", response.data.token);
            localStorage.setItem("adminEmail", response.data.email);
            localStorage.setItem("adminRole", response.data.role);

            navigate("/admin/dashboard");

        }

        catch (error) {

            console.error(error);

            showPopup("error", "Invalid Email or Password");

        }

        finally {

            submittingRef.current = false;
            setSubmitting(false);

        }

    };

    return (

        <div className="admin-login-container">

            {popup.open && (

                <div className={`popup ${popup.type}`}>

                    {popup.message}

                </div>

            )}

            <div className="admin-login-card">

                <h1>JKR Jewellers</h1>

                <h2>Admin Panel</h2>

                <p>Please login to continue</p>

                <form onSubmit={handleLogin}>

                    <div className="form-group">

                        <label>Email</label>

                        <input
                            type="email"
                            placeholder="Enter admin email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label>Password</label>

                        <input
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                    </div>

                    <button
                        type="submit"
                        className="login-btn"
                        disabled={submitting}
                    >
                        {submitting ? "Logging in..." : "Login"}
                    </button>

                </form>

            </div>

        </div>

    );

}

export default AdminLogin;