import Header from "../components/Header/Header";
import Navbar from "../components/Navbar/Navbar";
import BackButton from "../components/BackButton/BackButton";
import Footer from "../components/Footer/Footer";
import "./About.css";

function About() {

    return (

        <>
            <Header />
            <Navbar />
            <BackButton />

            <div className="about-page">

                <h1>About JKR Jewellers</h1>

                <p>
                    Welcome to <strong>JKR Jewellers</strong>, where craftsmanship,
                    trust, and elegance come together to create jewellery that
                    lasts a lifetime.
                </p>

                <p>
                    Located in the heart of <strong>Nellore</strong>, JKR Jewellers
                    is a trusted name with two well-established branches,
                    serving customers through both our physical stores and our
                    online platform. Over the years, we have earned the confidence
                    of thousands of customers by delivering high-quality jewellery,
                    transparent pricing, and exceptional customer service.
                </p>

                <p>
                    Unlike many jewellery stores, we are proud to be both
                    <strong> manufacturers and retail sellers</strong>. Every
                    piece is crafted with attention to detail by skilled artisans,
                    ensuring superior quality, authenticity, and beautiful
                    finishing. By manufacturing our own jewellery, we maintain
                    complete control over quality while offering our customers
                    excellent value.
                </p>

                <p>
                    At JKR Jewellers, we offer a wide collection of
                    <strong> Gold, Silver, Diamond, and Customized Jewellery</strong>
                    for every occasion. Whether you are looking for elegant
                    ready-made collections or wish to create a completely
                    personalized design, we are here to bring your ideas to life.
                </p>

                <h2>What We Offer</h2>

                <ul>

                    <li>Ready-made jewellery collections</li>

                    <li>Custom jewellery made on pre-order</li>

                    <li>Bridal jewellery</li>

                    <li>Traditional and contemporary designs</li>

                    <li>Jewellery for men, women, and children</li>

                    <li>Special occasion and gifting collections</li>

                </ul>

                <p>
                    Every jewellery piece is created with precision, purity,
                    and passion, reflecting our commitment to excellence and
                    customer satisfaction.
                </p>

                <p>
                    We warmly invite you to visit our showroom and experience
                    our collections in person.
                </p>

                <h2>Our Store</h2>

                <p>
                    <strong>JKR Jewellers</strong><br />

                    Chinna Bazaar Main Road,<br />

                    Beside New Rajya Lakshmi Hall,<br />

                    Nellore – 524001,<br />

                    Andhra Pradesh, India.
                </p>

                <h2>Contact Us</h2>

                <p>

                    <strong>Phone:</strong> +91 73825 72233

                    <br />

                    <strong>Email:</strong> jkrjewellers1@gmail.com

                </p>

                <p>
                    For enquiries regarding products, custom orders, pricing,
                    or appointments, our team is always happy to assist you.
                </p>

                <h2>Our Leadership</h2>

                <div className="leader">

                    <h3>Shaik Jaleel</h3>

                    <h4>Founder</h4>

                    <p>
                        The visionary behind JKR Jewellers, whose dedication
                        to quality, trust, and customer satisfaction laid the
                        foundation for the business.
                    </p>

                </div>

                <div className="leader">

                    <h3>Shaik Abbas Ahamad</h3>

                    <h4>Co-Founder & Managing Director</h4>

                    <p>
                        Leading the organization with a commitment to innovation,
                        excellence, and continuous growth while preserving the
                        values that define JKR Jewellers.
                    </p>

                </div>

                <div className="leader">

                    <h3>Shaik Adil</h3>

                    <h4>Social Media Manager</h4>

                    <p>
                        Managing our online presence and ensuring our customers
                        stay connected through social media and digital platforms.
                        Whether you have questions about our collections or need
                        assistance online, Adil and our digital support team are
                        always ready to help.
                    </p>

                    <p>

                        <strong>Email:</strong> adilshaik1424@gmail.com

                        <br />

                        <strong>Phone:</strong> +91 63055 22327

                    </p>

                </div>

            </div>

            <Footer />

        </>

    );

}

export default About;