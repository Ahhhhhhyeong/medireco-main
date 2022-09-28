//질병
import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Search from '../../../theme/search';
import { StyledInputBase, SearchIconWrapper } from '../../../theme/search';
import CustomNoRowsOverlay from '../../common/CustomNoRowsOverlay';
import Modal from '../../modal/findDisease';
import { Stack, Typography, Box, Grid, IconButton, Tooltip, Button } from '@mui/material';
import { DataGrid, GridRowModes } from "@mui/x-data-grid";
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/AddCircle';
import CancelIcon from '@mui/icons-material/Close';


function EditToolbar(props) {
    const { setRows, setRowModesModel, isSubmit } = props;
    let index = 0;
    const handleClick = useCallback(() => {
      let id = index++;
      setRows((oldRows) => [...oldRows, {id, diseaseNumber: id, diseaseName: '', isNew: true }]);  
      setRowModesModel((oldModel) => ({
        ...oldModel, mode: GridRowModes.Edit, fieldToFocus: 'diseaseNumber' ,
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

const Disease = ({isSubmit, value}) => {
    const [rows, setRows] = useState([]);
    const [rowModesModel, setRowModesModel] = useState({});
    const [modalOpen, setModalOpen] = useState(false);
    const [diseaseValue, setDiseaseValue] = useState('');   
    const columns = [
        { field: 'diseaseNumber', headerName: '질병코드', width:80 },
        { field: 'diseaseName', headerName: '병명', width:140, editable: true },
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
    }, [isSubmit])

    const openModal = () => {
        setModalOpen(true);
    }

    const closedModal = (value) => {
        setModalOpen(false);
        setRows([...value, ...rows]);  
        setRowModesModel((oldModel) => ({
            ...oldModel, mode: GridRowModes.Edit, fieldToFocus: 'diseaseNumber' ,
        }));
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
        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;
      };

    const handleCancelClick = (id) =>  {  
      setRows(rows.filter((row) => row.diseaseNumber !== id));
    };


    return (
        <React.Fragment>
            <Box sx={{ width: "100%" }}>
                <Stack>
                    <Typography>
                        질병 입력
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
                                placeholder="질병코드 검색...."
                                inputProps={{ 'aria-label': 'search' }}
                                onKeyPress= {(e) => {
                                    if (e.key === 'Enter') {
                                      setDiseaseValue(e.target.value);
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
                            getRowId={(row) => row.diseaseNumber}
                            columns={columns}
                            components={{
                                NoRowsOverlay: CustomNoRowsOverlay,
                            }}
                            rowsPerPageOptions={[10]}
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
            <Modal open={modalOpen} close={closedModal} value={diseaseValue} />
        </React.Fragment> 
    );
}

export default Disease;

