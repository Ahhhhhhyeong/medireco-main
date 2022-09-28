import { Container } from '@mui/material';
import React from 'react';
import Calendar from '../../components/attendance/Calendar';
import SiteLayout from '../../layout/SiteLayout';

function HospitalSchedule(props) {

    return (
        <SiteLayout>
            <Container maxWidth={false} sx={{height: 780}}>
                <Calendar />
            </Container>
        </SiteLayout>
    );
}

export default HospitalSchedule;