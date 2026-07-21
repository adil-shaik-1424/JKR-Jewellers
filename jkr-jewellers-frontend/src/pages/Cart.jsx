import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

import Header from "../components/Header/Header";
import Navbar from "../components/Navbar/Navbar";
import BackButton from "../components/BackButton/BackButton";

import "./Cart.css";

function Cart() {

    const navigate = useNavigate();

    const [cart, setCart] = useState(null);
    const [busyItems, setBusyItems] = useState(new Set());
    const busyRef = useRef(new Set());

    const [popup, setPopup] = useState({
        open: false,
        type: "success",
        message: ""
    });

    useEffect(() => {
        fetchCart();
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

    const fetchCart = async () => {

        try {

            const response = await api.get("/cart");

            setCart(response.data);

        } catch (error) {

            console.error(error);

            showPopup("error", "Unable to load cart.");

        }

    };

    const withItemLock = async (cartItemId, fn) => {

        if (busyRef.current.has(cartItemId)) return;

        busyRef.current.add(cartItemId);
        setBusyItems(new Set(busyRef.current));

        try {
            await fn();
        } finally {
            busyRef.current.delete(cartItemId);
            setBusyItems(new Set(busyRef.current));
        }

    };

    const increaseQuantity = (item) => withItemLock(item.cartItemId, async () => {

        try {

            await api.put(
                `/cart/${item.cartItemId}?quantity=${item.quantity + 1}`
            );

            await fetchCart();

        } catch (error) {

            console.error(error);

            showPopup("error", "Unable to update quantity.");

        }

    });

    const decreaseQuantity = (item) => withItemLock(item.cartItemId, async () => {

        try {

            if (item.quantity === 1) {

                await removeItemInternal(item.cartItemId);

                return;

            }

            await api.put(
                `/cart/${item.cartItemId}?quantity=${item.quantity - 1}`
            );

            await fetchCart();

        } catch (error) {

            console.error(error);

            showPopup("error", "Unable to update quantity.");

        }

    });

    const removeItemInternal = async (cartItemId) => {

        try {

            await api.delete(`/cart/${cartItemId}`);

            await fetchCart();

            showPopup("success", "Item removed from cart.");

        } catch (error) {

            console.error(error);

            showPopup("error", "Unable to remove item.");

        }

    };

    const removeItem = (cartItemId) => withItemLock(cartItemId, () => removeItemInternal(cartItemId));

    if (!cart) {

        return <h2>Loading Cart...</h2>;

    }

    const availableItems = cart.items.filter(
        (item) => item.status === "AVAILABLE"
    );

    const hasUnavailableItem = cart.items.some(
        (item) => item.status !== "AVAILABLE"
    );

    const availableTotal = availableItems.reduce(
        (sum, item) => sum + item.subtotal,
        0
    );

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

            <div className="cart-page">

                <h2>Your Shopping Cart</h2>

                {cart.items.length === 0 ? (

                    <h3 className="empty-cart">
                        Your Cart is Empty
                    </h3>

                ) : (

                    <div className="cart-container">

                        <div className="cart-items">

                            {cart.items.map((item) => {

                                const isUnavailable = item.status !== "AVAILABLE";
                                const isBusy = busyItems.has(item.cartItemId);

                                return (

                                    <div
                                        className={`cart-item ${isUnavailable ? "unavailable" : ""}`}
                                        key={item.cartItemId}
                                    >

                                        <img
                                            src={item.imageUrls?.[0] || "/placeholder.jpg"}
                                            alt={item.productName}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "/placeholder.jpg";
                                            }}
                                        />

                                        <div className="item-details">

                                            <h3>{item.productName}</h3>

                                            {isUnavailable && (
                                                <span className="unavailable-badge">
                                                    {item.status === "OUT_OF_STOCK"
                                                        ? "Out of Stock"
                                                        : "Unavailable"}
                                                </span>
                                            )}

                                            <p>
                                                <strong>Price :</strong> ₹ {item.price}
                                            </p>

                                            <div className="quantity-box">

                                                <button
                                                    disabled={isUnavailable || isBusy}
                                                    onClick={() => decreaseQuantity(item)}
                                                >
                                                    −
                                                </button>

                                                <span>{item.quantity}</span>

                                                <button
                                                    disabled={isUnavailable || isBusy}
                                                    onClick={() => increaseQuantity(item)}
                                                >
                                                    +
                                                </button>

                                            </div>

                                            <h4>
                                                Subtotal : ₹ {item.subtotal}
                                            </h4>

                                            <button
                                                className="remove-btn"
                                                disabled={isBusy}
                                                onClick={() => removeItem(item.cartItemId)}
                                            >
                                                {isBusy ? "..." : "Remove"}
                                            </button>

                                        </div>

                                    </div>

                                );

                            })}

                        </div>

                        <div className="cart-summary">

                            <h3>Order Summary</h3>

                            <hr />

                            {hasUnavailableItem && (
                                <p className="unavailable-warning">
                                    Some items in your cart are no longer available.
                                    Please remove them to proceed.
                                </p>
                            )}

                            <div className="summary-row">

                                <span>Total Amount</span>

                                <span>₹ {availableTotal}</span>

                            </div>

                            <button
                                className="checkout-btn"
                                disabled={hasUnavailableItem}
                                onClick={() => navigate("/checkout")}
                            >
                                Proceed To Checkout
                            </button>

                        </div>

                    </div>

                )}

            </div>

        </>

    );

}

export default Cart;