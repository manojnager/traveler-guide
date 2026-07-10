export default function SimpleBarChart({ data = [] }) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="d-flex flex-column gap-3">
      {data.map((item) => {
        const percent = Math.round((item.value / max) * 100);
        return (
          <div key={item.label}>
            <div className="d-flex justify-content-between mb-1">
              <span className="text-secondary">{item.label}</span>
              <span className="fw-semibold">{item.value}</span>
            </div>
            <div className="progress" style={{ height: "8px" }}>
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${percent}%`, backgroundColor: item.color || "#206bc4" }}
                aria-valuenow={percent}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}