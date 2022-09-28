import React, { useEffect, useState } from "react";
import axios from 'axios';
import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import { DataGrid, GridCellModes } from "@mui/x-data-grid";
import CustomNoRowsOverlay from '../common/CustomNoRowsOverlay';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Stack, Typography, Box, Grid, IconButton, Tooltip, Button } from '@mui/material';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { DateTime } from "luxon";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router";
import jwt_decode from "jwt-decode";


const Search = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 1,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto",
    },
    display: "inline",
    float: "center",
  }));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 1),
    // vertical padding + font size from searchIcon
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "30ch",
      "&:focus": {
        width: "40ch",
      },
    },
  },
}));

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  p: 4,
  justifyContent: 'center'
};

function AppointmentReturning() {
  const no = useLocation().pathname.substring(
    useLocation().pathname.lastIndexOf("/")
  );
  const [ data, setData ] = useState([]);
  const [ modalData, setModalData ] = useState({});
  const [ open, setOpen ] =  useState(false);
  const [ doctor, setDoctor ] = useState([]);
  const [ doctorData, setDoctorData ] = useState([]);
  const [ state, setState] = useState(null);
  const [ status, setStatus] = useState(2);
  const [ date, setDate ] = useState("2022-08-18 10:00:00");
  const [ patientName, setPatientName ] = useState("");
  const navigate = useNavigate();
  const isAuthorized = window.localStorage.getItem("Authorization");
  const hn = jwt_decode(isAuthorized).hospitalNo;
  const BACKEND_URL = process.env;
  const baseUrl = BACKEND_URL+'/api/nurse';

  console.log(hn);
  useEffect( () => {
    fetchList();
  }, []);

  const fetchList = async () => {
    await axios
    .get(BACKEND_URL+"/api/hospitaladmin?hn="+hn,{
      headers:{
        Authorization: window.localStorage.getItem("Authorization"),
      }
    })
    .then((res) => {
      setDoctorData(
        res.data.data
        .filter(element => element.role === "ROLE_DOCTOR")
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

  const onChange = (e) => {
    const url = baseUrl + "/patientByName/" + e.target.value;
    e.target.value && axios.get(url, {
      headers:{
        Authorization: window.localStorage.getItem("Authorization"),
      }
      })
      .then((response) => {
        setData(response.data.data);
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      })
  }

  const handleOpen = (id) => {
    const url = baseUrl + "/patientByNo/" + id;
    
    axios.get(url, {
      headers:{
        Authorization: window.localStorage.getItem("Authorization"),
      }
    })
    .then((response) => {
      setModalData(response.data.data);
    })
    .catch((error) => {
      console.log(error);
    })

    setOpen(true);
  }
  const handleClose = () => setOpen(false);

  const addAppointment = async () => {
    await axios
    .post(BACKEND_URL+"/api/nurse/appointment", 
    {
      state: state,
      date: date,
      remarks: state,
      patientNo: modalData.no,
      employeeNo: doctor,
      hospitalNo: hn,
      status: status
    },
    {
      headers:{
        Authorization: window.localStorage.getItem("Authorization"),
      }   
    })
    .then((res) => {
      console.log(res);
      navigate("/nurse", { replace: true});
    })
  }
  
  const handleChange = (event) => {
    console.log(event.target.value);
    setDoctor(event.target.value);
  };

  const columns = [
    { field: 'rrn', headerName: '주민등록번호', width: 150, editable: true },
    { field: 'name', headerName: '이름', width: 100, editable: true },
    { field: 'gender', headerName: '성별', width: 80, editable: true },
    { field: 'address', headerName: '주소', width: 300, editable: true },
    { field: 'phoneNumber', headerName: '전화번호', width: 200, editable: true },
    { field: 'history', headerName: '내원이력', width: 100, editable: true },
    { field: 'doctor', headerName: '담당의', width: 150, editable: true },
    {
        field: 'appointment',
        headerName: '접수하기',
        width: 150,
        renderCell:({id}) => (
            <IconButton
                color='primary'
                sx={{ width: 80 }}
                onClick={() => handleOpen(id)}
            >
                <AddCircleOutlineIcon />
            </IconButton>
        )
    }
  ];
 

  return (
    
    <div id="AppointmentReturning" style={{ height: "600px", width: "100%", marginBottom: "2rem" }} align="center" display="flex">
        <Search>
            <SearchIcon fontSize='small' />
                <StyledInputBase
                placeholder="환자 이름을 검색해주세요"
                inputProps={{ "aria-label": "search" }}
                onChange={onChange}
                />
        </Search>
        <DataGrid
            rows={data}
            columns={columns}
            rowsPerPageOptions={[10]}
            getRowId={(row) => row.no}
            pageSize={10}
            components={{
              NoRowsOverlay: CustomNoRowsOverlay
            }}
          ></DataGrid>
        <div>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style} >
            <Grid container spacing={3} >
              <Grid item xs={12}>
                <TextField
                  id="rrn"
                  label="주민등록번호"
                  fullWidth
                  variant="outlined"
                  value={modalData.rrn}
                  inputProps={
                    { readOnly: true }
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  id="name"
                  name="name"
                  label="이름"
                  fullWidth
                  variant="outlined"
                  value={modalData.name}
                  inputProps={
                    { readOnly: true }
                  }
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  required
                  id="phoneNumber"
                  name="phoneNumber"
                  label="전화번호"
                  variant="outlined"
                  fullWidth
                  value={modalData.phoneNumber}
                  inputProps={
                    { readOnly: true }
                  }
                />
              </Grid>

              <Grid item xs={12} >
                <TextField
                  id="address"
                  name="address"
                  label="주소"
                  variant="outlined"
                  fullWidth
                  value={modalData.address}
                  inputProps={
                    { readOnly: true }
                  }
                />
              </Grid>
            
              <Grid item xs={12}>
                <TextField
                  id="state"
                  name="state"
                  label="증상"
                  multiline
                  fullWidth
                  variant="outlined"
                  value={state || ""}
                  onChange={(e) => setState(e.target.value)}
                  />
              </Grid>
              <Grid item xs={12} >
                <FormControl variant="standard" sx={{m: 1, minWidth: 200 }}>
                  <InputLabel id="demo-simple-select-standard-label">담당의</InputLabel>
                    <Select
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={doctor || ""}
                      defaultValue={doctor || ""}
                      variant="outlined"
                      onChange={(e) => handleChange(e)}
                      autoWidth
                      label="담당의"
                    >
                      {doctorData.map((doctorData, idx) => (
                        <MenuItem
                          key={idx}
                          value={doctorData.id}
                        >
                          {doctorData.name}
                        </MenuItem>
                      ))}
                
                    </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                 <FormControl>
                  <FormLabel id="demo-radio-buttons-group-label">보험 가입 여부</FormLabel>
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue="1"
                    row
                    name="radio-buttons-group"
                    onChange={(e) => setHasInsurance(e.target.value)}
                  >
                    <FormControlLabel value="1" control={<Radio />} label="예" />
                    <FormControlLabel value="2" control={<Radio />} label="아니오" />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12} align='center'>
                <Button variant="contained" onClick={addAppointment} >
                  접수하기
                </Button>
              </Grid>
              
            </Grid>
      
            </Box>
          </Modal>
        </div>
    </div>

        

        
  );
};

export default AppointmentReturning;                    
                    
                    