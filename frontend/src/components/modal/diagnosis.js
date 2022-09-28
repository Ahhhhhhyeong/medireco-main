import React, { useEffect, useRef, useState } from 'react';
import { useReactToPrint } from "react-to-print";
import PrintDianosis from '../print/dianosisPrint.js';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, Grid } from '@mui/material';

const Diagnosis = ({ open, close, id }) => {
    const [ data, setData ] = useState([]);
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });
        
    useEffect(() => {
        console.log(open);
    }, [open]);

  

    return (
        <Dialog open={open} onClose={close} >
             <DialogContent>
                <DialogContentText>
                    진단서 출력
                </DialogContentText>
                <Grid>
                    <PrintDianosis ref={componentRef}  />
                </Grid>
                <DialogActions>
                    <Button onClick={close}>취소</Button>
                    <Button onClick={handlePrint}>인쇄</Button>
                   </DialogActions>
             </DialogContent>
        </Dialog>
    );
};

export default Diagnosis;