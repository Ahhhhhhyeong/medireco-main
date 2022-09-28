import React, { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import {
  AppBar,
  Typography,
  Badge,
  Box,
  IconButton,
  Toolbar,
  Tooltip,
} from "@mui/material";
import BellIcon from "@mui/icons-material/Notifications";
import LogoutIcon from "@mui/icons-material/Logout";
import UserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import { useNavigate } from "react-router";
import { NavLink } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { gridColumnPositionsSelector } from "@mui/x-data-grid";
import logo from "../../assets/images/logo.png";
import Timer from "./Timer";

const DashboardNavbarRoot = styled(AppBar)(({ theme }) => ({
  backgroundColor: "#24b9db",
  boxShadow: "none",
}));

export const DashboardNavbar = (props) => {
  const navigate = useNavigate();
  const isAuthorized = window.localStorage.getItem("Authorization");
  let no = "";

  if (isAuthorized !== null) {
    no = jwt_decode(isAuthorized).no;
  }

  const logout = () => {
    localStorage.removeItem("Authorization");
    navigate("/login", { replace: true });
  };

  return (
    <DashboardNavbarRoot
      sx={{
        width: {
          lg: "calc(100%)",
        },
      }}
    >
      <Toolbar
        disableGutters
        sx={{
          minHeight: 64,
          left: 0,
          px: 2,
        }}
      >
        <Box sx={{ p: 1 }}>
          <img src={logo} width="45px" height="45px" />
        </Box>
        <Box sx={{ flexGrow: 1 }} />

        <Timer />

        <Tooltip title="회원정보수정">
          <NavLink
            to={`/employee/${no}`}
            style={{ textDecoration: "none" }} // Underline 제거
          >
            <IconButton sx={{ ml: 1 }}>
              <UserCircleIcon fontSize="inherit" />
            </IconButton>
          </NavLink>
        </Tooltip>

        <Tooltip title="로그아웃">
          <IconButton sx={{ ml: 1 }} onClick={logout}>
            <LogoutIcon fontSize="inherit" />
          </IconButton>
        </Tooltip>
      </Toolbar>
    </DashboardNavbarRoot>
  );
};
