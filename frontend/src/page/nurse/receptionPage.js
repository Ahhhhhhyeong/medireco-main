import React from 'react';
import SiteLayout from '../../layout/SiteLayout';
import Reception from '../../components/nurse/Reception';
import { Box } from '@mui/material';

const ReceptionPage = (props) => {
    return (
        <SiteLayout>
            <Box flexGrow={1} component="main" marginTop='1rem'>
                <Reception />
            </Box>
        </SiteLayout>
    );
}

export default ReceptionPage