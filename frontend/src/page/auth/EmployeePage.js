import React from "react";
import Employee from "../../components/hospitalAdmin/Employee";
import AdminSiteLayout from "../../layout/AdminSiteLayout";
import SiteLayout from "../../layout/SiteLayout";
import jwt_decode from "jwt-decode";

const EmployeePage = (props) => {
  const isAuthorized = window.localStorage.getItem("Authorization");

  return jwt_decode(isAuthorized).role === "ROLE_SUPERADMIN" ? (
    <AdminSiteLayout>
      <Employee />
    </AdminSiteLayout>
  ) : (
    <SiteLayout>
      <Employee />
    </SiteLayout>
  );
};

export default EmployeePage;
