import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../services/api";
import "./CategorySection.css";

function CategorySection() {

    const [categories, setCategories] = useState([]);

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const gender = searchParams.get("gender");
    const metalType = searchParams.get("metalType");

    useEffect(() => {
        fetchCategories();
    }, [gender, metalType]);

    const fetchCategories = async () => {

        try {

            let url = "/categories/featured";

            if (gender && metalType) {
                url = `/categories?gender=${gender}&metalType=${metalType}`;
            }

            const response = await api.get(url);

            setCategories(response.data);

        } catch (error) {

            console.error("Error fetching categories:", error);

        }

    };

    return (

        <section className="category-section">

            <h2>Shop By Category</h2>

            <div className="category-container">

                {categories.map((category) => (

                    <div
                        key={category.id}
                        className="category-card"
                        onClick={() =>
                            navigate(`/products?categoryId=${category.id}`)
                        }
                    >

                        <img
                            src={category.imageUrl || "/logo.jpg"}
                            alt={category.name}
                        />

                        <div className="category-content">

                            <h3>{category.name}</h3>

                            <p>{category.description}</p>

                        </div>

                    </div>

                ))}

            </div>

        </section>

    );

}

export default CategorySection;