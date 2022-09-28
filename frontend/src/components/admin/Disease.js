import React, { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";
import { makeStyles } from "@material-ui/core";
import { DataGrid } from "@mui/x-data-grid";
import AdminSiteLayout from "../../layout/AdminSiteLayout";
import { Grid } from "@mui/material";
import Search, { SearchIconWrapper, StyledInputBase } from "../../theme/search";
import CustomNoRowsOverlay from "../common/CustomNoRowsOverlay";
import axios from "axios";

export default function Disease() {
  const [rows, setRows] = useState([]);
  const BACKEND_URL = process.env;
  // Table Cell에 Outline 제거 => <DataGrid>에 className={useStyles().root} 추가
  const useStyles = makeStyles({
    root: {
      "&.MuiDataGrid-root .MuiDataGrid-columnHeader:focus, &.MuiDataGrid-root .MuiDataGrid-cell:focus":
        {
          outline: "none",
        },
      "&.MuiDataGrid-root .MuiDataGrid-columnHeaderCheckbox .MuiDataGrid-columnHeaderTitleContainer":
        {
          display: "none",
        },
    },
  });

  useEffect(() => {
    fetchList();
  }, []);

  const fetchList = async () => {
    await axios
      .get(BACKEND_URL+"/api/admin/diseasedata", {
        headers: {
          Authorization: window.localStorage.getItem("Authorization"),
        },
      })
      .then((res) => {
        setRows(
          res.data.data.map((element) => {
            return {
              id: element.diseaseNumber,
              diseaseNumber: element.diseaseNumber,
              diseaseName: element.diseaseName,
            };
          })
        );
      });
  };

  const keywordChanged = async (keyword) => {
    await axios
      .get(`${BACKEND_URL}/api/admin/diseasedata?kw=${keyword}`, {
        headers: {
          Authorization: window.localStorage.getItem("Authorization"),
        },
      })
      .then((res) => {
        setRows(
          res.data.data.map((element) => {
            return {
              id: element.diseaseNumber,
              diseaseNumber: element.diseaseNumber,
              diseaseName: element.diseaseName,
            };
          })
        );
      });
  };

  return (
    <AdminSiteLayout>
      <h1 align="center">질병 관리</h1>
      <div style={{ height: 680 }}>
        <DataGrid
          style={{ marginLeft: "32px", marginRight: "32px" }}
          className={useStyles().root}
          disableColumnMenu // 메뉴 삭제
          disableSelectionOnClick // 선택 X
          hideFooterSelectedRowCount // 체크박스 선택갯수 표시 삭제
          checkboxSelection // 체크박스 표시
          rows={rows}
          columns={columns}
          components={{
            Toolbar: SearchToolbar,
            NoRowsOverlay: CustomNoRowsOverlay,
          }}
          componentsProps={{
            toolbar: { callback: keywordChanged, rows: rows },
          }}
          rowsPerPageOptions={[10]}
          pageSize={10}
          onSelectionModelChange={(id) => {
            if (id.length > 1) {
              id.shift();
            }
          }}
        ></DataGrid>
      </div>
    </AdminSiteLayout>
  );
}

// Search 부분
function SearchToolbar({ callback, rows }) {
  return (
    <div style={{ marginTop: "10px" }}>
      <Grid justifyContent="flex-end" alignItems="flex-start">
        <span style={{ float: "left" }}>
          <Button variant="contained" sx={{ ml: 1 }}>
            <CSVLink
              headers={headers}
              data={rows}
              filename="질병.csv"
              target="_blank"
              style={{ textDecoration: "none", color: "white" }}
            >
              EXCEL EXPORT
            </CSVLink>
          </Button>
        </span>

        <Search style={{ float: "right" }}>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="질병 검색"
            inputProps={{ "aria-label": "search" }}
            onChange={(e) => {
              callback(e.target.value);
            }}
          />
        </Search>
      </Grid>
    </div>
  );
}

const columns = [
  {
    field: "diseaseNumber",
    headerName: "질병코드",
    width: 180,
    sortable: false,
    flex: 0.1,
  },
  { field: "diseaseName", headerName: "질병 명", sortable: false, flex: 1 },
];

const headers = [
  { label: "질병코드", key: "diseaseNumber" },
  { label: "질병 명", key: "diseaseName" },
];
