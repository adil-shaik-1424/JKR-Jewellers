import { useEffect, useState, useRef } from "react";
import api from "../services/api";

import Header from "../components/Header/Header";
import Navbar from "../components/Navbar/Navbar";
import BackButton from "../components/BackButton/BackButton";

import "./MyAddresses.css";

function MyAddresses() {

    const [addresses, setAddresses] = useState([]);
    const [saving, setSaving] = useState(false);
    const savingRef = useRef(false);

    const [busyIds, setBusyIds] = useState(new Set());
    const busyRef = useRef(new Set());

    const [popup, setPopup] = useState({
        open: false,
        type: "success",
        message: ""
    });

    const [form, setForm] = useState({
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        pincode: "",
        phone: ""
    });

    useEffect(() => {
        fetchAddresses();
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

    const fetchAddresses = async () => {

        try {

            const response = await api.get("/addresses");

            setAddresses(response.data);

        } catch (error) {

            console.error(error);

            showPopup("error", "Unable to load addresses.");

        }

    };

    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

    };

    const saveAddress = async () => {

        if (savingRef.current) return;
        savingRef.current = true;
        setSaving(true);

        try {

            await api.post("/addresses", form);

            showPopup("success", "Address Added Successfully");

            setForm({
                addressLine1: "",
                addressLine2: "",
                city: "",
                state: "",
                pincode: "",
                phone: ""
            });

            await fetchAddresses();

        } catch (error) {

            console.error(error);

            showPopup("error", "Unable to add address.");

        } finally {

            savingRef.current = false;
            setSaving(false);

        }

    };

    const deleteAddress = async (id) => {

        if (busyRef.current.has(id)) return;

        busyRef.current.add(id);
        setBusyIds(new Set(busyRef.current));

        try {

            await api.delete(`/addresses/${id}`);

            showPopup("success", "Address Deleted Successfully");

            await fetchAddresses();

        } catch (error) {

            const message =
                error.response?.data?.message || "Unable to delete address.";

            showPopup("error", message);

            console.error(error);

        } finally {

            busyRef.current.delete(id);
            setBusyIds(new Set(busyRef.current));

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

            <div className="address-page">

                <h1>My Addresses</h1>

                <div className="address-form">

                    <input
                        name="addressLine1"
                        placeholder="Address Line 1"
                        value={form.addressLine1}
                        onChange={handleChange}
                    />

                    <input
                        name="addressLine2"
                        placeholder="Address Line 2"
                        value={form.addressLine2}
                        onChange={handleChange}
                    />

                    <input
                        name="city"
                        placeholder="City"
                        value={form.city}
                        onChange={handleChange}
                    />

                    <input
                        name="state"
                        placeholder="State"
                        value={form.state}
                        onChange={handleChange}
                    />

                    <input
                        name="pincode"
                        placeholder="Pincode"
                        value={form.pincode}
                        onChange={handleChange}
                    />

                    <input
                        name="phone"
                        placeholder="Phone Number"
                        value={form.phone}
                        onChange={handleChange}
                    />

                    <button
                        className="save-address-btn"
                        onClick={saveAddress}
                        disabled={saving}
                    >
                        {saving ? "Adding..." : "Add Address"}
                    </button>

                </div>

                <div className="address-list">

                    {
                        addresses.length === 0 ?

                            <h3>No Address Added</h3>

                            :

                            addresses.map((address) => (

                                <div
                                    className="saved-address-card"
                                    key={address.id}
                                >

                                    <p>
                                        <strong>{address.addressLine1}</strong>
                                    </p>

                                    {address.addressLine2 &&
                                        <p>{address.addressLine2}</p>
                                    }

                                    <p>
                                        {address.city}, {address.state}
                                    </p>

                                    <p>{address.pincode}</p>

                                    <p>{address.phone}</p>

                                    <button
                                        className="delete-address-btn"
                                        onClick={() => deleteAddress(address.id)}
                                        disabled={busyIds.has(address.id)}
                                    >
                                        {busyIds.has(address.id) ? "..." : "Delete"}
                                    </button>

                                </div>

                            ))
                    }

                </div>

            </div>

        </>

    );

}

export default MyAddresses;