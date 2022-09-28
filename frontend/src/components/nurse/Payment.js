import React, { useEffect, useState } from 'react';
import { 
    Stack,
    Typography,
    Box,
    Grid,
    IconButton,
    Tooltip,
    Button 
  } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import axios from "axios";
import Swal from "sweetalert2";
import jwt_decode from "jwt-decode";
import { useLocation, useNavigate } from "react-router";
const BACKEND_URL = process.env;
const treatCalcurator = (props) => {
  const medicineName = props.split(" ")[1];
  let base_url = "http://apis.data.go.kr/B551182/dgamtCrtrInfoService/getDgamtList";
  const serviceKey = 'qJPYj8bKT3j88lspmwEn26UzpqY0UEJAjb8IxaZ4HvXqQWhvtILK2uk3NbyWuEtr7Y6E1uqSKnJVtpO9y6iUvw==';
  let queryParams = '?' + encodeURIComponent('serviceKey') + '='+serviceKey;
  queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('10'); 
  queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1');
  queryParams += '&' + encodeURIComponent('itmNm') + '=' + encodeURIComponent(medicineName);
  let url = base_url + queryParams;
  console.log(url);

  fetch(url, {
    method: "GET",
    headers: {
      "Content-Type" : "application/xml"
    }
  })
  .then((res) => {
    console.log(res);
  })
}


const Payment = (props) => {
    console.log("받아온 수납데이터: ");
    console.log(props.props);
    const data = props.props[0];
    const patientName = data.patientName;
    const date = data.appointmentDate;
    const remark = data.diagnosisOpinion;
    const medicineName = data.medicineName;
    const dose = data.dose;
    const appointmentNo = data.appointmentNo;
    const base_url = BACKEND_URL+"/api/nurse";
    const navigate = useNavigate();
    const no = useLocation().pathname.substring(
      useLocation().pathname.lastIndexOf("/")
    );

    useEffect(() => {
      //treatCalcurator(medicineName);
    }, [])

    const handlePayment = async() => {
      
      let url = base_url + "/appointment/payment/"+appointmentNo;
      await axios
      .patch(
        url,
        {
          no: appointmentNo,
          status: 5
        },
        {
          headers: {
            Authorization: window.localStorage.getItem("Authorization"),
          },
        }
      )
      .then((res) => {
        if(res.data.result != 'success'){
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
        });
        navigate("/nurse", { replace: true})
        location.reload();
      });  
    }

    return (
        <Box sx={{width : "100%"}}>
          <Grid 
           marginTop="2rem"
           marginBottom="2rem"
           marginLeft="2rem"
           marginRight="2rem"
          >
           
            <Grid item xs={12} sx={{height: "100%"}}  direction={"row"} align="left">

              
            
                <DialogTitle id="responsive-dialog-title">

                </DialogTitle>
              <Grid container>   
                <Grid item xs={6}>

                  <Card  variant="outlined" >
                    <DialogContent>
                    <Typography gutterBottom>
                        환자 성명: {patientName}
                    </Typography>
                    </DialogContent>
                  </Card>

                </Grid>
                <Grid item xs={6}>
                <Card  variant="outlined" >
                  <DialogContent>
                  <Typography gutterBottom>
                        진료 기간: {date}
                    </Typography>
                    </DialogContent>
                </Card>

                </Grid>
                <Grid item xs={12}>
                <Card  variant="outlined" >
                  <DialogContent>
                  <Typography gutterBottom>
                        질병군 : {remark}
                    </Typography>
                    </DialogContent>
                </Card>
                </Grid>
               
              </Grid>
            </Grid>

          
            <Grid item xs={12} sx={{height: "100%"}}  direction={"row"} align="left">
              
              <Grid container height="100%">   
                <Grid item xs={12}>
                  <Grid container> 
                    <Grid item xs={6}>
                      <Card  variant="outlined" >
                        <DialogContent>
                        <Typography gutterBottom>
                              항목
                          </Typography>
                          </DialogContent>
                      </Card>
                      <Card  variant="outlined" >
                        <DialogContent>
                        <Typography gutterBottom>
                             진료비
                          </Typography>
                          </DialogContent>
                      </Card>
                      <Card  variant="outlined" >
                        <DialogContent>
                        <Typography gutterBottom>
                             투약 & 조제료
                          </Typography>
                          </DialogContent>
                      </Card>
                      <Card  variant="outlined" >
                        <DialogContent>
                        <Typography gutterBottom>
                              주사료
                          </Typography>
                          </DialogContent>
                      </Card>
                    </Grid>

                    <Grid item xs={3}>
                      <Card  variant="outlined" >
                        <DialogContent>
                        <Typography gutterBottom>
                              급여
                          </Typography>
                          </DialogContent>
                      </Card>
                      <Card  variant="outlined" >
                        <DialogContent>
                        <Typography gutterBottom>
                              4900
                          </Typography>
                          </DialogContent>
                      </Card>
                      <Card  variant="outlined" >
                        <DialogContent>
                        <Typography gutterBottom>
                              1500
                          </Typography>
                          </DialogContent>
                      </Card>
                      <Card  variant="outlined" >
                        <DialogContent>
                        <Typography gutterBottom>
                              1500
                          </Typography>
                          </DialogContent>
                      </Card>
                    </Grid>

                    <Grid item xs={3}>
                      <Card  variant="outlined" >
                        <DialogContent>
                        <Typography gutterBottom>
                              비급여
                          </Typography>
                          </DialogContent>
                      </Card>
                      <Card  variant="outlined" >
                        <DialogContent>
                        <Typography gutterBottom>
                              0
                          </Typography>
                          </DialogContent>
                      </Card>
                      <Card  variant="outlined" >
                        <DialogContent>
                        <Typography gutterBottom>
                              0
                          </Typography>
                          </DialogContent>
                      </Card>
                      <Card  variant="outlined" >
                        <DialogContent>
                        <Typography gutterBottom>
                              0
                          </Typography>
                          </DialogContent>
                      </Card>
                    </Grid>
                  </Grid>
                  </Grid>
                
              </Grid>
              <Grid item xs={12}>
                <Grid container>
                  <Grid item xs={3}>
                    <Card  variant="outlined" >
                      <DialogContent>
                      <Typography gutterBottom>
                            총합
                        </Typography>
                        </DialogContent>
                    </Card>
                  </Grid>
                  <Grid item xs={9}>
                    <Card  variant="outlined" >
                      <DialogContent>
                      <Typography gutterBottom>
                            7900
                        </Typography>
                        </DialogContent>
                    </Card>
                  </Grid>
                </Grid>

              </Grid>
              

            </Grid>


            <Grid item xs={12} sx={{height: "100%"}} align="center" marginTop="2rem">
              <Grid 
                container
                spacing={3}
                >
                <Grid item xs={12}>
                  <Button variant="contained" onClick={handlePayment}>
                    수납완료
                  </Button>
                </Grid>
              </Grid>
             
            </Grid>
          </Grid>
        </Box>
    )
}

export default Payment;