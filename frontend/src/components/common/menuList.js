import React, { useEffect, useState } from "react";
import Modal from "../modal/ChangeDoctor";
import "../../assets/Content.scss";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import axios from "axios";
import { NavLink } from "react-router-dom";
import jwt_decode from "jwt-decode";
import Swal from "sweetalert2";

export const SideBarTable = ({ close, publish }) => {
  const [selectedIndex, setSelectedIndex] = useState();
  const [selectedName, setSelectedName] = useState();
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [pageState, setPageState] = useState({
    data: [],
    total: 0,
    page: 1,
    pageSize: 10,
  });
  const isAuthorized = window.localStorage.getItem("Authorization");
  const hn = jwt_decode(isAuthorized).hospitalNo;
  const role = jwt_decode(isAuthorized).role;
  const no = jwt_decode(isAuthorized).no;
  const BACKEND_URL = process.env;
  const url = BACKEND_URL + "/api/common/menuList";
  //병원 : 1, 의사메일: hongill@gmail.com 으로 사용(추후 로그인완성 시 수정)

  useEffect(() => {
    patientList();
  }, [pageState.page]);

  const handleModalClose = () => {
    setModalOpen(false);
    patientList();
  };

  const handleContextMenu = (event, no, status, name) => {
    event.preventDefault();
    setSelectedIndex(no);
    setSelectedStatus(status);
    setSelectedName(name);
    setContextMenu(
      contextMenu === null
        ? { mouseX: event.clientX - 2, mouseY: event.clientY - 4 }
        : null
    );
  };

  const handleClose = () => {
    // contextMenu 그냥 닫을 때
    setContextMenu(null);
  };

  const diagnosis = () => {
    // 진료시작
    publish(selectedName + "씨 진료시작", "진료중");
    patientUpdate(3);
    handleClose();
    close();
  };

  const changeDiagnosis = () => {
    // 진료 대기로 변경
    patientUpdate(2);
    patientList();
    handleClose();
    close();
  };

  const changeDoctor = () => {
    // 의사 변경
    // 모달 창 필요할 듯 (의사 선택용)
    setModalOpen(true);
  };

  const cancleDiagnosis = () => {
    // 진료 취소
    handleClose();

    Swal.fire({
      title: "진료를 취소하시겠습니까?",
      showDenyButton: true,
      confirmButtonText: "확인",
      denyButtonText: `닫기`,
    }).then((result) => {
      if (result.isConfirmed) {
        publish(selectedName + "진료취소", "진료취소");
        patientUpdate(6);
        patientList();
      }
    });
  };

  // 환자 대기상황 가져오기
  const patientList = async () => {
    await axios
      .get(url, {
        headers: {
          Authorization: window.localStorage.getItem("Authorization"),
        },
        params: {
          hospital: hn,
          no: no,
          role: role,
          page: pageState.page,
        },
      })
      .then((response) => {
        setPageState(
          Object.assign({}, pageState, {
            total: response.data.data.map.totalCount,
            data: response.data.data.map.data,
          })
        );
      })
      .catch((error) => console.log(error));
  };

  // 환자 진료상태 업데이트
  const patientUpdate = async (value) => {
    await axios
      .put(
        url + `/${selectedIndex}`,
        {
          no: selectedIndex,
          status: value,
        },
        {
          headers: {
            Authorization: window.localStorage.getItem("Authorization"),
          },
        }
      )
      .then((res) => {
        if (res.data.result != "success") {
          Swal.fire({
            icon: "error",
            title: "변경실패",
            text: "변경 실패했습니다. 다시 한 번 시도해주십시오.",
          });
          return;
        }
        Swal.fire({
          icon: "success",
          title: "변경완료",
          text: "정상적으로 변경 되었습니다.",
          customClass: {
            container: "my-swal",
          },
        });

        // 간호사앞으로 알림기능 추가
      })
      .catch((err) => console.log(err));
  };

  const setStatus = (status) => {
    let statusName;
    switch (status) {
      case 2:
        statusName = "대기중";
        break;
      case 3:
        statusName = "진료중";
      default:
        break;
    }

    return statusName;
  };

  return (
    <div style={{ height: 570 }}>
      <TableContainer component={Paper}>
        <Table
          sx={{ maxHeight: 440, minWidth: 450 }}
          size="medium"
          aria-label="a dense table"
        >
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.field} style={{ width: column.width }}>
                  {column.headerName}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {pageState.data.map((row, index) => {
              return (
                <TableRow
                  hover
                  tabIndex={-1}
                  key={row.appointmentNo}
                  onContextMenu={(e) =>
                    handleContextMenu(
                      e,
                      row.appointmentNo,
                      row.status,
                      row.patientName
                    )
                  }
                >
                  {columns.map((column) => {
                    const value = row[column.field];
                    return (
                      <TableCell
                        key={column.field}
                        style={{ width: column.width }}
                      >
                        {column.field === "status"
                          ? setStatus(value)
                          : column.field === "id"
                          ? index + 1
                          : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10]}
        component="div"
        count={pageState.total}
        page={pageState.page - 1}
        rowsPerPage={10}
        onPageChange={(newPage) => {
          setPageState(object.assign({}, pageState, { page: newPage + 1 }));
        }}
      />

      <Menu
        open={contextMenu !== null}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
        componentsProps={{
          root: {
            onContextMenu: (e) => {
              e.preventDefault();
              handleClose();
            },
          },
        }}
      >
        {selectedStatus == 3 ? null : (
          <NavLink
            to={`/doctor/${selectedIndex}`}
            style={{ textDecoration: "none" }}
          >
            <MenuItem onClick={diagnosis}>진료</MenuItem>
          </NavLink>
        )}
        <MenuItem onClick={changeDiagnosis}>진료 대기 변경</MenuItem>
        <MenuItem onClick={changeDoctor}>담당 의사 변경</MenuItem>
        <MenuItem onClick={cancleDiagnosis}>진료 취소</MenuItem>
      </Menu>
      <Modal
        open={modalOpen}
        close={handleModalClose}
        hno={hn}
        no={selectedIndex}
      />
    </div>
  );
};

const columns = [
  {
    field: "id",
    headerName: "순번",
    width: 50,
  },
  {
    field: "appointmentDate",
    headerName: "내원시간",
    width: 110,
  },
  {
    field: "patientName",
    headerName: "환자명",
    width: 120,
  },
  {
    field: "status",
    headerName: "상태",
    sortable: true,
    width: 100,
  },
  {
    field: "employeeName",
    headerName: "담당의",
    width: 120,
    editable: true,
  },
];
