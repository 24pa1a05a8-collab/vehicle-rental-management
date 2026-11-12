import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

// Public & Customer Pages
import HomePage from './pages/HomePage';
import VehiclesPage from './pages/VehiclesPage';
import VehicleDetailsPage from './pages/VehicleDetailsPage';
import BookingCheckoutPage from './pages/BookingCheckoutPage';
import UserDashboardPage from './pages/UserDashboardPage';
import UserProfilePage from './pages/UserProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';

// Admin Components & Layout
import AdminLayout from './components/admin/AdminLayout';
import AdminOverview from './components/admin/AdminOverview';
import VehicleManagement from './components/admin/VehicleManagement';
import BookingManagement from './components/admin/BookingManagement';
import CategoryManagement from './components/admin/CategoryManagement';
import UserManagement from './components/admin/UserManagement';
import RevenueReport from './components/admin/RevenueReport';

// Public / User Layout with Navbar & Footer
const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public & Customer Layout */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/vehicles" element={<VehiclesPage />} />
            <Route path="/vehicles/:id" element={<VehicleDetailsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Customer Routes */}
            <Route
              path="/checkout/:vehicleId"
              element={
                <ProtectedRoute>
                  <BookingCheckoutPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <UserDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <UserProfilePage />
                </ProtectedRoute>
              }
            />

            {/* 404 Inside Main Layout */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* Protected Admin Routes (Rendered inside AdminLayout) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly={true}>
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route
              path="dashboard"
              element={
                <AdminLayout title="Dashboard Overview & KPIs">
                  <AdminOverview />
                </AdminLayout>
              }
            />
            <Route
              path="vehicles"
              element={
                <AdminLayout title="Fleet Inventory & Availability">
                  <VehicleManagement />
                </AdminLayout>
              }
            />
            <Route
              path="bookings"
              element={
                <AdminLayout title="Bookings & Reservations Control">
                  <BookingManagement />
                </AdminLayout>
              }
            />
            <Route
              path="categories"
              element={
                <AdminLayout title="Vehicle Classifications & Categories">
                  <CategoryManagement />
                </AdminLayout>
              }
            />
            <Route
              path="users"
              element={
                <AdminLayout title="Registered Users & Roles">
                  <UserManagement />
                </AdminLayout>
              }
            />
            <Route
              path="revenue"
              element={
                <AdminLayout title="Revenue & Financial Settlement">
                  <RevenueReport />
                </AdminLayout>
              }
            />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
