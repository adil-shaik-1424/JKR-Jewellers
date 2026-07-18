import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./BestSellerSection.css";

function BestSellerSection() {

    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchBestSellers();
    }, []);

    const fetchBestSellers = async () => {
        try {
            const response = await api.get("/products/best-sellers");
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

        <section className="best-section">

            <h2>Best Sellers</h2>

            <div className="best-container">

                {products.map((product) => {

                    const isAvailable = product.status === "AVAILABLE";

                    return (

                        <div
                            className={`best-card ${!isAvailable ? "unavailable" : ""}`}
                            key={product.id}
                            onClick={() => {

                                if (isAvailable) {
                                    navigate(`/products/${product.id}`);
                                }

                            }}
                            style={{ cursor: isAvailable ? "pointer" : "not-allowed" }}
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

                            <div className="best-content">

                                <h3>{product.name}</h3>

                                <p>{product.categoryName}</p>

                                <h4>₹ {product.price}</h4>

                                <button
                                    disabled={!isAvailable}
                                    onClick={(e) => {
                                        e.stopPropagation();

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

        </section>

    );

}

export default BestSellerSection;