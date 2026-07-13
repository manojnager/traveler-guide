import { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { IconPlus, IconEdit, IconTrash, IconSearch } from "@tabler/icons-react";

import PageHeader from "../components/common/PageHeader";
import DataTable from "../components/table/DataTable";
import CategoryFormModal from "../components/category/CategoryFormModal";

import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from "../services/categoryService";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const fetchCategories = async () => {
    setLoading(true);

    try {
      const data = await getAllCategories();
      setCategories(data);
    } catch {
      toast.error("Failed to load categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredCategories = useMemo(() => {
    if (!search) return categories;
    const term = search.toLowerCase();
    return categories.filter(
      (c) => c.name.toLowerCase().includes(term) || c.slug.toLowerCase().includes(term)
    );
  }, [categories, search]);

  const handleAdd = () => {
    setEditingCategory(null);
    setModalOpen(true);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setModalOpen(true);
  };

  const handleDelete = async (category) => {
    const result = await Swal.fire({
      title: "Delete category?",
      text: `"${category.name}" will be permanently removed.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d63939"
    });

    if (!result.isConfirmed) return;

    try {
      await deleteCategory(category.id);
      toast.success("Category deleted.");
      fetchCategories();
    } catch (error) {
      const message = error.response?.data?.message || "Failed to delete category.";
      toast.error(message);
    }
  };

  const handleSaved = () => {
    setModalOpen(false);
    fetchCategories();
  };

  const saveFn = editingCategory
    ? (data) => updateCategory(editingCategory.id, data)
    : (data) => createCategory(data);

  const columns = [
    { name: "Name", selector: (row) => row.name, sortable: true },
    { name: "Slug", selector: (row) => row.slug, sortable: true },
    {
      name: "Destinations",
      selector: (row) => row._count?.destinations ?? 0,
      sortable: true,
      center: true
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
        title="Categories"
        subtitle="Manage destination categories."
        actions={
          <button className="btn btn-primary d-flex align-items-center gap-1" onClick={handleAdd}>
            <IconPlus size={18} />
            Add Category
          </button>
        }
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
              placeholder="Search name or slug..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="card">
        <DataTable columns={columns} data={filteredCategories} loading={loading} pagination />
      </div>

      <CategoryFormModal
        show={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={handleSaved}
        category={editingCategory}
        saveFn={saveFn}
      />
    </>
  );
}