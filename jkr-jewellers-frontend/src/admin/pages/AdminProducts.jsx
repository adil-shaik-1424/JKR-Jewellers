import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import ProductModal from "../components/ProductModal";
import adminApi from "../services/adminApi";
import "../css/AdminProducts.css";

function AdminProducts() {

    const [products, setProducts] = useState([]);

    const [showModal, setShowModal] = useState(false);

    const [selectedProduct, setSelectedProduct] = useState(null);

    const [popup, setPopup] = useState({
        open: false,
        type: "success",
        message: ""
    });

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

    useEffect(() => {

        loadProducts();

    }, []);

    const loadProducts = async () => {

        try {

            const response = await adminApi.get("/products");

            setProducts(response.data);

        }

        catch (error) {

            console.error(error);

            showPopup("error", "Unable to load products.");

        }

    };

    const addProduct = () => {

        setSelectedProduct(null);

        setShowModal(true);

    };

    const editProduct = (product) => {

        setSelectedProduct(product);

        setShowModal(true);

    };
        const deleteProduct = async (id) => {

        const confirmDelete = window.confirm(
            "Delete this product?"
        );

        if (!confirmDelete) {

            return;

        }

        try {

            await adminApi.delete(`/products/${id}`);

            showPopup(
                "success",
                "Product Deleted Successfully"
            );

            loadProducts();

        }

        catch (error) {

            console.error(error);

            showPopup(
                "error",
                error.response?.data?.message ||
                error.response?.data ||
                "Unable to delete product."
            );

        }

    };

    return (

        <AdminLayout>

            {popup.open && (

                <div className={`popup ${popup.type}`}>

                    {popup.message}

                </div>

            )}

            <div className="product-header">

                <h1>Products</h1>

                <button
                    className="add-product-btn"
                    onClick={addProduct}
                >

                    + Add Product

                </button>

            </div>

            <div className="table-scroll-wrap">

            <table className="product-table">

                <thead>

                    <tr>

                        <th>Image</th>

                        <th>Name</th>

                        <th>Category</th>

                        <th>Price</th>

                        <th>Stock</th>

                        <th>Status</th>

                        <th>Actions</th>

                    </tr>

                </thead>

                <tbody>

                    {

                        products.length > 0 ?

                            products.map((product) => (

                                <tr key={product.id}>

                                    <td>

                                        <img

                                            src={
                                                product.images &&
                                                product.images.length > 0
                                                    ? product.images[0].imageUrl
                                                    : "/no-image.png"
                                            }

                                            alt={product.name}

                                            className="product-image"

                                        />

                                    </td>

                                    <td>{product.name}</td>

                                    <td>{product.categoryName}</td>

                                    <td>₹ {product.price}</td>

                                    <td>{product.stockQuantity}</td>

                                    <td>{product.status}</td>

                                    <td>

                                        <button

                                            className="edit-btn"

                                            onClick={() =>
                                                editProduct(product)
                                            }

                                        >

                                            Edit

                                        </button>

                                        <button

                                            className="delete-btn"

                                            onClick={() =>
                                                deleteProduct(product.id)
                                            }

                                        >

                                            Delete

                                        </button>

                                    </td>

                                </tr>

                            ))

                            :

                            <tr>

                                <td colSpan="7">

                                    No Products Found

                                </td>

                            </tr>

                    }

                </tbody>

            </table>

            </div>

            {

                showModal &&

                <ProductModal

                    product={selectedProduct}

                    closeModal={() => {

                        setShowModal(false);

                        setSelectedProduct(null);

                    }}

                    refreshProducts={loadProducts}

                />

            }

        </AdminLayout>

    );

}

export default AdminProducts;