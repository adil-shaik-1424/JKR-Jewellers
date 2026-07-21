import { useEffect, useState, useRef } from "react";
import "../css/CategoryModal.css";

function CategoryModal({

    closeModal,
    onSave,
    category

}) {

    const [name, setName] = useState("");

    const [gender, setGender] = useState("MEN");

    const [metalType, setMetalType] = useState("GOLD");

    const [description, setDescription] = useState("");

    const [image, setImage] = useState(null);

    const [featured, setFeatured] = useState(false);

    const [saving, setSaving] = useState(false);
    const savingRef = useRef(false);

    useEffect(() => {

        if (category) {

            setName(category.name);
            setGender(category.gender);
            setMetalType(category.metalType);
            setDescription(category.description || "");
            setFeatured(category.featured ?? false);

        }

        else {

            setName("");
            setGender("MEN");
            setMetalType("GOLD");
            setDescription("");
            setImage(null);
            setFeatured(false);

        }

    }, [category]);

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (savingRef.current) return;
        savingRef.current = true;
        setSaving(true);

        try {

            await onSave({

                name,
                gender,
                metalType,
                description,
                image,
                featured

            });

        } finally {

            savingRef.current = false;
            setSaving(false);

        }

    };

    return (

        <div className="modal-overlay">

            <div className="category-modal">

                <h2>

                    {category ? "Edit Category" : "Add Category"}

                </h2>

                <form onSubmit={handleSubmit}>

                    <div className="modal-group">

                        <label>Category Name</label>

                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />

                    </div>

                    <div className="modal-group">

                        <label>Gender</label>

                        <select
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                        >

                            <option value="MEN">Men</option>

                            <option value="WOMEN">Women</option>

                            <option value="UNISEX">Unisex</option>

                        </select>

                    </div>

                    <div className="modal-group">

                        <label>Metal Type</label>

                        <select
                            value={metalType}
                            onChange={(e) => setMetalType(e.target.value)}
                        >

                            <option value="GOLD">Gold</option>

                            <option value="SILVER">Silver</option>

                            <option value="PLATINUM">Platinum</option>

                            <option value="DIAMOND">Diamond</option>

                            <option value="ROSE_GOLD">Rose Gold</option>

                        </select>

                    </div>
                        <div className="modal-group">

                        <label>Description</label>

                        <textarea
                            rows="4"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />

                    </div>

                    <div className="modal-group">

                        <label>

                            {category
                                ? "Change Category Image"
                                : "Category Image"}

                        </label>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImage(e.target.files[0])}
                            disabled={saving}
                        />

                    </div>

                    <div className="modal-group featured-checkbox">

                        <label>

                            <input
                                type="checkbox"
                                checked={featured}
                                onChange={(e) => setFeatured(e.target.checked)}
                            />

                            Featured Category

                        </label>

                    </div>

                    <div className="modal-buttons">

                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={closeModal}
                            disabled={saving}
                        >

                            Cancel

                        </button>

                        <button
                            type="submit"
                            className="save-btn"
                            disabled={saving}
                        >

                            {saving
                                ? "Saving..."
                                : category
                                    ? "Update Category"
                                    : "Save Category"}

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}

export default CategoryModal;