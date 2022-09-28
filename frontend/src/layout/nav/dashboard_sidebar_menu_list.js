import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import { ListItemButton, ListItemText } from '@mui/material';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { NavLink } from 'react-router-dom';

const MenuItemsButton = styled(ListItemButton)(({ theme }) => ({
    alignItems: "flex-start",
    sx: {
     px: 3,
     pt: 2.5,
     pb: open ? 0 : 2.5,
     '&:hover, &:focus': { '& svg': { opacity: open ? 1 : 0 }}},     
}));



export default function SideBarMenuList({ item }) {
    const [showDetails, setShowDetails] = useState(true);
    const showDetailNav = () => setShowDetails(!showDetails);

    return (
        <div>
            <MenuItemsButton 
                onClick={item.children && showDetailNav}
            >              
                <ListItemText 
                    primary={item.title}
                    primaryTypographyProps={{
                        color: 'gray-300',
                        fontWeight: 'medium',
                        variant: 'body2'
                    }}
                />
                { showDetails ?
                     <KeyboardArrowUpIcon color="info" /> 
                    : <KeyboardArrowDown color="info" />
                }                               
            </MenuItemsButton>
            {
                showDetails ? 
                item.children.map((value, index) => {
                    return(
                      <NavLink
                        key={index}
                        to={`/${value.href}`}
                        style={{ textDecoration: "none" }}
                      >
                        <MenuItemsButton 
                            key={index} 
                            sx={{ py: 0, minHeight:32, paddingLeft:5}}
                        >
                            <ListItemText
                                primary={value.lable}
                                primaryTypographyProps={{
                                    color: 'black',
                                    fontWeight: 'medium',
                                    variant: 'body2'
                                }}
                            />
                        </MenuItemsButton>
                      </NavLink>
                    )})
                : null
            }
        </div>
    );
}

