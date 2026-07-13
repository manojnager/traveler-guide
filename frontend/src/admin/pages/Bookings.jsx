import { useCallback, useEffect, useState } from "react";
import Select from "react-select";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { format } from "date-fns";
import { IconSearch, IconEye, IconTrash, IconFilterOff } from "@tabler/icons-react";

import PageHeader from "../components/common/PageHeader";
import DataTable from "../components/table/DataTable";
import BookingStatusBadge from "../components/booking/BookingStatusBadge";
import BookingDetailsModal from "../components/booking/BookingDetailsModal";

import {
  getAdminBookings,
  updateBookingStatus,
  deleteBooking
} from "../services/bookingService";

const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "PENDING", label: "Pending" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "CANCELLED", label: "Cancelled" }
];

const STATUS_SELECT_OPTIONS = [
  { value: "PENDING", label: "Pending" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "CANCELLED", label: "Cancelled" }
];

export default function Bookings() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailsBooking, setDetailsBooking] = useState(null);

  const [pagination, setPagination] = useState({ page: 1, limit: 10, totalItems: 0 });
  const [searchInput, setSearchInput] = useState("");
  const [filters, setFilters] = useState({ search: "", status: "" });

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchInput }));
      setPagination((prev) => ({ ...prev, page: 1 }));
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const fetchBookings = useCallback(async () => {
    setLoading(true);

    try {
      const params = { page: pagination.page, limit: pagination.limit };
      if (filters.search) params.search = filters.search;
      if (filters.status) params.status = filters.status;

      const data = await getAdminBookings(params);

      setRows(data.items);
      setPagination((prev) => ({ ...prev, totalItems: data.pagination.totalItems }));
    } catch {
      toast.error("Failed to load bookings.");
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, filters.search, filters.status]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleClearFilters = () => {
    setSearchInput("");
    setFilters({ search: "", status: "" });
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleStatusChange = async (booking, newStatus) => {
    if (newStatus === booking.status) return;

    setRows((prev) =>
      prev.map((row) => (row.id === booking.id ? { ...row, status: newStatus } : row))
    );

    try {
      await updateBookingStatus(booking.id, newStatus);
      toast.success("Booking status updated.");
    } catch (error) {
      setRows((prev) =>
        prev.map((row) => (row.id === booking.id ? { ...row, status: booking.status } : row))
      );

      const message = error.response?.data?.message || "Failed to update status.";
      toast.error(message);
    }
  };

  const handleDelete = async (booking) => {
    const result = await Swal.fire({
      title: "Delete booking?",
      text: `Booking #${booking.id} for "${booking.destination?.title}" will be permanently removed.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d63939"
    });

    if (!result.isConfirmed) return;

    try {
      await deleteBooking(booking.id);
      toast.success("Booking deleted.");
      fetchBookings();
    } catch (error) {
      const message = error.response?.data?.message || "Failed to delete booking.";
      toast.error(message);
    }
  };

  const columns = [
    {
      name: "Customer",
      cell: (row) => (
        <div>
          <div className="fw-semibold">
            {row.user?.firstName} {row.user?.lastName}
          </div>
          <div className="text-secondary small">{row.user?.email}</div>
        </div>
      )
    },
    {
      name: "Destination",
      selector: (row) => row.destination?.title || "-"
    },
    {
      name: "Travel Date",
      selector: (row) => (row.travelDate ? format(new Date(row.travelDate), "MMM dd, yyyy") : "-")
    },
    {
      name: "Guests",
      selector: (row) => row.guests,
      center: true,
      width: "90px"
    },
    {
      name: "Amount",
      selector: (row) => `$${Number(row.totalAmount).toFixed(2)}`
    },
    {
      name: "Status",
      cell: (row) => (
        <div style={{ minWidth: "150px" }}>
          <Select
            options={STATUS_SELECT_OPTIONS}
            value={STATUS_SELECT_OPTIONS.find((o) => o.value === row.status)}
            onChange={(opt) => handleStatusChange(row, opt.value)}
            classNamePrefix="react-select"
            isSearchable={false}
            components={{
              SingleValue: ({ data }) => <BookingStatusBadge status={data.value} />
            }}
          />
        </div>
      )
    },
    {
      name: "Actions",
      right: true,
      cell: (row) => (
        <div className="btn-list flex-nowrap">
          <button
            type="button"
            className="btn btn-icon btn-sm btn-outline-primary"
            title="View details"
            onClick={() => setDetailsBooking(row)}
          >
            <IconEye size={16} />
          </button>

          <button
            type="button"
            className="btn btn-icon btn-sm btn-outline-danger"
            title="Delete"
            onClick={() => handleDelete(row)}
          >
            <IconTrash size={16} />
          </button>
        </div>
      )
    }
  ];

  return (
    <>
      <PageHeader title="Bookings" subtitle="Manage customer bookings and their status." />

      <div className="card mb-3">
        <div className="card-body">
          <div className="row g-2 align-items-center">
            <div className="col-md-4">
              <div className="input-icon">
                <span className="input-icon-addon">
                  <IconSearch size={16} />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search customer or destination..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </div>
            </div>

            <div className="col-md-3">
              <Select
                options={STATUS_OPTIONS}
                value={STATUS_OPTIONS.find((o) => o.value === filters.status)}
                onChange={(opt) => handleFilterChange("status", opt.value)}
                classNamePrefix="react-select"
              />
            </div>

            <div className="col-md-1">
              <button
                type="button"
                className="btn btn-outline-secondary btn-icon"
                title="Clear filters"
                onClick={handleClearFilters}
              >
                <IconFilterOff size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <DataTable
          columns={columns}
          data={rows}
          loading={loading}
          pagination
          paginationServer
          paginationTotalRows={pagination.totalItems}
          paginationDefaultPage={pagination.page}
          paginationPerPage={pagination.limit}
          onChangePage={(page) => setPagination((prev) => ({ ...prev, page }))}
          onChangeRowsPerPage={(newLimit, page) =>
            setPagination((prev) => ({ ...prev, limit: newLimit, page }))
          }
        />
      </div>

      <BookingDetailsModal
        show={Boolean(detailsBooking)}
        onClose={() => setDetailsBooking(null)}
        booking={detailsBooking}
      />
    </>
  );
}