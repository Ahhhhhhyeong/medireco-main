import React, { useState } from "react";
import { Box, Divider, Grid } from "@mui/material";
import { styled, ThemeProvider } from "@mui/material/styles";

import { DashboardNavbar } from "./header/dashboard_navbar";
import { DashboardSidebar } from "./nav/dashboard_sidebar";
import SnackbarCloseButton from "../components/common/SnackbarCloseButton";
import Footer from "./footer/Footer";
import theme from "../theme/index";
import jwt_decode from "jwt-decode";
import { SnackbarProvider } from "notistack";

const DashboardLayoutRoot = styled("div")(({ theme }) => ({
  display: "flex",
  flex: "1 1 auto",
  maxWidth: "100%",
  paddingTop: 64,
  [theme.breakpoints.up("lg")]: {
    paddingLeft: 25,
  },
}));

const SiteLayout = (props) => {
  const { children } = props;
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const isAuthorized = window.localStorage.getItem("Authorization");
  const role = jwt_decode(isAuthorized).role;

  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider
        maxSnack={10}
        action={(snackbarKey) => (
          <SnackbarCloseButton snackbarKey={snackbarKey} />
        )}
      >
        <DashboardNavbar onSidebarOpen={() => setSidebarOpen(true)} />
        <DashboardSidebar
          onClose={() => setSidebarOpen(false)}
          open={isSidebarOpen}
        />
        <DashboardLayoutRoot>
          <Divider orientation="vertical" flexItem height="100%" />
          <Box
            sx={{
              display: "flex",
              flex: "1 1 auto",
              flexDirection: "column",
              width: "100%",
              height: "100%",
            }}
          >
            {children}
          </Box>
        </DashboardLayoutRoot>
        <Footer />
      </SnackbarProvider>
    </ThemeProvider>
  );
};

export default SiteLayout;