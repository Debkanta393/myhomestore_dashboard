import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LayoutWrapper from "../layout/LayoutWrapper";
import UploadProduct from "../pages/UploadProduct";
import Login from "../pages/Login";
import Products from "../pages/Products";
import Dashboard from "../pages/Dashboard"
import PuckEditor from "../cms/PuckEditor";

function RouteHandler() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/create-pages" element={<PuckEditor />} />
        <Route path="/admin/pages/:slug"   element={<PuckEditor />} />

        <Route element={<LayoutWrapper />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/uploadproduct" element={<UploadProduct />} />
          <Route path="/editproduct/:id" element={<UploadProduct />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default RouteHandler;
