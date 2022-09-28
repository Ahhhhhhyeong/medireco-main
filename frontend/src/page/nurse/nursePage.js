import React from 'react';
import SiteLayout from '../../layout/SiteLayout';
import AppointmentList from '../../components/nurse/AppointmentList';
import { Box } from '@mui/material';

const NursePage = (props) => {
    return (
        <SiteLayout>
            <Box sx={{ width: "100%" }}>
                <AppointmentList />
            </Box>
        </SiteLayout>
    );
}

export default NursePage