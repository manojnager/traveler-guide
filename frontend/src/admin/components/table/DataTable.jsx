import DataTableCore from "react-data-table-component";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const customStyles = {
  table: { style: { backgroundColor: "transparent" } },
  headRow: {
    style: {
      backgroundColor: "var(--tblr-bg-surface, #fff)",
      borderBottomWidth: "1px",
      borderBottomColor: "var(--tblr-border-color, #e6e7e9)",
      minHeight: "48px"
    }
  },
  headCells: {
    style: {
      fontSize: "12px",
      fontWeight: 600,
      textTransform: "uppercase",
      color: "var(--tblr-secondary, #6c7a91)"
    }
  },
  rows: {
    style: {
      backgroundColor: "var(--tblr-bg-surface, #fff)",
      color: "var(--tblr-body-color, #1a1d21)",
      minHeight: "56px",
      borderBottomColor: "var(--tblr-border-color, #e6e7e9)"
    }
  },
  pagination: {
    style: {
      backgroundColor: "var(--tblr-bg-surface, #fff)",
      color: "var(--tblr-body-color, #1a1d21)",
      borderTopColor: "var(--tblr-border-color, #e6e7e9)"
    }
  },
  noData: {
    style: {
      backgroundColor: "var(--tblr-bg-surface, #fff)",
      color: "var(--tblr-secondary, #6c7a91)",
      padding: "3rem 0"
    }
  }
};

function TableSkeleton({ columnCount }) {
  return (
    <div className="p-3">
      {Array.from({ length: 6 }).map((_, rowIndex) => (
        <div key={rowIndex} className="d-flex gap-3 mb-3">
          {Array.from({ length: columnCount }).map((__, colIndex) => (
            <div key={colIndex} style={{ flex: 1 }}>
              <Skeleton height={20} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default function DataTable({ columns, data, loading, ...rest }) {
  return (
    <DataTableCore
      columns={columns}
      data={data}
      customStyles={customStyles}
      progressPending={loading}
      progressComponent={<TableSkeleton columnCount={columns.length} />}
      persistTableHead
      highlightOnHover
      responsive
      {...rest}
    />
  );
}