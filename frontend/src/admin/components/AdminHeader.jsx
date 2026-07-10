import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { IconLogout, IconUserCircle, IconMenu2, IconSun, IconMoon } from "@tabler/icons-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useSidebar } from "../context/SidebarContext";

export default function AdminHeader() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { toggleMobile } = useSidebar();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Log out?",
      text: "You will need to sign in again to access the admin panel.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Log out",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d63939"
    });
    if (result.isConfirmed) {
      logout();
      navigate("/admin/login", { replace: true });
    }
  };

  const displayName = user ? `${user.firstName} ${user.lastName}` : "Admin";

  return (
    <header className="navbar navbar-expand-md navbar-light bg-white border-bottom">
      <div className="container-fluid">
        <button type="button" className="btn btn-icon d-lg-none me-2" onClick={toggleMobile} aria-label="Toggle sidebar">
          <IconMenu2 size={20} />
        </button>
        <h2 className="page-title mb-0 d-none d-sm-block">Admin Dashboard</h2>
        <div className="ms-auto d-flex align-items-center gap-2">
          <button type="button" className="btn btn-icon" onClick={toggleTheme} aria-label="Toggle dark mode">
            {isDark ? <IconSun size={20} /> : <IconMoon size={20} />}
          </button>
          <div className="d-none d-sm-flex align-items-center gap-2 ms-2">
            <IconUserCircle size={22} />
            <span className="fw-semibold">{displayName}</span>
          </div>
          <button type="button" className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1 ms-2" onClick={handleLogout}>
            <IconLogout size={16} />
            <span className="d-none d-sm-inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}