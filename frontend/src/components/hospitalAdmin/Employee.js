import React, { useEffect, useRef, useState } from "react";
import { Button, TextField, Grid, Box, Container } from "@mui/material/";
import { useLocation } from "react-router";
import { useNavigate } from "react-router-dom";
import DaumPostcode from "react-daum-postcode";
import axios from "axios";
import {
  Dialog,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@material-ui/core";
import jwt_decode from "jwt-decode";

export default function Employee() {
  const no = useLocation().pathname.substring(
    useLocation().pathname.lastIndexOf("/")
  );
  const [status, setStatus] = useState("join");
  const [id, setId] = useState(null);
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(false);
  const [nameHelperText, setNameHelperText] = useState(false);
  const [rrn, setRrn] = useState("");
  const [rrnError, setRrnError] = useState(false);
  const [rrnHelperText, setRrnHelperText] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [emailHelperText, setEmailHelperText] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordHelperText, setPasswordHelperText] = useState(false);
  const [gender, setGender] = useState(1);
  const [address, setAddress] = useState("");
  const [addressError, setAddressError] = useState(false);
  const [addressHelperText, setAddressHelperText] = useState(false);
  const [licenseNumber, setLicenseNumber] = useState("");
  const [licenseNumberError, setLicenseNumberError] = useState(false);
  const [licenseNumberHelperText, setLicenseNumberHelperText] = useState(false);
  const [tel, setTel] = useState("");
  const [telError, setTelError] = useState(false);
  const [telHelperText, setTelHelperText] = useState(false);
  const [role, setRole] = useState("ROLE_DOCTOR");
  const [hospitalNo, setHospitalNo] = useState("");
  const navigate = useNavigate();
  const [dialogIsOpen, setDialogIsOpen] = React.useState(false);
  const isAuthorized = window.localStorage.getItem("Authorization");
  const hn = jwt_decode(isAuthorized).hospitalNo;
  const BACKEND_URL = process.env;

  const openDialog = () => {
    setDialogIsOpen(true);
  };
  const closedDialog = () => {
    setDialogIsOpen(false);
  };

  useEffect(() => {
    fetch();
  }, []);

  const fetch = async () => {
    if (no === "/employee") {
      return;
    }

    setStatus("update");

    await axios
      .get(BACKEND_URL + "/api/hospitaladmin" + no, {
        headers: {
          Authorization: window.localStorage.getItem("Authorization"),
        },
      })
      .then((res) => {
        setId(res.data.data.no);
        setName(res.data.data.name);
        setRrn(res.data.data.rrn);
        setEmail(res.data.data.email);
        setGender(res.data.data.gender);
        setAddress(res.data.data.address);
        setLicenseNumber(res.data.data.licenseNumber);
        setTel(res.data.data.phoneNumber);
        setRole(res.data.data.role);
        setHospitalNo(hn);
      });
  };

  useEffect(() => {
    if (rrn.length === 13) {
      setRrn(rrn.replace(/(\d{6})(\d{7})/, "$1-$2"));
    }
  }, [rrn]);

  useEffect(() => {
    if (tel.length === 10) {
      setTel(tel.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3"));
    }
    if (tel.length === 13) {
      setTel(
        tel.replace(/-/g, "").replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3")
      );
    }
  }, [tel]);

  // form ??????
  const handleSubmit = (e) => {
    e.preventDefault();

    let valiCheck = [];

    if (name.length < 1) {
      setNameError(true);
      setNameHelperText("?????? ????????? ??????????????????!");
      valiCheck[0] = false;
    } else {
      setNameError(false);
      valiCheck[0] = true;
    }

    if (rrn.length < 1) {
      setRrnError(true);
      setRrnHelperText("??????????????? ??????????????????!");
      valiCheck[1] = false;
    } else {
      setRrnError(false);
      valiCheck[1] = true;
    }

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/g;
    if (email.length < 1) {
      setEmailError(true);
      setEmailHelperText("???????????? ??????????????????!");
      valiCheck[2] = false;
    } else if (!emailRegex.test(email) && email.length > 0) {
      setEmailError(true);
      setEmailHelperText("????????? ????????? ????????? ????????????!");
      valiCheck[2] = false;
    } else {
      setEmailError(false);
      valiCheck[2] = true;
    }

    if (password.length < 1) {
      setPasswordError(true);
      setPasswordHelperText("??????????????? ??????????????????!");
      valiCheck[3] = false;
    } else {
      setPasswordError(false);
      valiCheck[3] = true;
    }

    if (address.length < 1) {
      setAddressError(true);
      setAddressHelperText("????????? ??????????????????!");
      valiCheck[4] = false;
    } else {
      setAddressError(false);
      valiCheck[4] = true;
    }

    const telRegex = /^01(?:0|1|[6-9])-(?:\d{3}|\d{4})-\d{4}$/;
    if (tel.length < 1) {
      setTelError(true);
      setTelHelperText("?????????????????? ??????????????????!");
      valiCheck[5] = false;
    } else if (!telRegex.test(tel) && tel.length > 0) {
      setTelError(true);
      setTelHelperText("????????? ??????????????? ????????? ????????????!");
      valiCheck[5] = false;
    } else if (telRegex.test(tel) && tel.length > 0 && tel.length < 10) {
      setTelError(true);
      setTelHelperText("?????? 10?????? ????????? ?????????????????? ???????????????!");
      valiCheck[5] = false;
    } else {
      setTelError(false);
      valiCheck[5] = true;
    }

    if (licenseNumber.length < 1) {
      setLicenseNumberError(true);
      setLicenseNumberHelperText("??????????????? ??????????????????!");
      valiCheck[6] = false;
    } else {
      setLicenseNumberError(false);
      valiCheck[6] = true;
    }

    if (valiCheck.every((e) => e === true)) {
      // ??????
      if (status === "join") {
        join();
        return;
      }

      // ??????
      update();
    }
  };

  const join = async () => {
    await axios
      .post(
        BACKEND_URL + "/api/hospitaladmin",
        {
          name: name,
          rrn: rrn,
          email: email,
          password: password,
          gender: gender,
          address: address,
          licenseNumber: licenseNumber,
          phoneNumber: tel,
          role: role,
          hospitalNo: hn,
        },
        {
          headers: {
            Authorization: window.localStorage.getItem("Authorization"),
          },
        }
      )
      .then((res) => {
        navigate("/employeelist", { replace: true });
      });
  };

  const update = async () => {
    await axios
      .put(
        BACKEND_URL + "/api/hospitaladmin" + no,
        {
          no: id,
          name: name,
          rrn: rrn,
          email: email,
          password: password,
          gender: gender,
          address: address,
          licenseNumber: licenseNumber,
          phoneNumber: tel,
          role: role,
          hospitalNo: hn,
        },
        {
          headers: {
            Authorization: window.localStorage.getItem("Authorization"),
          },
        }
      )
      .then((res) => {
        window.localStorage.removeItem("Authorization");
        navigate("/login", { replace: true });
      });
  };

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

    closedDialog();
  };

  return (
    <div>
      <h1 align="center">{status === "join" ? "?????? ??????" : "?????? ??????"}</h1>

      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mt: 1.5,
          }}
          component="form"
          noValidate
          onSubmit={handleSubmit}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                autoFocus
                fullWidth
                type="text"
                id="employeeName"
                name="employeeName"
                label="?????? ??????"
                value={name || ""}
                onChange={(e) => setName(e.target.value)}
                error={nameError}
                helperText={nameError ? nameHelperText : ""}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                type="text"
                id="rrn"
                name="rrn"
                label="????????????"
                value={rrn || ""}
                onChange={(e) => {
                  const regex = /^[0-9\b -]{0,13}$/;
                  if (regex.test(e.target.value)) {
                    setRrn(e.target.value);
                  }
                }}
                error={rrnError}
                helperText={rrnError ? rrnHelperText : ""}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                type="email"
                id="email"
                name="email"
                label="?????????"
                value={email || ""}
                onChange={(e) => setEmail(e.target.value)}
                error={emailError}
                helperText={emailError ? emailHelperText : ""}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                type="password"
                id="password"
                name="password"
                label="????????????"
                value={password || ""}
                onChange={(e) => setPassword(e.target.value)}
                error={passwordError}
                helperText={passwordError ? passwordHelperText : ""}
              />
            </Grid>

            <Grid item xs={12}>
              <FormLabel>??????</FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                onChange={(e) => setGender(e.target.value)}
              >
                <FormControlLabel
                  value="1"
                  checked={gender === "1" || gender === 1 ? true : false}
                  control={<Radio color="primary" />}
                  label="???"
                />
                <FormControlLabel
                  value="2"
                  checked={gender === "2" || gender === 2 ? true : false}
                  control={<Radio color="primary" />}
                  label="???"
                />
              </RadioGroup>
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                type="text"
                id="address"
                name="address"
                label="????????????"
                inputProps={{ readOnly: true }}
                value={address || ""}
                onClick={(e) => {
                  openDialog();
                }}
                onChange={(e) => setAddress(e.target.value)}
                error={addressError}
                helperText={addressError ? addressHelperText : ""}
              />
              {dialogIsOpen && (
                <Dialog open={dialogIsOpen} onClose={closedDialog}>
                  <DaumPostcode onComplete={selectAddress} />
                </Dialog>
              )}
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                type="text"
                id="tel"
                name="tel"
                label="???????????????"
                value={tel || ""}
                onChange={(e) => {
                  const regex = /^[0-9\b -]{0,13}$/;
                  if (regex.test(e.target.value)) {
                    setTel(e.target.value);
                  }
                }}
                error={telError}
                helperText={telError ? telHelperText : ""}
              />
            </Grid>

            <Grid item xs={12}>
              <FormLabel>??????</FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                onChange={(e) => setRole(e.target.value)}
              >
                <FormControlLabel
                  value="ROLE_DOCTOR"
                  checked={role === "ROLE_DOCTOR" ? true : false}
                  control={<Radio color="primary" />}
                  label="??????"
                />
                <FormControlLabel
                  value="ROLE_NURSE"
                  checked={role === "ROLE_NURSE" ? true : false}
                  control={<Radio color="primary" />}
                  label="?????????"
                />
              </RadioGroup>
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="licenseNumber"
                name="licenseNumber"
                label="????????????"
                value={licenseNumber || ""}
                onChange={(e) => setLicenseNumber(e.target.value)}
                error={licenseNumberError}
                helperText={licenseNumberError ? licenseNumberHelperText : ""}
              />
            </Grid>
          </Grid>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            size="large"
          >
            {status === "join" ? "??????" : "??????"}
          </Button>
        </Box>
      </Container>
    </div>
  );
}
