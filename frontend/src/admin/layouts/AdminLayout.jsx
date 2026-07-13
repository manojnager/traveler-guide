import { Outlet } from "react-router-dom";

import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";
import AdminFooter from "../components/AdminFooter";

export default function AdminLayout() {
  return (
    <div className="page admin-shell">
      <AdminSidebar />

      <div className="page-wrapper">
        <AdminHeader />

        <div className="page-body">
          <div className="container-xl py-4">
            <Outlet />
          </div>
        </div>

        <AdminFooter />
      </div>
    </div>
  );
}