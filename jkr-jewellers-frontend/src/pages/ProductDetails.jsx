import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

import Header from "../components/Header/Header";
import Navbar from "../components/Navbar/Navbar";
import BackButton from "../components/BackButton/BackButton";

import "./ProductDetails.css";

function ProductDetails() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [product, setProduct] = useState(null);

    const [selectedImage, setSelectedImage] = useState("");

    const [popup, setPopup] = useState({
        open: false,
        type: "success",
        message: ""
    });

    useEffect(() => {
        fetchProduct();
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

    const fetchProduct = async () => {

        try {

            const response = await api.get(`/products/${id}`);

            setProduct(response.data);

            if (response.data.images?.length > 0) {

                setSelectedImage(response.data.images[0].imageUrl);

            }

        } catch (error) {

            console.error(error);

        }

    };

    const handleAddToCart = async () => {

        if (product.status !== "AVAILABLE") return;

        try {

            await api.post("/cart", {
                productId: product.id,
                quantity: 1
            });

            showPopup("success", "Product added to cart successfully!");

            setTimeout(() => {
                navigate("/cart");
            }, 800);

        } catch (error) {

            console.error(error);

            showPopup("error", "Unable to add product to cart.");

        }

    };

    const handleAddToWishlist = async () => {

        try {

            await api.post(`/wishlist/${product.id}`);

            showPopup("success", "Product added to Wishlist ❤️");

            setTimeout(() => {
                navigate("/wishlist");
            }, 800);

        } catch (error) {

            console.error(error);

            showPopup("error", "Unable to add product to Wishlist.");

        }

    };

    const statusLabel = (status) => {

        if (status === "OUT_OF_STOCK") return "Out of Stock";
        if (status === "SOLD") return "Sold Out";
        if (status === "DISCONTINUED") return "Discontinued";
        return "Available";

    };

    if (!product) {

        return <h2>Loading...</h2>;

    }

    const isAvailable = product.status === "AVAILABLE";

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

            <div className={`product-details ${!isAvailable ? "unavailable" : ""}`}>

                <div className="product-details-image">

                    <img
                        className="main-image"
                        src={selectedImage || "/placeholder.jpg"}
                        alt={product.name}
                        onError={(e) => (e.target.src = "/placeholder.jpg")}
                    />

                    <div className="thumbnail-container">

                        {product.images?.map((image) => (

                            <img
                                key={image.id}
                                src={image.imageUrl}
                                alt={product.name}
                                className={`thumbnail ${selectedImage === image.imageUrl ? "active-thumbnail" : ""}`}
                                onClick={() => setSelectedImage(image.imageUrl)}
                            />

                        ))}

                    </div>

                </div>

                <div className="product-info">

                    <h1>{product.name}</h1>

                    <h2>₹ {product.price}</h2>

                    <p><strong>Purity :</strong> {product.purity}</p>

                    <p><strong>Weight :</strong> {product.weight} g</p>

                    <p>
                        <strong>Status :</strong>{" "}
                        <span className={`status-tag ${!isAvailable ? "status-unavailable" : "status-available"}`}>
                            {statusLabel(product.status)}
                        </span>
                    </p>

                    <p><strong>Description :</strong></p>

                    <p>{product.description}</p>

                    <div className="product-buttons">

                        <button
                            className="add-cart-btn"
                            disabled={!isAvailable}
                            onClick={handleAddToCart}
                        >
                            {isAvailable ? "Add To Cart" : statusLabel(product.status)}
                        </button>

                        <button
                            className="wishlist-btn"
                            onClick={handleAddToWishlist}
                        >
                            ❤️ Add To Wishlist
                        </button>

                    </div>

                </div>

            </div>

        </>

    );

}

export default ProductDetails;