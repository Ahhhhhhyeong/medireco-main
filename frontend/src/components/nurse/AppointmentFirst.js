import React, { useEffect, useState } from "react";
import { Box, Grid } from '@mui/material';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import axios from "axios";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { DateTime } from "luxon";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router";
import jwt_decode from "jwt-decode";
import DaumPostcode from "react-daum-postcode";
import {
  Dialog
} from "@material-ui/core";

const zone = "Asia/Seoul";
const now = () => {
    return DateTime.now().setZone(zone);
  }

function AppointmentFirst() {
  const no = useLocation().pathname.substring(
    useLocation().pathname.lastIndexOf("/")
  );
  const [ doctor, setDoctor ] = useState([]);
  const [ data, setData ] = useState([]);
  const [ name, setName] = useState(null);
  const [ rrn, setRrn] = useState("");
  const [ gender, setGender] = useState(1);
  const [ address, setAddress] = useState(null);
  const [ phoneNumber, setPhoneNumber] = useState("");
  const [ state, setState] = useState("2");
  const [ hasInsurance, setHasInsurance ] = useState("");
  const [ regDate, setRegDate ] = useState(now());
  const [ status, setStatus] = useState(2);
  const [ remarks, setRemarks] = useState("");
  const [ addressDialogOpen, setAddressDialogOpen ] = useState(false);
  const navigate = useNavigate();
  const isAuthorized = window.localStorage.getItem("Authorization");
  const hn = jwt_decode(isAuthorized).hospitalNo;
  const BACKEND_URL = process.env;

  const openAddressDialog = () => {
    setAddressDialogOpen(true);
  };
  const closeAddressDialog = () => {
    setAddressDialogOpen(false);
  };

  useEffect(() => {
    fetchList();
  }, []);

  
  useEffect(() => {
    if (phoneNumber.length === 10) {
      setPhoneNumber(phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3"));
    }
    if (phoneNumber.length === 13) {
      setPhoneNumber(
        phoneNumber.replace(/-/g, "").replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3")
      );
    }
  }, [phoneNumber]);

  useEffect(() => {
    if (rrn.length === 13) {
      setRrn(rrn.replace (/([\d|*]{6})([\d|*]+)/, '$1-$2'));
    }
  }, [rrn]);

  const fetchList = async () => {
    await axios
    .get(BACKEND_URL+"/api/hospitaladmin?hn="+hn,{
      headers:{
        Authorization: window.localStorage.getItem("Authorization"),
      }
    })
    .then((res) => {
      console.log(res.data.data);
      setData(
        res.data.data
        .filter(element => element.role === "ROLE_DOCTOR")
        .map((element) => {
            return {
              id: element.no,
              name: element.name,
              email: element.email,
              gender: element.gender === 1 ? "???" : "???",
              address: element.address,
              phoneNumber: element.phoneNumber,
              role: element.role,
              licenseNumber: element.licenseNumber,
            };
          
          
        })
      );
    });
  };

  const addPatient = async () => {
    let gender = rrn.split("-")[1].substr(0,1);
    console.log(gender);
    await axios
    .post(BACKEND_URL+"/api/nurse/patient", 
    {
      name: name,
      rrn: rrn,
      address: address,
      phoneNumber: phoneNumber,
      gender: gender,
      hasInsurance: hasInsurance,
      regDate: regDate,
      hospitalNo: hn,
      employeeNo: doctor,
      remarks: remarks,
      status: status
    },
    {
      headers:{
        Authorization: window.localStorage.getItem("Authorization"),
      },
     
    })
    .then((res) => {
      console.log(res);
      navigate("/nurse", { replace: true });
      //addAppointment();
    })
  }

  const selectAddress = (data) => {
    let fullAddr = data.address;
    let extraAddr = "";

    if (data.addressType === "R") {
      if (data.bname !== "") {
        extraAddr += data.bname;
      }
      if (data.buildingName !== "") {
        extraAddr +=
          extraAddr !== "" ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddr += extraAddr !== "" ? ` (${extraAddr})` : "";
    }
    setAddress(fullAddr);

    closeAddressDialog();
  }

  const handleChange = (e) => {
    setDoctor(e);
  };
 
 
  return (
    <div id="AppointmentFirst" style={{ height: "600px", width: "100%", marginTop: "3rem" }} align="center" display="flex">
       <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            required
            id="rrn"
            name="rrn"
            label="??????????????????"
            fullWidth
            variant="outlined"
            value={rrn || ""}
            onChange={(e) => {
              const regex = /^[0-9]{0,13}$/;
              if (regex.test(e.target.value)) {
                setRrn(e.target.value);    
              }
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id="name"
            name="name"
            label="??????"
            fullWidth
            autoComplete="family-name"
            variant="outlined"
            value={name || ""}
            onChange={(e) => setName(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} >
          <TextField
            id="address"
            name="address"
            label="??????"
            fullWidth
            autoComplete="shipping address-line2"
            variant="outlined"
            value={address || ""}
            inputProps={{readOnly : true}}
            onClick={(e) => {
              openAddressDialog();
            }}
            onChange={(e) => setAddress(e.target.value)}
          />
          {addressDialogOpen && (
            <Dialog open={addressDialogOpen} onClose={closeAddressDialog}>
              <DaumPostcode onComplete={selectAddress} />
            </Dialog>
          )}
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id="phoneNumber"
            name="phoneNumber"
            label="????????????"
            fullWidth
            autoComplete="shipping address-level2"
            variant="outlined"
            value={phoneNumber || ""}
            onChange={(e) => {
              const regex = /^[0-9\b -]{0,13}$/;
              if (regex.test(e.target.value)) {
                setPhoneNumber(e.target.value)
              }
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="remarks"
            name="remarks"
            label="??????"
            multiline
            fullWidth
            variant="outlined"
            value={remarks || ""}
            onChange={(e) => setRemarks(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl variant="outlined" fullWidth="true" >
            <InputLabel id="demo-simple-select-autowidth-label" >?????????</InputLabel>
              <Select
                labelId="demo-simple-select-autowidth-label"
                id="demo-simple-select-autowidth-label"
                defaultValue={doctor || ""}
                value={doctor || ""}
                onChange={(e) => handleChange(e.target.value)}
                fullWidth
                label="?????????"
              >
              {data.map((data, idx) => (
                <MenuItem
                  key={idx}
                  value={data.id}
                >
                  {data.name}
                </MenuItem>
              ))}
                
              </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
        <FormControl>
          <FormLabel id="demo-radio-buttons-group-label">??????????????????</FormLabel>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              display="flex"
              row
              value={hasInsurance}
              defaultValue="1"
              name="radio-buttons-group"
              onChange={(e) => setHasInsurance(e.target.value)}
            >
              <FormControlLabel value="1" control={<Radio />} label="???" />
              <FormControlLabel value="2" control={<Radio />} label="?????????" />
            </RadioGroup>
        </FormControl>
        </Grid>
     
      </Grid>
    <br />
    <br />
    <Button variant="contained"  onClick={addPatient}>
        ????????????
      </Button>     
    </div>
   
  );
};

const columns = [
  { field: 'appointmentDate', headerName: '????????????', widht: '100px', editable: true },
  { field: 'patientName', headerName: '??????', widht: '200px', editable: true },
  { field: 'patientAge', headerName: '??????', widht: '200px', editable: true },
  { field: 'patientGender', headerName: '??????', widht: '200px', editable: true },
  { field: 'appointmentStatus', headerName: '????????????', widht: '200px', editable: true },
  { field: 'patientDetail', headerName: '????????????', widht: '200px', editable: true },
  { field: 'appointmentCancel', headerName: '????????????', widht: '200px', editable: true },
  { field: 'appointmentPay', headerName: '??????', widht: '200px', editable: true },

  {
      field: 'id',
      headerName: '',
      widht: 150,
      renderCell:({id}) => (
          <IconButton
              color='primary'
              sx={{ widht: 80 }}
              onClick={() => handleCancelClick(id)}
          >
              <CancelIcon />
          </IconButton>
      )
  }
];

export default AppointmentFirst;