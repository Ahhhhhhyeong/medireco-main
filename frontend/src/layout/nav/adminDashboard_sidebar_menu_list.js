import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import { ListItemButton, ListItemText } from "@mui/material";
import { NavLink } from "react-router-dom";

const MenuItemsButton = styled(ListItemButton)(({ theme }) => ({
  alignItems: "flex-start",
  sx: {
    px: 3,
    pt: 2.5,
    pb: open ? 0 : 2.5,
    "&:hover, &:focus": { "& svg": { opacity: open ? 1 : 0 } },
  },
}));

export default function SideBarMenuList({ item }) {
  return (
    <div>
      {item.children.map((value, index) => {
        return (
          <NavLink
            key={index}
            to={`/${value.href}`}
            style={{ textDecoration: "none" }} // Underline 제거
          >
            <MenuItemsButton
              key={index}
              sx={{ py: 0, minHeight: 32, paddingLeft: 5 }}
            >
              <ListItemText
                primary={value.lable}
                primaryTypographyProps={{
                  color: "black",
                  fontWeight: "medium",
                  variant: "body2",
                  padding: "10px",
                }}
              />
            </MenuItemsButton>
          </NavLink>
        );
      })}
    </div>
  );
}
