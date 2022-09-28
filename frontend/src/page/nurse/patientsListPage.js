import React from 'react';
import SiteLayout from '../../layout/SiteLayout';
import PatientList from '../../components/nurse/PatientList';
import { Box } from '@mui/material';

const PatientListPage = (props) => {
    return (
        <SiteLayout>
            <Box flexGrow={1} component="main">
                <PatientList />
            </Box>
        </SiteLayout>
    );
}

export default PatientListPage;