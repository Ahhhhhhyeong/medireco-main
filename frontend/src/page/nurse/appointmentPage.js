import React from 'react';
import SiteLayout from '../../layout/SiteLayout';
import Appointment from '../../components/nurse/Appointment';
import { Box } from '@mui/material';

const AppointmentPage = (props) => {
    
    return (
        <SiteLayout>
            <Box sx={{width:"100%"}}>
                <Appointment />
            </Box>
        </SiteLayout>
    );
}

export default AppointmentPage;