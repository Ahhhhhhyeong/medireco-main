import React, { useEffect } from "react";
import jwt_decode from "jwt-decode";
import HospitalList from "../components/admin/HospitalList";
import Doctor from "./doctor/doctor";
import NursePage from "./nurse/nursePage";
import EmployeeList from "../components/hospitalAdmin/EmployeeList";
import Login from "../page/auth/login";
import { useNavigate } from "react-router";

function main(props) {
  const isAuthorized = window.localStorage.getItem("Authorization");
  let decode = "";
  const navigate = useNavigate();

  if (isAuthorized !== null) {
    decode = jwt_decode(isAuthorized).role;
  }

  console.log(decode);

  useEffect(() => {
    switch (decode) {
      case "ROLE_SUPERADMIN":
        return navigate("/hospitallist", { replace: true });
      case "ROLE_ADMIN":
        return navigate("/employeelist", { replace: true });
      case "ROLE_NURSE":
        return navigate("/nurse", { replace: true });
      case "ROLE_DOCTOR":
        return navigate("/doctor", { replace: true });
    }
  }, []);
}

export default main;
