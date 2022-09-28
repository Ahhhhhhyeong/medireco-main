// 내원기록
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import CustomNoRowsOverlay from "./CustomNoRowsOverlay";
import Calendar from "../attendance/Calendar";
import DetailRecord from "./detailRecord";
import Search from "../../theme/search";
import { StyledInputBase, SearchIconWrapper } from "../../theme/search";
import { Grid } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import jwt_decode from "jwt-decode";
import { useSnackbar } from "notistack";
import * as StompJs from "@stomp/stompjs";

const Record = () => {
  const [date, setDate] = useState("");
  const [data, setData] = useState({
    name: "",
    no: 0,
  });
  const [pageState, setPageState] = useState({
    isLoading: false,
    data: [],
    total: 0,
    page: 1,
    pageSize: 10,
  });
  const BACKEND_URL = process.env;
  const url = BACKEND_URL + "/api/common/visitedRecord";

  const { enqueueSnackbar } = useSnackbar();
  const client = useRef({});
  const isAuthorized = window.localStorage.getItem("Authorization");
  let hn = "";
  if (isAuthorized !== null) {
    hn = jwt_decode(isAuthorized).hospitalNo;
  }

  const connect = () => {
    client.current = new StompJs.Client({
      //brokerURL: "ws://localhost:8080/ws", // 웹소켓 서버로 직접 접속
      webSocketFactory: () => new SockJS(BACKEND_URL + "/ws"), // proxy를 통한 접속
      connectHeaders: {
        Authorization: window.localStorage.getItem("Authorization"),
      },
      debug: function (str) {
        // console.log(str);
      },
      // reconnectDelay: 5000,
      // heartbeatIncoming: 4000,
      // heartbeatOutgoing: 4000,
      onConnect: () => {
        subscribe();
      },
      onStompError: (frame) => {
        console.error(frame);
      },
    });
    client.current.activate();
  };

  const disconnect = () => {
    client.current.deactivate();
  };

  const subscribe = () => {
    client.current.subscribe(`/topic/${hn}`, ({ body }) => {
      if (JSON.parse(body).sender === "진료중") {
        handleClickVariant(JSON.parse(body).data, "info");
      }
      if (JSON.parse(body).sender === "진료완료") {
        handleClickVariant(JSON.parse(body).data, "success");
      }
      if (JSON.parse(body).sender === "진료취소") {
        handleClickVariant(JSON.parse(body).data, "error");
      }
    });
  };

  const handleClickVariant = (message, variant) => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(message, { variant: variant, persist: true });
  };

  useEffect(() => {
    connect();
    return () => disconnect();
  }, []);

  const sdate = (date) => {
    setDate(date);
  };

  useEffect(() => {
    if (date == "") return;
    setPageState(Object.assign({}, pageState, { isLoading: true }));

    axios
      .get(url, {
        headers: {
          Authorization: window.localStorage.getItem("Authorization"),
        },
        params: {
          hospital: hn,
          date: date,
          page: pageState.page,
        },
      })
      .then((response) => {
        setPageState(
          Object.assign({}, pageState, {
            isLoading: false,
            data: response.data.data.map.data,
            total: response.data.data.map.totalCount,
          })
        );
      })
      .catch((error) => {
        console.log(error);
      });
  }, [date]);

  const handleEvent = (e) => {
    //{}, setData, {name: e.row.patientName, no: e.row.patientNo})
    setData((old) => ({
      ...old,
      name: e.row.patientName,
      no: e.row.patientNo,
    }));
  };

  return (
    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
      <Grid item xs={6} sx={{ height: 780 }}>
        <Calendar sdate={sdate} />
      </Grid>
      <Grid
        item
        xs={6}
        container
        spacing={1}
        direction="column"
        justifyContent="space-evenly"
        alignItems="stretch"
      >
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
              autoFocus
              placeholder="환자이름검색..."
              inputProps={{ "aria-label": "search" }}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  setData((old) => ({ ...old, name: e.target.value }));
                }
              }}
            />
          </Search>
        </Grid>
        <DataGrid
          rows={pageState.data}
          rowCount={pageState.total}
          getRowId={(row) => row.appointmentNo}
          loading={pageState.isLoading}
          rowsPerPageOptions={[10]}
          hideFooterSelectedRowCount // 체크박스 선택갯수 표시 삭제
          pagination
          page={pageState.page - 1}
          pageSize={pageState.pageSize}
          paginationMode="server"
          onPageChange={(newPage) => {
            setPageState(Object.assign({}, pageState, { page: newPage + 1 }));
          }}
          columns={columns}
          components={{
            NoRowsOverlay: CustomNoRowsOverlay,
          }}
          sx={{ height: 400 }}
          onRowClick={handleEvent}

        />
        <br />
        <DetailRecord data={data} />
      </Grid>
    </Grid>
  );
};

export default Record;

const columns = [
  { field: "appointmentNo", headerName: "예약번호", hide: true },
  { field: "appointmentDate", headerName: "내원일자", type: "date" },
  { field: "employeeName", headerName: "담당의" },
  { field: "employeeNo", headerName: "담당의번호", hide: true },
  { field: "patientName", headerName: "환자명" },
  { field: "patientNo", headerName: "환자번호", hide: true },
  { field: "diagnosisOpinion", headerName: "증상", width: 200 },
];
