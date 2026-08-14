import { useCallback, useEffect, useState } from "react";
import Select from "react-select";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { IconSearch } from "@tabler/icons-react";

import PageHeader from "../components/common/PageHeader";
import DataTable from "../components/table/DataTable";

import { getAdminEmailLogs } from "../services/emailLogService";

const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "SENT", label: "Sent" },
  { value: "FAILED", label: "Failed" }
];

export default function EmailLogs() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const [pagination, setPagination] = useState({ page: 1, limit: 15, totalItems: 0 });
  const [searchInput, setSearchInput] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setPagination((prev) => ({ ...prev, page: 1 }));
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const fetchLogs = useCallback(async () => {
    setLoading(true);

    try {
      const params = { page: pagination.page, limit: pagination.limit };
      if (searchInput) params.search = searchInput;
      if (status) params.status = status;

      const data = await getAdminEmailLogs(params);

      setRows(data.items);
      setPagination((prev) => ({ ...prev, totalItems: data.pagination.totalItems }));
    } catch {
      toast.error("Failed to load email logs.");
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, searchInput, status]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const columns = [
    { name: "To", selector: (row) => row.toEmail },
    { name: "Subject", selector: (row) => row.subject },
    { name: "Type", selector: (row) => row.type },
    {
      name: "Status",
      cell: (row) => (
        <span className={`badge ${row.status === "SENT" ? "bg-green-lt text-green" : "bg-red-lt text-red"}`}>
          {row.status}
        </span>
      )
    },
    {
      name: "Error",
      cell: (row) =>
        row.errorMessage ? (
          <span className="text-danger small" title={row.errorMessage}>
            {row.errorMessage.length > 40 ? `${row.errorMessage.slice(0, 40)}...` : row.errorMessage}
          </span>
        ) : (
          "-"
        )
    },
    {
      name: "Sent At",
      selector: (row) => format(new Date(row.createdAt), "MMM dd, yyyy h:mm a")
    }
  ];

  return (
    <>
      <PageHeader title="Email Logs" subtitle="History of all outgoing emails and their delivery status." />

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
                  placeholder="Search recipient email..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </div>
            </div>

            <div className="col-md-3">
              <Select
                options={STATUS_OPTIONS}
                value={STATUS_OPTIONS.find((o) => o.value === status)}
                onChange={(opt) => setStatus(opt.value)}
                classNamePrefix="react-select"
              />
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