import { useState, useRef } from "react";
import api from "../services/api";

import Header from "../components/Header/Header";
import Navbar from "../components/Navbar/Navbar";
import BackButton from "../components/BackButton/BackButton";

import "./ChangePassword.css";

function ChangePassword() {

    const [form, setForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [submitting, setSubmitting] = useState(false);
    const submittingRef = useRef(false);

    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async () => {

        if (submittingRef.current) return;

        if (
            form.currentPassword.trim() === "" ||
            form.newPassword.trim() === "" ||
            form.confirmPassword.trim() === ""
        ) {

            alert("Please fill all fields");

            return;

        }

        if (form.newPassword !== form.confirmPassword) {

            alert("Passwords do not match");

            return;

        }

        submittingRef.current = true;
        setSubmitting(true);

        try {

            await api.put("/users/change-password", {
                currentPassword: form.currentPassword,
                newPassword: form.newPassword
            });

            alert("Password changed successfully");

            setForm({
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            });

        } catch (error) {

    console.error(error);

    const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.response?.data ||
        "Unable to change password.";

    alert(message);

} finally {

    submittingRef.current = false;
    setSubmitting(false);

}

    };

    return (

        <>
            <Header />
            <Navbar />
            <BackButton />

            <div className="change-password-page">

                <div className="password-card">

                    <h2>Change Password</h2>

                    <input
                        type="password"
                        name="currentPassword"
                        placeholder="Current Password"
                        value={form.currentPassword}
                        onChange={handleChange}
                    />

                    <input
                        type="password"
                        name="newPassword"
                        placeholder="New Password"
                        value={form.newPassword}
                        onChange={handleChange}
                    />

                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm New Password"
                        value={form.confirmPassword}
                        onChange={handleChange}
                    />

                    <button onClick={handleSubmit} disabled={submitting}>
                        {submitting ? "Updating..." : "Update Password"}
                    </button>

                </div>

            </div>

        </>

    );

}

export default ChangePassword;