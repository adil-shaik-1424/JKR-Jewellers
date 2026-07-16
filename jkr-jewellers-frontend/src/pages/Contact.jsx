import Header from "../components/Header/Header";
import Navbar from "../components/Navbar/Navbar";
import BackButton from "../components/BackButton/BackButton";
import Footer from "../components/Footer/Footer";
import "./Contact.css";

function Contact() {

    return (

        <>
            <Header />
            <Navbar />
            <BackButton />

            <div className="contact-page">

                <h1>Contact JKR Jewellers</h1>

                <p>
                    We are always happy to assist you with your jewellery needs.
                </p>

                <p>
                    Whether you have questions about our collections, wish to place
                    a custom jewellery order, need product information, or want to
                    know more about our services, our team is here to help.
                </p>

                <p>
                    Feel free to visit our showroom, call us, send us an email,
                    or connect with us through WhatsApp.
                </p>

                <h2>Store Address</h2>

                <p>

                    <strong>JKR Jewellers</strong>

                    <br />

                    Chinna Bazaar Main Road,

                    <br />

                    Beside New Rajya Lakshmi Hall,

                    <br />

                    Nellore – 524001,

                    <br />

                    Andhra Pradesh, India.

                </p>

                <h2>Contact Information</h2>

                <p>

                    <strong>Phone:</strong> +91 73825 72233

                    <br />

                    <strong>Email:</strong> jkrjewellers1@gmail.com

                </p>

                <h2>Business Hours</h2>

                <p>

                    Monday – Saturday

                    <br />

                    10:30 AM – 9:00 PM

                    <br /><br />

                    Sunday

                    <br />

                    10:30 AM – 2:00 PM

                </p>

                <h2>Custom Jewellery Orders</h2>

                <p>
                    Looking for a unique jewellery design?
                </p>

                <p>
                    We specialize in custom-made jewellery crafted according to
                    your preferences. Share your design ideas with us, and our
                    experienced craftsmen will create a beautiful piece exclusively
                    for you.
                </p>

                <h2>Visit Our Store</h2>

                <ul>

                    <li>Gold Jewellery</li>

                    <li>Silver Jewellery</li>

                    <li>Diamond Jewellery</li>

                    <li>Bridal Jewellery</li>

                    <li>Customized Jewellery</li>

                    <li>Ready-Made Collections</li>

                </ul>

                <p>
                    Our knowledgeable staff will be delighted to help you choose
                    the perfect jewellery for every occasion.
                </p>

                <h2>Stay Connected</h2>

                <p>

                    <strong>Phone:</strong> +91 73825 72233

                    <br />

                    <strong>Email:</strong> jkrjewellers1@gmail.com

                    <br />

                    <strong>WhatsApp:</strong> +91 73825 72233

                    <br />

                    <strong>Instagram:</strong> @jkr_jewellers_pvtltd

                </p>

                <a
                    className="whatsapp-btn"
                    href="https://wa.me/917382572233"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Chat on WhatsApp
                </a>

            </div>

            <Footer />

        </>

    );

}

export default Contact;