<!-- 수정을 할 시, 아래 작성일과 작성자 수정 부탁드려요!! -->
<p>
수정일 : 2022-08-05 </br>
수정자 : 권아영
</p>

# JSX DEMO
> 해당 프로젝트는 프론트 데모버전입니다.    
> 전체적인 프론트는 해당 프로젝트를 참고하십시오.   
> layout 파일명이 깁니다. Demo라서 파일명만 보고 이해하기 쉽도록 길게 작성했습니다.

|          |                        |  
| :------- | :--------------------- |
| 포트넘버 | 3000                   |
| 실행     | npm run debug src=demo |
| 빌드     | npm run build          |

``딱히 배포할 일이 없어 빌드는 하지 않음``    
</br></br>

--- 

</br></br>

## CSS 컴포넌트 분리
> **노션에도 작성을 하였지만 md에 내용을 조금 더 추가해서 작성함**

</br>

```style.js``` 파일을 생성하고, 그 안에 ```makeStyles``` hook을 이용하여 스타일을 제공 할 클래스에 대한 커스텀 스타일을 작성합니다.
</br>

```javascript
import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles({
    box: {
            display: 'flex',
            flexDirection: 'column',
            height: '80%',
            float: 'left',
            width: '20%', 
            marginTop: '62px'
        
    },
    dividerBox: {
            borderBottom: 1, 
            borderColor: 'divider'
          
    },
    tabPanel: {
        height: '650px',
    }
});
```

</br>

```javascript
import React from 'react';
import { Box,  Divider, Typography, } from '@mui/material';
import { useStyles } from './dashboard_sidebar_style';

export const DashboardSidebar = () => {
    const classes = useStyles(); //useStyles를 불러옴

    return (
        <>
            <Box className={classes.box}>
                <Box className={classes.dividerBox}>
                    useStyles를 'calsses'변수에 호출을 하여 사용을 한다.
                </Box>
            </Box>
        </>
    );
}

```
<!-- 📌 활용예제 : [dashboard_sidebar.js](src/demo/layout/navbar/dashboard_sidebar.js)  -->

## Search 테마 분리
**Search 컴포넌트를 theme 폴더에 따로 분리**
</br>

참고 : [doctor](/src/demo/components/doctor/disease.js)

</br>
---
</br>

> 추가사항   
> 1. 변수 명명 규칙   

</br></br></br>

--- 

</br></br></br>