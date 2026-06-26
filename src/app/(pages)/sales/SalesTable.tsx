"use client";

import { DataGridStyles } from "@/components/DataGridStyles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  DataGrid,
  type GridColDef,
  type GridColumnVisibilityModel,
} from "@mui/x-data-grid";
import { GridToolbar } from "@mui/x-data-grid/internals";

type SalesRow = {
  id: string;
  soldAt: Date;
  productId: string;
  productName: string;
  sku: string | null;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
};

type SalesTableProps = {
  rows: SalesRow[];
};

export default function SalesTable({ rows }: SalesTableProps) {
  const smallScreen = useMediaQuery("(max-width:1200px)");

  const columnVisibilityModel: GridColumnVisibilityModel = smallScreen
    ? {
        productId: false,
        sku: false,
      }
    : {};

  const columns: GridColDef<SalesRow>[] = [
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
      field: "soldAt",
      headerName: "Date",
      width: smallScreen ? 100 : undefined,
      flex: smallScreen ? undefined : 0.9,
      headerAlign: "center",
      align: "center",
      headerClassName: "inventory-header",
      renderCell: (params) => {
        const date =
          params.row.soldAt instanceof Date
            ? params.row.soldAt
            : new Date(String(params.row.soldAt));

        return date.toLocaleDateString();
      },
    },
    {
      field: "productName",
      headerName: smallScreen ? "Product" : "Product Name",
      width: smallScreen ? 140 : undefined,
      flex: smallScreen ? undefined : 1,
      headerAlign: "center",
      align: "left",
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
      field: "quantity",
      headerName: smallScreen ? "Qty" : "Quantity",
      width: smallScreen ? 80 : undefined,
      flex: smallScreen ? undefined : 0.7,
      type: "number",
      headerAlign: "center",
      align: "center",
      headerClassName: "inventory-header",
    },
    {
      field: "unitPrice",
      headerName: "Unit Price",
      width: smallScreen ? 90 : undefined,
      flex: smallScreen ? undefined : 0.8,
      type: "number",
      headerAlign: "center",
      align: "center",
      headerClassName: "inventory-header",
      valueFormatter: (value) => `$${Number(value).toFixed(2)}`,
    },
    {
      field: "totalAmount",
      headerName: "Total Amount",
      width: smallScreen ? 100 : undefined,
      flex: smallScreen ? undefined : 0.8,
      type: "number",
      headerAlign: "center",
      align: "center",
      headerClassName: "inventory-header",
      valueFormatter: (value) => `$${Number(value).toFixed(2)}`,
    },
    {
      field: "productId",
      headerName: "Product ID",
      width: smallScreen ? 120 : undefined,
      flex: smallScreen ? undefined : 0.9,
      headerAlign: "center",
      align: "center",
      headerClassName: "inventory-header",
    },
  ];

  return (
    <div className="mr-6 p-1">
      <div style={{ width: smallScreen ? 591 : "100%" }}>
        <DataGrid
          className="inventory-grid"
          rows={rows}
          columns={columns}
          getRowId={(row) => row.id}
          disableRowSelectionOnClick
          pageSizeOptions={[10, 25, 50, 100]}
          columnVisibilityModel={columnVisibilityModel}
          slots={{ toolbar: GridToolbar }}
          showToolbar
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 25,
                page: 0,
              },
            },
          }}
          sx={DataGridStyles}
          slotProps={{
            basePopper: {
              className: "inventory-grid-popper",
            },
          }}
        />
      </div>
    </div>
  );
}
