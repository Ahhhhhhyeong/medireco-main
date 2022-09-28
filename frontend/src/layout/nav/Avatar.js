import React from 'react';
import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';

const OnlineBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
        backgroundColor: '#44b700',
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,        
    },
}));

const OfflineBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
        backgroundColor: '#7E7E7E',
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,        
    },    
}));

function stringToColor(string) {
    let hash = 0;
    let i;
  
    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
  
    let color = '#';
  
    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */
    return color;
  }


function stringAvatar(name){
    return{
        sx: {
            backgroundColor: stringToColor(name),
        },
        children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`
    }
}

export default function BackgroundLetterAvaters() {
    return (
        <Stack direction="row" spacing={3} >
            <OnlineBadge
                overlap='circular'
                anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                variant='dot'   
            >
                <Avatar {...stringAvatar('권 아영')} />
            </OnlineBadge>

            <Avatar {...stringAvatar('김 성현')} />

            <OfflineBadge
                overlap='circular'
                anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                variant='dot'
            >
                <Avatar {...stringAvatar('김 재민')} />
            </OfflineBadge>
            
            <Avatar {...stringAvatar('이 희제')} />
        </Stack>
    );
}

