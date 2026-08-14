import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { format } from "date-fns";
import { IconPlus, IconEdit, IconTrash, IconSearch, IconFilterOff } from "@tabler/icons-react";

import PageHeader from "../components/common/PageHeader";
import DataTable from "../components/table/DataTable";
import { getImageUrl } from "../../utils/image";

import { getAdminBlogPosts, deleteBlogPost } from "../services/blogService";

const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "DRAFT", label: "Draft" },
  { value: "PUBLISHED", label: "Published" }
];

export default function BlogPosts() {
  const navigate = useNavigate();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const fetchPosts = useCallback(async () => {
    setLoading(true);

    try {
      const params = { page: pagination.page, limit: pagination.limit };
      if (filters.search) params.search = filters.search;
      if (filters.status) params.status = filters.status;

      const data = await getAdminBlogPosts(params);

      setRows(data.items);
      setPagination((prev) => ({ ...prev, totalItems: data.pagination.totalItems }));
    } catch {
      toast.error("Failed to load blog posts.");
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, filters.search, filters.status]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleDelete = async (post) => {
    const result = await Swal.fire({
      title: "Delete post?",
      text: `"${post.title}" will be permanently removed.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d63939"
    });

    if (!result.isConfirmed) return;

    try {
      await deleteBlogPost(post.id);
      toast.success("Post deleted.");
      fetchPosts();
    } catch (error) {
      const message = error.response?.data?.message || "Failed to delete post.";
      toast.error(message);
    }
  };

  const columns = [
    {
      name: "Post",
      grow: 2,
      cell: (row) => (
        <div className="d-flex align-items-center gap-2 py-2">
          <span
            className="avatar avatar-sm"
            style={{
              backgroundImage: row.coverImage ? `url(${getImageUrl(row.coverImage)})` : undefined,
              backgroundColor: row.coverImage ? undefined : "#e6e7e9"
            }}
          />
          <div>
            <div className="fw-semibold">{row.title}</div>
            <div className="text-secondary small">{row.slug}</div>
          </div>
        </div>
      )
    },
    { name: "Category", selector: (row) => row.category },
    {
      name: "Author",
      selector: (row) => `${row.author?.firstName || ""} ${row.author?.lastName || ""}`.trim() || "-"
    },
    {
      name: "Status",
      cell: (row) => (
        <span className={`badge ${row.status === "PUBLISHED" ? "bg-green-lt text-green" : "bg-secondary-lt"}`}>
          {row.status}
        </span>
      )
    },
    {
      name: "Date",
      selector: (row) =>
        row.publishedAt
          ? format(new Date(row.publishedAt), "MMM dd, yyyy")
          : format(new Date(row.createdAt), "MMM dd, yyyy")
    },
    {
      name: "Actions",
      right: true,
      cell: (row) => (
        <div className="btn-list flex-nowrap">
          <button
            type="button"
            className="btn btn-icon btn-sm btn-outline-primary"
            title="Edit"
            onClick={() => navigate(`/admin/blog/${row.id}/edit`)}
          >
            <IconEdit size={16} />
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
      <PageHeader
        title="Travel Journal"
        subtitle="Manage blog posts shown on the public Travel Journal page."
        actions={
          <button
            className="btn btn-primary d-flex align-items-center gap-1"
            onClick={() => navigate("/admin/blog/create")}
          >
            <IconPlus size={18} />
            New Post
          </button>
        }
      />

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
                  placeholder="Search title or excerpt..."
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
    </>
  );
}