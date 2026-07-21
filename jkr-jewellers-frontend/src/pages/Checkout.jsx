import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

import Header from "../components/Header/Header";
import Navbar from "../components/Navbar/Navbar";
import BackButton from "../components/BackButton/BackButton";
import Popup from "../components/Popup/Popup";

import "./Checkout.css";

const RAZORPAY_KEY_ID = "rzp_test_T4xzOypZNit2gb";

function Checkout() {

    const navigate = useNavigate();

    const [addresses, setAddresses] = useState([]);
    const [cart, setCart] = useState(null);
    const [selectedAddress, setSelectedAddress] = useState("");
    const [processing, setProcessing] = useState(false);
    const placingOrderRef = useRef(false);

    const [savingAddress, setSavingAddress] = useState(false);
    const savingAddressRef = useRef(false);

    const [popup, setPopup] = useState({
        show: false,
        type: "",
        message: ""
    });

    const [newAddress, setNewAddress] = useState({
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        pincode: "",
        phone: ""
    });

    useEffect(() => {
        fetchAddresses();
        fetchCart();
    }, []);

    const fetchAddresses = async () => {

        try {

            const response = await api.get("/addresses");

            setAddresses(response.data);

            if (response.data.length > 0) {
                setSelectedAddress(response.data[0].id);
            }

        } catch (error) {

            console.error(error);

            setPopup({
                show: true,
                type: "error",
                message: "Unable to load addresses."
            });

        }

    };

    const fetchCart = async () => {

        try {

            const response = await api.get("/cart");

            setCart(response.data);

        } catch (error) {

            console.error(error);

            setPopup({
                show: true,
                type: "error",
                message: "Unable to load cart."
            });

        }

    };

    const handleChange = (e) => {

        setNewAddress({
            ...newAddress,
            [e.target.name]: e.target.value
        });

    };

    const saveAddress = async () => {

        if (savingAddressRef.current) return;
        savingAddressRef.current = true;
        setSavingAddress(true);

        try {

            await api.post("/addresses", newAddress);

            setPopup({
                show: true,
                type: "success",
                message: "Address added successfully."
            });

            await fetchAddresses();

            setNewAddress({
                addressLine1: "",
                addressLine2: "",
                city: "",
                state: "",
                pincode: "",
                phone: ""
            });

        } catch (error) {

            console.error(error);

            setPopup({
                show: true,
                type: "error",
                message: "Unable to save address."
            });

        } finally {

            savingAddressRef.current = false;
            setSavingAddress(false);

        }

    };

    const loadRazorpayScript = () => {

        return new Promise((resolve) => {

            if (window.Razorpay) {
                resolve(true);
                return;
            }

            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);

        });

    };

    const placeOrder = async () => {

        if (placingOrderRef.current) return;

        if (!selectedAddress) {

            setPopup({
                show: true,
                type: "error",
                message: "Please select a shipping address."
            });

            return;

        }

        placingOrderRef.current = true;
        setProcessing(true);

        try {

            const scriptLoaded = await loadRazorpayScript();

            if (!scriptLoaded) {

                setPopup({
                    show: true,
                    type: "error",
                    message: "Unable to load payment gateway. Please check your connection."
                });

                return;

            }

            const orderResponse = await api.post("/orders", {
                addressId: selectedAddress
            });

            const orderId = orderResponse.data.orderId;

            const paymentResponse = await api.post("/payments/create", {
                orderId
            });

            const payment = paymentResponse.data;

            const options = {

                key: RAZORPAY_KEY_ID,

                amount: Number(payment.amount) * 100,

                currency: payment.currency,

                name: "JKR Jewellers",

                description: `Order #${orderId}`,

                order_id: payment.razorpayOrderId,

                handler: async function (response) {

                    try {

                        await api.post("/payments/verify", {

                            razorpayOrderId: payment.razorpayOrderId,

                            razorpayPaymentId: response.razorpay_payment_id,

                            razorpaySignature: response.razorpay_signature

                        });

                        navigate(`/order-success?orderId=${orderId}`);

                    } catch (error) {

                        console.error(error);

                        setPopup({
                            show: true,
                            type: "error",
                            message: "Payment verification failed."
                        });

                    }

                },

                modal: {

                    ondismiss: function () {

                        navigate("/payment-failed");

                    }

                },

                prefill: {

                    email: localStorage.getItem("email") || ""

                },

                theme: {

                    color: "#b08d57"

                }

            };

            const razorpay = new window.Razorpay(options);

            razorpay.on("payment.failed", function () {

                navigate("/payment-failed");

            });

            razorpay.open();

        } catch (error) {

            console.error(error);

            setPopup({
                show: true,
                type: "error",
                message: "Unable to place order."
            });

        } finally {

            placingOrderRef.current = false;
            setProcessing(false);

        }

    };

    if (!cart) {

        return <h2>Loading...</h2>;

    }

    return (

        <>
            <Header />
            <Navbar />
            <BackButton />

            <div className="checkout-page">

                <div className="checkout-left">

                    <h2>Shipping Address</h2>

                    {addresses.map((address) => (

                        <label
                            key={address.id}
                            className="address-card"
                        >

                            <input
                                type="radio"
                                checked={selectedAddress === address.id}
                                onChange={() => setSelectedAddress(address.id)}
                            />

                            <div>

                                <h4>{address.addressLine1}</h4>

                                <p>{address.addressLine2}</p>

                                <p>
                                    {address.city}, {address.state}
                                </p>

                                <p>{address.pincode}</p>

                                <p>{address.phone}</p>

                            </div>

                        </label>

                    ))}

                    <h3>Add New Address</h3>

                    <input
                        name="addressLine1"
                        placeholder="Address Line 1"
                        value={newAddress.addressLine1}
                        onChange={handleChange}
                    />

                    <input
                        name="addressLine2"
                        placeholder="Address Line 2"
                        value={newAddress.addressLine2}
                        onChange={handleChange}
                    />

                    <input
                        name="city"
                        placeholder="City"
                        value={newAddress.city}
                        onChange={handleChange}
                    />

                    <input
                        name="state"
                        placeholder="State"
                        value={newAddress.state}
                        onChange={handleChange}
                    />

                    <input
                        name="pincode"
                        placeholder="Pincode"
                        value={newAddress.pincode}
                        onChange={handleChange}
                    />

                    <input
                        name="phone"
                        placeholder="Phone"
                        value={newAddress.phone}
                        onChange={handleChange}
                    />

                    <button
                        className="save-btn"
                        onClick={saveAddress}
                        disabled={savingAddress}
                    >
                        {savingAddress ? "Saving..." : "Save Address"}
                    </button>

                </div>

                <div className="checkout-right">

                    <h2>Order Summary</h2>

                    {cart.items.map((item) => (

                        <div
                            className="summary-item"
                            key={item.cartItemId}
                        >

                            <h4>{item.productName}</h4>

                            <p>Qty : {item.quantity}</p>

                            <p>₹ {item.subtotal}</p>

                        </div>

                    ))}

                    <hr />

                    <h2>

                        Total : ₹ {cart.totalAmount}

                    </h2>

                    <button
                        className="place-order-btn"
                        onClick={placeOrder}
                        disabled={processing}
                    >
                        {processing
                            ? "Processing..."
                            : "Proceed to Payment"}
                    </button>

                </div>

            </div>

            <Popup
                show={popup.show}
                type={popup.type}
                message={popup.message}
                onClose={() =>
                    setPopup({
                        show: false,
                        type: "",
                        message: ""
                    })
                }
            />

        </>

    );

}

export default Checkout;