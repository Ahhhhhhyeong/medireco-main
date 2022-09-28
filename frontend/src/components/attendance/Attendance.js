import React, { useEffect, useMemo, useState } from "react";
import CustomNoRowsOverlay from '../common/CustomNoRowsOverlay';
import { nowDate } from "./datetime";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { Box, Button, Icon, IconButton } from "@mui/material";
import ClearIcon from '@mui/icons-material/Clear'; // x
import DoneIcon from '@mui/icons-material/Done'; // v
import DeleteIcon from '@mui/icons-material/Delete'; // 취소
import Swal from "sweetalert2";
/**
 * 근태 결제 테이블
 * 
 * 월별 근태 목록 출력
 */
function Attendance({ selectDate, addAttendance }) {
    const date = useMemo(() => selectDate == undefined ? nowDate() : selectDate );
    const [ data, setData ] = useState([]);
    const [ selectData, setSelectData ] = useState([]);
    const isAuthorized = window.localStorage.getItem("Authorization");
    const hn = jwt_decode(isAuthorized).hospitalNo;
    const role = jwt_decode(isAuthorized).role;
    const name = jwt_decode(isAuthorized).name;
    const BACKEND_URL = process.env;
    const url = BACKEND_URL+'/api/common/';

    useEffect(() => {
        fetchList();
    }, [date, addAttendance]);

    const fetchList = async () => {
        await axios
         .get(url + 'attendanceScheduleTable',{
             headers: {
                 Authorization: window.localStorage.getItem("Authorization"),
               },
             params: {
                 hospital: hn,
                 startDate: date,
             }
         })
         .then((res) => {
             setData(res.data.data);
         }).catch((err) => console.log(err));        
    };

    const isUpdateConfirmed = async () => {
        if(selectData == ''){
            Swal.fire({
                icon: "error",
                title: "결재실패",
                text: "선택된 데이터가 없습니다.",
              });
              return;
        }

        await axios
        .put(
            url + 'attendanceSchedule',
            {
                no: selectData
            },
            {
                headers: {
                    Authorization: window.localStorage.getItem("Authorization"),
                  },
            }
        ).then((res) => {
            if(res.data.result != "success") return;

            Swal.fire({
                icon: "success",
                title: "결재완료",
                text: "결재가 되었습니다."
            }).then(() => location.reload());

        }).catch(err => console.log(err));
    }


    const columns = [
        { field: 'no', headerName: 'no', width: 100, hide: true},
        { field: 'startDate', headerName: '시작일', width: 110},
        { field: 'endDate', headerName: '종료일', width: 110},
        { field: 'employeeName', headerName: '이름', width: 120 },
        { field: 'status', headerName: '유형', width: 100},
        { field: 'remark', headerName: '사유', width: 180 },
        { field: 'isConfirmed', 
          headerName: '결재여부', 
          width: 80,
          align:'center',
          renderCell: (params) => (
            params.row.isConfirmed == 1 ? <DoneIcon color='custom' /> : <ClearIcon  />
          )
        },
        { field: 'id',
          headerName: '',
          width: 80,
          align:'center',
          hide: role == 'ROLE_ADMIN' ? false : true,
          renderCell: ({id}) => [
            <IconButton aria-label="delete" onClick={() => handleCancel(id)} >
                <DeleteIcon />
            </IconButton >
          ]
        }    
      ];

      const handleCancel = (no) => {
        Swal.fire({ 
            title: '결재를 취소하시겠습니까?',
            showDenyButton: true,
            confirmButtonText: '확인',
            denyButtonText: `닫기`,
          }).then(async (result) => {
            if (result.isConfirmed) {
                await axios
                .delete(
                    url + `attendanceSchedule/${no}`, {
                        headers: {
                            Authorization: window.localStorage.getItem("Authorization"),
                          },
                    }
                ).then((res) => {
                    location.reload();
                }).catch(err => console.log(err))
            }
          });   
      }
    
    return (
        <>
            <DataGrid
            rows={data}
            getRowId={(data) => data.no}
            pageSize={10}
            rowsPerPageOptions={[10]}
            columns={columns}
            components={{
                NoRowsOverlay: CustomNoRowsOverlay
            }}
            isRowSelectable={(params) => params.row.isConfirmed == 0}
            checkboxSelection={role == 'ROLE_ADMIN' ? true : false}
            onSelectionModelChange={(ids) => {
                setSelectData(ids);
            }}
            hideFooterSelectedRowCount
            />  
            { role == 'ROLE_ADMIN' ? 
            (
                <Box display="flex" justifyContent="flex-end" alignItem="flex-end">
                    <Button variant="contained" onClick={isUpdateConfirmed}>
                        결재확인
                    </Button>
                </Box>
            ) 
            : null
            }
        </>
    );
}
export default Attendance;