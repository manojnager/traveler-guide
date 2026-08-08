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
import Account from "../pages/Account";
import NotFound from "../pages/NotFound";
import AdminRoutes from "../admin/routes/AdminRoutes";
import Experiences from "../pages/Experiences";
import TravelJournal from "../pages/TravelJournal";
import Gallery from "../pages/Gallery";
import HelpCenter from "../pages/HelpCenter";
import FAQs from "../pages/FAQs";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import Terms from "../pages/Terms";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path={ROUTES.ABOUT} element={<About />} />
        <Route path={ROUTES.CONTACT} element={<Contact />} />
        <Route path={ROUTES.EXPERIENCES} element={<Experiences />} />
        <Route path={ROUTES.TRAVEL_JOURNAL} element={<TravelJournal />} />
        <Route path={ROUTES.GALLERY} element={<Gallery />} />
        <Route path={ROUTES.HELP_CENTER} element={<HelpCenter />} />
        <Route path={ROUTES.FAQS} element={<FAQs />} />
        <Route path={ROUTES.PRIVACY_POLICY} element={<PrivacyPolicy />} />
        <Route path={ROUTES.TERMS} element={<Terms />} />
        <Route path={ROUTES.DESTINATIONS} element={<Destinations />} />
        <Route
          path={ROUTES.DESTINATION_DETAILS}
          element={<DestinationDetails />}
        />
        <Route path={ROUTES.PACKAGES} element={<Packages />} />
        <Route path={ROUTES.BOOKING} element={<Booking />} />
        <Route path={ROUTES.CHECKOUT} element={<Checkout />} />
        <Route
          path={ROUTES.ACCOUNT}
          element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route path={ROUTES.REGISTER} element={<Register />} />
      <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
      <Route path={ROUTES.RESET_PASSWORD} element={<ResetPassword />} />
      
      <Route
          path="/admin/*"
          element={<AdminRoutes />}
        />
      <Route path="*" element={<NotFound />} />
      
    </Routes>
  );
}
export default AppRoutes;