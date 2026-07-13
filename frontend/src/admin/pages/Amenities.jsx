import { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { IconPlus, IconEdit, IconTrash, IconSearch } from "@tabler/icons-react";

import PageHeader from "../components/common/PageHeader";
import DataTable from "../components/table/DataTable";
import AmenityFormModal from "../components/amenity/AmenityFormModal";

import {
  getAllAmenities,
  createAmenity,
  updateAmenity,
  deleteAmenity
} from "../services/amenityService";

export default function Amenities() {
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAmenity, setEditingAmenity] = useState(null);

  const fetchAmenities = async () => {
    setLoading(true);

    try {
      const data = await getAllAmenities();
      setAmenities(data);
    } catch {
      toast.error("Failed to load amenities.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAmenities();
  }, []);

  const filteredAmenities = useMemo(() => {
    if (!search) return amenities;
    const term = search.toLowerCase();
    return amenities.filter((a) => a.name.toLowerCase().includes(term));
  }, [amenities, search]);

  const handleAdd = () => {
    setEditingAmenity(null);
    setModalOpen(true);
  };

  const handleEdit = (amenity) => {
    setEditingAmenity(amenity);
    setModalOpen(true);
  };

  const handleDelete = async (amenity) => {
    const result = await Swal.fire({
      title: "Delete amenity?",
      text: `"${amenity.name}" will be permanently removed.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d63939"
    });

    if (!result.isConfirmed) return;

    try {
      await deleteAmenity(amenity.id);
      toast.success("Amenity deleted.");
      fetchAmenities();
    } catch (error) {
      const message = error.response?.data?.message || "Failed to delete amenity.";
      toast.error(message);
    }
  };

  const handleSaved = () => {
    setModalOpen(false);
    fetchAmenities();
  };

  const saveFn = editingAmenity
    ? (data) => updateAmenity(editingAmenity.id, data)
    : (data) => createAmenity(data);

  const columns = [
    { name: "Name", selector: (row) => row.name, sortable: true },
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
        title="Amenities"
        subtitle="Manage amenities available on destinations."
        actions={
          <button className="btn btn-primary d-flex align-items-center gap-1" onClick={handleAdd}>
            <IconPlus size={18} />
            Add Amenity
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
              placeholder="Search amenity name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="card">
        <DataTable columns={columns} data={filteredAmenities} loading={loading} pagination />
      </div>

      <AmenityFormModal
        show={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={handleSaved}
        amenity={editingAmenity}
        saveFn={saveFn}
      />
    </>
  );
}