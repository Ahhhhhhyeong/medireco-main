import React, { useEffect, useRef, useState } from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import AppointmentFirst from "./AppointmentFirst";
import AppointmentReturning from "./AppointmentReturning";
import {
  Stack,
  Typography,
  Box,
  Grid,
  IconButton,
  Tooltip,
  Button,
  CardContent,
} from "@mui/material";
import { Card, Container } from "@material-ui/core";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { useSnackbar } from "notistack";
import * as StompJs from "@stomp/stompjs";
import SockJS from "sockjs-client";

const Appointment = (props) => {
  const [status, setStatus] = useState({});
  const { enqueueSnackbar } = useSnackbar();
  const BACKEND_URL = process.env;

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

  const ShowAppointment = () => {
    if (status === "first") {
      return (
        <Card variant="outlined" style={{ height: "50%" }}>
          <CardContent>
            <AppointmentFirst />
          </CardContent>
        </Card>
      );
    } else if (status === "returning") {
      return (
        <Card variant="outlined" style={{ height: "100%" }}>
          <CardContent>
            <AppointmentReturning />
          </CardContent>
        </Card>
      );
    }
  };

  return (
    <Container>
      <Grid
        container
        spacing={3}
        justify="center"
        alignItems="center"
        height="100%"
        marginTop="1rem"
        marginLeft="1rem"
        marginRight="1rem"
      >
        <Grid item xs={12} variant="outlined">
          <Card>
            <CardContent>
              <FormControl
                sx={{
                  justify: "center",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <FormLabel id="appointment-group-label">
                  초진환자인지 재진환자인지 선택해주세요
                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="appointment-group-label"
                  name="appointment-group"
                >
                  <FormControlLabel
                    value="first"
                    control={<Radio onClick={() => setStatus("first")} />}
                    label="초진환자"
                  />
                  <FormControlLabel
                    value="returning"
                    control={<Radio onClick={() => setStatus("returning")} />}
                    label="재진환자"
                  />
                </RadioGroup>
              </FormControl>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          {ShowAppointment()}
        </Grid>
      </Grid>
    </Container>
  );
};

const columns = [
  {
    field: "appointmentDate",
    headerName: "접수시간",
    width: 200,
    editable: true,
  },
  { field: "patientName", headerName: "이름", width: 150, editable: true },
  { field: "patientAge", headerName: "나이", width: 100, editable: true },
  { field: "patientGender", headerName: "성별", width: 100, editable: true },
  {
    field: "appointmentStatus",
    headerName: "진료현황",
    width: 200,
    editable: true,
  },
  {
    field: "patientDetail",
    headerName: "상세정보",
    width: 150,
    editable: true,
  },
  {
    field: "appointmentCancel",
    headerName: "접수취소",
    width: 150,
    editable: true,
  },
  { field: "appointmentPay", headerName: "수납", width: 150, editable: true },

  {
    field: "id",
    headerName: "",
    widht: 150,
    renderCell: ({ id }) => (
      <IconButton
        color="primary"
        sx={{ width: 80 }}
        onClick={() => handleCancelClick(id)}
      >
        <CancelIcon />
      </IconButton>
    ),
  },
];

export default Appointment;
