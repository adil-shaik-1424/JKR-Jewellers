import { useEffect, useState } from "react";
import adminApi from "../services/adminApi";
import "../css/ProductModal.css";

function ProductModal({

    closeModal,
    product = null,
    refreshProducts

}) {

    const [categories, setCategories] = useState([]);

    const [selectedImages, setSelectedImages] = useState([]);

    const [previewImages, setPreviewImages] = useState([]);

    const [existingImages, setExistingImages] = useState([]);

    // ---------- Custom Popup ----------
    const [popup, setPopup] = useState({
        show: false,
        type: "",
        message: ""
    });

    const showPopup = (type, message) => {

        setPopup({
            show: true,
            type,
            message
        });

        setTimeout(() => {

            setPopup({
                show: false,
                type: "",
                message: ""
            });

        }, 2500);

    };
    // -------------------------------

    const [formData, setFormData] = useState({

        categoryId: "",
        name: "",
        description: "",
        price: "",
        weight: "",
        purity: "",
        stockQuantity: "",
        status: "AVAILABLE",
        bestSeller: false

    });

    useEffect(() => {

        loadCategories();

    }, []);

    useEffect(() => {

        if (product) {

            setFormData({

                categoryId: product.categoryId || "",
                name: product.name || "",
                description: product.description || "",
                price: product.price || "",
                weight: product.weight || "",
                purity: product.purity || "",
                stockQuantity: product.stockQuantity || "",
                status: product.status || "AVAILABLE",
                bestSeller: product.bestSeller || false

            });

            setExistingImages(product.imageUrls || []);

        }

    }, [product]);

    const loadCategories = async () => {

        try {

            const response = await adminApi.get("/categories");

            setCategories(response.data);

        }

        catch (error) {

            console.error(error);

        }

    };

    const handleChange = (e) => {

        const { name, value, type, checked } = e.target;

        setFormData({

            ...formData,

            [name]: type === "checkbox"
                ? checked
                : value

        });

    };

    const handleImageChange = (e) => {

        const files = Array.from(e.target.files);

        setSelectedImages(files);

        const previews = files.map(file => URL.createObjectURL(file));

        setPreviewImages(previews);

    };

    const saveProduct = async (e) => {

        e.preventDefault();

        try {

            let productId;

            if (product) {

                await adminApi.put(

                    `/products/${product.id}`,

                    formData

                );

                productId = product.id;

            }

            else {

                const response = await adminApi.post(

                    "/products",

                    formData

                );

                productId = response.data.id;

            }

            if (selectedImages.length > 0) {

                const imageData = new FormData();

                selectedImages.forEach(image => {

                    imageData.append("files", image);

                });

                await adminApi.post(

                    `/products/${productId}/images`,

                    imageData,

                    {

                        headers: {

                            "Content-Type": "multipart/form-data"

                        }

                    }

                );

            }

            showPopup(

                "success",

                product
                    ? "Product Updated Successfully"
                    : "Product Added Successfully"

            );

            if (refreshProducts) {

                refreshProducts();

            }

            setTimeout(() => {

                closeModal();

            }, 1200);

        }

        catch (error) {

            console.error(error);

            showPopup(

                "error",

                product
                    ? "Unable to Update Product"
                    : "Unable to Add Product"

            );

        }

    };

    return (

        <div className="modal-overlay">

            <div className="product-modal">

                {popup.show && (

                    <div className={`custom-popup ${popup.type}`}>

                        {popup.message}

                    </div>

                )}

                <h2>

                    {

                        product

                            ? "Edit Product"

                            : "Add Product"

                    }

                </h2>

                <form onSubmit={saveProduct}>

                    <div className="modal-group">

                        <label>Category</label>

                        <select
                            name="categoryId"
                            value={formData.categoryId}
                            onChange={handleChange}
                            required
                        >

                            <option value="">

                                Select Category

                            </option>

                            {

                                categories.map(category => (

                                    <option
                                        key={category.id}
                                        value={category.id}
                                    >

                                        {category.name}

                                    </option>

                                ))

                            }

                        </select>

                    </div>

                    <div className="modal-group">

                        <label>Product Name</label>

                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div className="modal-group">

                        <label>Description</label>

                        <textarea
                            rows="4"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                        />

                    </div>

                    <div className="modal-group">

                        <label>Price</label>

                        <input
                            type="number"
                            step="0.01"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div className="modal-group">

                        <label>Weight</label>

                        <input
                            type="number"
                            step="0.01"
                            name="weight"
                            value={formData.weight}
                            onChange={handleChange}
                        />

                    </div>

                    <div className="modal-group">

                        <label>Purity</label>

                        <input
                            type="text"
                            name="purity"
                            value={formData.purity}
                            onChange={handleChange}
                        />

                    </div>

                    <div className="modal-group">

                        <label>Stock Quantity</label>

                        <input
                            type="number"
                            name="stockQuantity"
                            value={formData.stockQuantity}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div className="modal-group">

                        <label>Status</label>

                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                        >

                            <option value="AVAILABLE">Available</option>

                            <option value="OUT_OF_STOCK">

                                Out Of Stock

                            </option>

                            <option value="DISCONTINUED">

                                Discontinued

                            </option>

                        </select>

                    </div>

                    <div className="modal-group">

                        <label>

                            <input
                                type="checkbox"
                                name="bestSeller"
                                checked={formData.bestSeller}
                                onChange={handleChange}
                            />

                            Best Seller

                        </label>

                    </div>

                    <div className="modal-group">

                        <label>

                            Upload Images

                        </label>

                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageChange}
                        />

                    </div>

                    {

                        existingImages.length > 0 &&

                        <div className="image-preview-container">

                            <h4>Existing Images</h4>

                            <div className="preview-grid">

                                {

                                    existingImages.map((img, index) => (

                                        <img
                                            key={index}
                                            src={img}
                                            alt="product"
                                            className="preview-image"
                                        />

                                    ))

                                }

                            </div>

                        </div>

                    }

                    {

                        previewImages.length > 0 &&

                        <div className="image-preview-container">

                            <h4>Selected Images</h4>

                            <div className="preview-grid">

                                {

                                    previewImages.map((img, index) => (

                                        <img
                                            key={index}
                                            src={img}
                                            alt="preview"
                                            className="preview-image"
                                        />

                                    ))

                                }

                            </div>

                        </div>

                    }

                    <div className="modal-buttons">

                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={closeModal}
                        >

                            Cancel

                        </button>

                        <button
                            type="submit"
                            className="save-btn"
                        >

                            {

                                product

                                    ? "Update Product"

                                    : "Save Product"

                            }

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}

export default ProductModal;