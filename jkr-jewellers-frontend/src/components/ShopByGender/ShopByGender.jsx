import { useNavigate } from "react-router-dom";
import "./ShopByGender.css";

function ShopByGender() {

    const navigate = useNavigate();

    return (
        <section className="gender-section">

            <h2>Shop By Gender</h2>

            <div className="gender-container">

                <div className="gender-card">
                    <img src="/womengender.jpg" alt="Women's Jewellery" />

                    <div className="overlay">
                        <h3>Women's Collection</h3>
                        <button onClick={() => navigate("/products?gender=WOMEN")}>
                            Shop Now
                        </button>
                    </div>
                </div>

                <div className="gender-card">
                    <img src="/mengender.jpg" alt="Men's Jewellery" />

                    <div className="overlay">
                        <h3>Men's Collection</h3>
                        <button onClick={() => navigate("/products?gender=MEN")}>
                            Shop Now
                        </button>
                    </div>
                </div>

            </div>

        </section>
    );
}

export default ShopByGender;