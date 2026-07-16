import { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {

    const [menuOpen, setMenuOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);

    const closeAll = () => {
        setMenuOpen(false);
        setOpenDropdown(null);
    };

    const toggleDropdown = (name) => {
        setOpenDropdown((prev) => (prev === name ? null : name));
    };

    return (

        <nav className="navbar">

            <button
                className={`nav-toggle ${menuOpen ? "open" : ""}`}
                onClick={() => setMenuOpen((prev) => !prev)}
                aria-label="Toggle navigation menu"
                aria-expanded={menuOpen}
            >
                <span></span>
                <span></span>
                <span></span>
            </button>

            <ul className={`nav-links ${menuOpen ? "show" : ""}`}>

                <li>
                    <Link to="/" onClick={closeAll}>Home</Link>
                </li>

                <li className={`dropdown ${openDropdown === "gold" ? "open" : ""}`}>

                    <span onClick={() => toggleDropdown("gold")}>Gold ▾</span>

                    <div className="dropdown-menu">

                        <Link to="/categories?gender=MEN&metalType=GOLD" onClick={closeAll}>
                            Men
                        </Link>

                        <Link to="/categories?gender=WOMEN&metalType=GOLD" onClick={closeAll}>
                            Women
                        </Link>

                    </div>

                </li>

                <li className={`dropdown ${openDropdown === "silver" ? "open" : ""}`}>

                    <span onClick={() => toggleDropdown("silver")}>Silver ▾</span>

                    <div className="dropdown-menu">

                        <Link to="/categories?gender=MEN&metalType=SILVER" onClick={closeAll}>
                            Men
                        </Link>

                        <Link to="/categories?gender=WOMEN&metalType=SILVER" onClick={closeAll}>
                            Women
                        </Link>

                    </div>

                </li>

                <li>
                   <Link to="/about" onClick={closeAll}>About</Link>
                </li>

                <li>
                    <Link to="/contact" onClick={closeAll}>Contact</Link>
                </li>

            </ul>

        </nav>

    );

}

export default Navbar;