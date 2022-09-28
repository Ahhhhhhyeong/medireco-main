import React from 'react';
import MenuItems from './sideMenuItem.json';
import SideBarMenuList from './dashboard_sidebar_menu_list';
import { Box } from '@mui/material';
import { useStyles } from './dashboard_sidebar_style';
import jwt_decode from "jwt-decode";

export default function SideBarMenu() {
  const classes = useStyles();   
  const isAuthorized = window.localStorage.getItem("Authorization");
  const role = jwt_decode(isAuthorized).role;


    return (
      <Box className={classes.sidebarMenuBox}>            
        {
          MenuItems.map((item, index) => {
            if(role == item.level){
              return (<SideBarMenuList item={item} key={index} />);              
            }
            if(item.level == 'ALL'){
              return (<SideBarMenuList item={item} key={index} />);
            }
          })
         }
      </Box>
    );
}
