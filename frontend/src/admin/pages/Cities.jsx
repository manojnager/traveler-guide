import { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import Select from "react-select";
import { IconPlus, IconEdit, IconTrash, IconSearch } from "@tabler/icons-react";

import PageHeader from "../components/common/PageHeader";
import DataTable from "../components/table/DataTable";
import CityFormModal from "../components/city/CityFormModal";

import { getAllCities, createCity, updateCity, deleteCity } from "../services/cityService";
import { getAllCountries } from "../services/countryService";

export default function Cities() {
  const [cities, setCities] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCity, setEditingCity] = useState(null);

  const fetchCities = async () => {
    setLoading(true);

    try {
      const data = await getAllCities();
      setCities(data);
    } catch {
      toast.error("Failed to load cities.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCountries = async () => {
    try {
      const data = await getAllCountries();
      setCountries(data);
    } catch {
      toast.error("Failed to load countries.");
    }
  };

  useEffect(() => {
    fetchCities();
    fetchCountries();
  }, []);

  const countryFilterOptions = useMemo(
    () => [
      { value: "", label: "All Countries" },
      ...countries.map((c) => ({ value: String(c.id), label: c.name }))
    ],
    [countries]
  );

  const filteredCities = useMemo(() => {
    let result = cities;

    if (countryFilter) {
      result = result.filter((c) => String(c.countryId) === countryFilter);
    }

    if (search) {
      const term = search.toLowerCase();
      result = result.filter((c) => c.name.toLowerCase().includes(term));
    }

    return result;
  }, [cities, search, countryFilter]);

  const handleAdd = () => {
    setEditingCity(null);
    setModalOpen(true);
  };

  const handleEdit = (city) => {
    setEditingCity(city);
    setModalOpen(true);
  };

  const handleDelete = async (city) => {
    const result = await Swal.fire({
      title: "Delete city?",
      text: `"${city.name}" will be permanently removed.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d63939"
    });

    if (!result.isConfirmed) return;

    try {
      await deleteCity(city.id);
      toast.success("City deleted.");
      fetchCities();
    } catch (error) {
      const message = error.response?.data?.message || "Failed to delete city.";
      toast.error(message);
    }
  };

  const handleSaved = () => {
    setModalOpen(false);
    fetchCities();
  };

  const saveFn = editingCity
    ? (data) => updateCity(editingCity.id, data)
    : (data) => createCity(data);

  const columns = [
    { name: "Name", selector: (row) => row.name, sortable: true },
    { name: "Country", selector: (row) => row.country?.name || "-", sortable: true },
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
        title="Cities"
        subtitle="Manage cities available on the platform."
        actions={
          <button className="btn btn-primary d-flex align-items-center gap-1" onClick={handleAdd}>
            <IconPlus size={18} />
            Add City
          </button>
        }
      />

      <div className="card mb-3">
        <div className="card-body">
          <div className="row g-2 align-items-center">
            <div className="col-md-3">
              <div className="input-icon">
                <span className="input-icon-addon">
                  <IconSearch size={16} />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search city name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="col-md-3">
              <Select
                options={countryFilterOptions}
                value={countryFilterOptions.find((o) => o.value === countryFilter)}
                onChange={(opt) => setCountryFilter(opt.value)}
                classNamePrefix="react-select"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <DataTable columns={columns} data={filteredCities} loading={loading} pagination />
      </div>

      <CityFormModal
        show={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={handleSaved}
        city={editingCity}
        saveFn={saveFn}
        countries={countries}
      />
    </>
  );
}