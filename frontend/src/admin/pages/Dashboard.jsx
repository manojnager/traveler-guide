import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { IconMap2, IconWorldCheck, IconCalendarEvent, IconUsers, IconCurrencyDollar } from "@tabler/icons-react";

import { getDashboardStats } from "../services/dashboardService";
import PageHeader from "../components/common/PageHeader";
import StatCard from "../components/cards/StatCard";
import SimpleBarChart from "../components/charts/SimpleBarChart";
import PageLoader from "../components/loader/PageLoader";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        const message = error.response?.data?.message || "Failed to load dashboard stats.";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <PageLoader />;
  if (!stats) return <div className="text-center text-secondary py-5">No dashboard data available.</div>;

  const { counts, recent } = stats;

  const overviewChartData = [
    { label: "Destinations", value: counts.totalDestinations, color: "#206bc4" },
    { label: "Published", value: counts.publishedDestinations, color: "#2fb344" },
    { label: "Bookings", value: counts.totalBookings, color: "#f76707" },
    { label: "Users", value: counts.totalUsers, color: "#ae3ec9" }
  ];

  return (
    <>
      <PageHeader title="Dashboard" subtitle="Welcome to the Traveler Guide admin panel." />

      <div className="row row-deck row-cards mb-4">
        <div className="col-sm-6 col-lg-3">
          <StatCard title="Total Destinations" value={counts.totalDestinations} icon={IconMap2} color="primary" />
        </div>
        <div className="col-sm-6 col-lg-3">
          <StatCard title="Published" value={counts.publishedDestinations} icon={IconWorldCheck} color="success" />
        </div>
        <div className="col-sm-6 col-lg-3">
          <StatCard title="Total Bookings" value={counts.totalBookings} icon={IconCalendarEvent} color="orange" />
        </div>
        <div className="col-sm-6 col-lg-3">
          <StatCard title="Total Users" value={counts.totalUsers} icon={IconUsers} color="purple" />
        </div>
      </div>

      <div className="row row-deck row-cards mb-4">
        <div className="col-lg-4">
          <div className="card">
            <div className="card-body">
              <div className="subheader mb-2">Confirmed Revenue</div>
              <div className="d-flex align-items-center">
                <IconCurrencyDollar size={28} className="text-success me-2" />
                <div className="h1 mb-0">
                  {Number(counts.totalRevenue).toLocaleString(undefined, { style: "currency", currency: "USD" })}
                </div>
              </div>
              <div className="text-secondary mt-2">Sum of all confirmed bookings.</div>
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="card">
            <div className="card-header"><h3 className="card-title">Platform Overview</h3></div>
            <div className="card-body"><SimpleBarChart data={overviewChartData} /></div>
          </div>
        </div>
      </div>

      <div className="row row-deck row-cards">
        <div className="col-lg-6">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Recent Destinations</h3>
              <Link to="/admin/destinations" className="ms-auto btn btn-sm btn-outline-primary">View all</Link>
            </div>
            <div className="table-responsive">
              <table className="table table-vcenter card-table">
                <thead><tr><th>Title</th><th>Category</th><th>Status</th></tr></thead>
                <tbody>
                  {recent.destinations.length === 0 && (
                    <tr><td colSpan={3} className="text-center text-secondary">No destinations yet.</td></tr>
                  )}
                  {recent.destinations.map((destination) => (
                    <tr key={destination.id}>
                      <td>{destination.title}</td>
                      <td>{destination.category?.name || "-"}</td>
                      <td>
                        <span className={`badge ${destination.isPublished ? "bg-success-lt" : "bg-secondary-lt"}`}>
                          {destination.isPublished ? "Published" : "Draft"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Recent Bookings</h3>
              <Link to="/admin/bookings" className="ms-auto btn btn-sm btn-outline-primary">View all</Link>
            </div>
            <div className="table-responsive">
              <table className="table table-vcenter card-table">
                <thead><tr><th>Customer</th><th>Destination</th><th>Status</th></tr></thead>
                <tbody>
                  {recent.bookings.length === 0 && (
                    <tr><td colSpan={3} className="text-center text-secondary">No bookings yet.</td></tr>
                  )}
                  {recent.bookings.map((booking) => (
                    <tr key={booking.id}>
                      <td>{booking.user ? `${booking.user.firstName} ${booking.user.lastName}` : "-"}</td>
                      <td>{booking.destination?.title || "-"}</td>
                      <td>
                        <span className={`badge ${
                          booking.status === "CONFIRMED" ? "bg-success-lt" :
                          booking.status === "CANCELLED" ? "bg-danger-lt" : "bg-warning-lt"
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="row row-deck row-cards mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Recent Users</h3>
              <Link to="/admin/users" className="ms-auto btn btn-sm btn-outline-primary">View all</Link>
            </div>
            <div className="table-responsive">
              <table className="table table-vcenter card-table">
                <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Joined</th></tr></thead>
                <tbody>
                  {recent.users.length === 0 && (
                    <tr><td colSpan={5} className="text-center text-secondary">No users yet.</td></tr>
                  )}
                  {recent.users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.firstName} {user.lastName}</td>
                      <td>{user.email}</td>
                      <td>{user.role?.name || "-"}</td>
                      <td>
                        <span className={`badge ${user.status === "ACTIVE" ? "bg-success-lt" : "bg-secondary-lt"}`}>
                          {user.status}
                        </span>
                      </td>
                      <td>{format(new Date(user.createdAt), "dd MMM yyyy")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}