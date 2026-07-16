import { useEffect, useState } from "react";
import api from "../services/api";

import Header from "../components/Header/Header";
import Navbar from "../components/Navbar/Navbar";
import BackButton from "../components/BackButton/BackButton";

import "./MyProfile.css";

function MyProfile() {

    const [profile, setProfile] = useState({
        name: "",
        email: "",
        phone: "",
        role: ""
    });

    const [popup, setPopup] = useState({
        open: false,
        type: "success",
        message: ""
    });

    useEffect(() => {
        fetchProfile();
    }, []);

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

    const fetchProfile = async () => {

        try {

            const response = await api.get("/users/profile");

            setProfile(response.data);

        } catch (error) {

            console.error(error);

        }

    };

    const handleChange = (e) => {

        setProfile({
            ...profile,
            [e.target.name]: e.target.value
        });

    };

    const updateProfile = async () => {

        try {

            await api.put("/users/profile", {
                name: profile.name,
                phone: profile.phone
            });

            showPopup("success", "Profile Updated Successfully");

        } catch (error) {

            console.error(error);

            showPopup("error", "Unable to update profile.");

        }

    };

    return (

        <>
            {popup.open && (
                <div className={`popup ${popup.type}`}>
                    {popup.message}
                </div>
            )}

            <Header />
            <Navbar />
            <BackButton />

            <div className="profile-page">

                <h1>My Profile</h1>

                <div className="profile-card">

                    <label>Name</label>

                    <input
                        type="text"
                        name="name"
                        value={profile.name}
                        onChange={handleChange}
                    />

                    <label>Email</label>

                    <input
                        type="email"
                        value={profile.email}
                        disabled
                    />

                    <label>Phone</label>

                    <input
                        type="text"
                        name="phone"
                        value={profile.phone || ""}
                        onChange={handleChange}
                    />

                    <label>Role</label>

                    <input
                        type="text"
                        value={profile.role}
                        disabled
                    />

                    <button
                        className="save-btn"
                        onClick={updateProfile}
                    >
                        Save Changes
                    </button>

                </div>

            </div>

        </>
    );

}

export default MyProfile;