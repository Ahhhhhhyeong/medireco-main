import React, { useCallback, useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router";
import axios from "axios";
import { Button, Grid, Paper, TextField, Typography } from "@mui/material";
import { Box, Container, Stack } from "@mui/system";
import { DataGrid } from "@mui/x-data-grid";
import Swal from "sweetalert2";
import CustomNoRowsOverlay from "../common/CustomNoRowsOverlay";
import Disease from "./act/disease";
import Prescription from "./act/prescription";
import Treatment from "./act/treatment";
import FloatingButton from "../../layout/footer/FloatingButton";
import jwt_decode from "jwt-decode";
import { useSnackbar } from "notistack";
import * as StompJs from "@stomp/stompjs";
import SockJS from "sockjs-client";

function Index(props) {
  const [pageState, setPageState] = useState({
    isLoading: false,
    data: [],
    total: 0,
    page: 1,
    pageSize: 10,
  });
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedDate, setSelectedDate] = useState();
  const [selectedRemark, setSelectedRemark] = useState();
  const [diagnosis, setDiagnosis] = useState({
    appointmentNo: 0,
    patientNo: 0,
    opinion: "",
  });

  const [isValidation, setValidation] = useState({
    opinion: false,
  });

  const [isSubmit, setIsSubmit] = useState(false);
  const [prescription, setPrescription] = useState([]);
  const [disease, setDisease] = useState([]);
  const [treatment, setTreatment] = useState([]);
  const BACKEND_URL = process.env;
  const url = `${BACKEND_URL}/api/doctor`;
  const navigate = useNavigate();

  const no = useLocation().pathname.substring(
    useLocation().pathname.lastIndexOf("/")
  );

  const [toggle, setToggle] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const client = useRef({});
  const isAuthorized = window.localStorage.getItem("Authorization");
  let hn = "";
  if (isAuthorized !== null) {
    hn = jwt_decode(isAuthorized).hospitalNo;
  }

  const connect = () => {
    client.current = new StompJs.Client({
      //brokerURL: "ws://localhost:8080/ws", // ????????? ????????? ?????? ??????
      webSocketFactory: () => new SockJS(BACKEND_URL + "/ws"), // proxy??? ?????? ??????
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
      if (JSON.parse(body).sender === "?????????") {
        handleClickVariant(JSON.parse(body).data, "info");
      }
      if (JSON.parse(body).sender === "????????????") {
        handleClickVariant(JSON.parse(body).data, "success");
      }
      if (JSON.parse(body).sender === "????????????") {
        handleClickVariant(JSON.parse(body).data, "error");
      }
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

  useEffect(() => {
    connect();
    return () => disconnect();
  }, []);

  useEffect(() => {
    if (no === "/doctor") {
      return;
    }

    setPageState(Object.assign({}, pageState, { isLoading: true }));
    axios
      .get(url + no, {
        headers: {
          Authorization: window.localStorage.getItem("Authorization"),
        },
      })
      .then((res) => {
        setPageState(
          Object.assign({}, pageState, {
            isLoading: false,
            total: res.data.data.map.totalCount,
            data: res.data.data.map.data,
          })
        );
        setSelectedRows(res.data.data.map.data[0]);
      })
      .catch((err) => console.log(err));
  }, [no]);

  useEffect(() => {
    setSelectedDate(selectedRows.appointmentDate);
    setSelectedRemark(selectedRows.appointmentRemark);
    setDiagnosis(
      Object.assign({}, diagnosis, {
        appointmentNo: selectedRows.appointmentNo,
        patientNo: selectedRows.patientNo,
        employeeNo: selectedRows.employeeNo,
      })
    );
  }, [selectedRows]);

  useEffect(() => {
    if (!isSubmit) return;

    if (isValidation.opinion || diagnosis.opinion == "") {
      setIsSubmit(!isSubmit);
      setValidation(Object.assign({}, isValidation, { opinion: true }));
      return;
    }
    insert();
  }, [disease, treatment, prescription]);

  const insert = async () => {
    await axios
      .post(
        url,
        {
          diagnosis: diagnosis,
          disease: disease,
          treatment: treatment,
          prescription: prescription,
        },
        {
          headers: {
            Authorization: window.localStorage.getItem("Authorization"),
          },
        }
      )
      .then((res) => {
        if (res.data.result != "success") {
          setSubmit(false);
          Swal.fire({
            icon: "error",
            title: "????????????",
            text: "????????? ??? ??? ???????????????.",
          });
          return;
        }
        Swal.fire({
          icon: "success",
          title: "????????????",
          text: "?????? ???????????????.",
        });
        navigate("/doctor", { replace: true });
      });
  };

  const callbackRef = useCallback((inputElement) => {
    if (inputElement) {
      inputElement.focus();
    }
  }, []);

  const setSubmit = () => {
    publish(selectedRows.patientName + "??? ????????????", "????????????");
    setIsSubmit(!isSubmit);
  };

  const getPrescription = (value) => {
    console.log(value);
    setPrescription(value);
  };

  const getDiease = (value) => {
    setDisease(value);
  };

  const getTreatment = (value) => {
    setTreatment(value);
  };

  const onTextChange = (e) => {
    if (e.target.value == "") {
      setValidation(Object.assign({}, isValidation, { opinion: true }));
      return;
    }

    setValidation(Object.assign({}, isValidation, { opinion: false }));
    setDiagnosis(Object.assign({}, diagnosis, { opinion: e.target.value }));
  };

  return (
    <Box flexGrow={1} component="main" sx={{ paddingTop: 1 }}>
      <Container maxWidth={false}>
        <Grid container spacing={2}>
          <Grid item lg={6} xs={6}>
            <Paper>
              <Stack>
                <Typography>????????????</Typography>
                <div style={{ height: 340 }}>
                  <DataGrid
                    rows={pageState.data}
                    rowCount={pageState.total}
                    getRowId={(row) => row.appointmentNo}
                    loading={pageState.isLoading}
                    rowsPerPageOptions={[10]}
                    pagination
                    page={pageState.page - 1}
                    pageSize={pageState.pageSize}
                    paginationMode="server"
                    onPageChange={(newPage) => {
                      setPageState(
                        Object.assign({}, pageState, { page: newPage + 1 })
                      );
                    }}
                    columns={columns}
                    components={{
                      NoRowsOverlay: CustomNoRowsOverlay,
                    }}
                    disableSelectionOnClick
                  />
                </div>
              </Stack>
            </Paper>
          </Grid>
          <Grid item lg={6} xs={6}>
            <Paper sx={{ height: "100%", width: "100%" }}>
              <TextField
                fullWidth
                variant="standard"
                InputProps={{ readOnly: true }}
                value={
                  selectedDate && selectedRemark
                    ? `[${selectedDate}] ${selectedRemark}`
                    : ``
                }
              />
              <TextField
                fullWidth
                multiline
                inputRef={callbackRef}
                id="outlined-multiline-static"
                rows={12}
                variant="standard"
                InputProps={{ disableUnderline: true }}
                sx={{ marginLeft: 1 }}
                label="????????????"
                InputLabelProps={{ shrink: true }}
                onChange={onTextChange}
                error={isValidation.opinion}
                helperText={
                  isValidation.opinion ? "????????? ?????? ??? ?????????." : ""
                }
              />
            </Paper>
          </Grid>
          {/** ???????????? ?????? */}
          <Grid item lg={3} xs={3}>
            <Paper variant="outlined">
              <Disease isSubmit={isSubmit} value={getDiease} />
            </Paper>
          </Grid>
          <Grid item lg={4} xs={4}>
            <Paper variant="outlined">
              <Treatment isSubmit={isSubmit} value={getTreatment} />
            </Paper>
          </Grid>

          <Grid item lg={5} xs={5}>
            <Stack spacing={1}>
              <Paper variant="outlined">
                <Prescription isSubmit={isSubmit} value={getPrescription} />
              </Paper>
              <Button
                disabled={isSubmit}
                variant="contained"
                onClick={setSubmit}
              >
                ????????????
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Container>
      <FloatingButton publish={publish} />
    </Box>
  );
}

export default Index;

const columns = [
  { field: "appointmentNo", width: 100, hide: true },
  {
    field: "appointmentDate",
    headerName: "????????????",
    type: "date",
    width: 120,
  },
  { field: "patientBirth", headerName: "????????????", width: 100 },
  { field: "patientName", headerName: "?????????", width: 120 },
  { field: "patientNo", width: 120, hide: true },
  { field: "appointmentRemark", headerName: "??????", width: 200 },
  { field: "diseaseName", headerName: "??????", type: "number", hide: true },
  { field: "employeeNo", hide: true },
];
