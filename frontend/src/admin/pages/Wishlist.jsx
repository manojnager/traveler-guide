import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { IconSearch, IconTrash } from "@tabler/icons-react";
import { format } from "date-fns";

import PageHeader from "../components/common/PageHeader";
import DataTable from "../components/table/DataTable";
import { getImageUrl } from "../utils/image";

import { getAdminWishlist, deleteWishlistItem } from "../services/wishlistService";

export default function Wishlist() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const [pagination, setPagination] = useState({ page: 1, limit: 10, totalItems: 0 });
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPagination((prev) => ({ ...prev, page: 1 }));
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const fetchWishlist = useCallback(async () => {
    setLoading(true);

    try {
      const params = { page: pagination.page, limit: pagination.limit };
      if (search) params.search = search;

      const data = await getAdminWishlist(params);

      setRows(data.items);
      setPagination((prev) => ({ ...prev, totalItems: data.pagination.totalItems }));
    } catch {
      toast.error("Failed to load wishlist.");
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, search]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const handleRemove = async (row) => {
    const result = await Swal.fire({
      title: "Remove from wishlist?",
      text: `Remove "${row.destination?.title}" from ${row.user?.firstName} ${row.user?.lastName}'s wishlist?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Remove",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d63939"
    });

    if (!result.isConfirmed) return;

    try {
      await deleteWishlistItem(row.userId, row.destinationId);
      toast.success("Removed from wishlist.");
      fetchWishlist();
    } catch (error) {
      const message = error.response?.data?.message || "Failed to remove wishlist entry.";
      toast.error(message);
    }
  };

  const columns = [
    {
      name: "Destination",
      cell: (row) => (
        <div className="d-flex align-items-center gap-2 py-2">
          <span
            className="avatar avatar-sm"
            style={{
              backgroundImage: row.destination?.thumbnail
                ? `url(${getImageUrl(row.destination.thumbnail)})`
                : undefined,
              backgroundColor: row.destination?.thumbnail ? undefined : "#e6e7e9"
            }}
          />
          <div>
            <div className="fw-semibold">{row.destination?.title || "-"}</div>
            <div className="text-secondary small">{row.destination?.slug}</div>
          </div>
        </div>
      )
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
      name: "Added",
      selector: (row) => format(new Date(row.createdAt), "dd MMM yyyy")
    },
    {
      name: "Actions",
      right: true,
      cell: (row) => (
        <div className="btn-list flex-nowrap">
          <Link
            to={`/admin/destinations/${row.destinationId}/edit`}
            className="btn btn-sm btn-outline-primary"
          >
            View Destination
          </Link>

          <button
            type="button"
            className="btn btn-icon btn-sm btn-outline-danger"
            title="Remove"
            onClick={() => handleRemove(row)}
          >
            <IconTrash size={16} />
          </button>
        </div>
      )
    }
  ];

  return (
    <>
      <PageHeader
        title="Wishlist"
        subtitle="See what customers have saved for later."
      />

      <div className="card mb-3">
        <div className="card-body">
          <div className="input-icon" style={{ maxWidth: "320px" }}>
            <span className="input-icon-addon">
              <IconSearch size={16} />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search user or destination..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
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