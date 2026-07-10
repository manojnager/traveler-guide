import Breadcrumb from "./Breadcrumb";

export default function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="page-header d-print-none mb-4">
      <div className="row align-items-center">
        <div className="col">
          <Breadcrumb />
          <h2 className="page-title mt-1">{title}</h2>
          {subtitle && <div className="text-secondary mt-1">{subtitle}</div>}
        </div>
        {actions && (
          <div className="col-auto ms-auto d-print-none">
            <div className="btn-list">{actions}</div>
          </div>
        )}
      </div>
    </div>
  );
}