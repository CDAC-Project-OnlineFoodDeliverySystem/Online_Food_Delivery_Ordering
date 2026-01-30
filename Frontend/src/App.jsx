import { Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* ================= USER COMPONENTS ================= */
import Signup from "./components/Signup.jsx";
import Signin from "./components/Signin.jsx";
import CustomerHome from "./components/CustomerHome.jsx";
import Menu from "./components/Menu.jsx";
import Cart from "./components/Cart.jsx";
import Checkout from "./components/Checkout.jsx";
import PaymentPage from "./components/PaymentPage.jsx";
import Orders from "./components/Orders.jsx";
import CustomerNavbar from "./components/CustomerNavbar.jsx";

/* ================= ADMIN COMPONENTS ================= */
import AdminLogin from "./admin/AdminLogin.jsx";
import AdminDashboard from "./admin/AdminDashboard.jsx";
import ManageRestaurants from "./admin/ManageRestaurants.jsx";
import AddRestaurant from "./admin/AddRestaurant.jsx";
import EditRestaurant from "./admin/EditRestaurant.jsx";

/* ================= RESTAURANT COMPONENTS ================= */
import RestaurantLogin from "./restaurant/RestaurantLogin.jsx";
import RestaurantDashboard from "./restaurant/RestaurantDashboard.jsx";
import ManageMenu from "./restaurant/ManageMenu.jsx";
import RestaurantOrders from "./restaurant/RestaurantOrders.jsx";

/* ================= PROTECTED ROUTES ================= */
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  const location = useLocation();

  // Hide customer navbar on admin & restaurant routes
  const hideCustomerNavbar =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/restaurant");

  return (
    <>
      {/* CUSTOMER NAVBAR (ONLY FOR CUSTOMER PAGES) */}
      {!hideCustomerNavbar && <CustomerNavbar />}
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />

      <Routes>
        {/* ================= CUSTOMER ROUTES ================= */}

        {/* PUBLIC HOME */}
        <Route path="/" element={<CustomerHome />} />
        <Route path="/home" element={<CustomerHome />} />

        {/* AUTH */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />

        {/* PROTECTED CUSTOMER ROUTES */}
        <Route
          path="/menu/:id"
          element={
            <ProtectedRoute>
              <Menu />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <PaymentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />

        {/* ================= ADMIN ROUTES ================= */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/approvals" element={<AdminDashboard />} />
        <Route path="/admin/restaurants" element={<ManageRestaurants />} />
        <Route path="/admin/add-restaurant" element={<AddRestaurant />} />
        <Route path="/admin/edit-restaurant/:id" element={<EditRestaurant />} />

        {/* ================= RESTAURANT ROUTES ================= */}
        <Route path="/restaurant/login" element={<RestaurantLogin />} />
        <Route path="/restaurant/dashboard" element={<RestaurantDashboard />} />
        <Route path="/restaurant/menu" element={<ManageMenu />} />
        <Route path="/restaurant/orders" element={<RestaurantOrders />} />
      </Routes>
    </>
  );
}

export default App;
