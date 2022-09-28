// 내원기록
import React from 'react';
import SiteLayout from '../../layout/SiteLayout';
import Record from '../../components/common/visitedRecord';
import { Box, Stack, Typography } from '@mui/material';
import { Container } from '@mui/system';


const VisitedRecord = (props) => {


    return (
    <SiteLayout >
        <Box  flexGrow={1} component="main" sx={{height: 780}}>
            <Container maxWidth={false}>
            <Stack>
                    <Record />           
                </Stack>
            </Container>
        </Box>
    </SiteLayout>
    );
}

export default VisitedRecord;
