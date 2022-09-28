import React, { useState } from 'react';
import SiteLayout from '../../layout/SiteLayout';
import Attendance from '../../components/attendance/Attendance';
import Calendar from '../../components/attendance/Calendar';
import AttendanceModal from '../../components/modal/AttendanceAdd';
import { Button, Container, Grid } from '@mui/material';

const AttendancePage = (props) => {
    const [ selectDate, setSelectDate ] = useState();
    const [ modalOpen, setModalOpen ] = useState(false);

    const getSelectDate = (value) => {
        setSelectDate(value);
    }

    const openModal = () => {
        setModalOpen(true);
    }

    const closeModal = () => {
        setModalOpen(false);
    }


    return (
        <SiteLayout>
            <Container maxWidth={false}>
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item xs={12}>
                        <Button variant="contained" disableElevation onClick={openModal}>근태 신청하기</Button>
                    </Grid>
                    <Grid item xs={6} sx={{height: 780}}>
                        <Calendar sdate={getSelectDate} addAttendance={modalOpen} />
                    </Grid>

                    <Grid item xs={6} sx={{height: 780}}>
                        <Attendance  selectDate={selectDate} addAttendance={modalOpen} />
                    </Grid>
                </Grid>
            </Container>
            <AttendanceModal open={modalOpen} close={closeModal} />
        </SiteLayout>
    );
}
 
export default AttendancePage;
