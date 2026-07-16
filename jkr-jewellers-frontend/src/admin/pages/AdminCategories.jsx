import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import CategoryModal from "../components/CategoryModal";
import adminApi from "../services/adminApi";
import "../css/AdminCategories.css";

function AdminCategories() {

    const [categories, setCategories] = useState([]);

    const [showModal, setShowModal] = useState(false);

    const [selectedCategory, setSelectedCategory] = useState(null);

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
        loadCategories();
    }, []);

    const loadCategories = async () => {

        try {

            const response = await adminApi.get("/categories");

            setCategories(response.data);

        }

        catch (error) {

            console.error(error);

            showPopup("error", "Unable to load categories.");

        }

    };

    // ------------------------
    // ADD / EDIT CATEGORY
    // ------------------------

    const saveCategory = async (categoryData) => {

        try {

            let categoryId;

            // EDIT
            if (selectedCategory) {

                await adminApi.put(

                    `/categories/${selectedCategory.id}`,

                    {
                        name: categoryData.name,
                        gender: categoryData.gender,
                        metalType: categoryData.metalType,
                        description: categoryData.description,
                        active: true,
                        featured: categoryData.featured
                    }

                );

                categoryId = selectedCategory.id;

            }

            // ADD
            else {

                const response = await adminApi.post(

                    "/categories",

                    {
                        name: categoryData.name,
                        gender: categoryData.gender,
                        metalType: categoryData.metalType,
                        description: categoryData.description,
                        active: true,
                        featured: categoryData.featured
                    }

                );

                categoryId = response.data.id;

            }

            if (categoryData.image) {

                const formData = new FormData();

                formData.append("file", categoryData.image);

                await adminApi.post(

                    `/categories/${categoryId}/image`,

                    formData,

                    {

                        headers: {

                            "Content-Type": "multipart/form-data"

                        }

                    }

                );

            }

            showPopup(
                "success",
                selectedCategory
                    ? "Category Updated Successfully"
                    : "Category Added Successfully"
            );

            setShowModal(false);

            setSelectedCategory(null);

            loadCategories();

        }

        catch (error) {

            console.error(error);

            showPopup("error", "Operation Failed");

        }

    };

    // ------------------------
    // DELETE CATEGORY
    // ------------------------

    const deleteCategory = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this category?"
        );

        if (!confirmDelete) return;

        try {

            await adminApi.delete(`/categories/${id}`);

            showPopup("success", "Category Deleted Successfully");

            loadCategories();

        }

        catch (error) {

            console.error(error);

            if (error.response?.data) {

                showPopup("error", error.response.data);

            } else {

                showPopup(
                    "error",
                    "Cannot delete category because it contains products."
                );

            }

        }

    };
        // ------------------------
    // OPEN EDIT MODAL
    // ------------------------

    const editCategory = (category) => {

        setSelectedCategory(category);

        setShowModal(true);

    };

    return (

        <AdminLayout>

            {popup.open && (
                <div className={`popup ${popup.type}`}>
                    {popup.message}
                </div>
            )}

            <div className="category-header">

                <h1>Categories</h1>

                <button
                    className="add-category-btn"
                    onClick={() => {

                        setSelectedCategory(null);
                        setShowModal(true);

                    }}
                >
                    + Add Category
                </button>

            </div>

            <div className="table-scroll-wrap">

                <table className="category-table">

                    <thead>

                        <tr>

                            <th>Image</th>
                            <th>Name</th>
                            <th>Gender</th>
                            <th>Metal</th>
                            <th>Featured</th>
                            <th>Actions</th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            categories.length > 0 ?

                                (

                                    categories.map((category) => (

                                        <tr key={category.id}>

                                            <td>

                                                <img
                                                    src={category.imageUrl}
                                                    alt={category.name}
                                                    className="category-image"
                                                />

                                            </td>

                                            <td>{category.name}</td>

                                            <td>{category.gender}</td>

                                            <td>{category.metalType}</td>

                                            <td>

                                                {category.featured ? "✅ Yes" : "❌ No"}

                                            </td>

                                            <td>

                                                <button
                                                    className="edit-btn"
                                                    onClick={() => editCategory(category)}
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    className="delete-btn"
                                                    onClick={() => deleteCategory(category.id)}
                                                >
                                                    Delete
                                                </button>

                                            </td>

                                        </tr>

                                    ))

                                )

                                :

                                (

                                    <tr>

                                        <td colSpan="6">

                                            No Categories Found

                                        </td>

                                    </tr>

                                )

                        }

                    </tbody>

                </table>

            </div>

            {

                showModal &&

                <CategoryModal

                    closeModal={() => {

                        setShowModal(false);
                        setSelectedCategory(null);

                    }}

                    onSave={saveCategory}

                    category={selectedCategory}

                />

            }

        </AdminLayout>

    );

}

export default AdminCategories;