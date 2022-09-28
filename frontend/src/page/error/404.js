import React from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import notFoundImg from '../../assets/images/undraw_page_not_found_su7k.svg'

const NotFound = () => (
  <>
    <Box
      component="main"
      sx={{
        alignItems: 'center',
        display: 'flex',
        flexGrow: 1,
        minHeight: '100%',
        marginTop: 20
      }}
    >
      <Container maxWidth="md">
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Typography
            align="center"
            color="textPrimary"
            variant="h2"
          >
            404: 페이지를 찾을 수 없습니다.
          </Typography>
          <Typography
            align="center"
            color="textPrimary"
            variant="subtitle3"
          >
            요청하신 페이지가 사라졌거나, 잘못된 경로를 이용하셨어요.
          </Typography>
          <Box sx={{ textAlign: 'center' }}>
            <img
              alt="Under development"
              src={notFoundImg}
              style={{
                marginTop: 50,
                display: 'inline-block',
                maxWidth: '100%',
                width: 560
              }}
            />
          </Box>
            <Button
               href='/'
              component="a"
              startIcon={(<ArrowBackIcon fontSize="small" />)}
              sx={{ mt: 3 }}
              variant="contained"
            >
              메인으로 돌아가기
            </Button>
        </Box>
      </Container>
    </Box>
  </>
);

export default NotFound;
