import type { SxProps, Theme } from "@mui/material/styles";

export const DataGridStyles: SxProps<Theme> = {
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
};
