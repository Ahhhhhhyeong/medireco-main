import React from "react";
import { Box } from "@mui/material";
import SideBarMenu from "./dashboard_sidebar_menu";
import { useStyles } from "./dashboard_sidebar_style";
import { Stack } from "@mui/system";


export const DashboardSidebar = () => {
  const classes = useStyles();
  
  
  return (
    <Box className={classes.box}>
      <Stack 
        direction="column"
        spacing={1}>
        <Box className={classes.dividerBox}>
          <SideBarMenu />
        </Box>        
      </Stack>              
    </Box>
  );
};
