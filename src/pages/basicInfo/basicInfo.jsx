import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";

import "./basicInfo.css";

import NavBar from "../../component/page_compo/navBar/navBar";
import Footer from "../../component/page_compo/footer/footer";

import ToTitleCase from "../../utils/functions/toTitleCase";
import { null_array } from "../../stores/const/nullArray";
import scrollToSection from "../../utils/functions/scrollToSection";
import DataField from "../../component/loan_apply/dataField/dataField";
import loanReasons from "../../stores/const/loanReasons";
import useLoanInfoStore from "../../stores/loanInfoStore";
import useEmployeeDataStore from "../../stores/employeeDataStore";

export default function BasicInfo() {
    const basicNavigate = useNavigate();
    var basic_data = useEmployeeDataStore((state) => state.employeeData);

    const addBasicField = useLoanInfoStore((state) => state.addLoanField);
    const basicDataField = useLoanInfoStore((state) => state.loanInfo);

    useEffect(() => {
        addBasicField("EMPLOYEE_NAME", basic_data["EMPLOYEE_NAME"]);
        addBasicField("DESIGNATION", basic_data["DESIGNATION"]);
        addBasicField("OFFICE", basic_data["OFFICE"]);
        addBasicField("BANK_ACCOUNT_NO", basic_data["BANK_ACCOUNT_NO"]);
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }, []);

    const applicantNameRef = useRef(null);
    const designationRef = useRef(null);
    const officeDepartmentRef = useRef(null);
    const accountNoRef = useRef(null);
    const loanAmountRef = useRef(null);
    const reasonForLoanRef = useRef(null);

    // addBasicField("EMPLOYEE_NAME", basic_data["EMPLOYEE_NAME"]);
    // addBasicField("DESIGNATION", basic_data["DESIGNATION"]);
    // addBasicField("OFFICE", basic_data["OFFICE"]);
    // addBasicField("BANK_ACCOUNT_NO", basic_data["BANK_ACCOUNT_NO"]);

    const [loanAmountError, setLoanAmountError] = useState("");

    const [reasonForLoanError, setReasonForLoanError] = useState("");

    const validBasicInfo = () => {
        if (null_array.includes(basicDataField["LOAN_AMNT"])) {
            setLoanAmountError("আবেদনকৃত ঋণের পরিমাণ লিখুন***");
            scrollToSection(designationRef);
            return false;
        } else if (Number(basicDataField["LOAN_AMNT"]) <= 0) {
            setLoanAmountError("আবেদনকৃত ঋণের পরিমাণ ধনাত্মক হতে হবে***");
            scrollToSection(designationRef);
            return false;
        } else {
            setLoanAmountError("");
        }

        if (null_array.includes(basicDataField["REASON_FOR_LOAN"])) {
            setReasonForLoanError("আবেদনকৃত ঋণ গ্রহণের কারণ লিখুন***");
            scrollToSection(officeDepartmentRef);
            return false;
        } else {
            setReasonForLoanError("");
        }

        return true;
    };

    const onBasicAuthenticate = async (e) => {
        e.preventDefault();

        if (validBasicInfo()) {
            basicNavigate("/application/2");
        }
    };

    return (
        <div>
            <NavBar hide={{ nav_mid: true }} />

            <div className="basicFieldBody">
                <div className="basic_label">
                    {basicDataField["LOAN_TYPE"]} Application Form
                </div>

                <div className="basicField">
                    <DataField
                        refer={applicantNameRef}
                        type="data"
                        label="১. আবেদন-কারীর নাম "
                        value={basicDataField["EMPLOYEE_NAME"]}
                    />

                    <DataField
                        refer={designationRef}
                        type="data"
                        label="২. পদবী "
                        value={basicDataField["DESIGNATION"]}
                    />

                    <DataField
                        refer={officeDepartmentRef}
                        type="data"
                        label="৩. অফিস/বিভাগ "
                        value={basicDataField["OFFICE"]}
                    />

                    <DataField
                        refer={accountNoRef}
                        type="data"
                        label="৪. হিসাব নম্বর "
                        value={basicDataField["BANK_ACCOUNT_NO"]}
                    />

                    <DataField
                        refer={loanAmountRef}
                        helperText={loanAmountError}
                        type="input"
                        dataType="number"
                        label="৫. আবেদনকৃত ঋণের পরিমাণ "
                        value={basicDataField["LOAN_AMNT"]}
                        setValue={(data) => {
                            addBasicField("LOAN_AMNT", data);
                        }}
                        placeholder="i.e. 100000"
                    />

                    <DataField
                        refer={reasonForLoanRef}
                        helperText={reasonForLoanError}
                        type="suggestedInput"
                        label="৬. আবেদনকৃত ঋণ গ্রহণের কারণ "
                        value={basicDataField["REASON_FOR_LOAN"]}
                        options={loanReasons}
                        setValue={(data) => {
                            addBasicField("REASON_FOR_LOAN", data["title"]);
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
