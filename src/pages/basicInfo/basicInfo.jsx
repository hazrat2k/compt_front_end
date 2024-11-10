import React, { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router";

import "./basicInfo.css";

import NavBar from "../../component/page_compo/navBar/navBar";
import Footer from "../../component/page_compo/footer/footer";

import ToTitleCase from "../../utils/functions/toTitleCase";
import DataField from "../../component/loan_apply/dataField/dataField";
import loanReasons from "../../stores/const/loanReasons";

export default function BasicInfo() {
    const basicNavigate = useNavigate();
    const { state } = useLocation();
    var basic_data = state["info"];

    var state_used = "no";

    if (state["used"] === "yes") {
        state_used = "yes";
    }

    if (state["used"] === "no") {
        basic_data["LOAN_TYPE"] = state["loan_type"];
        basic_data["LOAN_AMNT"] = "";
        basic_data["REASON_FOR_LOAN"] = "";
    }

    const applicantNameRef = useRef(null);
    const designationRef = useRef(null);
    const officeDepartmentRef = useRef(null);
    const accountNoRef = useRef(null);
    const loanAmountRef = useRef(null);
    const reasonForLoanRef = useRef(null);

    const applicantName = basic_data["EMPLOYEE_NAME"];

    const designation = basic_data["DESIGNATION"];
    const officeDepartment = basic_data["OFFICE"];
    const accountNo = basic_data["BANK_ACCOUNT_NO"];
    const loanType = basic_data["LOAN_TYPE"];

    const [loanAmount, setLoanAmount] = useState(basic_data["LOAN_AMNT"]);
    const [loanAmountError, setLoanAmountError] = useState("");

    const [reasonForLoan, setReasonForLoan] = useState(
        basic_data["REASON_FOR_LOAN"]
    );
    const [reasonForLoanError, setReasonForLoanError] = useState("");

    const scrollToSection = (elementRef) => {
        window.scrollTo({
            top: elementRef.current.offsetTop,
            behavior: "smooth",
        });
    };

    const validBasicInfo = () => {
        // if (loanType === "") {
        //     setLoanTypeError("আবেদনকৃত ঋণের ধরণ নির্বাচন করুন***");
        //     scrollToSection(loanTypeRef);
        //     return false;
        // } else {
        //     setLoanTypeError("");
        // }

        if (loanAmount == "") {
            setLoanAmountError("আবেদনকৃত ঋণের পরিমাণ লিখুন***");
            scrollToSection(officeDepartmentRef);
            return false;
        } else if (Number(loanAmount) <= 0) {
            setLoanAmountError("আবেদনকৃত ঋণের পরিমাণ ধনাত্মক হতে হবে***");
            scrollToSection(officeDepartmentRef);
            return false;
        } else {
            setLoanAmountError("");
        }

        if (reasonForLoan == undefined || reasonForLoan == "") {
            setReasonForLoanError("আবেদনকৃত ঋণ গ্রহণের কারণ লিখুন***");
            scrollToSection(accountNoRef);
            return false;
        } else {
            setReasonForLoanError("");
        }

        return true;
    };

    const onBasicAuthenticate = async (e) => {
        e.preventDefault();

        if (validBasicInfo()) {
            basic_data["LOAN_TYPE"] = loanType;
            basic_data["LOAN_AMNT"] = loanAmount;

            if (state["used"] === "no") {
                basic_data["REASON_FOR_LOAN"] = reasonForLoan["title"];
            } else if (
                reasonForLoan["title"] !== undefined &&
                basic_data["REASON_FOR_LOAN"] != reasonForLoan["title"]
            ) {
                basic_data["REASON_FOR_LOAN"] = reasonForLoan["title"];
            }

            basicNavigate("/application/2", {
                state: { info: basic_data, used: state_used },
            });
        }
    };

    return (
        <div>
            <NavBar hide={{ nav_mid: true }} />

            <div className="basicFieldBody">
                <div className="basic_label">
                    {ToTitleCase(loanType)} Application Form
                </div>

                <div className="basicField">
                    <DataField
                        refer={applicantNameRef}
                        type="data"
                        label="১. আবেদনকারীর নাম "
                        value={applicantName}
                    />

                    <DataField
                        refer={designationRef}
                        type="data"
                        label="২. পদবী "
                        value={designation}
                    />

                    <DataField
                        refer={officeDepartmentRef}
                        type="data"
                        label="৩. অফিস/বিভাগ "
                        value={officeDepartment}
                    />

                    <DataField
                        refer={accountNoRef}
                        type="data"
                        label="৪. সোনালী ব্যাংক, বুয়েট শাখায় পরিচালিত হিসাব নম্বর "
                        value={accountNo}
                    />

                    <DataField
                        refer={loanAmountRef}
                        helperText={loanAmountError}
                        type="input"
                        dataType="number"
                        label="৫. আবেদনকৃত ঋণের পরিমাণ "
                        value={loanAmount}
                        setValue={(data) => {
                            setLoanAmount(data);
                        }}
                        placeholder="i.e. 100000"
                    />

                    <DataField
                        refer={reasonForLoanRef}
                        helperText={reasonForLoanError}
                        type="suggestedInput"
                        label="৬. আবেদনকৃত ঋণ গ্রহণের কারণ "
                        value={reasonForLoan}
                        options={loanReasons}
                        setValue={(data) => {
                            setReasonForLoan(data);
                        }}
                        placeholder="i.e. Building House"
                    />
                </div>

                <div className="bisingleButton">
                    <button
                        className="binormalButton"
                        onClick={onBasicAuthenticate}
                    >
                        Next
                    </button>
                </div>
            </div>

            <Footer />
        </div>
    );
}
