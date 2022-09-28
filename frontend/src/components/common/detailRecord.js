import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import CustomNoRowsOverlay from './CustomNoRowsOverlay';
import Diagnosis from '../modal/diagnosis';
import { IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import PrintIcon from '@mui/icons-material/Print';
import jwt_decode from "jwt-decode";

const DetailRecord = ({data}) => {
    const [pageState, setPageState] = useState({
        isLoading: false,
        data: [],
        total: 0,
        page: 1,
        pageSize: 10
    });
    const [open, setOpen] = useState(false);
    const [id, setId] = useState(0);
    const BACKEND_URL = process.env;
    const url = BACKEND_URL+'/api/common/recordDetail';
    const isAuthorized = window.localStorage.getItem("Authorization");
    let hn = "";
  if (isAuthorized !== null) {
    hn = jwt_decode(isAuthorized).hospitalNo;
  }
    
    useEffect(() => {
        if(data.name == '') 
            return;

        setPageState(Object.assign({}, pageState, {isLoading: true}));
        axios.get(url, {
            headers: {
                Authorization: window.localStorage.getItem("Authorization"),
            },
            params: {
                hospital: hn,
                name: data.name,
                no: data.no,
                page: pageState.page
            }
        })
        .then((response) => {
            setPageState(Object.assign({}, pageState, {isLoading: false, data: response.data.data.map.data, total: response.data.data.map.totalCount}));
        })
        .catch((error) => {
            console.log(error);
        })

    }, [data]);

    const detailedColumns = [
        { field: 'diagnosisNo', headerName: '진단번호', hide: true },
        { field: 'appointmentDate', headerName: '내원일자', type:'date', width: 100 },
        { field: 'patientName', headerName: '환자이름'},
        { field: 'patientNo', headerName: '환자번호', hide: true },
        { field: 'birth', headerName: '생년월일' },
        { field: 'diagnosisOpinion', headerName: '증상', width: 150 },
        { field: 'diseaseName', headerName: '병명', width: 200, hide: true},
        { field: 'employeeName', headerName: '담당의' },
        { field: 'employeeNo', headerName: '담당의번호', hide: true},
        {
            field: 'id',
            headerName: '진단서출력',
            renderCell:({id}) => (
                <IconButton
                    color='primary'
                    sx={{ width: 80 }}
                    //onClick={() => handlePrintClick(id)}
                >
                    <PrintIcon />
                </IconButton>
            )
        }
    ];  
        
    const handlePrintClick = (id) => {
        setOpen(true); // 진단서 완성언제쯤..?
        setId(id);
    }

    const handelClose = () => setOpen(false);

    return (
        <div>
            <DataGrid 
               rows={pageState.data}
               rowCount={pageState.total}
               getRowId={(row) => row.diagnosisNo }
               loading={pageState.isLoading}
               rowsPerPageOptions={[10]}
               pagination
               page={pageState.page - 1}
               pageSize={pageState.pageSize}
               hideFooterSelectedRowCount // 체크박스 선택갯수 표시 삭제
               paginationMode="server"
               onPageChange={(newPage) => {                  
                   setPageState(Object.assign({}, pageState, {page: newPage + 1}))
               }}
               columns={detailedColumns}
               components={{
                   NoRowsOverlay: CustomNoRowsOverlay,
               }}         
               sx={{height: 400}}
            />

            <Diagnosis 
                open={open}
                close={handelClose}
                id={id} />
        </div>
    );
};

export default DetailRecord;

DetailRecord.propTypes = {
    data: PropTypes.object
};
