import Header from "../components/Header/Header";
import Navbar from "../components/Navbar/Navbar";
import Hero from "../components/Hero/Hero";
import CategorySection from "../components/CategorySection/CategorySection";
import BestSellerSection from "../components/BestSellerSection/BestSellerSection";
import ShopByGender from "../components/ShopByGender/ShopByGender";
import TrustSection from "../components/TrustSection/TrustSection";
import Footer from "../components/Footer/Footer";

function Home() {
  return (
    <>
      <Header />
      <Navbar />
      <Hero />
      <CategorySection />
      <BestSellerSection />
      <ShopByGender />
      <TrustSection />
        <Footer />
    </>
  );
}

export default Home;