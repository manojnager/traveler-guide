import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import Home from "../pages/Home";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Destinations from "../pages/Destinations";
import DestinationDetails from "../pages/DestinationDetails";
import Packages from "../pages/Packages";
import Booking from "../pages/Booking";
import Checkout from "../pages/Checkout";
import Login from "../pages/Login";
import Register from "../pages/Register";
import NotFound from "../pages/NotFound";

function AppRoutes() {
  return (
    <Routes>

      <Route element={<MainLayout />}>

        <Route path="/" element={<Home />} />

        <Route path="/about" element={<About />} />

        <Route path="/contact" element={<Contact />} />

        <Route path="/destinations" element={<Destinations />} />

        <Route
          path="/destinations/:slug"
          element={<DestinationDetails />}
        />

        <Route path="/packages" element={<Packages />} />

        <Route path="/booking" element={<Booking />} />

        <Route path="/checkout" element={<Checkout />} />

      </Route>

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route path="*" element={<NotFound />} />

    </Routes>
  );
}

export default AppRoutes;