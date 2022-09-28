import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useRoutes } from "react-router";
import Login from "./page/auth/login";
import Main from "./page/main";
import Hospital from "./components/admin/Hospital";
import Disease from "./components/admin/Disease";
import Medicine from "./components/admin/Medicine";
import HospitalList from "./components/admin/HospitalList";
import Doctor from "./page/doctor/doctor";
import VisitedRecord from "./page/common/visitedRecord";
import HospitalSchedule from "./page/common/hospitalSchedule";
import Nurse from "./page/nurse/nursePage";
import Reception from "./page/nurse/receptionPage";
import Appointment from "./page/nurse/appointmentPage";
import PatientList from "./page/nurse/patientsListPage";
import Attendance from "./page/attendance/attendancePage";
import EmployeeList from "./components/hospitalAdmin/EmployeeList";
import EmployeePage from "./page/auth/EmployeePage";
import NotFound from "./page/error/404";

const App = (props) => {
  const no = useLocation().pathname.substring(
    useLocation().pathname.lastIndexOf("/")
  );
  const isAuthorized = window.localStorage.getItem("Authorization");
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthorized === null) {
      navigate("/login", { replace: true });
    } else {
      if (no === "/login") {
        navigate("/", { replace: true });
      }
    }
  }, []);

  return useRoutes([
    { path: "/", element: <Main /> },
    { path: "login", element: <Login /> },
    { path: "hospital/*", element: <Hospital /> },
    { path: "disease", element: <Disease /> },
    { path: "medicine", element: <Medicine /> },
    { path: "hospitallist", element: <HospitalList /> },
    { path: "doctor/*", element: <Doctor /> },
    { path: "visitedrecord", element: <VisitedRecord /> },
    { path: "hospitalschedule", element: <HospitalSchedule /> },
    { path: "nurse", element: <Nurse /> },
    { path: "reception", element: <Reception /> },
    { path: "appointment", element: <Appointment /> },
    { path: "patientList", element: <PatientList /> },
    { path: "attendance", element: <Attendance /> },
    { path: "employeelist", element: <EmployeeList /> },
    { path: "employee/*", element: <EmployeePage /> },
    { path: "*", element: <NotFound /> },
  ]);
};

export default App;
