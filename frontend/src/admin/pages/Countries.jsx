import { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { IconPlus, IconEdit, IconTrash, IconSearch } from "@tabler/icons-react";

import PageHeader from "../components/common/PageHeader";
import DataTable from "../components/table/DataTable";
import CountryFormModal from "../components/country/CountryFormModal";

import {
  getAllCountries,
  createCountry,
  updateCountry,
  deleteCountry
} from "../services/countryService";

export default function Countries() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCountry, setEditingCountry] = useState(null);

  const fetchCountries = async () => {
    setLoading(true);

    try {
      const data = await getAllCountries();
      setCountries(data);
    } catch {
      toast.error("Failed to load countries.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  const filteredCountries = useMemo(() => {
    if (!search) return countries;
    const term = search.toLowerCase();
    return countries.filter(
      (c) => c.name.toLowerCase().includes(term) || c.code.toLowerCase().includes(term)
    );
  }, [countries, search]);

  const handleAdd = () => {
    setEditingCountry(null);
    setModalOpen(true);
  };

  const handleEdit = (country) => {
    setEditingCountry(country);
    setModalOpen(true);
  };

  const handleDelete = async (country) => {
    const result = await Swal.fire({
      title: "Delete country?",
      text: `"${country.name}" will be permanently removed.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d63939"
    });

    if (!result.isConfirmed) return;

    try {
      await deleteCountry(country.id);
      toast.success("Country deleted.");
      fetchCountries();
    } catch (error) {
      const message = error.response?.data?.message || "Failed to delete country.";
      toast.error(message);
    }
  };

  const handleSaved = () => {
    setModalOpen(false);
    fetchCountries();
  };

  const saveFn = editingCountry
    ? (data) => updateCountry(editingCountry.id, data)
    : (data) => createCountry(data);

  const columns = [
    { name: "Name", selector: (row) => row.name, sortable: true },
    { name: "Code", selector: (row) => row.code, sortable: true, width: "100px" },
    {
      name: "Cities",
      selector: (row) => row._count?.cities ?? 0,
      sortable: true,
      center: true
    },
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
        title="Countries"
        subtitle="Manage countries available on the platform."
        actions={
          <button className="btn btn-primary d-flex align-items-center gap-1" onClick={handleAdd}>
            <IconPlus size={18} />
            Add Country
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
              placeholder="Search name or code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="card">
        <DataTable columns={columns} data={filteredCountries} loading={loading} pagination />
      </div>

      <CountryFormModal
        show={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={handleSaved}
        country={editingCountry}
        saveFn={saveFn}
      />
    </>
  );
}