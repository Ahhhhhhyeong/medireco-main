import React, { useEffect, useState } from 'react';
import { now } from '../attendance/datetime';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, InputLabel, Box, TextField, Select } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { koKR } from '@mui/material/locale';
import Swal from "sweetalert2";
import axios from 'axios';
import jwt_decode from "jwt-decode";


function AttendanceModal({ open, close }) {
    const [ startDate, setStartDate ] = useState();
    const [ endDate, setEndDate ] = useState();
    const [ data, setData ] = useState({
        type: '',
        name: name,
        remark: ''
    });
    const [isValidation, setValidation] = useState({
        name: false,
        remark: true,
        type: true,        
    });
    const isAuthorized = window.localStorage.getItem("Authorization");
    const hn = jwt_decode(isAuthorized).hospitalNo;
    const name = jwt_decode(isAuthorized).name;
    const no = jwt_decode(isAuthorized).no;
    const role = jwt_decode(isAuthorized).role;
    const BACKEND_URL = process.env;
    const url = BACKEND_URL+'/api/common/attendanceSchedule';

    useEffect(() => {
        setStartDate(now().toFormat("yyyy-MM-dd"));
        setEndDate(now().toFormat("yyyy-MM-dd"));
        setData(Object.assign({}, data, { hospitalNo: hn, no: no }));
    }, []);

    const handleSubmit = async (e) => {
        if(isValidation.name || isValidation.type || isValidation.remark){
            return;
        }
        if(startDate > endDate){
            alert("시작일이 종료일보다 큽니다.");
            return;
        }
        e.preventDefault();
        await axios
        .post(url, {
            No: data.no,
            startDate: startDate,
            endDate: endDate,
            status: data.type,
            remark: data.remark,
            isConfirmed: role == 'ROLE_ADMIN' ? 1 : 0,
            hospitalNo: hn,
            employeeNo: no
        },
        {
          headers: {
            Authorization: window.localStorage.getItem("Authorization"),
          },
        })
        .then((res) => {
            console.log(res);
            if(res.data.result != 'success'){
                setSubmit(false);
                Swal.fire({
                    icon: 'error',
                    title: '저장실패',
                    text: '입력이 잘 못 되었습니다.',
                  });
                return;
            }            
            close();
            Swal.fire({
                icon: 'success',
                title:'저장완료',
                text: '저장 되었습니다.',
              });
            navigate("/attendance", { replace: true });
        })
    };

    const typeChange = (e) => {
        e.target.value != '' ? setValidation(Object.assign({}, isValidation, {type: false})) : setValidation(Object.assign({}, isValidation, {type: true}));
        setData(Object.assign({}, data, {type: e.target.value}));
    }
    const remarkChange = (e) => {
        e.target.value != '' ? setValidation(Object.assign({}, isValidation, {remark: false})) : setValidation(Object.assign({}, isValidation, {remark: true}));
        setData(Object.assign({}, data, { remark: e.target.value }));
    }
    const nameChange = (e) => {
        e.target.value != '' ? setValidation(Object.assign({}, isValidation, {name: false})) : setValidation(Object.assign({}, isValidation, {name: true}));
        setData(Object.assign({}, data, { name: e.target.value }));
    }

    const types = [
        '연차',
        '월차',
        '당직',
        '반차'
    ];

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={koKR}>
        <Dialog open={open} onClose={close} >
            <DialogTitle>근태 신청</DialogTitle>
            <DialogContent>
                <Box sx={{marginTop: 2}} onSubmit={handleSubmit}>
                  <Grid container
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                    spacing={2}>
                    <Grid item sx={12}>
                    <InputLabel>시작일자</InputLabel>
                        <DatePicker
                            value={startDate}
                            id='sdate'
                            inputFormat={"YYYY-MM-DD"}
                            mask={"____-__-__"}
                            onChange={(newValue) => {
                                const date = newValue.year() + '-' + (newValue.month() + 1 > 10 ? newValue.month() + 1 : '0'+(newValue.month() + 1)) + '-' + (newValue.date() > 10 ? newValue.date() : '0' + newValue.date()); 
                                setStartDate(date);
                            }}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </Grid>
                    <Grid item sx={12}>
                    <InputLabel>종료일자</InputLabel>
                        <DatePicker
                            value={endDate}
                            id='edate'
                            inputFormat={"YYYY-MM-DD"}
                            mask={"____-__-__"}
                            onChange={(newValue) => {
                                const date = newValue.year() + '-' + (newValue.month() + 1 > 10 ? newValue.month() + 1 : '0'+(newValue.month() + 1)) + '-' + (newValue.date() > 10 ? newValue.date() : '0' + newValue.date()); 
                                setEndDate(date);
                            }}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </Grid>
                    <Grid item sx={12}>
                        <InputLabel>이름</InputLabel>
                        <TextField 
                            variant="outlined"
                            fullWidth 
                            required 
                            id="name"
                            value={name}
                            onChange={nameChange}
                            sx={{ minWidth: 265 }}
                            error={isValidation.name}
                            helperText={isValidation.name ? '이름을 입력해주세요' : ''}
                        />
                    </Grid>
                    <Grid item sx={12}>
                        <InputLabel>유형</InputLabel>
                        <Select
                            id="type"                            
                            sx={{ minWidth: 265 }}
                            onChange={typeChange}
                            value={data.type}
                            error={isValidation.type}
                            helperText={isValidation.type ? '유형을 선택해주세요' : ''}
                            >
                            {
                            role == "ROLE_ADMIN" ? 
                                <MenuItem key='휴진' value='휴진'>
                                    휴진
                                </MenuItem>
                                :
                                types.map((t) => (
                                    <MenuItem key={t} value={t}>
                                        {t}
                                    </MenuItem>
                                ))                            
                            }
                        </Select>
                    </Grid>
                    <Grid item sx={12}>
                        <InputLabel>사유</InputLabel>
                        <TextField 
                            multiline
                            fullWidth 
                            required 
                            rows={4}
                            variant="outlined"
                            id="remark"
                            sx={{ minWidth: 265 }}
                            onChange={remarkChange}
                            error={isValidation.remark}
                            helperText={isValidation.remark ? '사유를 입력해주세요' : ''}
                        />
                    </Grid> 
                  </Grid>
                </Box>
                <DialogActions>
                    <Button variant="contained" onClick={close}>취소</Button>
                    <Button variant="contained" onClick={handleSubmit}>저장</Button>
                   </DialogActions>
             </DialogContent>
        </Dialog>
        </LocalizationProvider>
    );
}

export default AttendanceModal;

