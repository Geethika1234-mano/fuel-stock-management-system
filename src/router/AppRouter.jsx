import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import FuelSalesPage from "../pages/FuelSalesPage";      // (when you add it)
import DeliveriesPage from "../pages/DeliveriesPage";    // (when you add it)
import FuelStockPage from "../pages/FuelStockPage";      // (when you add it)
import DashboardLayout from "../layout/DashboardLayout";
import PrivateRoute from "./PrivateRoute";


export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />
        {/* <Route path="/register" element={<Register />} /> */}
        <Route
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/sales" element={<FuelSalesPage />} />
          <Route path="/deliveries" element={<DeliveriesPage />} />
          <Route path="/stock" element={<FuelStockPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
