import Hero from "../components/Hero/Hero";
import SearchBar from "../components/SearchBar/SearchBar";
import PopularDestinations from "../components/PopularDestinations/PopularDestinations";
import FeaturedPackages from "../components/FeaturedPackages/FeaturedPackages";
import WhyChooseUs from "../components/WhyChooseUs/WhyChooseUs";
import Testimonials from "../components/Testimonials/Testimonials";
import Newsletter from "../components/Newsletter/Newsletter";
import Footer from "../components/Footer/Footer";

function Home() {
  return (
    <main>
      <Hero />
      <SearchBar />
      <PopularDestinations />
      <FeaturedPackages />
      <WhyChooseUs />
      <Testimonials />
      <Newsletter /> 
      <Footer />
    </main>
  );
}

export default Home;