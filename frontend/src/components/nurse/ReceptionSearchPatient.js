import React, { useEffect, useState } from "react";
import axios from 'axios';
import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import { DataGrid, GridCellModes } from "@mui/x-data-grid";
import CustomNoRowsOverlay from '../common/CustomNoRowsOverlay';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Stack, Typography, Box, Grid, IconButton, Tooltip, Button } from '@mui/material';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { DateTime } from "luxon";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router";
import jwt_decode from "jwt-decode";
import { SelectAllRounded } from "@material-ui/icons";
const BACKEND_URL = process.env;

const ReceptionSearchPatient = (props) => {
    console.log(props);
    const [data, setData] = useState([]);
    const [selectedRow, setSelectedRow] = useState([]);
    const name = props.name;
    const baseUrl = BACKEND_URL+"/api/nurse";

    const columns = [
        {
            field: 'appointment',
            headerName: '선택',
            width: 100,
            renderCell:({id}) => (
                <IconButton
                    color='primary'
                    sx={{ width: 80 }}
                    onClick={() => handleOpen(id)}
                >
                    <AddCircleOutlineIcon />
                </IconButton>
            )
        },
        { field: 'rrn', headerName: '주민등록번호', width: 150, editable: true },
        { field: 'name', headerName: '이름', width: 100, editable: true },
        { field: 'gender', headerName: '성별', width: 80, editable: true },
        { field: 'address', headerName: '주소', width: 300, editable: true },
        { field: 'phoneNumber', headerName: '전화번호', width: 200, editable: true },
        { field: 'history', headerName: '내원이력', width: 100, editable: true },
        { field: 'doctor', headerName: '담당의', width: 150, editable: true },
       
    ];

    useEffect (() => {
        fetchListByName();
    }, [])

    const fetchListByName = async() => {
        let url = baseUrl + "/patientByName/" + name;

        await axios
       .get(url, {
        headers:{
            Authorization: window.localStorage.getItem("Authorization"),
          }
       })
       .then((res) => {
            console.log(res.data.data);
            setData(res.data.data);
       })
    }

    const handleOpen = () => {
        props.closeSearchDialog();
    }

    return (
      
            <Box sx={{width: "100%"}}>
                  <div
                id="AppointmentList"
                style={{
                    height: 400,
                    width: "95%",
                    marginLeft: "2rem",
                    marginTop: "2rem",
                }}
                align="center"
                display="flex"
                >
                <DataGrid
                    rows={data}
                    columns={columns}
                    rowsPerPageOptions={[10]}
                    getRowId={(row) => row.no}
                    pageSize={10}
                    components={{
                    NoRowsOverlay: CustomNoRowsOverlay
                    }}
                    onRowClick={(params) => {
                        props.setPatient(params.row);
                    }}
                ></DataGrid>
                </div>
            </Box>
       
    )
}
export default ReceptionSearchPatient;