import React, {useEffect, useState, useRef} from 'react';
import axios from 'axios';
import Search from '../../theme/search';
import { StyledInputBase, SearchIconWrapper } from '../../theme/search';
import CustomNoRowsOverlay from '../common/CustomNoRowsOverlay';
import { Grid, Dialog, DialogActions, DialogContent, DialogContentText, TextField, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';

      
const columns = [
    { field: 'diseaseNumber', headerName: '질병번호',  editable: true , width: 80},
    { field: 'diseaseName', headerName: '질병명', editable: true, width: 300},        
];


const Modal = ({open, close, value}) => {
    const [findValue, setValue] = useState(value);   
    const [selectedRow, setSelectedRows] = useState({}); 
    const [pageState, setPageState] = useState({
        isLoading: false,
        data: [],
        total: 0,
        page: 1,
        pageSize: 10
    });
    const BACKEND_URL = process.env;
    const url = BACKEND_URL+'/api/doctor/diseasemodal';

    useEffect(() => {
            if(!open) return;        

            let inputValue = value;
            if(findValue !== ''){ inputValue = findValue; }

            setPageState(old => ({...old, isLoading:true}));
            
            axios.get(url, {
                headers: {
                    Authorization: window.localStorage.getItem("Authorization"),
                },
                params: {
                    name: inputValue,
                    no: pageState.page
                },
            })
            .then((response) => {
                setPageState(old => ({...old, isLoading:false, total: response.data.data.map.totalCount, data: response.data.data.map.list}));
            })
            .catch((error) => {
                console.log(error);
            })
    }, [open, pageState.page, findValue]);


    const onSubmit = () => {
        close(selectedRow);
    }

    return (
        <Dialog open={open} onClose={close} >
            <DialogContent>
                <DialogContentText>
                    질병코드 검색창
                </DialogContentText>
                <Grid
                    container
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                >
                    <Search>
                        <SearchIconWrapper>
                            <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                            autoFocus
                            placeholder="질병코드 검색...."
                            inputProps={{ 'aria-label': 'search' }}
                            defaultValue={value}                      
                            onKeyPress= {(e) => {
                                if (e.key === 'Enter') {
                                    setValue(e.target.value);
                                }
                            }}
                            
                        />
                    </Search>
                </Grid>
                <DataGrid
                    rows={pageState.data}
                    rowCount={pageState.total}
                    getRowId={(row) => row.diseaseNumber }
                    loading={pageState.isLoading}
                    rowsPerPageOptions={[10]}
                    pagination
                    page={pageState.page - 1}
                    pageSize={pageState.pageSize}
                    paginationMode="server"
                    onPageChange={(newPage) => {
                        console.log(newPage, newPage + 1);
                        setPageState(Object.assign({}, pageState, {page: newPage + 1}))
                    }}
                    columns={columns}
                    components={{
                        NoRowsOverlay: CustomNoRowsOverlay,
                    }}                    
                    autoHeight
                    checkboxSelection
                    sx={{
                        width: 500,
                        height: 500
                    }}
                    onSelectionModelChange={(ids) => {
                        const selectedRowsData = ids.map((id) => pageState.data.find((row) => row.diseaseNumber === id));
                        setSelectedRows(selectedRowsData);
                    }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={close}>취소</Button>
                <Button onClick={onSubmit}>확인</Button>
            </DialogActions>
        </Dialog>
        
    );
}

export default  Modal;