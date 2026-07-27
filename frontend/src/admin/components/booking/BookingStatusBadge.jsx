const STATUS_STYLES = {
  PENDING: "badge bg-yellow-lt text-yellow",
  CONFIRMED: "badge bg-green-lt text-green",
  CANCELLED: "badge bg-red-lt text-red"
};

export default function BookingStatusBadge({ status }) {
  return <span className={STATUS_STYLES[status] || "badge bg-secondary-lt"}>{status}</span>;
}