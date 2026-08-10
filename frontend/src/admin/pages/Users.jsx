import { useCallback, useEffect, useState } from "react";
import Select from "react-select";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { IconPlus, IconEdit, IconTrash, IconSearch, IconFilterOff } from "@tabler/icons-react";

import PageHeader from "../components/common/PageHeader";
import DataTable from "../components/table/DataTable";
import UserFormModal from "../components/user/UserFormModal";
import { useAuth } from "../context/AuthContext";

import { getAdminUsers, createUser, updateUser, deleteUser } from "../services/userService";
import { getAllRoles } from "../services/roleService";

import { getImageUrl } from "../../utils/image";

const STATUS_FILTER_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" }
];

export default function Users() {
  const { user: currentUser } = useAuth();

  const [rows, setRows] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [pagination, setPagination] = useState({ page: 1, limit: 10, totalItems: 0 });
  const [searchInput, setSearchInput] = useState("");
  const [filters, setFilters] = useState({ search: "", roleId: "", status: "" });

  useEffect(() => {
    const loadRoles = async () => {
      try {
        const data = await getAllRoles();
        setRoles(data);
      } catch {
        toast.error("Failed to load roles.");
      }
    };
    loadRoles();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchInput }));
      setPagination((prev) => ({ ...prev, page: 1 }));
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);

    try {
      const params = { page: pagination.page, limit: pagination.limit };
      if (filters.search) params.search = filters.search;
      if (filters.roleId) params.roleId = filters.roleId;
      if (filters.status) params.status = filters.status;

      const data = await getAdminUsers(params);

      setRows(data.items);
      setPagination((prev) => ({ ...prev, totalItems: data.pagination.totalItems }));
    } catch {
      toast.error("Failed to load users.");
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, filters.search, filters.roleId, filters.status]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleClearFilters = () => {
    setSearchInput("");
    setFilters({ search: "", roleId: "", status: "" });
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleAdd = () => {
    setEditingUser(null);
    setModalOpen(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setModalOpen(true);
  };

  const handleDelete = async (user) => {
    if (user.id === currentUser?.id) {
      toast.error("You cannot delete your own account.");
      return;
    }

    const result = await Swal.fire({
      title: "Delete user?",
      text: `"${user.firstName} ${user.lastName}" will be permanently removed.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d63939"
    });

    if (!result.isConfirmed) return;

    try {
      await deleteUser(user.id);
      toast.success("User deleted.");
      fetchUsers();
    } catch (error) {
      const message = error.response?.data?.message || "Failed to delete user.";
      toast.error(message);
    }
  };

  const handleSaved = () => {
    setModalOpen(false);
    fetchUsers();
  };

  const saveFn = editingUser
    ? (data) => updateUser(editingUser.id, data)
    : (data) => createUser(data);

  const roleFilterOptions = [
    { value: "", label: "All Roles" },
    ...roles.map((r) => ({ value: String(r.id), label: r.name }))
  ];

  const AVATAR_COLORS = ["C8A96A", "6C7A91", "1F9D55", "D63939", "206BC4", "9C6ADE", "F59F00"];

  const getFallbackAvatarUrl = (user) => {
    const name = `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User";
    const colorIndex = user.id % AVATAR_COLORS.length;
    const background = AVATAR_COLORS[colorIndex];
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${background}&color=fff&size=64&bold=true`;
  };

  const columns = [
    {
      name: "Name",
      sortable: true,
      selector: (row) => `${row.firstName} ${row.lastName}`,
      cell: (row) => (
        <div className="d-flex align-items-center gap-2 py-2">
          <span
            className="avatar avatar-sm rounded-circle adminuserimages"
            style={{
              backgroundImage: `url(${row.avatar ? getImageUrl(row.avatar) : getFallbackAvatarUrl(row)})`
            }}
          />
          <div className="fw-semibold">
            {row.firstName} {row.lastName}
          </div>
        </div>
      )
    },
    { name: "Email", selector: (row) => row.email },
    { name: "Phone", selector: (row) => row.phone || "-" },
    {
      name: "Role",
      cell: (row) => (
        <span className={`badge ${row.role?.name === "Admin" ? "bg-blue-lt text-blue" : "bg-secondary-lt"}`}>
          {row.role?.name}
        </span>
      )
    },
    {
      name: "Status",
      cell: (row) => (
        <span className={`badge ${row.status === "ACTIVE" ? "bg-green-lt text-green" : "bg-red-lt text-red"}`}>
          {row.status}
        </span>
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
            title="Edit"
            onClick={() => handleEdit(row)}
          >
            <IconEdit size={16} />
          </button>

          <button
            type="button"
            className="btn btn-icon btn-sm btn-outline-danger"
            title="Delete"
            onClick={() => handleDelete(row)}
            disabled={row.id === currentUser?.id}
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
        title="Users"
        subtitle="Manage admin and customer accounts."
        actions={
          <button className="btn btn-primary d-flex align-items-center gap-1" onClick={handleAdd}>
            <IconPlus size={18} />
            Add User
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
                  placeholder="Search name or email..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </div>
            </div>

            <div className="col-md-3">
              <Select
                options={roleFilterOptions}
                value={roleFilterOptions.find((o) => o.value === filters.roleId)}
                onChange={(opt) => handleFilterChange("roleId", opt.value)}
                classNamePrefix="react-select"
              />
            </div>

            <div className="col-md-3">
              <Select
                options={STATUS_FILTER_OPTIONS}
                value={STATUS_FILTER_OPTIONS.find((o) => o.value === filters.status)}
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

      <UserFormModal
        show={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={handleSaved}
        user={editingUser}
        saveFn={saveFn}
        roles={roles}
        isSelf={editingUser?.id === currentUser?.id}
      />
    </>
  );
}