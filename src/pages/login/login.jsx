import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";

import TextField from "@mui/material/TextField";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import NavBar from "../../component/page_compo/navBar/navBar";
import Footer from "../../component/page_compo/footer/footer";

import "./login.css";

import Logo from "../../component/loan_apply/logo/logo";
import ToTitleCase from "../../utils/functions/toTitleCase";
import { backend_site_address } from "../../stores/const/siteAddress";

export default function Login() {
    var emp_data = [];
    var real_dob = "";

    var pay_data = [];

    const loginNavigate = useNavigate();

    const [log_loan_type, setLog_loan_type] = useState("");

    const loan_type_check = [
        "",
        "Consumer Loan",
        "Laptop Loan",
        "SBL House Loan",
        "SBL Multipurpose Loan",
    ];

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }, []);

    const [buetId, setBuetId] = useState("");
    const [buetIdHelperText, setBuetIdHelperText] = useState("");

    const [dob, setDob] = useState(null);
    const [dobHelperText, setDobHelperText] = useState("");

    const [l_error, setL_error] = useState(false);
    const [l_error_text, setL_error_text] = useState("");
    const [l_err_text_color, setL_err_text_color] = useState(true);

    const duration_calculation = (date) => {
        const now = new Date();
        const first_join_date = new Date(date);

        var currentYear = now.getFullYear();
        var currentMonth = now.getMonth();
        var currentDate = now.getDate();

        var first_join_dateYear = first_join_date.getFullYear();
        var first_join_dateMonth = first_join_date.getMonth();
        var first_join_dateDate = first_join_date.getDate();

        var yearDuration = currentYear - first_join_dateYear;
        var monthDuration = 0;
        var dateDuration = 0;

        if (currentMonth >= first_join_dateMonth)
            monthDuration = currentMonth - first_join_dateMonth;
        else {
            yearDuration--;
            monthDuration = 12 + currentMonth - first_join_dateMonth;
        }

        if (currentDate >= first_join_dateDate)
            dateDuration = currentDate - first_join_dateDate;
        else {
            monthDuration--;
            dateDuration = 31 + currentDate - first_join_dateDate;
            if (monthDuration < 0) {
                monthDuration = 11;
                yearDuration--;
            }
        }

        return { year: yearDuration, month: monthDuration, day: dateDuration };
    };

    const checkValidation = (employ_data) => {
        const duration = duration_calculation(employ_data["DATE_OF_BIRTH"]);

        const teacherOrNot = employ_data["EMPLOYEE_ID"][0] == "T";

        if (duration["year"] > 60 && !teacherOrNot) {
            setL_error(true);
            setL_err_text_color(!l_err_text_color);
            setL_error_text("You are retired already.");
            return false;
        } else if (duration["year"] > 65 && teacherOrNot) {
            setL_error(true);
            setL_err_text_color(!l_err_text_color);
            setL_error_text("You are retired already.");
            return false;
        } else {
            setL_error(false);
        }

        return true;
    };

    const authenticate = async (e) => {
        if (buetId == "") {
            //BUET ID is empty or not
            setBuetIdHelperText("***BUET ID must be filled.");
            return;
        } else if (buetId.length != 10) {
            //BUET ID length is 10 or not
            setBuetIdHelperText("***BUET ID is invalid.");
            return;
        } else {
            setBuetIdHelperText("");
        }

        if (dob == null) {
            //DOB is empty or not
            setDobHelperText("***Date of Birth must be filled.");
            return;
        } else if (dob.$d == "Invalid Date") {
            //DOB length is invalid or not
            setDobHelperText("***Date of Birth is invalid.");
            return;
        } else {
            setDobHelperText("");
        }

        const uploadData = {
            BUETID: buetId,
            DATE_OF_BIRTH: new Date(dob.$d).toLocaleDateString("en-US"),
        };

        var loan_data = [];

        var temp_l_t = ToTitleCase(log_loan_type);

        try {
            const res = await axios.post(
                "http://" + backend_site_address + "/application_login",
                uploadData
            );

            emp_data = res.data;

            // checking whether the input employee exists or not
            if (emp_data.offset == 0) {
                setL_error(true);
                setL_err_text_color(!l_err_text_color);
                setL_error_text("Database Error!!!");
                return;
            } else if (emp_data.length == 0) {
                setL_error(true);
                setL_err_text_color(!l_err_text_color);
                setL_error_text(
                    "BUET ID doesn't match with Date of Birth \n Try Again!!!"
                );
                return;
            } else {
                setL_error(false);
            }

            // const uploadLoan = {
            //     EMPLOYEEID: emp_data[0]["EMPLOYEEID"],
            //     LOAN_TYPE: temp_l_t,
            // };

            // const loan_res = await axios.post(
            //     "http://"+backend_site_address+"/loan_with_type",
            //     uploadLoan
            // );

            // loan_data = loan_res.data;

            const uploadPay = {
                EMPLOYEEID: emp_data[0]["EMPLOYEEID"],
            };

            const pay_res = await axios.post(
                "http://" + backend_site_address + "/pay_valid",
                uploadPay
            );

            pay_data = pay_res.data;

            console.log(pay_data);
        } catch (err) {
            console.log(err);
        }

        // console.log(pay_data);

        // // does have more selected loan or not
        // if (loan_data.length != 0) {
        //     setL_error(true);
        //     setL_err_text_color(!l_err_text_color);
        //     setL_error_text("You already have a " + temp_l_t + " running");
        //     return;
        // } else {
        //     setL_error(false);
        // }

        //Getting last month payment or not
        if (pay_data.length == 0) {
            setL_error(true);
            setL_err_text_color(!l_err_text_color);
            setL_error_text("You are currently not an employee of BUET");
            return;
        } else {
            setL_error(false);
        }

        // whether service period is more than 10 years or not.
        if (checkValidation(emp_data[0])) {
            loginNavigate("/employeedash", {
                state: {
                    info: emp_data[0],
                },
            });
        }
    };

    return (
        <div className="login_body">
            <NavBar hide={{ nav_mid: true }} />

            <div className="login_context">
                <div className="login_label">Employee Login</div>

                <div className="login">
                    <div className="login_form_items">
                        <TextField
                            error={buetIdHelperText != ""}
                            id="outlined-basic"
                            label="BUET ID"
                            className="log_font"
                            variant="outlined"
                            value={buetId}
                            onChange={(e) => setBuetId(e.target.value)}
                            helperText={buetIdHelperText}
                            style={{
                                width: "300px",
                                marginBottom: "5px",
                            }}
                        />

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={["DatePicker"]}>
                                <DatePicker
                                    label="Date of Birth"
                                    value={dob}
                                    disableFuture
                                    onChange={(newValue) => setDob(newValue)}
                                    slotProps={{
                                        textField: {
                                            error: dobHelperText != "",
                                            helperText: dobHelperText,
                                            style: {
                                                width: "300px",
                                                marginBottom: "5px",
                                            },
                                        },
                                    }}
                                />
                            </DemoContainer>
                        </LocalizationProvider>

                        <div className="login_text_area">
                            <div
                                className="login_btn not-selectable"
                                onClick={authenticate}
                            >
                                Login
                            </div>
                        </div>

                        {l_error ? (
                            <div className="login_text_area">
                                <div
                                    className="login_error_Text"
                                    style={{
                                        color: l_err_text_color
                                            ? "#1976d2"
                                            : "#bf15af",
                                    }}
                                >
                                    {l_error_text}
                                </div>
                            </div>
                        ) : (
                            ""
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
