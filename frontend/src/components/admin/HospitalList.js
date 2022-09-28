import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";
import { makeStyles } from "@material-ui/core";
import { DataGrid } from "@mui/x-data-grid";
import { NavLink, useNavigate } from "react-router-dom";
import AdminSiteLayout from "../../layout/AdminSiteLayout";
import { Grid } from "@mui/material";
import Search, { SearchIconWrapper, StyledInputBase } from "../../theme/search";
import CustomNoRowsOverlay from "../common/CustomNoRowsOverlay";
import Swal from "sweetalert2";
import axios from "axios";

export default function HospitalList() {
  const [rows, setRows] = useState([]);
  const [no, setNo] = useState([]);
  const navigate = useNavigate();
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
      .get(BACKEND_URL + "/api/admin", {
        headers: {
          Authorization: window.localStorage.getItem("Authorization"),
        },
      })
      .then((res) => {
        setRows(
          res.data.data.map((element) => {
            return {
              id: element.no,
              name: element.name,
              address: element.address,
              tel: element.phoneNumber,
              url: element.url,
              isActive: element.isActive,
            };
          })
        );
      })
      .catch((error) => {
        if (error.response.data.status === 403) {
        }
      });
  };

  const deleteHospital = () => {
    Swal.fire({
      title: "삭제하시겠습니까?",
      showDenyButton: true,
      confirmButtonText: "확인",
      denyButtonText: `닫기`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios
          .delete(`${BACKEND_URL}/api/admin/${no}`, {
            headers: {
              Authorization: window.localStorage.getItem("Authorization"),
            },
          })
          .then((res) => {
            setRows(rows.filter((row) => row.id != no));
          });
      }
    });
  };

  const keywordChanged = async (keyword) => {
    await axios
      .get(`${BACKEND_URL}/api/admin?kw=${keyword}`, {
        headers: {
          Authorization: window.localStorage.getItem("Authorization"),
        },
      })
      .then((res) => {
        setRows(
          res.data.data.map((element) => {
            return {
              id: element.no,
              name: element.name,
              address: element.address,
              tel: element.phoneNumber,
              url: element.url,
              isActive: element.isActive,
            };
          })
        );
      });
  };

  const selectedCheck = () => {
    Swal.fire({ confirmButtonColor: "#24b9db", text: "병원을 선택해 주세요" });
  };
  return (
    <AdminSiteLayout>
      <h1 align="center">병원 목록</h1>
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
            toolbar: { callback: keywordChanged },
          }}
          rowsPerPageOptions={[10]}
          pageSize={10}
          onSelectionModelChange={(id) => {
            if (id.length > 1) {
              id.shift();
            }
            setNo(id);
          }}
        ></DataGrid>
      </div>

      <div align="right" style={{ marginTop: "20px", marginRight: "32px" }}>
        {no.length === 0 ? (
          <Button variant="contained" sx={{ ml: 1 }} onClick={selectedCheck}>
            병원 수정
          </Button>
        ) : (
          <NavLink
            to={`/hospital/${no}`}
            style={{ textDecoration: "none" }} // Underline 제거
          >
            <Button variant="contained" sx={{ ml: 1 }}>
              병원 수정
            </Button>
          </NavLink>
        )}

        {no.length === 0 ? (
          <Button variant="contained" sx={{ ml: 1 }} onClick={selectedCheck}>
            병원 삭제
          </Button>
        ) : (
          <Button variant="contained" sx={{ ml: 1 }} onClick={deleteHospital}>
            병원 삭제
          </Button>
        )}

        <NavLink to={"/hospital"} style={{ textDecoration: "none" }}>
          <Button variant="contained" sx={{ ml: 1 }}>
            병원 등록
          </Button>
        </NavLink>
      </div>
    </AdminSiteLayout>
  );
}

// Search 부분
function SearchToolbar({ callback }) {
  return (
    <div style={{ marginTop: "10px" }}>
      <Grid
        container
        direction="row"
        justifyContent="flex-end"
        alignItems="flex-start"
      >
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="병원목록 검색"
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
  { field: "name", headerName: "이름", sortable: false, flex: 0.4 },
  { field: "address", headerName: "주소", sortable: false, flex: 1 },
  { field: "tel", headerName: "전화번호", sortable: false, flex: 0.3 },
  { field: "url", headerName: "홈페이지 주소", sortable: false, flex: 1 },
];
