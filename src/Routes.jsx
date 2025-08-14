import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import ShoppingCart from './pages/shopping-cart';
import ProductCatalog from './pages/product-catalog';
import AdminDashboard from './pages/admin-dashboard';
import AdminProductManagement from './pages/admin-product-management';
import Checkout from './pages/checkout';
import Homepage from './pages/homepage';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/shopping-cart" element={<ShoppingCart />} />
        <Route path="/product-catalog" element={<ProductCatalog />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-product-management" element={<AdminProductManagement />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
