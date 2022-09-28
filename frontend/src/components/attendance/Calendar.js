import React, { useState, useEffect, useMemo } from 'react';
import '../../assets/Calendar.css';
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import luxon2Plugin from "@fullcalendar/luxon2";
import axios from 'axios';
import jwt_decode from "jwt-decode";


const Calendar = (props) => {
  const [ startDate, setStartDate ] = useState();
  const [ endDate, setEndDate ] = useState();
  const [ data, setData ] = useState([]);
  const isAuthorized = window.localStorage.getItem("Authorization");
  const hn = jwt_decode(isAuthorized).hospitalNo;
  const BACKEND_URL = process.env;
  const url = BACKEND_URL+'/api/common';

  const clickEvent = (args) => {
    props.sdate(args.dateStr);  // 선택한 날짜 넘기기
  }
  
  useEffect(() => {
    if(startDate != '' && endDate != ''){
      fetchEvents();
    }
  }, [startDate, endDate, props.addAttendance]);



  const fetchEvents = async () => {
    await axios
      .get(url +'/attendanceSchedule', {
        headers: {
            Authorization: window.localStorage.getItem("Authorization"),
        },
        params: {
          hospital: hn,
          startDate: startDate,
          endDate: endDate
        }
      })
      .then((res) => {
        if(res.data.data == '') return;
        setData(res.data.data.map((value) => {
            return {
              title: value.role=='ROLE_ADMIN' ? value.title : value.name + `(${value.title})`,
              start: value.start,
              end: value.end,
              color: value.role=='ROLE_ADMIN' ? '#d32f2f' : '#24b9db',
              textColor: '#fff'
            };
        }));  
      });
    };

    return (
      <FullCalendar
      selectable={true}
      initialView="dayGridMonth"
      headerToolbar={{
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,listYear"
      }}
      plugins={[
          dayGridPlugin,
          timeGridPlugin,
          listPlugin,
          interactionPlugin,
          luxon2Plugin
      ]}
      dateClick={clickEvent}  
      height= '100%'
      locale= 'ko'
      datesSet={(arg) => {
        setStartDate(arg.startStr.substring(0, 10));
        setEndDate(arg.endStr.substring(0, 10));
      }}     
      events={data}
    />
  );
}

  

export default Calendar;