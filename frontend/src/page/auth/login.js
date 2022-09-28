import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../../theme/index";
import axios from "axios";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import logo from "../../assets/images/logo.png"

export default function SignIn() {
  const navigate = useNavigate();
  const BACKEND_URL = process.env;
  const selectedCheck = () => {
    Swal.fire({
      confirmButtonColor: "#24b9db",
      text: "이메일 및 비밀번호를 확인해 주세요",
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log(process.env);
    await axios
      .post(BACKEND_URL+"/api/login", {
        email: data.get("email"),
        password: data.get("password"),
      })
      .then((res) => {
        window.localStorage.setItem("Authorization", res.headers.authorization);
        navigate("/", { replace: true });
      })
      .catch((error) => {
        selectedCheck();
      });
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box sx={{ p: 1 }}>
            <img src={logo} width="45px" height="45px" />
          </Box>

          <TextField
            margin="normal"
            required
            fullWidth
            label="이메일"
            type="text"
            id="email"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="비밀번호"
            type="password"
            id="password"
            name="password"
            autoComplete="on"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            로그인
          </Button>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
