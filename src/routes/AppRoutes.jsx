import { Routes, Route } from "react-router-dom";

import ROUTES from "../constants/routes";

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
        <Route path={ROUTES.HOME} element={<Home />} />

        <Route path={ROUTES.ABOUT} element={<About />} />

        <Route path={ROUTES.CONTACT} element={<Contact />} />

        <Route path={ROUTES.DESTINATIONS} element={<Destinations />} />

        <Route
          path={ROUTES.DESTINATION_DETAILS}
          element={<DestinationDetails />}
        />

        <Route path={ROUTES.PACKAGES} element={<Packages />} />

        <Route path={ROUTES.BOOKING} element={<Booking />} />

        <Route path={ROUTES.CHECKOUT} element={<Checkout />} />
      </Route>

      <Route path={ROUTES.LOGIN} element={<Login />} />

      <Route path={ROUTES.REGISTER} element={<Register />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;