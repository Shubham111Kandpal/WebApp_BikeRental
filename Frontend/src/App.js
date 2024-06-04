import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/customer_pages/CustomerLoginPage';
import RegistrationPage from './pages/customer_pages/RegistrationPage';
import HomePage from './pages/customer_pages/HomePage';
import MyBookingsPage from './pages/customer_pages/MyBookingsPage';
import ReviewPage from "./pages/customer_pages/ReviewPage";
import BikeSelectionPage from "./pages/customer_pages/BikeSelectionPage";
import AdminLoginPage from './pages/admin_pages/AdminLoginPage';
import HomeAdmin from './pages/admin_pages/HomeAdmin';
import UpdateBike from './pages/admin_pages/UpdateBike';
import AdminCreateUser from "./pages/admin_pages/AdminCreateuser";
import AdminEditUser from "./pages/admin_pages/AdminEdituser";
import AdminUserList from "./pages/admin_pages/AdminUserList";
import AdminBooking from './pages/admin_pages/AdminBooking';

function App() {
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/customer/register" element={<RegistrationPage />} />
        <Route path="/customer/home-customer" element={<HomePage />} />
        <Route path="/customer/bookings" element={<MyBookingsPage />} />
        <Route path="/customer/reviews" element={<ReviewPage />} />
        <Route path="/customer/bike-select" element={<BikeSelectionPage />} />
        <Route path="/admin" element={<AdminLoginPage />} />
        <Route path="/admin/home-admin" element={<HomeAdmin />} />
        <Route path="/admin/update-bike" element={<UpdateBike />} />
        <Route path="/admin/bikes" element={<UpdateBike />} />
        <Route path="/admin/create-user" element={<AdminCreateUser />} />
        <Route path="/admin/user-list" element={<AdminUserList />} />
        <Route path="/admin/edit-user/:userId" element={<AdminEditUser />} />
        <Route path="/admin/booking" element={<AdminBooking />} />
      </Routes>
    </Router>
  );
}

export default App; 