import React from "react";
import { Routes, Route } from "react-router";

import Welcome from "./pages/welcome/welcome";

import PersonnelLogin from "./pages/personnelLogin/personnelLogin";
import PersonnelDash from "./pages/personeelDash/personeelDash";
import LoanDetails from "./pages/loanDetails/loanDetails";
import SanctionCopy from "./pages/sanctionCopy/sanctionCopy";
import BillCopy from "./pages/billCopy/billCopy";

import Login from "./pages/login/login";
import EmployeeDash from "./pages/employeeDash/employeeDash";
import BasicInfo from "./pages/basicInfo/basicInfo";
import PersonalInfo from "./pages/personalInfo/personalInfo";
import SalServInfo from "./pages/salServInfo/salServInfo";
import LoanInfo from "./pages/loanInfo/loanInfo";
import LastPageInfo from "./pages/lastPageInfo/lastPageInfo";
import PreviewApplication from "./pages/previewApplication/previewApplication";

import AboutUs from "./pages/aboutUs/aboutUs";
import Administration from "./pages/administration/administration";
import Services from "./pages/services/services";
import Sections from "./pages/sections/sections";
import Downloads from "./pages/downloads/downloads";
import Notices from "./pages/notices/notices";
import Contact from "./pages/contact/contact";
import useEmployeeDataStore from "./stores/employeeDataStore";

export default function App() {
    return (
        <>
            <Routes>
                <Route index element={<Welcome />} />

                <Route path="/" element={<Welcome />} />

                <Route path="/login" element={<PersonnelLogin />} />

                <Route
                    path="/personnel_dashboard"
                    element={<PersonnelDash />}
                />

                <Route
                    path="/personnel_dashboard/pending_loan_details"
                    element={<LoanDetails />}
                />

                <Route
                    path="/personnel_dashboard/sanction_copy"
                    element={<SanctionCopy />}
                />

                <Route
                    path="/personnel_dashboard/bill_copy"
                    element={<BillCopy />}
                />

                <Route path="/employeelogin" element={<Login />} />

                <Route path="/employeeDash" element={<EmployeeDash />} />

                <Route path="/application/1" element={<BasicInfo />} />

                <Route path="/application/2" element={<PersonalInfo />} />

                <Route path="/application/3" element={<SalServInfo />} />

                <Route path="/application/4" element={<LoanInfo />} />

                <Route path="/application/5" element={<LastPageInfo />} />

                <Route
                    path="/application/preview"
                    element={<PreviewApplication />}
                />

                <Route path="/aboutus" element={<AboutUs />} />

                <Route path="/administration" element={<Administration />} />

                <Route path="/services" element={<Services />} />

                <Route path="/sections" element={<Sections />} />

                <Route path="/downloads" element={<Downloads />} />

                <Route path="/notices" element={<Notices />} />

                <Route path="/contact" element={<Contact />} />
            </Routes>
        </>
    );
}
