import React from "react";
import propTypes from "prop-types";
import { Box, Divider, Typography } from "@mui/material";
import { Tabs, Tab } from "@mui/material";
import SideBarMenuList from "./adminDashboard_sidebar_menu_list";
import { useStyles } from "./dashboard_sidebar_style";
import { Stack } from "@mui/system";
import MenuItems from "./adminSideMenuItem.json";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component={"span"}>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: propTypes.node,
  index: propTypes.any.isRequired,
  value: propTypes.any.isRequired,
};

function menuProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

export const DashboardSidebar = () => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box className={classes.box}>
      <Stack direction="column" spacing={1}>
        <Box className={classes.dividerBox}>
          <Box className={classes.sidebarMenuBox}>
            {MenuItems.map((item, index) => {
              return <SideBarMenuList item={item} key={index} />;
            })}
          </Box>
        </Box>
      </Stack>
    </Box>
  );
};
