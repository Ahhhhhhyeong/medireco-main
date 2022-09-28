import React, { useState, useEffect } from 'react';
import { Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, CircularProgress } from '@mui/material';
import axios from 'axios';
import Swal from "sweetalert2";

// 진료부분 의사 변경 모달창
function Modal({ open, close, hno, no }) {
    const BACKEND_URL = process.env;
    const url = BACKEND_URL+'/api'
    const [comboOpen, setComboOpen] = useState(false);
    const [options, setOptions] = useState([]);
    const [value, setValue] = useState();
    const loading = comboOpen && options.length === 0;

    useEffect(() => {
        let active = true;
    
        if (!loading) {
          return undefined;
        }
    
        (async () => {
          if (active) {
           await axios.get(url + `/common/doctorlist/${hno}`, {
                headers: {
                    Authorization: window.localStorage.getItem("Authorization"),
                  },
            }).then((res) => setOptions(res.data.data)).catch((err) => console.log(err));
          }
        })();
    
        return () => {
          active = false;
        };
    }, [loading]);
    
    useEffect(() => {
      if (!open) {
        setOptions([]);
      }
    }, [comboOpen]);

    const handleChange = async () => {
        console.log(value);
        await axios.put(url + `/common/doctorupdate/${no}`, {
            no: no,
            employeeNo: value.no
        },
        {
          headers: {
            Authorization: window.localStorage.getItem("Authorization"),
          }
        })
        .then((res) => {
            if(res.data.result != 'success') {
                Swal.fire({
                  icon: 'error',
                  title: '변경실패',
                  text: '변경 실패했습니다. 다시 한 번 시도해주십시오.'
                });
                return;
              }
              Swal.fire({
                icon: 'success',
                title:'변경완료',
                text: '정상적으로 변경 되었습니다.',
                customClass: {
                  container: 'my-swal'
                }                
              }).then(() => close());
        })
        .catch((err) => console.log(err));
    };


    return (
        <Dialog open={open} onClose={close} sx={{ height: '100%' }}>
            <DialogTitle> 의사 변경 </DialogTitle>
            <DialogContent>
            <Autocomplete
                sx={{ width: 300 }}
                open={comboOpen}
                onOpen={() => {
                    setComboOpen(true);
                }}
                onClose={() => {
                    setComboOpen(false);
                }}
                isOptionEqualToValue={(option, value) => option.name === value.name}
                getOptionLabel={(option) => option.name}
                options={options}
                loading={loading}
                renderInput={(params) => (
                    <TextField
                    {...params}
                    label="의사 변경"
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                        <React.Fragment>
                            {loading ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                        </React.Fragment>
                        ),
                    }}
                    sx={{ marginTop: 2 }}
                    />
                )}
                onChange={(event, newValue) => {
                    setValue(newValue);
                }}
            />
            </DialogContent>
            <DialogActions>
                <Button onClick={close}>취소</Button>
                <Button onClick={handleChange}>변경</Button>
            </DialogActions>
        </Dialog>
    );
}

export default Modal;
