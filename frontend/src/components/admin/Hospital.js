import React, { useEffect, useRef, useState } from "react";
import { Button, TextField, Grid, Box, Container } from "@mui/material/";
import SiteLayout from "../../layout/AdminSiteLayout";
import { useLocation } from "react-router";
import { useNavigate } from "react-router-dom";
import DaumPostcode from "react-daum-postcode";
import axios from "axios";
import { Dialog } from "@material-ui/core";

export default function Hospital() {
  const no = useLocation().pathname.substring(
    useLocation().pathname.lastIndexOf("/")
  );
  const [status, setStatus] = useState("join");
  const [id, setId] = useState(null);
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(false);
  const [nameHelperText, setNameHelperText] = useState(false);
  const [address, setAddress] = useState("");
  const [addressError, setAddressError] = useState(false);
  const [addressHelperText, setAddressHelperText] = useState(false);
  const [tel, setTel] = useState("");
  const [telError, setTelError] = useState(false);
  const [telHelperText, setTelHelperText] = useState(false);
  const [url, setUrl] = useState("");
  const [urlError, setUrlError] = useState(false);
  const [urlHelperText, setUrlHelperText] = useState(false);
  const navigate = useNavigate();
  const [dialogIsOpen, setDialogIsOpen] = React.useState(false);
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
    if (no === "/hospital") {
      return;
    }

    setStatus("update");

    await axios
      .get(BACKEND_URL + "/api/admin" + no, {
        headers: {
          Authorization: window.localStorage.getItem("Authorization"),
        },
      })
      .then((res) => {
        setId(res.data.data.no);
        setName(res.data.data.name);
        setAddress(res.data.data.address);
        setTel(res.data.data.phoneNumber);
        setUrl(res.data.data.url);
      });
  };

  useEffect(() => {
    if (tel.length === 9) {
      setTel(tel.replace(/(\d{2})(\d{3})(\d{4})/, "$1-$2-$3"));
    }
    if (tel.length === 12) {
      if (tel[0] === "0" && tel[1] === "2") {
        setTel(
          tel.replace(/-/g, "").replace(/(\d{2})(\d{4})(\d{4})/, "$1-$2-$3")
        );
      } else {
        setTel(
          tel.replace(/-/g, "").replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3")
        );
      }
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

    if (address.length < 1) {
      setAddressError(true);
      setAddressHelperText("????????? ??????????????????!");
      valiCheck[1] = false;
    } else {
      setAddressError(false);
      valiCheck[1] = true;
    }

    const telRegex = /^(?:\d{2}|\d{3})-(?:\d{3}|\d{4})-\d{4}$/;
    if (tel.length < 1) {
      setTelError(true);
      setTelHelperText("??????????????? ??????????????????!");
      valiCheck[2] = false;
    } else if (!telRegex.test(tel) && tel.length > 0) {
      setTelError(true);
      setTelHelperText("????????? ???????????? ????????? ????????????!");
      valiCheck[2] = false;
    } else if (telRegex.test(tel) && tel.length > 0 && tel.length < 9) {
      setTelError(true);
      setTelHelperText("?????? 9?????? ????????? ??????????????? ???????????????!");
      valiCheck[2] = false;
    } else {
      setTelError(false);
      valiCheck[2] = true;
    }

    if (url.length < 1) {
      setUrlError(true);
      setUrlHelperText("URL??? ??????????????????!");
      valiCheck[3] = false;
    } else {
      setUrlError(false);
      valiCheck[3] = true;
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
        BACKEND_URL + "/api/admin",
        {
          name: name,
          address: address,
          phoneNumber: tel,
          url: url,
        },
        {
          headers: {
            Authorization: window.localStorage.getItem("Authorization"),
          },
        }
      )
      .then((res) => {
        navigate("/hospitallist", { replace: true });
      });
  };

  const update = async () => {
    await axios
      .put(
        BACKEND_URL + "/api/admin" + no,
        {
          no: id,
          name: name,
          address: address,
          phoneNumber: tel,
          url: url,
        },
        {
          headers: {
            Authorization: window.localStorage.getItem("Authorization"),
          },
        }
      )
      .then((res) => {
        navigate("/hospitallist", { replace: true });
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
      <SiteLayout>
        <h1 align="center">{status === "join" ? "?????? ??????" : "?????? ??????"}</h1>

        <Container component="main" maxWidth="xs">
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mt: 3,
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
                  id="hospitalName"
                  name="hospitalName"
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
                  id="address"
                  name="address"
                  label="????????????"
                  inputProps={{ readOnly: true }}
                  value={address || ""}
                  onChange={(e) => setAddress(e.target.value)}
                  error={addressError}
                  helperText={addressError ? addressHelperText : ""}
                  onClick={(e) => {
                    openDialog();
                  }}
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
                  label="????????????"
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
                <TextField
                  required
                  fullWidth
                  type="email"
                  id="url"
                  name="url"
                  label="URL"
                  value={url || ""}
                  onChange={(e) => setUrl(e.target.value)}
                  error={urlError}
                  helperText={urlError ? urlHelperText : ""}
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
      </SiteLayout>
    </div>
  );
}
