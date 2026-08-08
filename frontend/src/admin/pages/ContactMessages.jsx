import { useCallback, useEffect, useState } from "react";
import Select from "react-select";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { format } from "date-fns";
import { IconSearch, IconEye, IconTrash, IconFilterOff } from "@tabler/icons-react";

import PageHeader from "../components/common/PageHeader";
import DataTable from "../components/table/DataTable";
import ContactMessageDetailsModal from "../components/contact/ContactMessageDetailsModal";

import {
  getAdminContactMessages,
  updateContactMessageStatus,
  deleteContactMessage
} from "../services/contactService";

const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "NEW", label: "New" },
  { value: "READ", label: "Read" },
  { value: "RESPONDED", label: "Responded" }
];

const STATUS_BADGE = {
  NEW: "bg-blue-lt text-blue",
  READ: "bg-yellow-lt text-yellow",
  RESPONDED: "bg-green-lt text-green"
};

export default function ContactMessages() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailsMessage, setDetailsMessage] = useState(null);

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

  const fetchMessages = useCallback(async () => {
    setLoading(true);

    try {
      const params = { page: pagination.page, limit: pagination.limit };
      if (filters.search) params.search = filters.search;
      if (filters.status) params.status = filters.status;

      const data = await getAdminContactMessages(params);

      setRows(data.items);
      setPagination((prev) => ({ ...prev, totalItems: data.pagination.totalItems }));
    } catch {
      toast.error("Failed to load messages.");
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, filters.search, filters.status]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleView = async (row) => {
    setDetailsMessage(row);

    if (row.status === "NEW") {
      try {
        await updateContactMessageStatus(row.id, "READ");
        setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, status: "READ" } : r)));
      } catch {
        // silent — non-critical
      }
    }
  };

  const handleStatusChange = async (row, newStatus) => {
    setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, status: newStatus } : r)));

    try {
      await updateContactMessageStatus(row.id, newStatus);
      toast.success("Status updated.");
    } catch (error) {
      setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, status: row.status } : r)));
      const message = error.response?.data?.message || "Failed to update status.";
      toast.error(message);
    }
  };

  const handleDelete = async (row) => {
    const result = await Swal.fire({
      title: "Delete message?",
      text: `The message from "${row.name}" will be permanently removed.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d63939"
    });

    if (!result.isConfirmed) return;

    try {
      await deleteContactMessage(row.id);
      toast.success("Message deleted.");
      fetchMessages();
    } catch (error) {
      const message = error.response?.data?.message || "Failed to delete message.";
      toast.error(message);
    }
  };

  const columns = [
    {
      name: "From",
      cell: (row) => (
        <div>
          <div className="fw-semibold">{row.name}</div>
          <div className="text-secondary small">{row.email}</div>
        </div>
      )
    },
    { name: "Subject", selector: (row) => row.subject || "-" },
    { name: "Destination", selector: (row) => row.destination || "-" },
    {
      name: "Received",
      selector: (row) => format(new Date(row.createdAt), "MMM dd, yyyy")
    },
    {
      name: "Status",
      cell: (row) => (
        <span className={`badge ${STATUS_BADGE[row.status]}`}>{row.status}</span>
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
            title="View"
            onClick={() => handleView(row)}
          >
            <IconEye size={16} />
          </button>

          {row.status !== "RESPONDED" && (
            <button
              type="button"
              className="btn btn-sm btn-outline-success"
              onClick={() => handleStatusChange(row, "RESPONDED")}
            >
              Mark Responded
            </button>
          )}

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
      <PageHeader title="Contact Messages" subtitle="Messages submitted through the public contact form." />

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
                  placeholder="Search name, email, subject..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </div>
            </div>

            <div className="col-md-3">
              <Select
                options={STATUS_OPTIONS}
                value={STATUS_OPTIONS.find((o) => o.value === filters.status)}
                onChange={(opt) => setFilters((prev) => ({ ...prev, status: opt.value }))}
                classNamePrefix="react-select"
              />
            </div>

            <div className="col-md-1">
              <button
                type="button"
                className="btn btn-outline-secondary btn-icon"
                title="Clear filters"
                onClick={() => {
                  setSearchInput("");
                  setFilters({ search: "", status: "" });
                }}
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

      <ContactMessageDetailsModal
        show={Boolean(detailsMessage)}
        onClose={() => setDetailsMessage(null)}
        message={detailsMessage}
      />
    </>
  );
}