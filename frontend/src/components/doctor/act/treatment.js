//치료
import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import Search from '../../../theme/search';
import { StyledInputBase, SearchIconWrapper } from '../../../theme/search';
import CustomNoRowsOverlay from '../../common/CustomNoRowsOverlay';
import Modal from '../../modal/findMedicine';
import { Stack, Typography, Box, Grid, IconButton, Tooltip, Button } from '@mui/material';
import { DataGrid, GridRowModes } from "@mui/x-data-grid";
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/AddCircle';
import CancelIcon from '@mui/icons-material/Close';


function EditToolbar({ setRows, setRowModesModel, isSubmit }) {
    let index = 0;
    const handleClick = useCallback(() => {
      let id = index++;
      setRows((oldRows) => [...oldRows, { id , medicineNumber: id, medicineName: '', dose:0,  isNew: true }]);  
      setRowModesModel((oldModel) => ({
        ...oldModel,
        [id]: { mode: GridRowModes.Edit, fieldToFocus: 'medicineNumber' },
      }));
    }, []);
  
    return (
        <Tooltip title="행추가">
            <IconButton
                disabled={isSubmit}
                onClick={handleClick}
                color="primary"
            >
                <AddIcon />
            </IconButton>
        </Tooltip>
    );
  }

EditToolbar.propTypes = {
    setRowModesModel: PropTypes.func.isRequired,
    setRows: PropTypes.func.isRequired,
};


const Treatment = ({isSubmit, value}) => {
    const [rows, setRows] = React.useState([]);
    const [rowModesModel, setRowModesModel] = React.useState({});
    const [modalOpen, setModalOpen] = React.useState(false);
    const [medicineValue, setMedicineValue] = React.useState('');
    const columns = [
        { field: 'medicineNumber', headerName: '의약코드'},
        { field: 'medicineName', headerName: '약명', editable: true },
        { field: 'dose', headerName: '투여량', type:'number', editable: true },
        { field: 'medicineUnit', headerName: '단위', width: 80, editable: true},        
        { field: 'usage', headerName: '치료방식', editable: true },
        {
            field: 'id',
            headerName: '',
            width: 150,
            renderCell:({id}) => (
                <IconButton
                    color='primary'
                    sx={{ width: 80 }}
                    onClick={() => handleCancelClick(id)}
                >
                    <CancelIcon />
                </IconButton>
            )
        }
    ];

    useEffect(() => {
        if(!isSubmit){
            return;
        }
        value(rows);
    }, [isSubmit]);

    const openModal = () => {
        setModalOpen(true);
    }
    
    const closedModal = (value) => {
        setModalOpen(false);
        setRows([...value, ...rows]);
        setRowModesModel((oldModel) => ({
            ...oldModel, mode: GridRowModes.Edit, fieldToFocus: 'medicineNumber'
        }))
    }

    const handleRowEditStart = (params, event) => {
        setRowModesModel({ ...rowModesModel, [params.id]: { mode: GridRowModes.Edit } });
        event.defaultMuiPrevented = true;
      };
    
      const handleRowEditStop = (params, event) => {
        setRowModesModel({ ...rowModesModel, [params.id]: { mode: GridRowModes.View } });
        event.defaultMuiPrevented = true;
      };

        
    const processRowUpdate = (newRow) => {
        const updatedRow = { ...newRow, isNew: false };
        
        setRows(rows.map((row) => (row.medicineNumber === newRow.medicineNumber ? updatedRow : row)));
        return updatedRow;
      };

    const handleCancelClick = (id) =>  {    
        setRows(rows.filter((row) => row.medicineNumber !== id));
    };


    return (
        <React.Fragment>
        <Box sx={{ width: "100%" }}>
        <Stack>
            <Typography>
                치료 입력
            </Typography>        
            <Grid
                container
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
            >
                {EditToolbar({ setRows, setRowModesModel, isSubmit })}
                <Search>
                    <SearchIconWrapper>
                        <SearchIcon />
                    </SearchIconWrapper>
                    <StyledInputBase
                        placeholder="의약품코드 검색...."
                        inputProps={{ 'aria-label': 'search' }}
                        onKeyPress = {(e) => {
                            if(e.key === 'Enter'){
                                setMedicineValue(e.target.value);
                                openModal();
                            }
                        }}
                    />
                </Search>
            </Grid>  
            <div style={{ height: 300 }}> 
                <DataGrid 
                    editMode="row"
                    rows={rows}
                    getRowId={(row) => row.medicineNumber}
                    columns={columns}
                    components={{
                        NoRowsOverlay: CustomNoRowsOverlay,
                    }}
                    rowsPerPageOptions={[20]}
                    options={{
                        paging: false
                    }}   
                    disableSelectionOnClick
                    editRowsModel={rowModesModel}
                    onCellEditStart={handleRowEditStart}
                    onCellEditStop={handleRowEditStop}
                    processRowUpdate={processRowUpdate}
                    experimentalFeatures={{ newEditingApi: true }}
                />
            </div>
        </Stack>
    </Box>   
    <Modal open={modalOpen} close={closedModal} value={medicineValue} type="treatmentmodal" />
    </React.Fragment>
    );
}

export default Treatment;