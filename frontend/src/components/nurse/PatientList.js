import React, { useEffect, useState, useRef } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import jwt_decode from "jwt-decode";
import CustomNoRowsOverlay from "../common/CustomNoRowsOverlay";
import { useSnackbar } from "notistack";
import * as StompJs from "@stomp/stompjs";
import SockJS from "sockjs-client";

function PatientList(props) {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [hospitalNo, setHospitalNo] = useState("1");
  const isAuthorized = window.localStorage.getItem("Authorization");
  const hn = jwt_decode(isAuthorized).hospitalNo;
  const BACKEND_URL = process.env;
  const url = BACKEND_URL + "/api/nurse/patientByHospitalNo/" + hn;

  const columns = [
    { field: "name", headerName: "이름", width: 100, editable: true },
    { field: "rrn", headerName: "주민번호", width: 150, editable: true },
    { field: "address", headerName: "주소", width: 200, editable: true },
    {
      field: "phoneNumber",
      headerName: "전화번호",
      width: 150,
      editable: true,
    },
    { field: "gender", headerName: "성별", width: 100, editable: true },
    {
      field: "hasInsurance",
      headerName: "보험가입여부",
      width: 100,
      editable: true,
    },
    { field: "regDate", headerName: "최초내원일", width: 200, editable: true },
  ];

  const { enqueueSnackbar } = useSnackbar();
  const client = useRef({});

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
    getPatientListByHospitalNo();
    return () => disconnect();
  }, []);

  const getPatientListByHospitalNo = async () => {
    await axios
      .get(url, {
        headers: {
          Authorization: window.localStorage.getItem("Authorization"),
        },
      })
      .then((res) => {
        console.log(res.data.data);
        setData(
          res.data.data.map((element) => {
            return {
              no: element.no,
              name: element.name,
              rrn: element.rrn,
              address: element.address,
              phoneNumber: element.phoneNumber,
              gender: element.gender,
              hasInsurance: element.hasInsurance,
              regDate: element.regDate,
            };
          })
        );
      });
  };

  return (
    <div
      id="PatientList"
      style={{
        height: 700,
        width: "70%",
        marginLeft: "2rem",
        marginTop: "2rem",
      }}
      align="center"
      display="flex"
    >
      <DataGrid
        sx={{
          p: 2,
        }}
        rows={data}
        columns={columns}
        getRowId={(data) => data.no}
        experimentalFeatures={{ newEditingApi: true }}
        rowsPerPageOptions={[10]}
        pageSize={10}
        components={{
          NoRowsOverlay: CustomNoRowsOverlay,
        }}
      ></DataGrid>
    </div>
  );
}

export default PatientList;
