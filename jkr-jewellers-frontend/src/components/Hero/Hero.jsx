import { useEffect, useState } from "react";
import api from "../../services/api";
import "./Hero.css";

function Hero() {

    const [banners, setBanners] = useState([]);
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        loadBanners();
    }, []);

    useEffect(() => {

        if (banners.length <= 1) return;

        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % banners.length);
        }, 4000);

        return () => clearInterval(interval);

    }, [banners]);

    const loadBanners = async () => {
        try {
            const response = await api.get("/banners");
            setBanners(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    if (banners.length === 0) {
        return null;
    }

    return (
        <section className="hero">
            <img
                src={banners[current].imageUrl}
                alt={`JKR Jewellers Banner ${banners[current].position}`}
            />
        </section>
    );
}

export default Hero;