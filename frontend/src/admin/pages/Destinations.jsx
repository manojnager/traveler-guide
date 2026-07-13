import { useEffect, useMemo, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { getImageUrl } from "../utils/image";

import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconSearch,
  IconFilterOff
} from "@tabler/icons-react";

import PageHeader from "../components/common/PageHeader";
import DataTable from "../components/table/DataTable";

import {
  getAdminDestinations,
  deleteDestination,
  bulkDeleteDestinations,
  toggleDestinationField
} from "../services/destinationService";
import { getAllCategories } from "../services/categoryService";
import { getAllCountries } from "../services/countryService";
import { getAllCities } from "../services/cityService";

const FEATURED_OPTIONS = [
  { value: "", label: "All" },
  { value: "true", label: "Featured only" },
  { value: "false", label: "Not featured" }
];

const PUBLISHED_OPTIONS = [
  { value: "", label: "All" },
  { value: "true", label: "Published" },
  { value: "false", label: "Draft" }
];

const SORT_MAP = {
  title: { asc: "title_asc", desc: "title_desc" },
  price: { asc: "price_low", desc: "price_high" },
  createdAt: { asc: "oldest", desc: "" }
};

export default function Destinations() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);
  const [clearSelectionToggle, setClearSelectionToggle] = useState(false);

  const [categories, setCategories] = useState([]);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalItems: 0
  });

  const [searchInput, setSearchInput] = useState("");
  const [filters, setFilters] = useState({
    search: "",
    categoryId: "",
    countryId: "",
    cityId: "",
    featured: "",
    published: "",
    sort: ""
  });

  useEffect(() => {
    const loadDropdowns = async () => {
      try {
        const [categoryData, countryData, cityData] = await Promise.all([
          getAllCategories(),
          getAllCountries(),
          getAllCities()
        ]);

        setCategories(categoryData);
        setCountries(countryData);
        setCities(cityData);
      } catch {
        toast.error("Failed to load filter options.");
      }
    };

    loadDropdowns();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchInput }));
      setPagination((prev) => ({ ...prev, page: 1 }));
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const fetchDestinations = useCallback(async () => {
    setLoading(true);

    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit
      };

      if (filters.search) params.search = filters.search;
      if (filters.categoryId) params.categoryId = filters.categoryId;
      if (filters.countryId) params.countryId = filters.countryId;
      if (filters.cityId) params.cityId = filters.cityId;
      if (filters.featured !== "") params.featured = filters.featured;
      if (filters.published !== "") params.published = filters.published;
      if (filters.sort) params.sort = filters.sort;

      const data = await getAdminDestinations(params);

      setRows(data.items);
      setPagination((prev) => ({
        ...prev,
        totalItems: data.pagination.totalItems
      }));
    } catch (error) {
      const message = error.response?.data?.message || "Failed to load destinations.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [
    pagination.page,
    pagination.limit,
    filters.search,
    filters.categoryId,
    filters.countryId,
    filters.cityId,
    filters.featured,
    filters.published,
    filters.sort
  ]);

  useEffect(() => {
    fetchDestinations();
  }, [fetchDestinations]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleClearFilters = () => {
    setSearchInput("");
    setFilters({
      search: "",
      categoryId: "",
      countryId: "",
      cityId: "",
      featured: "",
      published: "",
      sort: ""
    });
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleSort = (column, sortDirection) => {
    const field = column.sortField;
    const mapping = SORT_MAP[field];

    if (!mapping) return;

    handleFilterChange("sort", mapping[sortDirection] || "");
  };

  const handleDelete = async (destination) => {
    const result = await Swal.fire({
      title: "Delete destination?",
      text: `"${destination.title}" will be permanently removed, along with its bookings, reviews, and images.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d63939"
    });

    if (!result.isConfirmed) return;

    try {
      await deleteDestination(destination.id);
      toast.success("Destination deleted.");
      fetchDestinations();
    } catch (error) {
      const message = error.response?.data?.message || "Failed to delete destination.";
      toast.error(message);
    }
  };

  const handleBulkDelete = async () => {
    const result = await Swal.fire({
      title: `Delete ${selectedRows.length} destinations?`,
      text: "This will permanently remove all selected destinations and their related data.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete all",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d63939"
    });

    if (!result.isConfirmed) return;

    try {
      await bulkDeleteDestinations(selectedRows.map((row) => row.id));
      toast.success("Selected destinations deleted.");
      setClearSelectionToggle((prev) => !prev);
      setSelectedRows([]);
      fetchDestinations();
    } catch {
      toast.error("Some destinations could not be deleted.");
      fetchDestinations();
    }
  };

  const handleToggle = async (destination, field) => {
    const newValue = !destination[field];

    setRows((prev) =>
      prev.map((row) => (row.id === destination.id ? { ...row, [field]: newValue } : row))
    );

    try {
      await toggleDestinationField(destination.id, field, newValue);
      toast.success("Updated successfully.");
    } catch (error) {
      setRows((prev) =>
        prev.map((row) =>
          row.id === destination.id ? { ...row, [field]: destination[field] } : row
        )
      );

      const message = error.response?.data?.message || "Failed to update destination.";
      toast.error(message);
    }
  };

  const categoryOptions = useMemo(
    () => [
      { value: "", label: "All Categories" },
      ...categories.map((c) => ({ value: String(c.id), label: c.name }))
    ],
    [categories]
  );

  const countryOptions = useMemo(
    () => [
      { value: "", label: "All Countries" },
      ...countries.map((c) => ({ value: String(c.id), label: c.name }))
    ],
    [countries]
  );

  const cityOptions = useMemo(
    () => [
      { value: "", label: "All Cities" },
      ...cities.map((c) => ({ value: String(c.id), label: c.name }))
    ],
    [cities]
  );

  const columns = [
    {
      name: "Destination",
      sortable: true,
      sortField: "title",
      cell: (row) => (
        <div className="d-flex align-items-center gap-2 py-2">
          <span
            className="avatar avatar-sm"
            style={{
              backgroundImage: row.thumbnail ? `url(${getImageUrl(row.thumbnail)})` : undefined,
              backgroundColor: row.thumbnail ? undefined : "#e6e7e9"
            }}
          />
          <div>
            <div className="fw-semibold">{row.title}</div>
            <div className="text-secondary small">{row.slug}</div>
          </div>
        </div>
      )
    },
    {
      name: "Category",
      selector: (row) => row.category?.name || "-",
      sortable: false
    },
    {
      name: "Location",
      selector: (row) => `${row.city?.name || "-"}, ${row.country?.name || "-"}`,
      sortable: false
    },
    {
      name: "Price",
      sortable: true,
      sortField: "price",
      selector: (row) => `$${Number(row.price).toFixed(2)}`
    },
    {
      name: "Featured",
      cell: (row) => (
        <label className="form-check form-switch mb-0">
          <input
            className="form-check-input"
            type="checkbox"
            checked={row.featured}
            onChange={() => handleToggle(row, "featured")}
          />
        </label>
      )
    },
    {
      name: "Published",
      cell: (row) => (
        <label className="form-check form-switch mb-0">
          <input
            className="form-check-input"
            type="checkbox"
            checked={row.isPublished}
            onChange={() => handleToggle(row, "isPublished")}
          />
        </label>
      )
    },
    {
      name: "Actions",
      right: true,
      cell: (row) => (
        <div className="btn-list flex-nowrap">
          <Link
            to={`/admin/destinations/${row.id}/edit`}
            className="btn btn-icon btn-sm btn-outline-primary"
            title="Edit"
          >
            <IconEdit size={16} />
          </Link>

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
        title="Destinations"
        subtitle="Manage all destinations listed on the platform."
        actions={
          <Link to="/admin/destinations/create" className="btn btn-primary d-flex align-items-center gap-1">
            <IconPlus size={18} />
            Add Destination
          </Link>
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
                  placeholder="Search title or slug..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </div>
            </div>

            <div className="col-md-2">
              <Select
                options={categoryOptions}
                value={categoryOptions.find((o) => o.value === filters.categoryId)}
                onChange={(opt) => handleFilterChange("categoryId", opt.value)}
                classNamePrefix="react-select"
              />
            </div>

            <div className="col-md-2">
              <Select
                options={countryOptions}
                value={countryOptions.find((o) => o.value === filters.countryId)}
                onChange={(opt) => handleFilterChange("countryId", opt.value)}
                classNamePrefix="react-select"
              />
            </div>

            <div className="col-md-2">
              <Select
                options={cityOptions}
                value={cityOptions.find((o) => o.value === filters.cityId)}
                onChange={(opt) => handleFilterChange("cityId", opt.value)}
                classNamePrefix="react-select"
              />
            </div>

            <div className="col-md-2">
              <Select
                options={FEATURED_OPTIONS}
                value={FEATURED_OPTIONS.find((o) => o.value === filters.featured)}
                onChange={(opt) => handleFilterChange("featured", opt.value)}
                classNamePrefix="react-select"
              />
            </div>

            <div className="col-md-1 d-flex justify-content-end">
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

          <div className="row g-2 align-items-center mt-2">
            <div className="col-md-2">
              <Select
                options={PUBLISHED_OPTIONS}
                value={PUBLISHED_OPTIONS.find((o) => o.value === filters.published)}
                onChange={(opt) => handleFilterChange("published", opt.value)}
                classNamePrefix="react-select"
              />
            </div>

            {selectedRows.length > 0 && (
              <div className="col-md-auto ms-auto">
                <button
                  type="button"
                  className="btn btn-danger d-flex align-items-center gap-1"
                  onClick={handleBulkDelete}
                >
                  <IconTrash size={16} />
                  Delete Selected ({selectedRows.length})
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card">
        <DataTable
          columns={columns}
          data={rows}
          loading={loading}
          selectableRows
          clearSelectedRows={clearSelectionToggle}
          onSelectedRowsChange={({ selectedRows: selected }) => setSelectedRows(selected)}
          pagination
          paginationServer
          paginationTotalRows={pagination.totalItems}
          paginationDefaultPage={pagination.page}
          paginationPerPage={pagination.limit}
          onChangePage={(page) => setPagination((prev) => ({ ...prev, page }))}
          onChangeRowsPerPage={(newLimit, page) =>
            setPagination((prev) => ({ ...prev, limit: newLimit, page }))
          }
          sortServer
          onSort={handleSort}
        />
      </div>
    </>
  );
}