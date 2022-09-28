import React, { useState, useEffect, useMemo, useRef } from "react";
import "../../assets/Calendar.css";
import FullCalendar from "@fullcalendar/react"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import luxon2Plugin from "@fullcalendar/luxon2";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { useSnackbar } from "notistack";
import * as StompJs from "@stomp/stompjs";
import SockJS from "sockjs-client";

const Calendar = (props) => {
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [data, setData] = useState([]);
  const isAuthorized = window.localStorage.getItem("Authorization");
  const BACKEND_URL = process.env;
  const url = BACKEND_URL + "/api/common";

  const { enqueueSnackbar } = useSnackbar();
  const client = useRef({});
  let hn = "";
  if (isAuthorized !== null) {
    hn = jwt_decode(isAuthorized).hospitalNo;
  }

  const connect = () => {
    client.current = new StompJs.Client({
      //brokerURL: "ws://localhost:8080/ws", // 웹소켓 서버로 직접 접속
      webSocketFactory: () => new SockJS(BACKEND_URL + "/ws"), // proxy를 통한 접속
      connectHeaders: {
        Authorization: window.localStorage.getItem("Authorization"),
      },
      debug: function (str) {
        // console.log(str);
      },
      // reconnectDelay: 5000,
      // heartbeatIncoming: 4000,
      // heartbeatOutgoing: 4000,
      onConnect: () => {
        subscribe();
      },
      onStompError: (frame) => {
        console.error(frame);
      },
    });
    client.current.activate();
  };

  const disconnect = () => {
    client.current.deactivate();
  };

  const subscribe = () => {
    client.current.subscribe(`/topic/${hn}`, ({ body }) => {
      if (JSON.parse(body).sender === "진료중") {
        handleClickVariant(JSON.parse(body).data, "info");
      }
      if (JSON.parse(body).sender === "진료완료") {
        handleClickVariant(JSON.parse(body).data, "success");
      }
      if (JSON.parse(body).sender === "진료취소") {
        handleClickVariant(JSON.parse(body).data, "error");
      }
    });
  };

  const handleClickVariant = (message, variant) => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(message, { variant: variant, persist: true });
  };

  useEffect(() => {
    connect();
    return () => disconnect();
  }, []);

  const clickEvent = (args) => {
    setStartDate(args.dateStr);
    props.getDate(args.dateStr); // 선택한 날짜 넘기기
  };

  useEffect(() => {
    if (startDate != "" && endDate != "") {
      fetchEvents();
    }
  }, [startDate, endDate]);

  const fetchEvents = async () => {
    await axios
      .get(url + "/attendanceSchedule", {
        headers: {
          Authorization: window.localStorage.getItem("Authorization"),
        },
        params: {
          hospital: hn,
          startDate: startDate,
          endDate: endDate,
        },
      })
      .then((res) => {
        setData(res.data.data);
      });
  };

  return (
    <FullCalendar
      selectable={true}
      initialView="dayGridMonth"
      headerToolbar={{
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,listYear",
      }}
      plugins={[
        dayGridPlugin,
        timeGridPlugin,
        listPlugin,
        interactionPlugin,
        luxon2Plugin,
      ]}
      dateClick={clickEvent}
      height="100%"
      locale="ko"
      datesSet={(arg) => {
        setStartDate(arg.startStr.substring(0, 10));
        setEndDate(arg.endStr.substring(0, 10));
      }}
      events={data}
    />
  );
};

export default Calendar;
