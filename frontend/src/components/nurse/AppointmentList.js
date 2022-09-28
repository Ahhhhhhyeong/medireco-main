import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { DataGrid, GridCellModes } from "@mui/x-data-grid";
import {
  Stack,
  Typography,
  Box,
  Grid,
  IconButton,
  Tooltip,
  Button,
} from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

import { styled, alpha } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import CustomNoRowsOverlay from "../common/CustomNoRowsOverlay";
import axios from "axios";
import CancelIcon from "@mui/icons-material/Close";
import PaymentIcon from "@mui/icons-material/Payment";
import { red, blue } from "@mui/material/colors";
import jwt_decode from "jwt-decode";
import Swal from "sweetalert2";
import { useSnackbar } from "notistack";
import * as StompJs from "@stomp/stompjs";
import SockJS from "sockjs-client";
import Payment from "./Payment";
import { useLocation, useNavigate } from "react-router";

let today = new Date().toISOString().slice(0, 10);
function AppointmentList(props) {
  const no = useLocation().pathname.substring(
    useLocation().pathname.lastIndexOf("/")
  );
  const [data, setData] = useState([]);
  const [paymentData, setPaymentData] = useState([]);
  const [appointmentNo, setAppointmentNo] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [patient, setPatient] = useState("");
  const BACKEND_URL = process.env;
  const navigate = useNavigate();
  const [toggle, setToggle] = useState(false);
  const [date, setDate] = useState(today);

  const baseUrl = BACKEND_URL + "/api/nurse";
  const columns = [
    { field: "date", headerName: "접수시간", width: 200 },
    {
      field: "status",
      headerName: "접수상태",
      width: 100,
      valueFormatter: (params) => {
        if (params.value == "0") {
          return "0번";
        } else if (params.value == "1") {
          return "예약";
        } else if (params.value == "2") {
          return "대기";
        } else if (params.value == "3") {
          return "진료중";
        } else if (params.value == "4") {
          return "수납대기";
        } else if (params.value == "5") {
          return "수납완료";
        } else if (params.value == "6") {
          return "진료 취소";
        }
      },
    },
    { field: "remarks", headerName: "증상", width: 300 },
    { field: "doctorName", headerName: "담당의", width: 150 },
    { field: "patientName", headerName: "환자", width: 150 },
    {
      field: "cancel",
      headerName: "접수취소",
      width: 100,
      renderCell: (params) => {
        if (params.row.status < 4) {
          return (
            <IconButton onClick={(params) => handleCancelClick(params.row)}>
              <CancelIcon sx={{ color: red[500] }} />
            </IconButton>
          );
        } else {
        }
      },
    },
    {
      field: "pay",
      headerName: "수납",
      width: 100,
      renderCell: (params) => {
        if (params.row.status == 4) {
          return (
            <IconButton onClick={() => handlePaymentClick()}>
              <PaymentIcon color="primary" />
            </IconButton>
          );
        } else {
        }
      },
    },
  ];

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
      setToggle((toggle) => !toggle);
    });
  };

  const handleClickVariant = (message, variant) => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(message, { variant: variant, persist: true });
  };

  const publish = (message, status) => {
    if (!client.current.connected) {
      return;
    }

    client.current.publish({
      destination: "/pub/nurse",
      body: JSON.stringify({
        sender: status,
        channelId: hn,
        data: message,
      }),
    });
  };

  const handleCancelClick = (event) => {
    setAlertOpen(true);
  };

  const handleAlertClose = (event) => {
    setAlertOpen(false);
    if (event.target.value === "true") {
      // 삭제
      publish(patient["patientName"] + "씨 진료취소", "진료취소");
      deleteAppointment(patient["no"]);
    } else {
      // 안삭제
    }
  };

  const handlePaymentClick = () => {
    console.log("수납버튼 클릭");
    setPaymentDialogOpen(true);
  };

  const handlePaymentClose = () => {
    setPaymentDialogOpen(false);
  };

  useEffect(() => {
    connect();
    getAppointmentByToday();
    return () => disconnect();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      getAppointmentByToday();
    }, 500);
  }, [toggle]);

  useEffect(() => {
    getPaymentData(patient["no"]);
  }, [patient]);

  const getAppointmentByToday = async () => {
    const url = baseUrl + "/appointmentByDate";
    console.log("오늘 접수대기");
    console.log(hn);
    console.log(typeof(date));
    await axios
      .get(url, 
        {
          headers: {
            Authorization: window.localStorage.getItem("Authorization"),
          },
          params: {
            hospitalNo : hn,
            date : date
          }
        })
      .then((res) => {
        console.log(res.data.data.map);
        setData(res.data.data.map);
      });
  };

  const deleteAppointment = async (id) => {
    const url = baseUrl + "/appointment/" + id;
    console.log(url);
    await axios
      .patch(
        url,
        {
          no: id,
        },
        {
          headers: {
            Authorization: window.localStorage.getItem("Authorization"),
          },
        }
      )
      .then((res) => {
        console.log(res);
        getAppointmentByToday();
      });
  };

  const getPaymentData = async (props) => {
    console.log("수납환자번호: " + props);
    await axios
      .get(baseUrl + "/payment/" + props, {
        headers: {
          Authorization: window.localStorage.getItem("Authorization"),
        },
      })
      .then((res) => {
        console.log("수납데이터: ");
        console.log(res.data.data);
        setPaymentData(
          res.data.data.map((element) => {
            return {
              appointmentNo: element.appointmentNo,
              appointmentDate: element.appointmentDate,
              appointmentRemark: element.appointmentRemark,
              diagnosisNo: element.diagnosisNo,
              diagnosisOpinion: element.diagnosisOpinion,
              treatmentNo: element.treatmentNo,
              medicineName: element.medicineName,
              treat: element.treat,
              dose: element.dose,
              prescriptionName: element.prescriptionName,
              prescriptionDosingPrequency: element.prescriptionDosingPrequency,
              prescriptionDosingDays: element.prescriptionDosingDays,
              prescriptionRemark: element.prescriptionRemark,
              patientName: element.patientName,
            };
          })
        );
      });
  };

  return (
    <div
      id="AppointmentList"
      style={{
        height: 700,
        width: "95%",
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
        getRowId={(data) => data.no}
        columns={columns}
        experimentalFeatures={{ newEditingApi: true }}
        rowsPerPageOptions={[10]}
        pageSize={10}
        components={{
          NoRowsOverlay: CustomNoRowsOverlay,
        }}
        onRowClick={(params) => {
          setPatient(params.row);
          setAppointmentNo(params.row.no);
        }}
      ></DataGrid>
      <Dialog
        open={alertOpen}
        onClose={handleAlertClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          접수를 취소하시겠습니까?
        </DialogTitle>

        <DialogActions>
          <Button onClick={handleAlertClose} autoFocus value="true">
            예
          </Button>
          <Button onClick={handleAlertClose} value="false">
            아니요
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={paymentDialogOpen}
        onClose={handlePaymentClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
      >
        <Payment props={paymentData} />
      </Dialog>
    </div>
  );
}

export default AppointmentList;
