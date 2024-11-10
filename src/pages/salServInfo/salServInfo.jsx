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

export default function SalServInfo() {
    const salServNavigate = useNavigate();
    const { state } = useLocation();
    const salary_file = state["file"]["salary"];

    var salServData = state["info"];

    var state_used = "no";

    if (state["used"] === "yes") {
        state_used = "yes";
    }

    const [loan_file, setLoan_file] = useState([]);
    const [loan_type_file, setLoan_type_file] = useState([]);

    useEffect(() => {
        const fetch_loan_data = async () => {
            try {
                const res = await axios.post("http://localhost:8800/loan", {
                    EMPLOYEEID: salServData["EMPLOYEEID"],
                });
                setLoan_file(res.data);

                const type_res = await axios.get(
                    "http://localhost:8800/loan_type"
                );
                setLoan_type_file(type_res.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetch_loan_data();
    }, []);

    const setSalServData = (data) => {
        salServData = { ...salServData, ...data };
    };

    const onSalServAuthenticate = (button) => {
        if (button == "first")
            salServNavigate("/application/2", {
                state: { info: salServData, used: "yes" },
            });

        if (button == "second") {
            const file = {
                salary: salary_file,
                loan: loan_file,
                loan_type: loan_type_file,
            };
            salServNavigate("/application/4", {
                state: { info: salServData, file: file, used: state_used },
            });
        }
    };

    return (
        <div>
            <NavBar hide={{ nav_mid: true }} />

            <div className="salServ_info">
                <div className="basic_label">
                    {ToTitleCase(salServData["LOAN_TYPE"])} Application Form
                </div>

                <ServiceInfo
                    service_data={state["info"]}
                    setServData={(data) => {
                        setSalServData(data);
                    }}
                />

                <SalaryInfo
                    salary_data={state["info"]}
                    salary_file={salary_file}
                    setSalData={(data) => {
                        setSalServData(data);
                    }}
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
