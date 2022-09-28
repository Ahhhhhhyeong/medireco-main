import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles({
    box: {
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            float: 'left',
            width: '10%', 
            marginTop: '62px'
    },
    dividerBox: {
            borderBottom: 1, 
            borderColor: 'divider',
    },
    tabPanel: {
        height: '680px',
    },
    sidebarMenuBox: {
        height: '520px'
    }, 
});