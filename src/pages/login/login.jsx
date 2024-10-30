import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";

import "./login.css";

import Logo from "../../component/loan_apply/logo/logo";

export default function Login() {
    var emp_data = [];
    var real_dob = "";

    var pay_data = [];

    const loginNavigate = useNavigate();

    const [buetId, setBuetId] = useState("");
    const [dob, setDob] = useState("");
    const [error_display, setError_Display] = useState([]);

    const [l_error, setL_error] = useState(false);
    const [l_error_text, setL_error_text] = useState("");
    const [l_err_text_color, setL_err_text_color] = useState(true);

    const handleInputChange = (event) => {
        const name = event.target.name;
        if (name === "buetId") {
            setBuetId(event.target.value);
        }
        if (name === "dob") {
            setDob(event.target.value);
        }
    };

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
        const duration = duration_calculation(employ_data["DATE_FIRST_JOIN"]);

        if (duration["year"] < 10) {
            setL_error(true);
            setL_err_text_color(!l_err_text_color);
            setL_error_text(
                "Service period needs to be more than 10 years. Yours is " +
                    duration["year"] +
                    " years, " +
                    duration["month"] +
                    " months, " +
                    duration["day"] +
                    " days"
            );
            return false;
        } else {
            setL_error(false);
        }

        const retirementDate = new Date(emp_data[0]["DATE_OF_RETIREMENT"]);
        const currentDate = new Date();

        if (retirementDate < currentDate) {
            setL_error(true);
            setL_err_text_color(!l_err_text_color);
            setL_error_text("You are already retired.");
            return false;
        } else {
            setL_error(false);
        }

        return true;
    };

    const authenticate = async (e) => {
        if (buetId == "") {
            setL_error(true);
            setL_err_text_color(!l_err_text_color);
            setL_error_text("BUET ID is empty!!!");
            return;
        } else {
            setL_error(false);
        }

        if (dob == "") {
            setL_error(true);
            setL_err_text_color(!l_err_text_color);
            setL_error_text("Date of Birth is empty!!!");
            return;
        } else {
            setL_error(false);
        }

        var data_found = false;

        const uploadData = {
            BUETID: buetId,
            DATE_OF_BIRTH: new Date(dob).toLocaleDateString("en-US"),
        };

        try {
            const res = await axios.post(
                "http://localhost:8800/application_login",
                uploadData
            );

            emp_data = res.data;

            if (emp_data.length == 0) {
                setL_error(true);
                setL_err_text_color(!l_err_text_color);
                setL_error_text(
                    "Invalid BUET ID and/or password \n Try Again!!!"
                );
                return;
            } else {
                setL_error(false);
            }

            const uploadPay = {
                EMPLOYEEID: emp_data[0]["EMPLOYEEID"],
            };

            const pay_res = await axios.post(
                "http://localhost:8800/pay_valid",
                uploadPay
            );
            pay_data = pay_res.data;
        } catch (err) {
            console.log(err);
        }

        if (pay_data.length == 0) {
            setL_error(true);
            setL_err_text_color(!l_err_text_color);
            setL_error_text("You are currently not an employee of BUET");
            return;
        } else {
            setL_error(false);
        }

        if (checkValidation(emp_data[0])) {
            loginNavigate("/application/1", {
                state: { info: emp_data[0], used: "no" },
            });
        }
    };

    return (
        <div className="login_body">
            <div className="login_logo">
                <Logo />
            </div>
            <div>
                <div className="login">
                    <div className="login_label">Application Login</div>

                    <div className="login_form">
                        <div className="login_form_items">
                            <div className="login_text_area">
                                <input
                                    type="text"
                                    id="buetId"
                                    name="buetId"
                                    placeholder="BUET ID"
                                    className="login_text_input"
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="login_text_area">
                                <input
                                    type="text"
                                    id="dob"
                                    name="dob"
                                    placeholder="DOB"
                                    onFocus={(e) => (e.target.type = "date")}
                                    className="login_text_input"
                                    min="1900-01-01"
                                    max="2025-01-01"
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="login_text_area">
                                <div
                                    className="login_btn not-selectable"
                                    onClick={authenticate}
                                >
                                    LOGIN
                                </div>
                            </div>

                            {l_error ? (
                                <div className="login_text_area">
                                    <div
                                        className="login_error_Text"
                                        style={{
                                            color: l_err_text_color
                                                ? "red"
                                                : "crimson",
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
            </div>
        </div>
    );
}
