import React, { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import { Typography } from "@mui/material";

function Timer(props) {
  const getCurrentClockTime = () => {
    const now = new Date();
    const hours = now.getHours();
    return {
      hours: ("0" + (hours > 12 ? hours - 12 : hours)).slice(-2),
      minutes: ("0" + now.getMinutes()).slice(-2),
      seconds: ("0" + now.getSeconds()).slice(-2),
      session: hours > 12 ? "PM" : "AM",
    };
  };

  const [currentTime, setCurrentTime] = useState(getCurrentClockTime());
  const [ticks, setTicks] = useState(0);
  const isAuthorized = window.localStorage.getItem("Authorization");

  useEffect(() => {
    setTimeout(() => {
      setCurrentTime(getCurrentClockTime());
      setTicks(ticks + 1);
      if (jwt_decode(isAuthorized).exp < Math.floor(+new Date() / 1000)) {
        // 토큰 만료시간 체크
        localStorage.removeItem("Authorization");
        navigate("/login", { replace: true });
      }
    }, 1000);
  }, [currentTime]);

  return (
    <Typography variant="h6">
      {`${currentTime.hours} : ${currentTime.minutes} : ${currentTime.seconds} ${currentTime.session}`}
    </Typography>
  );
}

export default Timer;
