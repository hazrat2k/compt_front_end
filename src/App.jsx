import React from "react";
import { Routes, Route } from "react-router";
import { Navigate } from "react-router-dom";

import Welcome from "./pages/welcome/welcome";

import PersonnelLogin from "./pages/personnelLogin/personnelLogin";
import PersonnelDash from "./pages/personeelDash/personeelDash";
import CashBook from "./pages/cashBook/cashBook";
import LoanPage from "./pages/loanPage/loanPage";
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

import CashBookNewEntry from "./pages/cashBookNewEntry/cashBookNewEntry";
import CashBookPreview from "./pages/cashBookPreview/cashBookPreview";
import CashBookEdit from "./pages/cashBookEdit/cashBookEdit";
import CashBookAddHeading from "./pages/cashBookAddHeading/cashBookAddHeading";
import CashBookReceivePayment from "./pages/cashBookReceivePayment/cashBookReceivePayment";

import useEmployeeDataStore from "./stores/employeeDataStore";
import usePersonnelDataStore from "./stores/personnelDataStore";

const ProtectedPersonnelRoute = ({ children }) => {
    const isAuthenticated = usePersonnelDataStore(
        (state) => state.personnelData
    );

    console.log(isAuthenticated);

    return Object.keys(isAuthenticated).length !== 0 ? (
        children
    ) : (
        <Navigate to="/login" replace />
    );
};

const ProtectedEmployeeRoute = ({ children }) => {
    const isAuthenticated = useEmployeeDataStore((state) => state.employeeData);

    return Object.keys(isAuthenticated).length !== 0 ? (
        children
    ) : (
        <Navigate to="/employeelogin" replace />
    );
};

export default function App() {
    return (
        <>
            <Routes>
                <Route index element={<Welcome />} />

                <Route path="/" element={<Welcome />} />

                <Route path="/login" element={<PersonnelLogin />} />

                <Route path="/employeelogin" element={<Login />} />

                <Route path="/aboutus" element={<AboutUs />} />

                <Route path="/administration" element={<Administration />} />

                <Route path="/services" element={<Services />} />

                <Route path="/sections" element={<Sections />} />

                <Route path="/downloads" element={<Downloads />} />

                <Route path="/notices" element={<Notices />} />

                <Route path="/contact" element={<Contact />} />

                <Route
                    path="/personnel_dashboard"
                    element={
                        <ProtectedPersonnelRoute>
                            <PersonnelDash />
                        </ProtectedPersonnelRoute>
                    }
                />
                <Route
                    path="/processing_loan"
                    element={
                        <ProtectedPersonnelRoute>
                            <LoanPage />
                        </ProtectedPersonnelRoute>
                    }
                />

                <Route
                    path="/processing_loan/loan_details"
                    element={
                        <ProtectedPersonnelRoute>
                            <LoanDetails />
                        </ProtectedPersonnelRoute>
                    }
                />

                <Route
                    path="/processing_loan/sanction_copy"
                    element={
                        <ProtectedPersonnelRoute>
                            <SanctionCopy />
                        </ProtectedPersonnelRoute>
                    }
                />

                <Route
                    path="/processing_loan/bill_copy"
                    element={
                        <ProtectedPersonnelRoute>
                            <BillCopy />
                        </ProtectedPersonnelRoute>
                    }
                />

                <Route
                    path="/cashbook"
                    element={
                        <ProtectedPersonnelRoute>
                            <CashBook />
                        </ProtectedPersonnelRoute>
                    }
                />

                <Route
                    path="/cashbook/newentry"
                    element={
                        <ProtectedPersonnelRoute>
                            <CashBookNewEntry />
                        </ProtectedPersonnelRoute>
                    }
                />

                <Route
                    path="/cashbook/preview"
                    element={
                        <ProtectedPersonnelRoute>
                            <CashBookPreview />
                        </ProtectedPersonnelRoute>
                    }
                />

                <Route
                    path="/cashbook/editentry"
                    element={
                        <ProtectedPersonnelRoute>
                            <CashBookEdit />
                        </ProtectedPersonnelRoute>
                    }
                />

                <Route
                    path="/cashbook/addheading"
                    element={
                        <ProtectedPersonnelRoute>
                            <CashBookAddHeading />
                        </ProtectedPersonnelRoute>
                    }
                />

                <Route
                    path="/cashbook/receivepayment"
                    element={
                        <ProtectedPersonnelRoute>
                            <CashBookReceivePayment />
                        </ProtectedPersonnelRoute>
                    }
                />

                <Route
                    path="/employeeDash"
                    element={
                        <ProtectedEmployeeRoute>
                            <EmployeeDash />
                        </ProtectedEmployeeRoute>
                    }
                />

                <Route
                    path="/application/1"
                    element={
                        <ProtectedEmployeeRoute>
                            <BasicInfo />
                        </ProtectedEmployeeRoute>
                    }
                />

                <Route
                    path="/application/2"
                    element={
                        <ProtectedEmployeeRoute>
                            <PersonalInfo />
                        </ProtectedEmployeeRoute>
                    }
                />

                <Route
                    path="/application/3"
                    element={
                        <ProtectedEmployeeRoute>
                            <SalServInfo />
                        </ProtectedEmployeeRoute>
                    }
                />

                <Route
                    path="/application/4"
                    element={
                        <ProtectedEmployeeRoute>
                            <LoanInfo />
                        </ProtectedEmployeeRoute>
                    }
                />

                <Route
                    path="/application/5"
                    element={
                        <ProtectedEmployeeRoute>
                            <LastPageInfo />
                        </ProtectedEmployeeRoute>
                    }
                />

                <Route
                    path="/application/preview"
                    element={
                        <ProtectedEmployeeRoute>
                            <PreviewApplication />
                        </ProtectedEmployeeRoute>
                    }
                />
            </Routes>
        </>
    );
}
