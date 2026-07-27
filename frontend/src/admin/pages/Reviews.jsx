import { useCallback, useEffect, useState } from "react";
import Select from "react-select";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { IconEye, IconEyeOff, IconTrash, IconSearch, IconFilterOff, IconStarFilled } from "@tabler/icons-react";

import PageHeader from "../components/common/PageHeader";
import DataTable from "../components/table/DataTable";

import { getAdminReviews, setReviewVisibility, deleteReview } from "../services/reviewService";

const RATING_OPTIONS = [
  { value: "", label: "All Ratings" },
  { value: "5", label: "5 Stars" },
  { value: "4", label: "4 Stars" },
  { value: "3", label: "3 Stars" },
  { value: "2", label: "2 Stars" },
  { value: "1", label: "1 Star" }
];

export default function Reviews() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const [pagination, setPagination] = useState({ page: 1, limit: 10, totalItems: 0 });
  const [searchInput, setSearchInput] = useState("");
  const [filters, setFilters] = useState({ search: "", rating: "" });

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchInput }));
      setPagination((prev) => ({ ...prev, page: 1 }));
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const fetchReviews = useCallback(async () => {
    setLoading(true);

    try {
      const params = { page: pagination.page, limit: pagination.limit };
      if (filters.search) params.search = filters.search;
      if (filters.rating) params.rating = filters.rating;

      const data = await getAdminReviews(params);

      setRows(data.items);
      setPagination((prev) => ({ ...prev, totalItems: data.pagination.totalItems }));
    } catch {
      toast.error("Failed to load reviews.");
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, filters.search, filters.rating]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleClearFilters = () => {
    setSearchInput("");
    setFilters({ search: "", rating: "" });
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleViewFull = (review) => {
    Swal.fire({
      title: `${review.destination?.title || "Destination"}`,
      html: `
        <div style="text-align:left">
          <p><strong>${review.user?.firstName || ""} ${review.user?.lastName || ""}</strong> (${review.user?.email || "-"})</p>
          <p>Rating: ${Number(review.rating)} / 5</p>
          <p>${review.review}</p>
        </div>
      `,
      confirmButtonText: "Close"
    });
  };

  const handleToggleVisibility = async (review) => {
    const newValue = !review.isHidden;

    setRows((prev) =>
      prev.map((row) => (row.id === review.id ? { ...row, isHidden: newValue } : row))
    );

    try {
      await setReviewVisibility(review.id, newValue);
      toast.success(newValue ? "Review hidden." : "Review made visible.");
    } catch (error) {
      setRows((prev) =>
        prev.map((row) => (row.id === review.id ? { ...row, isHidden: review.isHidden } : row))
      );
      const message = error.response?.data?.message || "Failed to update review.";
      toast.error(message);
    }
  };

  const handleDelete = async (review) => {
    const result = await Swal.fire({
      title: "Delete review?",
      text: "This review will be permanently removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d63939"
    });

    if (!result.isConfirmed) return;

    try {
      await deleteReview(review.id);
      toast.success("Review deleted.");
      fetchReviews();
    } catch (error) {
      const message = error.response?.data?.message || "Failed to delete review.";
      toast.error(message);
    }
  };

  const columns = [
    {
      name: "Destination",
      selector: (row) => row.destination?.title || "-",
      sortable: false
    },
    {
      name: "User",
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
      name: "Rating",
      cell: (row) => (
        <div className="d-flex align-items-center gap-1">
          <IconStarFilled size={14} className="text-warning" />
          {Number(row.rating)}
        </div>
      )
    },
    {
      name: "Review",
      grow: 2,
      cell: (row) => (
        <div
          className="text-truncate"
          style={{ maxWidth: "280px", cursor: "pointer" }}
          onClick={() => handleViewFull(row)}
          title="Click to view full review"
        >
          {row.review}
        </div>
      )
    },
    {
      name: "Visible",
      cell: (row) => (
        <label className="form-check form-switch mb-0">
          <input
            className="form-check-input"
            type="checkbox"
            checked={!row.isHidden}
            onChange={() => handleToggleVisibility(row)}
          />
        </label>
      )
    },
    {
      name: "Actions",
      right: true,
      cell: (row) => (
        <div className="btn-list flex-nowrap">
          <button
            type="button"
            className="btn btn-icon btn-sm btn-outline-secondary"
            title="View full review"
            onClick={() => handleViewFull(row)}
          >
            {row.isHidden ? <IconEyeOff size={16} /> : <IconEye size={16} />}
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
      <PageHeader title="Reviews" subtitle="Moderate destination reviews submitted by customers." />

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
                  placeholder="Search review text..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </div>
            </div>

            <div className="col-md-3">
              <Select
                options={RATING_OPTIONS}
                value={RATING_OPTIONS.find((o) => o.value === filters.rating)}
                onChange={(opt) => handleFilterChange("rating", opt.value)}
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
    </>
  );
}