import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";
import { makeStyles } from "@material-ui/core";
import { DataGrid } from "@mui/x-data-grid";
import { NavLink } from "react-router-dom";
import SiteLayout from "../../layout/SiteLayout";
import { Grid } from "@mui/material";
import Search, { SearchIconWrapper, StyledInputBase } from "../../theme/search";
import CustomNoRowsOverlay from "../common/CustomNoRowsOverlay";
import axios from "axios";
import Swal from "sweetalert2";
import jwt_decode from "jwt-decode";

export default function EmployeeList() {
  const [rows, setRows] = useState([]);
  const [no, setNo] = useState([]);
  const isAuthorized = window.localStorage.getItem("Authorization");
  const hn = jwt_decode(isAuthorized).hospitalNo;
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
      .get(`${BACKEND_URL}/api/hospitaladmin?hn=${hn}`, {
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
              email: element.email,
              gender: element.gender === 1 ? "남" : "여",
              address: element.address,
              tel: element.phoneNumber,
              role:
                element.role === "ROLE_ADMIN"
                  ? "관리자"
                  : element.role === "ROLE_DOCTOR"
                  ? "의사"
                  : "간호사",
              licenseNumber: element.licenseNumber,
            };
          })
        );
      });
  };

  const deleteEmployee = () => {
    Swal.fire({
      title: "삭제하시겠습니까?",
      showDenyButton: true,
      confirmButtonText: "확인",
      denyButtonText: `닫기`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios
          .delete(`${BACKEND_URL}/api/hospitaladmin/${no}`, {
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
      .get(`${BACKEND_URL}/api/hospitaladmin?kw=${keyword}&hn=${hn}`, {
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
              email: element.email,
              gender: element.gender === 1 ? "남" : "여",
              address: element.address,
              tel: element.phoneNumber,
              role:
                element.role === "ROLE_ADMIN"
                  ? "관리자"
                  : element.role === "ROLE_DOCTOR"
                  ? "의사"
                  : "간호사",
              licenseNumber: element.licenseNumber,
            };
          })
        );
      });
  };

  const selectedCheck = () => {
    Swal.fire({ confirmButtonColor: "#24b9db", text: "직원을 선택해 주세요" });
  };
  return (
    <SiteLayout>
      <h1 align="center">직원 목록</h1>
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
            직원 수정
          </Button>
        ) : (
          <NavLink
            to={`/employee/${no}`}
            style={{ textDecoration: "none" }} // Underline 제거
          >
            <Button variant="contained" sx={{ ml: 1 }}>
              직원 수정
            </Button>
          </NavLink>
        )}

        {no.length === 0 ? (
          <Button variant="contained" sx={{ ml: 1 }} onClick={selectedCheck}>
            직원 삭제
          </Button>
        ) : (
          <Button variant="contained" sx={{ ml: 1 }} onClick={deleteEmployee}>
            직원 삭제
          </Button>
        )}
        <NavLink to={"/employee"} style={{ textDecoration: "none" }}>
          <Button variant="contained" sx={{ ml: 1 }}>
            직원 등록
          </Button>
        </NavLink>
      </div>
    </SiteLayout>
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
            placeholder="직원 검색"
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
  { field: "name", headerName: "이름", sortable: false, flex: 0.1 },
  { field: "email", headerName: "이메일", sortable: false, flex: 0.4 },
  { field: "gender", headerName: "성별", sortable: false, flex: 0.1 },
  { field: "address", headerName: "주소", sortable: false, flex: 0.4 },
  { field: "tel", headerName: "휴대폰번호", sortable: false, flex: 0.2 },
  { field: "role", headerName: "직급", sortable: false, flex: 0.1 },
  {
    field: "licenseNumber",
    headerName: "면허번호",
    sortable: false,
    flex: 0.2,
  },
];
