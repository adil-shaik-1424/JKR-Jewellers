import { useEffect, useState, useRef } from "react";
import api from "../services/api";

import Header from "../components/Header/Header";
import Navbar from "../components/Navbar/Navbar";
import BackButton from "../components/BackButton/BackButton";

import "./Wishlist.css";

function Wishlist() {

    const [wishlist, setWishlist] = useState([]);
    const [busyItems, setBusyItems] = useState(new Set());
    const busyRef = useRef(new Set());

    const [popup, setPopup] = useState({
        open: false,
        type: "success",
        message: ""
    });

    useEffect(() => {
        fetchWishlist();
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

    const fetchWishlist = async () => {

        try {

            const response = await api.get("/wishlist");

            setWishlist(response.data);

        } catch (error) {

            console.error(error);

            showPopup("error", "Unable to load wishlist.");

        }

    };

    const withItemLock = async (productId, fn) => {

        if (busyRef.current.has(productId)) return;

        busyRef.current.add(productId);
        setBusyItems(new Set(busyRef.current));

        try {
            await fn();
        } finally {
            busyRef.current.delete(productId);
            setBusyItems(new Set(busyRef.current));
        }

    };

    const removeWishlist = (productId) => withItemLock(productId, async () => {

        try {

            await api.delete(`/wishlist/${productId}`);

            await fetchWishlist();

            showPopup("success", "Item removed from wishlist.");

        } catch (error) {

            console.error(error);

            showPopup("error", "Unable to remove item.");

        }

    });

    const addToCart = (productId) => withItemLock(productId, async () => {

        try {

            await api.post("/cart", {
                productId,
                quantity: 1
            });

            showPopup("success", "Added to Cart");

        } catch (error) {

            console.error(error);

            showPopup("error", "Unable to add to cart.");

        }

    });

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

            <div className="wishlist-page">

                <h2>My Wishlist</h2>

                {wishlist.length === 0 ? (

                    <div className="empty-wishlist">

                        <h3>Your Wishlist is Empty ❤️</h3>

                    </div>

                ) : (

                    <div className="wishlist-grid">

                        {wishlist.map((item) => {

                            const isUnavailable = item.status !== "AVAILABLE";
                            const isBusy = busyItems.has(item.productId);

                            return (

                                <div
                                    className={`wishlist-card ${isUnavailable ? "unavailable" : ""}`}
                                    key={item.wishlistId}
                                >

                                    <img
                                        src={item.imageUrls?.[0] || "/placeholder.jpg"}
                                        alt={item.productName}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "/placeholder.jpg";
                                        }}
                                    />

                                    {isUnavailable && (
                                        <span className="unavailable-badge">
                                            {item.status === "OUT_OF_STOCK"
                                                ? "Out of Stock"
                                                : "Unavailable"}
                                        </span>
                                    )}

                                    <h3>{item.productName}</h3>

                                    <h4>₹ {item.price}</h4>

                                    <button
                                        className="cart-btn"
                                        disabled={isUnavailable || isBusy}
                                        onClick={() =>
                                            addToCart(item.productId)
                                        }
                                    >
                                        {isUnavailable ? "Unavailable" : (isBusy ? "..." : "Add To Cart")}
                                    </button>

                                    <button
                                        className="remove-btn"
                                        disabled={isBusy}
                                        onClick={() =>
                                            removeWishlist(item.productId)
                                        }
                                    >
                                        {isBusy ? "..." : "Remove"}
                                    </button>

                                </div>

                            );

                        })}

                    </div>

                )}

            </div>

        </>

    );

}

export default Wishlist;