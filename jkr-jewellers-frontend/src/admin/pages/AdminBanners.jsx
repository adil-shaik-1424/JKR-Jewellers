import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import adminApi from "../services/adminApi";
import "../css/AdminBanners.css";

function AdminBanners() {

    const [banners, setBanners] = useState({});

    const [uploading, setUploading] = useState({});

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
        loadBanners();
    }, []);

    const loadBanners = async () => {

        try {

            const response = await adminApi.get("/banners");

            const map = {};

            response.data.forEach((banner) => {

                map[banner.position] = banner;

            });

            setBanners(map);

        }

        catch (error) {

            console.error(error);

            showPopup("error", "Unable to load banners.");

        }

    };
    const handleFileChange = async (position, event) => {

    const file = event.target.files[0];

    if (!file) return;

    const formData = new FormData();

    formData.append("file", file);

    setUploading((prev) => ({
        ...prev,
        [position]: true
    }));

    try {

        await adminApi.post(

            `/banners/${position}`,

            formData,

            {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }

        );

        showPopup(
            "success",
            `Banner ${position} uploaded successfully`
        );

        loadBanners();

    }

    catch (error) {

        console.error(error);

        showPopup(
            "error",
            "Unable to upload banner."
        );

    }

    finally {

        setUploading((prev) => ({
            ...prev,
            [position]: false
        }));

        event.target.value = "";

    }

};

const handleDelete = async (position) => {

    if (!window.confirm(`Delete Banner ${position}?`)) return;

    try {

        await adminApi.delete(`/banners/${position}`);

        showPopup(
            "success",
            `Banner ${position} deleted successfully`
        );

        loadBanners();

    }

    catch (error) {

        console.error(error);

        showPopup(
            "error",
            "Unable to delete banner."
        );

    }

};

const positions = [1, 2, 3];

return (

    <AdminLayout>

        {popup.open && (

            <div className={`popup ${popup.type}`}>

                {popup.message}

            </div>

        )}

        <div className="banners-header">

            <h1>Homepage Banners</h1>

            <p className="banners-subtext">

                These images appear automatically on the customer homepage.

            </p>

        </div>

        <div className="banners-grid">

            {positions.map((position) => {

                const banner = banners[position];

                return (

                    <div
                        className="banner-card"
                        key={position}
                    >

                        <h3>

                            Banner {position}

                        </h3>

                        <div className="banner-preview">

                            {

                                banner ?

                                    <img
                                        src={banner.imageUrl}
                                        alt={`Banner ${position}`}
                                    />

                                    :

                                    <div className="banner-placeholder">

                                        No image uploaded

                                    </div>

                            }

                        </div>

                        <div className="banner-actions">

                            <label className="upload-btn">

                                {

                                    uploading[position]

                                        ?

                                        "Uploading..."

                                        :

                                        banner

                                            ?

                                            "Replace"

                                            :

                                            "Upload"

                                }

                                <input
                                    type="file"
                                    accept="image/*"
                                    hidden
                                    disabled={uploading[position]}
                                    onChange={(e) =>
                                        handleFileChange(position, e)
                                    }
                                />

                            </label>

                            {

                                banner &&

                                <button
                                    className="delete-btn"
                                    onClick={() =>
                                        handleDelete(position)
                                    }
                                >

                                    Delete

                                </button>

                            }

                        </div>

                    </div>

                );

            })}

        </div>

    </AdminLayout>

);

}

export default AdminBanners;