import "./Header.css";
import {
  FaWhatsapp,
  FaInstagram,
  FaHeart,
  FaUser,
  FaShoppingCart,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Header() {

  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");

  const handleSearch = () => {

    if (keyword.trim() === "") return;

    navigate(`/products?keyword=${keyword}`);

  };

  return (

    <header className="header">

      <div className="logo">
        <img
          src="/logo.jpg"
          alt="JKR Jewellers"
          className="logo-img"
        />
      </div>

      <div className="search-bar">

        <input
          type="text"
          placeholder="Search Jewellery..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => {

            if (e.key === "Enter") {
              handleSearch();
            }

          }}
        />

        <button onClick={handleSearch}>
          Search
        </button>

      </div>

      <div className="header-icons">

        <a
          href="https://wa.me/917382572233"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaWhatsapp className="icon" />
        </a>

        <a
          href="https://www.instagram.com/jkr_jewellers_pvtltd/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaInstagram className="icon" />
        </a>

        <div
          className="icon-box"
          onClick={() => navigate("/wishlist")}
        >
          <FaHeart className="icon" />
          <span>Wishlist</span>
        </div>

        <div
          className="icon-box"
          onClick={() => navigate("/my-account")}
        >
          <FaUser className="icon" />
          <span>Account</span>
        </div>

        <div
          className="icon-box"
          onClick={() => navigate("/cart")}
        >
          <FaShoppingCart className="icon" />
          <span>Cart</span>
        </div>

      </div>

    </header>

  );

}

export default Header;