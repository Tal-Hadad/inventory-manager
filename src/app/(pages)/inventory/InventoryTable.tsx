"use client";

import useMediaQuery from "@mui/material/useMediaQuery";
import {
  DataGrid,
  GridColDef,
  GridColumnVisibilityModel,
} from "@mui/x-data-grid";

type InventoryRow = {
  id: string;
  name: string;
  sku: string | null;
  price: number;
  costPrice: number;
  rating: number | null;
  stockQuantity: number;
  reorderPoint: number;
};

type InventoryTableProps = {
  rows: InventoryRow[];
};

export default function InventoryTable({ rows }: InventoryTableProps) {
  const smallScreen = useMediaQuery("(max-width:1200px)");
  const columnVisibilityModel: GridColumnVisibilityModel = smallScreen
    ? {
        sku: false,
        costPrice: false,
        reorderPoint: false,
        stockStatus: false,
      }
    : {};

  const columns: GridColDef<InventoryRow>[] = [
    {
      field: "id",
      headerName: "ID",
      width: smallScreen ? 80 : undefined,
      flex: smallScreen ? undefined : 0.7,
      headerAlign: "center",
      align: "center",
      headerClassName: "inventory-header",
    },
    {
      field: "sku",
      headerName: "SKU",
      width: smallScreen ? 90 : undefined,
      flex: smallScreen ? undefined : 0.7,
      headerAlign: "center",
      align: "center",
      headerClassName: "inventory-header",
      renderCell: (params) => params.row.sku ?? "N/A",
    },
    {
      field: "name",
      headerName: "Product Name",
      width: smallScreen ? 180 : undefined,
      flex: smallScreen ? undefined : 1,
      headerAlign: "center",
      align: "left",
      headerClassName: "inventory-header",
    },
    {
      field: "price",
      headerName: "Price",
      width: smallScreen ? 90 : undefined,
      flex: smallScreen ? undefined : 0.8,
      type: "number",
      headerAlign: "center",
      align: "center",
      headerClassName: "inventory-header",
      valueFormatter: (value) => `$${Number(value).toFixed(2)}`,
    },
    {
      field: "costPrice",
      headerName: "Cost Price",
      width: smallScreen ? 100 : undefined,
      flex: smallScreen ? undefined : 0.8,
      type: "number",
      headerAlign: "center",
      align: "center",
      headerClassName: "inventory-header",
      valueFormatter: (value) => `$${Number(value).toFixed(2)}`,
    },
    {
      field: "rating",
      headerName: "Rating",
      width: smallScreen ? 80 : undefined,
      flex: smallScreen ? undefined : 0.7,
      headerAlign: "center",
      align: "center",
      headerClassName: "inventory-header",
      renderCell: (params) =>
        params.row.rating !== null ? params.row.rating.toFixed(1) : "N/A",
    },
    {
      field: "stockQuantity",
      headerName: smallScreen ? "StockQTY" : "Stock Quantity",
      width: smallScreen ? 110 : undefined,
      flex: smallScreen ? undefined : 0.8,
      type: "number",
      headerAlign: "center",
      align: "center",
      headerClassName: "inventory-header",
    },
    {
      field: "reorderPoint",
      headerName: "Reorder Point",
      width: smallScreen ? 110 : undefined,
      flex: smallScreen ? undefined : 0.8,
      type: "number",
      headerAlign: "center",
      align: "center",
      headerClassName: "inventory-header",
    },
    {
      field: "stockStatus",
      headerName: "Stock Status",
      width: smallScreen ? 100 : undefined,
      flex: smallScreen ? undefined : 0.8,
      sortable: false,
      filterable: false,
      headerAlign: "center",
      align: "center",
      headerClassName: "inventory-header",
      renderCell: (params) => {
        const stock = params.row.stockQuantity;
        const reorderPoint = params.row.reorderPoint;

        if (stock === 0) return "Out of stock";
        if (stock <= reorderPoint) return "Low stock";
        return "In stock";
      },
    },
  ];

  return (
    <div className="mr-3 p-1">
      <div style={{ width: smallScreen ? 542 : "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row.id}
          disableRowSelectionOnClick
          pageSizeOptions={[10, 25, 50, 100]}
          columnVisibilityModel={columnVisibilityModel}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 25,
                page: 0,
              },
            },
          }}
          sx={{
            "--grid-bg": "#ffffff",
            "--grid-text": "#18181b",
            "--grid-border": "#e4e4e7",
            "--grid-hover": "#f4f4f5",
            "--grid-icon": "#52525b",
            border: "1px solid var(--grid-border)",
            backgroundColor: "var(--grid-bg)",
            color: "var(--grid-text)",

            "& .MuiDataGrid-main": {
              backgroundColor: "var(--grid-bg)",
            },

            "& .MuiDataGrid-row": {
              backgroundColor: "var(--grid-bg)",
            },

            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "var(--grid-bg)",
              color: "var(--grid-text)",
              borderBottom: "1px solid var(--grid-border)",
            },

            "& .MuiDataGrid-columnHeader": {
              backgroundColor: "var(--grid-bg)",
              color: "var(--grid-text)",
            },

            "& .MuiDataGrid-cell": {
              backgroundColor: "var(--grid-bg)",
              color: "var(--grid-text)",
              borderBottom: "1px solid var(--grid-border)",
              textAlign: "center",
            },

            "& .MuiDataGrid-row:hover": {
              backgroundColor: "var(--grid-hover)",
            },

            "& .MuiDataGrid-footerContainer": {
              backgroundColor: "var(--grid-bg)",
              color: "var(--grid-text)",
              borderTop: "1px solid var(--grid-border)",
            },

            "& .MuiTablePagination-root, & .MuiSvgIcon-root": {
              color: "var(--grid-icon)",
            },

            ".dark &": {
              "--grid-bg": "#18181b",
              "--grid-text": "#f4f4f5",
              "--grid-border": "#3f3f46",
              "--grid-hover": "#27272a",
              "--grid-icon": "#a1a1aa",
            },
          }}
        />
      </div>
    </div>
  );
}
