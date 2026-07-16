import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import LoginModal from "./components/Auth/LoginModal";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import MyAccount from "./pages/MyAccount";
import MyProfile from "./pages/MyProfile";
import MyOrders from "./pages/MyOrders";
import MyAddresses from "./pages/MyAddresses";
import ChangePassword from "./pages/ChangePassword";
import Categories from "./pages/Categories";
import About from "./pages/About";
import Contact from "./pages/Contact";

import AdminLogin from "./admin/pages/AdminLogin";
import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminCategories from "./admin/pages/AdminCategories";
import AdminProducts from "./admin/pages/AdminProducts";
import AdminOrders from "./admin/pages/AdminOrders";
import AdminCustomers from "./admin/pages/AdminCustomers";
import AdminBanners from "./admin/pages/AdminBanners";
import OrderSuccess from "./pages/OrderSuccess";
import PaymentFailed from "./pages/PaymentFailed";

function App() {

    const location = useLocation();

    const isAdminRoute = location.pathname.startsWith("/admin");

    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        return !!localStorage.getItem("token");
    });

    const [showAuthPrompt, setShowAuthPrompt] = useState(false);

    useEffect(() => {

        if (isLoggedIn || isAdminRoute) {
            return;
        }

        const timer = setTimeout(() => {
            setShowAuthPrompt(true);
        }, 3000);

        return () => clearTimeout(timer);

    }, [isLoggedIn, isAdminRoute]);

    return (

        <>

            <Routes>

                {/* Customer Routes */}

                <Route path="/" element={<Home />} />

                <Route path="/products" element={<Products />} />

                <Route path="/products/:id" element={<ProductDetails />} />

                <Route path="/cart" element={<Cart />} />

                <Route path="/wishlist" element={<Wishlist />} />

                <Route path="/checkout" element={<Checkout />} />

                <Route path="/my-account" element={<MyAccount />} />

                <Route path="/profile" element={<MyProfile />} />

                <Route path="/orders" element={<MyOrders />} />

                <Route path="/addresses" element={<MyAddresses />} />

                <Route path="/change-password" element={<ChangePassword />} />

                <Route path="/categories" element={<Categories />} />

                <Route path="/about" element={<About />} />

                <Route path="/contact" element={<Contact />} />

                {/* Admin Routes */}

                <Route path="/admin/login" element={<AdminLogin />} />

                <Route path="/admin/dashboard" element={<AdminDashboard />} />

                <Route path="/admin/categories" element={<AdminCategories />} />
                <Route path="/admin/products" element={<AdminProducts />} />
                <Route path="/admin/orders" element={<AdminOrders />} />
                <Route path="/admin/customers" element={<AdminCustomers />} />
                <Route path="/admin/banners" element={<AdminBanners />} />
                <Route path="/order-success" element={<OrderSuccess />} />
                <Route
                    path="/payment-failed"
                    element={<PaymentFailed />}
                />
            </Routes>

            {showAuthPrompt && !isLoggedIn && !isAdminRoute && (
                <LoginModal
                    setIsLoggedIn={(value) => {
                        setIsLoggedIn(value);
                        setShowAuthPrompt(false);
                    }}
                />
            )}

        </>

    );

}

export default App;