import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import "./salServInfo.css";
import Logo from "../../component/loan_apply/logo/logo";
import axios from "axios";

import NavBar from "../../component/page_compo/navBar/navBar";
import Footer from "../../component/page_compo/footer/footer";

import ToTitleCase from "../../utils/functions/toTitleCase";
import ServiceInfo from "../../component/loan_apply/serviceInfo/serviceInfo";
import SalaryInfo from "../../component/loan_apply/salaryInfo/salaryInfo";
import DoubleButton from "../../component/loan_apply/doubleButton/doubleButton";
import { backend_site_address } from "../../stores/const/siteAddress";
import useEmployeeDataStore from "../../stores/employeeDataStore";
import useLoanInfoStore from "../../stores/loanInfoStore";

export default function SalServInfo() {
    const salServNavigate = useNavigate();

    let salServData = useEmployeeDataStore((state) => state.employeeData);

    const salServField = useLoanInfoStore((state) => state.loanInfo);
    const salServAddLoanField = useLoanInfoStore((state) => state.addLoanField);

    const salary_file = salServField["salaryFile"];

    const [loan_file, setLoan_file] = useState([]);
    const [loan_type_file, setLoan_type_file] = useState([]);

    useEffect(() => {
        const fetch_loan_data = async () => {
            try {
                const res = await axios.post(
                    "http://" + backend_site_address + "/loan",
                    {
                        EMPLOYEEID: salServData["EMPLOYEEID"],
                    }
                );
                setLoan_file(res.data);

                const type_res = await axios.get(
                    "http://" + backend_site_address + "/loan_type"
                );
                setLoan_type_file(type_res.data);
            } catch (err) {
                console.log(err);
            }
        };
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        fetch_loan_data();
    }, []);

    const onSalServAuthenticate = (button) => {
        if (button == "first") salServNavigate("/application/2");

        if (button == "second") {
            const file = {
                salary: salary_file,
                loan: loan_file,
                loan_type: loan_type_file,
            };
            salServAddLoanField("file", file);
            salServNavigate("/application/4");
        }
    };

    

    return (
        <div>
            <NavBar hide={{ nav_mid: true }} />

            <div className="salServ_info">
                <div className="basic_label">
                    {salServField["LOAN_TYPE"]} Application Form
                </div>

                <ServiceInfo service_data={salServData} />

                <SalaryInfo
                    salary_data={salServData}
                    salary_file={salary_file}
                />

                <DoubleButton
                    firstButtonName="Previous"
                    secondButtonName="Next"
                    clickedButton={(clicked) => {
                        onSalServAuthenticate(clicked);
                    }}
                />
            </div>

            <Footer />
        </div>
    );
}
