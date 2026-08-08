import { NavLink } from "react-router-dom";
import {
  IconLayoutDashboard, IconMap2, IconPlus, IconCategory, IconWorld,
  IconMapPin, IconChecklist, IconCalendarEvent, IconUsers, IconSettings, IconX,
  IconMail, IconHeart, IconStar, IconMailForward
} from "@tabler/icons-react";
import { useSidebar } from "../context/SidebarContext";

const menuSections = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", icon: IconLayoutDashboard, path: "/admin", end: true }
    ]
  },
  {
    label: "Catalog",
    items: [
      { title: "Destinations", icon: IconMap2, path: "/admin/destinations" },
      { title: "Add Destination", icon: IconPlus, path: "/admin/destinations/create" },
      { title: "Categories", icon: IconCategory, path: "/admin/categories" },
      { title: "Countries", icon: IconWorld, path: "/admin/countries" },
      { title: "Cities", icon: IconMapPin, path: "/admin/cities" },
      { title: "Amenities", icon: IconChecklist, path: "/admin/amenities" },
      { title: "Wishlist", icon: IconHeart, path: "/admin/wishlist" },
      { title: "Contact Messages", icon: IconMail, path: "/admin/contact-messages" },
      { title: "Email Logs", icon: IconMailForward, path: "/admin/email-logs" },
    ]
  },
  {
    label: "Operations",
    items: [
      { title: "Bookings", icon: IconCalendarEvent, path: "/admin/bookings" },
      { title: "Users", icon: IconUsers, path: "/admin/users" },
      { title: "Reviews", icon: IconStar, path: "/admin/reviews" },
    ]
  },
  {
    label: "System",
    items: [
      { title: "Settings", icon: IconSettings, path: "/admin/settings" }
    ]
  }
];

export default function AdminSidebar() {
  const { mobileOpen, closeMobile } = useSidebar();

  return (
    <>
      {mobileOpen && <div className="admin-sidebar-backdrop" onClick={closeMobile} />}
      <aside className={`navbar navbar-vertical navbar-expand-lg navbar-dark bg-dark admin-sidebar ${mobileOpen ? "admin-sidebar-open" : ""}`}>
        <div className="container-fluid">
          <div className="d-flex align-items-center justify-content-between w-100 mb-4 d-lg-block">
            <h1 className="navbar-brand mb-0">Traveler Guide</h1>
            <button type="button" className="btn btn-icon btn-ghost-light d-lg-none" onClick={closeMobile} aria-label="Close sidebar">
              <IconX size={20} />
            </button>
          </div>

          <div className="navbar-nav flex-column w-100 admin-sidebar-nav">
            {menuSections.map((section) => (
              <div key={section.label} className="admin-sidebar-section">
                <div className="admin-sidebar-section-label">{section.label}</div>

                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.end}
                      onClick={closeMobile}
                      className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                    >
                      <span className="nav-link-icon d-md-none d-lg-inline-block">
                        <Icon size={20} />
                      </span>
                      <span className="nav-link-title">{item.title}</span>
                    </NavLink>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}