import { Link, useLocation } from "react-router-dom";
import { IconHome } from "@tabler/icons-react";
import { resolveBreadcrumbLabel } from "../../constants/breadcrumbs";

export default function Breadcrumb() {
  const location = useLocation();
  const segments = location.pathname.split("/").filter(Boolean);
  let path = "";

  const crumbs = segments.map((segment, index) => {
    path += `/${segment}`;
    return { label: resolveBreadcrumbLabel(segment), path, isLast: index === segments.length - 1 };
  });

  return (
    <ol className="breadcrumb breadcrumb-arrows mb-0">
      <li className="breadcrumb-item">
        <Link to="/admin"><IconHome size={16} className="me-1" />Home</Link>
      </li>
      {crumbs.slice(1).map((crumb) => (
        <li key={crumb.path} className={`breadcrumb-item ${crumb.isLast ? "active" : ""}`} aria-current={crumb.isLast ? "page" : undefined}>
          {crumb.isLast ? crumb.label : <Link to={crumb.path}>{crumb.label}</Link>}
        </li>
      ))}
    </ol>
  );
}