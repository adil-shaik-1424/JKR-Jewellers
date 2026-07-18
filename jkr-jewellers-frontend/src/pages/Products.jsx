import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import Header from "../components/Header/Header";
import Navbar from "../components/Navbar/Navbar";
import BackButton from "../components/BackButton/BackButton";
import "./Products.css";

function Products() {

    const [products, setProducts] = useState([]);

    const [searchParams] = useSearchParams();

    const categoryId = searchParams.get("categoryId");
    const keyword = searchParams.get("keyword");

    const navigate = useNavigate();

    useEffect(() => {

        if (keyword) {
            searchProducts();
        } else {
            fetchProducts();
        }

    }, [categoryId, keyword]);

    const fetchProducts = async () => {

        try {

            let url = "/products";

            if (categoryId) {
                url += `?categoryId=${categoryId}`;
            }

            const response = await api.get(url);

            setProducts(response.data);

        } catch (error) {

            console.error(error);

        }

    };

    const searchProducts = async () => {

        try {

            const response = await api.get(
                `/products/search?keyword=${keyword}`
            );

            setProducts(response.data);

        } catch (error) {

            console.error(error);

        }

    };

    const statusLabel = (status) => {

        if (status === "OUT_OF_STOCK") return "Out of Stock";
        if (status === "SOLD") return "Sold Out";
        if (status === "DISCONTINUED") return "Discontinued";
        return "";

    };

    return (
        <>
            <Header />
            <Navbar />
            <BackButton />

            <div className="products-page">

                <div className="products-grid">

                    {products.map((product) => {

                        const isAvailable = product.status === "AVAILABLE";

                        return (

                            <div
                                className={`product-card ${!isAvailable ? "unavailable" : ""}`}
                                key={product.id}
                            >

                                {

                                    !isAvailable &&

                                    <span className="unavailable-badge">
                                        {statusLabel(product.status)}
                                    </span>

                                }

                                <img
                                    src={product.images?.[0]?.imageUrl || "/placeholder.jpg"}
                                    alt={product.name}
                                    onError={(e) => { e.target.onerror = null; e.target.src = "/placeholder.jpg"; }}
                                />

                                <div className="product-card-content">

                                    <h3>{product.name}</h3>

                                    <p className="price">
                                        ₹ {product.price}
                                    </p>

                                    <p>
                                        <strong>Purity:</strong> {product.purity}
                                    </p>

                                    <p>
                                        <strong>Weight:</strong> {product.weight} g
                                    </p>

                                    <button
                                        disabled={!isAvailable}
                                        onClick={() => {

                                            if (isAvailable) {
                                                navigate(`/products/${product.id}`);
                                            }

                                        }}
                                    >
                                        {isAvailable ? "View Details" : statusLabel(product.status)}
                                    </button>

                                </div>

                            </div>

                        );

                    })}

                </div>

            </div>

        </>
    );

}

export default Products;