import React, { useEffect, useState, useRef } from "react";
import { styled } from "@mui/material/styles";
import {
  Grid,
  Typography,
  Container,
  Box,
  Paper,
  Card,
  CardContent,
  CardActions,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";

import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { DataGrid, gridColumnPositionsSelector } from "@mui/x-data-grid";
import { useLocation, useNavigate } from "react-router";
import FullCalendar from "@fullcalendar/react"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClic
import { now } from "../attendance/datetime";
import { red, blue } from "@mui/material/colors";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { useSnackbar } from "notistack";
import * as StompJs from "@stomp/stompjs";
import SockJS from "sockjs-client";
import ReceptionSearchPatient from "./ReceptionSearchPatient";
import { ContactsOutlined } from "@material-ui/icons";
import { nowDate } from "../attendance/datetime";
console.log("test");
console.log(nowDate());
let today = new Date().toISOString().slice(0, 10);
let dayOfToday = new Date().getDay();
const BACKEND_URL = process.env;

const ReceptionCard = (props) => {
  const navigate = useNavigate();
  const isAuthorized = window.localStorage.getItem("Authorization");
  let hn = "";
  if (isAuthorized !== null) {
    hn = jwt_decode(isAuthorized).hospitalNo;
  }
  const baseUrl = BACKEND_URL + "/api/nurse";
  console.log("받아온 데이터");
  console.log(props);
  const {
    doctorData,
    doctor,
    date,
    day,
    patientName,
    phoneNumber,
    remarks,
    schedule,
    hasInsurance,
    setDoctor,
  } = props;
  const [patientNameSearch, setPatientNameSearch] = useState("");
  const [patient, setPatient] = useState([]);
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [receptionRemarks, setReceptionRemarks] = useState("");
  const [receptionPhoneNumber, setReceptionPhoneNumber] = useState("");
  const [unableToWorkEmployee, setUnableToWorkEmployee] = useState([]);
  const [receptionDoctorData, setReceptionDoctorData] = useState([]);
  const [receptionDoctorId, setReceptionDoctorId] = useState("");
  const [occupiedSchedule, setOccupiedSchedule] = useState([]);
  const [openingTime, setOpeningTime] = useState([]);
  const [availableTime, setAvailableTime] = useState([]);
  const [availableSchedule, setAvailableSchedule] = useState("");

  const handleChange = (event) => {
    setDoctor(event.target.value);
  };

  const handleDate = (event) => {
    console.log("예약가능시간");
    console.log(event.target.value);
    setAvailableSchedule(event.target.value);
  };

  const handleSearch = () => {
    setSearchDialogOpen(true);
  };

  const closeSearchDialog = () => {
    setSearchDialogOpen(false);
  };

  const getUnabledToWorkEmployeeList = async (date) => {
    let url = baseUrl + "/reception/" + date;
    await axios
      .get(url, {
        headers: {
          Authorization: window.localStorage.getItem("Authorization"),
        },
      })
      .then((res) => {
        setUnableToWorkEmployee(res.data.data);
      });
  };
  const getOpeningHour = (day) => {
    /**
     * 월요일에서 금요일 까지는 아침 9시 시작 오후 6시 종료
     * 토요일은 아침 9시 시작 오후 2시 종료
     * 일요일은 휴무
     */
    let time = [
      {
        no: 1,
        start: "9",
        end: "00",
      },
      {
        no: 2,
        start: "9",
        end: "30",
      },
      {
        no: 3,
        start: "10",
        end: "00",
      },
      {
        no: 4,
        start: "10",
        end: "30",
      },
      {
        no: 5,
        start: "11",
        end: "00",
      },
      {
        no: 6,
        start: "11",
        end: "30",
      },
      {
        no: 7,
        start: "13",
        end: "00",
      },
      {
        no: 8,
        start: "13",
        end: "30",
      },
      {
        no: 9,
        start: "14",
        end: "00",
      },
      {
        no: 10,
        start: "14",
        end: "30",
      },
      {
        no: 11,
        start: "15",
        end: "00",
      },
      {
        no: 12,
        start: "15",
        end: "30",
      },
      {
        no: 13,
        start: "16",
        end: "00",
      },
      {
        no: 14,
        start: "16",
        end: "30",
      },
      {
        no: 15,
        start: "17",
        end: "00",
      },
      {
        no: 16,
        start: "17",
        end: "30",
      },
    ];
    if (props === 6) {
      // 9 to 2
      time = time.splice(0, 8);
    } else if (props === 7) {
      // holiday
      time = [];
    } else {
      // 9 to 6
    }

    setOpeningTime(time);
  };
  const popUpUnabledDoctor = () => {
    let result = [];
    doctorData.map((doctor) => {
      if (unableToWorkEmployee.length != 0) {
        unableToWorkEmployee.map((employee) => {
          if (employee["employee_no"] == doctor["id"]) {
          } else {
            result.push(doctor);
          }
        });
      } else {
        result = doctorData;
      }
    });
    result = [...new Set(result)];

    setReceptionDoctorData(result);
  };

  const appointmentListByDoctor = async () => {
    const url = baseUrl + "/reception/appointment";

    await axios
      .get(url, {
        headers: {
          Authorization: window.localStorage.getItem("Authorization"),
        },
        params: {
          no: doctor,
          date: date,
        },
      })
      .then((res) => {
        setOccupiedSchedule(res.data.data);
      });
  };

  const getAvailableTime = () => {
    let _today = new Date().getHours();
    const UAT = getUnAvailableTime();
    let result = openingTime;

    for (let i = 0; i < UAT.length; i++) {
      for (let j = 0; j < openingTime.length; j++) {
        if (openingTime[j]["start"] == UAT[i].startTime) {
          if (UAT[i].endTime < 30) {
            result.splice(j, 1);
          } else {
            result.splice(j, 1);
          }
        } else if (openingTime[j]["start"] < _today) {
          result.splice(j, 1);
        } else {
        }
      }
    }
    console.log(typeof result);
    setAvailableTime(result);

    return result;
  };

  const getUnAvailableTime = () => {
    let result = [];
    let time = {};
    Object.values(occupiedSchedule).map((element) => {
      for (let i = 0; i < element.length; i++) {
        time.startTime = Object.values(element[i])[0].split(" ")[0];
        time.endTime = Object.values(element[i])[0].split(" ")[1];
        result.push(time);
        time = {};
      }
    });
    return result;
  };

  const addReception = async () => {
    console.log(availableSchedule);
    let at = availableSchedule.start + ":" + availableSchedule.end;
    let _date = date + " " + at;
    console.log(at);
    let _patient = patient["no"];
    console.log("예약정보");
    console.log(hn);
    console.log(_date)
    await axios
      .post(
        BACKEND_URL + "/api/nurse/appointment",
        {
          status: 1,
          date: _date,
          remarks: receptionRemarks,
          patientNo: _patient,
          employeeNo: doctor,
          hospitalNo: hn,
        },
        {
          headers: {
            Authorization: window.localStorage.getItem("Authorization"),
          },
        }
      )
      .then((res) => {
        console.log(res);
        navigate("/nurse", { replace: true });
      });
  };

  useEffect(() => {
    appointmentListByDoctor();
  }, [doctor]);

  useEffect(() => {
    console.log(patient.phoneNumber);
    setReceptionPhoneNumber(patient.phoneNumber);
  }, [patient]);

  useEffect(() => {
    getOpeningHour();
    getUnabledToWorkEmployeeList(date);
  }, [date]);

  useEffect(() => {
    popUpUnabledDoctor();
    console.log("일할수있는 의사");
    console.log(receptionDoctorData);
  }, [unableToWorkEmployee]);

  useEffect(() => {
    let at = getAvailableTime();
    console.log("예약 가능 시간");
    console.log(at);
    setAvailableTime(at);
  }, [occupiedSchedule]);

  return (
    <Card variant="outlined" style={{ height: "100%" }}>
      <CardContent align="center">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              required
              id="date"
              name="date"
              label="예약일자"
              fullWidth
              autoComplete="given-name"
              variant="outlined"
              value={date || ""}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              id="patientName"
              name="patientName"
              label="이름을 입력한 뒤 검색 아이콘을 클릭해주세요"
              fullWidth
              variant="outlined"
              value={patientNameSearch || ""}
              onChange={(event) => setPatientNameSearch(event.target.value)}
              InputProps={{
                endAdornment: (
                  <IconButton>
                    <SearchIcon onClick={handleSearch} />
                  </IconButton>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="phoneNumber"
              name="phoneNumber"
              label="전화번호"
              fullWidth
              variant="outlined"
              value={receptionPhoneNumber || ""}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="remarks"
              name="remarks"
              label="증상"
              multiline
              fullWidth
              variant="outlined"
              value={receptionRemarks || ""}
              onChange={(event) => setReceptionRemarks(event.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl variant="outlined" sx={{ m: 1, minWidth: 240 }}>
              <InputLabel id="demo-simple-select-standard-label">
                담당의
              </InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={doctor || ""}
                fullWidth
                variant="outlined"
                onChange={(e) => handleChange(e)}
                label="담당의"
              >
                {receptionDoctorData.map((element, idx) => (
                  <MenuItem key={idx} value={element.id}>
                    {element.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl variant="outlined" sx={{ m: 1, minWidth: 240 }}>
              <InputLabel id="demo-simple-select-standard-label">
                예약시간
              </InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={availableSchedule || ""}
                fullWidth
                onChange={handleDate}
                label="담당의"
                variant="outlined"
              >
                {availableTime.map((element, idx) => (
                  <MenuItem key={idx} value={element}>
                    {element.start}:{element.end}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <br />
        <br />
        <Button variant="contained" onClick={addReception}>
          접수하기
        </Button>
      </CardContent>
      <Dialog
        open={searchDialogOpen}
        onClose={closeSearchDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
      >
        <ReceptionSearchPatient
          setPatient={setPatient}
          name={patientNameSearch}
          closeSearchDialog={closeSearchDialog}
        />
      </Dialog>
    </Card>
  );
};
const ReceptionCalendar = (props) => {
  const clickEvent = (args) => {
    const date = args["dateStr"];
    const day = args["date"].getDay();
    const openingTime = props.openingTime;
    props.setDate(date);
    props.setDay(day);

    console.log(openingTime);
  };

  useEffect(() => {});

  return (
    <Card variant="outlined" style={{ height: "100%" }}>
      <CardContent>
        <FullCalendar
          selectable={true}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          className="full-calendar"
          dateClick={clickEvent}
          editable={true}
        />
      </CardContent>
    </Card>
  );
};

const ReceptionPatientsCard = (props) => {
  /*
    const { schedule, setSchedule } = useState([]);

    console.log(props);
    useEffect(() => {
      setSchedule(props);
    }, [props]);
    */
  const {
    doctorData,
    doctor,
    date,
    patientName,
    phoneNumber,
    remarks,
    schedule,
    hasInsurance,
  } = props;

  const columns = [
    {
      field: "date",
      headerName: "진료시간",
      width: 180,
      editable: true,
    },
    {
      field: "patientName",
      headerName: "환자이름",
      width: 100,
      editable: true,
    },
    {
      field: "doctorName",
      headerName: "담당의",
      width: 110,
      editable: true,
    },
    {
      field: "remarks",
      headerName: "특이사항",
      sortable: false,
      width: 160,
    },
  ];

  /*
     
    */
  return (
    <Card variant="outlined" style={{ height: "100%" }}>
      <CardContent>
        <Typography color="textSecondary" gutterBottom>
          예약환자목록
        </Typography>
        <Box sx={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={schedule}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
          />
        </Box>
      </CardContent>
    </Card>
  );
};

const Reception = (props) => {
  const no = useLocation().pathname.substring(
    useLocation().pathname.lastIndexOf("/")
  );
  const [schedule, setSchedule] = useState([]);
  const [doctor, setDoctor] = useState([]);
  const [doctorData, setDoctorData] = useState([]);
  const [hasInsurance, setHasInsurance] = useState("");
  const [date, setDate] = useState(today);
  const [hospitalNo, setHospitalNo] = useState("");
  const [status, setStatus] = useState("4");
  const [patientName, setPatientName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [day, setDay] = useState(dayOfToday);
  const [openingTime, setOpeningTime] = useState("");

  const { enqueueSnackbar } = useSnackbar();
  const client = useRef({});
  const isAuthorized = window.localStorage.getItem("Authorization");
  let hn = "";
  if (isAuthorized !== null) {
    hn = jwt_decode(isAuthorized).hospitalNo;
  }
  const baseUrl = BACKEND_URL + "/api/nurse";
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

  const getSchedule = async (props) => {
    console.log("예약")
    console.log(hn);
    console.log(date)
    await axios
      .get(BACKEND_URL + "/api/nurse/appointmentByDate", {
        headers: {
          Authorization: window.localStorage.getItem("Authorization"),
        },
        params: {
          hospitalNo : hn,
          date : date
        }
      })
      .then((res) => {
        setSchedule(
          res.data.data.map.map((element) => {
            return {
              id: element.no,
              status: element.status,
              date: element.date,
              remarks: element.remarks,
              patientName: element.patientName,
              doctorName: element.doctorName,
              hospitalNo: element.hospitalNo,
            };
          })
        );
      });
  };

  const getDoctor = async () => {
    await axios
      .get(BACKEND_URL + "/api/hospitaladmin?hn=" + hn, {
        headers: {
          Authorization: window.localStorage.getItem("Authorization"),
        },
      })
      .then((res) => {
        setDoctorData(
          res.data.data
            .filter((element) => element.role === "ROLE_DOCTOR")
            .map((element) => {
              return {
                id: element.no,
                name: element.name,
                email: element.email,
                gender: element.gender === 1 ? "남" : "여",
                address: element.address,
                phoneNumber: element.phoneNumber,
                role: element.role,
                licenseNumber: element.licenseNumber,
              };
            })
        );
      });
  };

  const getUnAvailableTime = (param) => {
    /**
     * 전체 스케쥴 받아와서 그 시간을 뺀 나머지 예약 시간을 출력
     *
     */

    param.map((item) => {
      let temp = item.date;
      let unAvailableTime = new Map();
      let result = "";

      result = temp.split(" ")[1].split(":");
      console.log(result);
      unAvailableTime.set("time", result);
    });
  };

  useEffect(() => {
    let param = date;
    param = param.split(" ")[0];
    getSchedule((props = param));
    getDoctor();
  }, [date]);

  useEffect(() => {
    let param = schedule;
    getUnAvailableTime(param);
  }, [schedule]);

  return (
    <Container>
      <Grid container spacing={3} direction="row" alignItems="stretch">
        <Grid item xs={6}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <ReceptionCalendar setDate={setDate} setDay={setDay} />
            </Grid>
            <Grid item xs={12}>
              <ReceptionPatientsCard
                doctorData={doctorData}
                date={date}
                patientName={patientName}
                phoneNumber={phoneNumber}
                remarks={remarks}
                schedule={schedule}
                hasInsurance={hasInsurance}
                doctor={doctor}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <ReceptionCard
            doctorData={doctorData}
            date={date}
            patientName={patientName}
            phoneNumber={phoneNumber}
            remarks={remarks}
            schedule={schedule}
            hasInsurance={hasInsurance}
            doctor={doctor}
            setDoctorData={setDoctorData}
            setDoctor={setDoctor}
            day={day}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Reception;
