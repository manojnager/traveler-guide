export default function StatCard({ title, value, icon: Icon, color = "primary" }) {
  return (
    <div className="card position-relative">
      <div className="card-body">
        <div className="d-flex align-items-center">
          <div className="subheader">{title}</div>
        </div>
        <div className="d-flex align-items-baseline mt-2">
          <div className="h1 mb-0 me-2">{value}</div>
        </div>
      </div>
      {Icon && (
        <span className={`position-absolute top-0 end-0 mt-3 me-3 text-${color}`}>
          <Icon size={28} />
        </span>
      )}
    </div>
  );
}