import { Outlet } from "react-router-dom";
import Layout from "../layout/Layout";

function LayoutWrapper() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

export default LayoutWrapper;