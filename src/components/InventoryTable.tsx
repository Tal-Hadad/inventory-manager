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
  const smallScreen = useMediaQuery("(max-width:1500px)");
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
        m: 3,
        pr: 1,
        border: "1px solid #e4e4e7",
        backgroundColor: "#ffffff",
        color: "#18181b",

        "& .MuiDataGrid-main": {
          backgroundColor: "#ffffff",
        },

        "& .MuiDataGrid-columnHeaders": {
          backgroundColor: "#ffffff",
          color: "#18181b",
          borderBottom: "1px solid #e4e4e7",
        },

        "& .inventory-header": {
          backgroundColor: "#ffffff",
          color: "#18181b",
          fontWeight: 700,
        },

        "& .MuiDataGrid-columnHeaderTitle": {
          width: "100%",
          fontWeight: 700,
        },

        "& .MuiDataGrid-row": {
          backgroundColor: "#ffffff",
        },

        "& .MuiDataGrid-cell": {
          backgroundColor: "#ffffff",
          color: "#18181b",
          borderBottom: "1px solid #e4e4e7",
          textAlign: "center",
        },

        "& .MuiDataGrid-row:hover": {
          backgroundColor: "#f4f4f5",
        },

        "& .MuiDataGrid-footerContainer": {
          backgroundColor: "#ffffff",
          color: "#18181b",
          borderTop: "1px solid #e4e4e7",
        },

        "& .MuiDataGrid-filler": {
          backgroundColor: "#ffffff",
        },

        "& .MuiDataGrid-scrollbarFiller": {
          backgroundColor: "#ffffff",
        },

        "& .MuiTablePagination-root": {
          color: "#18181b",
        },

        "& .MuiSvgIcon-root": {
          color: "#52525b",
        },

        ".dark &": {
          border: "1px solid #3f3f46",
          backgroundColor: "#18181b",
          color: "#f4f4f5",
        },

        ".dark & .MuiDataGrid-main": {
          backgroundColor: "#18181b",
        },

        ".dark & .MuiDataGrid-columnHeaders": {
          backgroundColor: "#18181b",
          color: "#f4f4f5",
          borderBottom: "1px solid #3f3f46",
        },

        ".dark & .inventory-header": {
          backgroundColor: "#18181b",
          color: "#f4f4f5",
        },

        ".dark & .MuiDataGrid-row": {
          backgroundColor: "#18181b",
        },

        ".dark & .MuiDataGrid-cell": {
          backgroundColor: "#18181b",
          color: "#f4f4f5",
          borderBottom: "1px solid #555962",
        },

        ".dark & .MuiDataGrid-row:hover": {
          backgroundColor: "#27272a",
        },

        ".dark & .MuiDataGrid-footerContainer": {
          backgroundColor: "#18181b",
          color: "#f4f4f5",
          borderTop: "1px solid #3f3f46",
        },

        ".dark & .MuiDataGrid-filler": {
          backgroundColor: "#18181b",
        },

        ".dark & .MuiDataGrid-scrollbarFiller": {
          backgroundColor: "#18181b",
        },

        ".dark & .MuiTablePagination-root": {
          color: "#f4f4f5",
        },

        ".dark & .MuiSvgIcon-root": {
          color: "#a1a1aa",
        },
      }}
    />
  );
}
