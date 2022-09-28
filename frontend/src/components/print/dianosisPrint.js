import React from 'react';
import { Grid, Paper } from '@mui/material';

const  PrintDianosis = React.forwardRef((props, ref) => {
    return (
        <Paper elevation={0} sx={{ flexGrow: 1 }} >
            <Grid container spacing={2}>
                <Grid>
                    아아아악
                </Grid>
            </Grid>

        </Paper>
    );
});

export default PrintDianosis;