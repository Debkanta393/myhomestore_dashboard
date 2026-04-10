import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LayoutWrapper from "../layout/LayoutWrapper";
import UploadProduct from "../pages/UploadProduct";
import Login from "../pages/Login";
import Products from "../pages/Products";
import Dashboard from "../pages/Dashboard"
import PuckEditor from "../cms/PuckEditor";
import Orders from "../pages/Orders";
import Customers from "../pages/Customers";
import Pages from "../pages/Pages";
import PageBySlug from "../pages/PageBySlug";

function RouteHandler() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/page/:slug" element={<PageBySlug />} />
        <Route path="/create-pages" element={<PuckEditor />} />
        <Route path="/admin/pages/:slug"   element={<PuckEditor />} />

        <Route element={<LayoutWrapper />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/pages" element={<Pages />} />
          <Route path="/uploadproduct" element={<UploadProduct />} />
          <Route path="/editproduct/:id" element={<UploadProduct />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default RouteHandler;
