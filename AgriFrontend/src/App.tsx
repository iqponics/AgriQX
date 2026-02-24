import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import LandingPage from "./pages/LandingPage";
import Contacts from "./pages/Contacts";
import Cloud from "./pages/Cloud";
import Messages from "./pages/Messages";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import GetPremium from "./pages/GetPremium";
import VerifyEmail from "./pages/VerifyEmail";
import Feed from "./pages/Feed";
import EcommerceRoutes from "./ecommerce/routes/EcommerceRoutes";
import { useState, useEffect } from "react";
import ProfileInfo from "./pages/ProfileInfo";
import Navbar1 from "./components/Navbar1";
import LawyerProfile from "./pages/LawyerProfile";
import ProductCart from "./pages/ProductCart";
import PublicProductDetails from "./pages/PublicProductDetails";
import FarmerProductLifecycle from "./pages/FarmerProductLifecycle";
import AdminDashboard from "./pages/AdminDashboard";
import { ToastProvider } from "./components/ToastProvider";

function App() {
  const isAuthenticated = () => {
    return localStorage.getItem("authToken") !== null;
  };

  const [isAuth, setIsAuth] = useState(isAuthenticated());

  const ProtectedRoute = () => {
    return isAuth ? <Outlet /> : <Navigate to="/login" replace />;
  };

  const PublicRoute = () => {
    return isAuth ? <Navigate to="/home" replace /> : <Outlet />;
  };

  useEffect(() => {
    const checkAuth = () => setIsAuth(isAuthenticated());
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  return (
    <BrowserRouter>
      <ToastProvider>
        <div className="min-h-screen bg-gray-50">
          {!isAuth && <Navbar1 />}

          <Routes>
            <Route path="/product-details/:id" element={<PublicProductDetails />} />

            <Route element={<PublicRoute />}>
              <Route path="/login" element={<Login setIsAuth={setIsAuth} />} />
              <Route
                path="/verify-email/:confirmationCode"
                element={<VerifyEmail />}
              />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/" element={<LandingPage />} />
            </Route>

            <Route element={<ProtectedRoute />}>
              <Route
                path="/home"
                element={
                  <>
                    <Navbar setIsAuth={setIsAuth} />
                    <Home />
                    <Footer />
                  </>
                }
              />
              <Route
                path="/profile-info"
                element={
                  <>
                    <Navbar setIsAuth={setIsAuth} />
                    <ProfileInfo />
                    <Footer />
                  </>
                }
              />
              <Route
                path="/feed"
                element={
                  <>
                    <Navbar setIsAuth={setIsAuth} />
                    <Feed />
                    <Footer />
                  </>
                }
              />
              <Route
                path="/getpremium"
                element={
                  <>
                    <Navbar setIsAuth={setIsAuth} />
                    <GetPremium />
                    <Footer />
                  </>
                }
              />
              <Route
                path="/ecommerce/*"
                element={
                  <>
                    <Navbar setIsAuth={setIsAuth} />
                    <EcommerceRoutes />
                    <Footer />
                  </>
                }
              />
              // Change from :name to :userId
              <Route
                path="/lawyer/:userId"
                element={
                  <>
                    <Navbar setIsAuth={setIsAuth} />
                    <LawyerProfile />
                    <Footer />
                  </>
                }
              />
              <Route
                path="/contacts/:userId"
                element={
                  <>
                    <Navbar setIsAuth={setIsAuth} />
                    <Contacts />
                    <Footer />
                  </>
                }
              />
              <Route
                path="/cloud"
                element={
                  <>
                    <Navbar setIsAuth={setIsAuth} />
                    <Cloud />
                    <Footer />
                  </>
                }
              />
              <Route
                path="/messages"
                element={
                  <>
                    <Navbar setIsAuth={setIsAuth} />
                    <Messages />
                  </>
                }
              />
              <Route
                path="/vendor/my-products"
                element={
                  <>
                    <Navbar setIsAuth={setIsAuth} />
                    <ProductCart />
                  </>
                }
              />
              <Route
                path="/vendor/product-lifecycle"
                element={
                  <>
                    <Navbar setIsAuth={setIsAuth} />
                    <FarmerProductLifecycle />
                  </>
                }
              />
              <Route
                path="/vendor/product-lifecycle/:id"
                element={
                  <>
                    <Navbar setIsAuth={setIsAuth} />
                    <FarmerProductLifecycle />
                  </>
                }
              />
              <Route
                path="/admin"
                element={
                  <>
                    <Navbar setIsAuth={setIsAuth} />
                    <AdminDashboard />
                  </>
                }
              />
            </Route>

            <Route path="*" element={<Navigate to={isAuth ? "/home" : "/"} />} />
          </Routes>
        </div>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
