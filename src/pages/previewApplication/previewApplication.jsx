import React, { useEffect } from "react";
import { useLocation } from "react-router";
import moment from "moment";

import { useMediaQuery } from "react-responsive";

import "./previewApplication.css";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import NavBar from "../../component/page_compo/navBar/navBar";
import Footer from "../../component/page_compo/footer/footer";
import InWords from "../../utils/functions/inWords";
import ToTitleCase from "../../utils/functions/toTitleCase";
import PreviewText from "../../component/loan_apply/previewText/previewText";
import Application from "../../utils/pdfCopy/application";

import useLoanInfoStore from "../../stores/loanInfoStore";
import useEmployeeDataStore from "../../stores/employeeDataStore";

const createSalaryData = (
    serialNo,
    loanMonth,
    loanPrevMonth1,
    loanPrevMonth2,
    loanPrevMonth3
) => {
    return {
        serialNo,
        loanMonth,
        loanPrevMonth1,
        loanPrevMonth2,
        loanPrevMonth3,
    };
};

const createLoanData = (
    serialNo,
    loanType,
    loanAmnt,
    instAmnt,
    totInstNo,
    paidInstNo,
    unpaidLoanAmnt
) => {
    return {
        serialNo,
        loanType,
        loanAmnt,
        instAmnt,
        totInstNo,
        paidInstNo,
        unpaidLoanAmnt,
    };
};

export default function PreviewApplication() {
    var previewData = useEmployeeDataStore((state) => state.employeeData);

    const isMobile = useMediaQuery({ query: "(max-width: 800px)" });

    const previewDataField = useLoanInfoStore((state) => state.loanInfo);

    previewData["LOAN_TYPE"] = previewDataField["LOAN_TYPE"];
    previewData["LOAN_AMNT"] = previewDataField["LOAN_AMNT"];
    previewData["REASON_FOR_LOAN"] = previewDataField["REASON_FOR_LOAN"];
    previewData["MOTHERS_NAME"] = previewDataField["MOTHERS_NAME"];
    previewData["NOMINEES_NAME"] = previewDataField["NOMINEES_NAME"];
    previewData["NOMINEES_RELSHIP"] = previewDataField["NOMINEES_RELSHIP"];
    previewData["PRESENT_ADDRESS"] = previewDataField["PRESENT_ADDRESS"];
    previewData["PERMANENT_ADDRESS"] = previewDataField["PERMANENT_ADDRESS"];
    previewData["NOMINEES_NID"] = previewDataField["NOMINEES_NID"];
    previewData["CONTACT_NO"] = previewDataField["CONTACT_NO"];
    previewData["SERV_PERIOD"] = previewDataField["SERV_PERIOD"];

    let nf = new Intl.NumberFormat("en-IN");

    const preAppApplicantName = previewData["EMPLOYEE_NAME"];
    const preAppDesignation = previewData["DESIGNATION"];
    const preAppOfficeDept = previewData["OFFICE"];
    const preAppAccountNo = previewData["BANK_ACCOUNT_NO"];
    const preAppLoanType = previewData["LOAN_TYPE"];
    const preAppLoanAmnt = previewData["LOAN_AMNT"];
    const preAppLoanReas = previewData["REASON_FOR_LOAN"];

    const preAppPersoInfo = [
        ["ক", "খ", "গ", "ঘ", "ঙ", "চ", "ছ", "জ", "ঝ"],
        [
            "পিতা/স্বামীর নাম",
            "মাতার নাম",
            "নমিনীর নাম",
            "নমিনীর সম্পর্ক",
            "বর্তমান ঠিকানা",
            "স্থায়ী ঠিকানা",
            "জন্ম তারিখ",
            "নমিনীর NID",
            "মোবাইল নং",
        ],
        [
            previewData["FATHERS_NAME"],
            previewData["MOTHERS_NAME"],
            previewData["NOMINEES_NAME"],
            previewData["NOMINEES_RELSHIP"],
            previewData["PRESENT_ADDRESS"],
            previewData["PERMANENT_ADDRESS"],
            moment(new Date(previewData["DATE_OF_BIRTH"])).format(
                "DD MMM YYYY"
            ),
            previewData["NOMINEES_NID"],
            previewData["CONTACT_NO"],
        ],
    ];

    const preAppServInfo = [
        ["ক", "খ", "গ", "ঘ", "ঙ"],
        [
            "বুয়েট আই.ডি. নং",
            "চাকুরীর ধরণ",
            "যোগদানের তারিখ",
            "মোট চাকুরীকাল",
            "অবসরের তারিখ",
        ],
        [
            previewData["EMPLOYEE_ID"],
            previewData["APPOINTMENT_TYPE"],
            moment(new Date(previewData["DATE_FIRST_JOIN"])).format(
                "DD MMM YYYY"
            ),
            previewData["SERV_PERIOD"],
            moment(new Date(previewData["DATE_OF_RETIREMENT"])).format(
                "DD MMM YYYY"
            ),
        ],
    ];

    var preAppSalInfo = [
        [" ", "ক", "খ", "গ", "ঘ"],
        ["মাস", "মূল বেতন", "মোট বেতন", "মোট কর্তন", "নীট বেতন"],
    ];

    preAppSalInfo = [...preAppSalInfo, ...previewDataField["PREV_MON_SAL"]];

    previewData["PREV_MON_SAL"] = previewDataField["PREV_MON_SAL"];

    var preAppLoanInfo = [
        ["ক্রমিক নং", "০১", "০২", "০৩", "০৪", "০৫", "০৬", " "],
        [
            "ঋণের নাম",
            //মোটরযান ক্রয়/গৃহ নির্মাণ/মেরামত/জমি ক্রয়
            "গৃহ নির্মাণ ঋণ",
            "ভোগ্যপণ্য ঋণ",
            "ল্যাপটপ ঋণ",
            "সোনালী ব্যাংকের হোলসেল ঋণ",
            "সোনালী ব্যাংকের গৃহ নির্মাণ ঋণ",
            "অন্যান্য",
            "মোট",
        ],
        ["ঋণের পরিমাণ"],
        ["কিস্তির পরিমাণ"],
        ["মোট কিস্তির সংখ্যা"],
        ["পরিশোধিত কিস্তির সংখ্যা"],
        ["অপরিশোধিত ঋণের পরিমাণ (সুদ সহ)"],
    ];

    previewData["LOAN_DETAILS"] = previewDataField["LOAN_DETAILS"];

    for (let i = 0; i < 5; i++) {
        preAppLoanInfo[i + 2] = [
            ...preAppLoanInfo[i + 2],
            ...previewDataField["LOAN_DETAILS"][i],
        ];
    }

    const preAppLastInfo = [
        ["ক", "খ"],
        ["পেনশন বাবদ (এককালীন পেনশন)", " "],
        [" ", " "],
    ];

    const persoTable = [];
    const persoTable2 = [];
    const persoTable3 = [];
    const persoTable4 = [];
    const persoTable5 = [];
    const persoTable6 = [];

    for (let i = 0; i < 4; i += 2) {
        persoTable.push(
            <tbody>
                <tr>
                    <th className="tableIndexCol">
                        {preAppPersoInfo[0][i] + ")"}
                    </th>
                    <th className="tableLabelCol">{preAppPersoInfo[1][i]}</th>
                    <th className="tableColonCol">:</th>
                    <th className="tableValueCol">{preAppPersoInfo[2][i]}</th>
                </tr>
            </tbody>
        );
    }

    for (let i = 1; i < 4; i += 2) {
        persoTable2.push(
            <tbody>
                <tr>
                    <th className="tableIndexCol">
                        {preAppPersoInfo[0][i] + ")"}
                    </th>
                    <th className="tableLabelCol">{preAppPersoInfo[1][i]}</th>
                    <th className="tableColonCol">:</th>
                    <th className="tableValueCol">{preAppPersoInfo[2][i]}</th>
                </tr>
            </tbody>
        );
    }

    for (let i = 4; i < 6; i += 1) {
        persoTable3.push(
            <tbody>
                <tr>
                    <th className="tableIndexCol">
                        {preAppPersoInfo[0][i] + ")"}
                    </th>
                    <th className="tableLabelCol tablebigCol">
                        {preAppPersoInfo[1][i]}
                    </th>
                    <th className="tableColonCol">:</th>
                    <th className="tableValueCol">{preAppPersoInfo[2][i]}</th>
                </tr>
            </tbody>
        );
    }

    for (let i = 6; i < 7; i += 1) {
        persoTable4.push(
            <tbody>
                <tr>
                    <th className="tableIndexCol">
                        {preAppPersoInfo[0][i] + ")"}
                    </th>
                    <th className="tableLabelCol">{preAppPersoInfo[1][i]}</th>
                    <th className="tableColonCol">:</th>
                    <th className="tableValueCol">{preAppPersoInfo[2][i]}</th>
                </tr>
            </tbody>
        );
    }

    for (let i = 7; i < 8; i += 1) {
        persoTable5.push(
            <tbody>
                <tr>
                    <th className="tableIndexCol">
                        {preAppPersoInfo[0][i] + ")"}
                    </th>
                    <th className="tableLabelCol">{preAppPersoInfo[1][i]}</th>
                    <th className="tableColonCol">:</th>
                    <th className="tableValueCol">{preAppPersoInfo[2][i]}</th>
                </tr>
            </tbody>
        );
    }

    for (let i = 8; i < 9; i += 1) {
        persoTable6.push(
            <tbody>
                <tr>
                    <th className="tableIndexCol">
                        {preAppPersoInfo[0][i] + ")"}
                    </th>
                    <th className="tableLabelCol">{preAppPersoInfo[1][i]}</th>
                    <th className="tableColonCol">:</th>
                    <th className="tableValueCol">{preAppPersoInfo[2][i]}</th>
                </tr>
            </tbody>
        );
    }

    const servTable = [];
    const servTable2 = [];

    for (let i = 0; i < 5; i += 2) {
        servTable.push(
            <tbody>
                <tr>
                    <th className="tableIndexCol">
                        {preAppServInfo[0][i] + ")"}
                    </th>
                    <th className="tableLabelCol">{preAppServInfo[1][i]}</th>
                    <th className="tableColonCol">:</th>
                    <th className="tableValueCol">{preAppServInfo[2][i]}</th>
                </tr>
            </tbody>
        );
    }

    for (let i = 1; i < 5; i += 2) {
        servTable2.push(
            <tbody>
                <tr>
                    <th className="tableIndexCol">
                        {preAppServInfo[0][i] + ")"}
                    </th>
                    <th className="tableLabelCol">{preAppServInfo[1][i]}</th>
                    <th className="tableColonCol">:</th>
                    <th className="tableValueCol">{preAppServInfo[2][i]}</th>
                </tr>
            </tbody>
        );
    }

    const salTable = [];

    for (let i = 1; i < 5; i++) {
        salTable.push(
            createSalaryData(
                preAppSalInfo[0][i],
                preAppSalInfo[1][i],
                nf.format(preAppSalInfo[2][i]),
                nf.format(preAppSalInfo[3][i]),
                nf.format(preAppSalInfo[4][i])
            )
        );
    }

    const loanTable = [];

    for (let i = 1; i < preAppLoanInfo[0].length; i++) {
        loanTable.push(
            createLoanData(
                preAppLoanInfo[0][i],
                preAppLoanInfo[1][i],
                nf.format(preAppLoanInfo[2][i]),
                nf.format(preAppLoanInfo[3][i]),
                nf.format(preAppLoanInfo[4][i]),
                nf.format(preAppLoanInfo[5][i]),
                nf.format(preAppLoanInfo[6][i])
            )
        );
    }

    const lastTable = [];

    for (let i = 0; i < 2; i++) {
        lastTable.push(
            <tbody>
                <tr>
                    <th className="tableIndexCol">{preAppLastInfo[0][i]}</th>
                    <th className="tableLabelCol">{preAppLastInfo[1][i]}</th>
                    <th className="tableValueCol">{preAppLastInfo[2][i]}</th>
                </tr>
            </tbody>
        );
    }

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }, []);

    previewData["DATE_FIRST_JOIN"] = new Date(
        previewData["DATE_FIRST_JOIN"]
    ).toLocaleDateString("en-US");

    previewData["DATE_OF_BIRTH"] = new Date(
        previewData["DATE_OF_BIRTH"]
    ).toLocaleDateString("en-US");

    previewData["DATE_OF_RETIREMENT"] = new Date(
        previewData["DATE_OF_RETIREMENT"]
    ).toLocaleDateString("en-US");

    return (
        <div>
            <div className="previewApp">
                <NavBar hide={{ nav_mid: true }} />

                <div className="pageLabel">
                    Preview Application for {preAppLoanType}
                </div>
                <div className="allField">
                    {isMobile ? (
                        <div className="preBasicFieldMob">
                            <PreviewText
                                label="১. আবেদন-কারীর নাম"
                                value={preAppApplicantName}
                            />

                            <PreviewText
                                label="২. পদবী"
                                value={preAppDesignation}
                            />

                            <PreviewText
                                label="৩. অফিস/বিভাগ"
                                value={preAppOfficeDept}
                            />

                            <PreviewText
                                label="৪. হিসাব নম্বর"
                                value={preAppAccountNo}
                            />
                        </div>
                    ) : (
                        <div className="preBasicFieldwithProPic">
                            <div className="preBasicField">
                                <PreviewText
                                    label="১. আবেদন-কারীর নাম"
                                    value={preAppApplicantName}
                                />

                                <PreviewText
                                    label="৩. অফিস/বিভাগ"
                                    value={preAppOfficeDept}
                                />
                            </div>

                            <div className="preAppProPic">
                                <PreviewText
                                    label="২. পদবী"
                                    value={preAppDesignation}
                                />

                                <PreviewText
                                    label="৪. হিসাব নম্বর"
                                    value={preAppAccountNo}
                                />

                                {/* <img className='preAppProImg' src={preAppPhoto} /> */}
                            </div>
                        </div>
                    )}
                    <>
                        <PreviewText
                            label="৫. যে ঋণের জন্যে আবেদন করা হয়েছে"
                            value={preAppLoanType}
                        />

                        <PreviewText
                            label="৬. আবেদনকৃত ঋণের পরিমাণ"
                            value={
                                nf.format(preAppLoanAmnt) +
                                " ( " +
                                InWords(preAppLoanAmnt) +
                                ")"
                            }
                        />

                        <PreviewText
                            label="৭. আবেদনকৃত ঋণ গ্রহণের কারণ"
                            value={preAppLoanReas}
                        />
                    </>

                    <div className="prePersInfo">
                        <div className="prePersInfoLabel">
                            ৮. ব্যক্তিগত তথ্যাবলী :
                        </div>

                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                flexBasis: "50%",
                            }}
                        >
                            <table>{persoTable}</table>
                            <table>{persoTable2}</table>
                        </div>
                        <table>{persoTable3}</table>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                flexBasis: "50%",
                            }}
                        >
                            <table>{persoTable4}</table>
                            <table>{persoTable5}</table>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                width: isMobile ? "100%" : "50%",
                            }}
                        >
                            <table>{persoTable6}</table>
                        </div>
                    </div>

                    <div className="prePersInfo">
                        <div className="prePersInfoLabel">
                            ৯. আবেদনকারীর চাকুরী সংক্রান্ত তথ্যাবলী :
                        </div>

                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                flexBasis: "50%",
                            }}
                        >
                            <table>{servTable}</table>
                            <table>{servTable2}</table>
                        </div>
                    </div>

                    <div className="prePersInfo">
                        <div className="prePersInfoLabel">
                            ১০. বেতন সংক্রান্ত তথ্যাবলী (বিগত তিন মাসের) :
                        </div>
                        <TableContainer component={Paper}>
                            <Table aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell
                                            align="center"
                                            className="pa_bold"
                                        >
                                            {preAppSalInfo[0][0]}
                                        </TableCell>
                                        <TableCell
                                            align="center"
                                            className="pa_bold"
                                        >
                                            {preAppSalInfo[1][0]}
                                        </TableCell>
                                        <TableCell
                                            align="center"
                                            className="pa_bold"
                                        >
                                            {preAppSalInfo[2][0]}
                                        </TableCell>
                                        <TableCell
                                            align="center"
                                            className="pa_bold"
                                        >
                                            {preAppSalInfo[3][0]}
                                        </TableCell>
                                        <TableCell
                                            align="center"
                                            className="pa_bold"
                                        >
                                            {preAppSalInfo[4][0]}
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {salTable.map((row) => (
                                        <TableRow
                                            key={row.serialNo}
                                            sx={{
                                                "&:last-child td, &:last-child th":
                                                    {
                                                        border: 0,
                                                    },
                                            }}
                                        >
                                            <TableCell
                                                component="th"
                                                scope="row"
                                                align="center"
                                                className="pa_bold"
                                            >
                                                {row.serialNo}
                                            </TableCell>
                                            <TableCell
                                                align="center"
                                                className="pa_reg"
                                            >
                                                {row.loanMonth}
                                            </TableCell>
                                            <TableCell
                                                align="center"
                                                className="pa_reg"
                                            >
                                                {row.loanPrevMonth1}
                                            </TableCell>
                                            <TableCell
                                                align="center"
                                                className="pa_reg"
                                            >
                                                {row.loanPrevMonth2}
                                            </TableCell>
                                            <TableCell
                                                align="center"
                                                className="pa_reg"
                                            >
                                                {row.loanPrevMonth3}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>

                    <div className="prePersInfo">
                        <div className="prePersInfoLabel">
                            ১১. বিশ্ববিদ্যালয় ও সোনালী ব্যাংক হতে গৃহীত ঋণের
                            তথ্যাবলী:
                        </div>
                        <TableContainer component={Paper}>
                            <Table
                                sx={{ minWidth: 650 }}
                                aria-label="simple table"
                            >
                                <TableHead>
                                    <TableRow>
                                        <TableCell
                                            align="center"
                                            className="pa_bold"
                                        >
                                            ক্রমিক নং
                                        </TableCell>
                                        <TableCell
                                            align="justified"
                                            className="pa_bold"
                                        >
                                            ঋণের নাম
                                        </TableCell>
                                        <TableCell
                                            align="center"
                                            className="pa_bold"
                                        >
                                            ঋণের পরিমাণ
                                        </TableCell>
                                        <TableCell
                                            align="center"
                                            className="pa_bold"
                                        >
                                            কিস্তির পরিমাণ
                                        </TableCell>
                                        <TableCell
                                            align="center"
                                            className="pa_bold"
                                        >
                                            মোট কিস্তির সংখ্যা
                                        </TableCell>
                                        <TableCell
                                            align="center"
                                            className="pa_bold"
                                        >
                                            পরিশোধিত কিস্তির সংখ্যা
                                        </TableCell>
                                        <TableCell
                                            align="center"
                                            className="pa_bold"
                                        >
                                            অপরিশোধিত ঋণের পরিমাণ (সুদ সহ)
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {loanTable.map((row) => (
                                        <TableRow
                                            key={row.serialNo}
                                            sx={{
                                                "&:last-child td, &:last-child th":
                                                    {
                                                        border: 0,
                                                    },
                                            }}
                                        >
                                            <TableCell
                                                component="th"
                                                scope="row"
                                                align="center"
                                                className="pa_bold"
                                            >
                                                {row.serialNo}
                                            </TableCell>
                                            <TableCell
                                                align="justified"
                                                className={
                                                    row.serialNo == " "
                                                        ? "pa_bold"
                                                        : "pa_reg"
                                                }
                                            >
                                                {row.loanType}
                                            </TableCell>
                                            <TableCell
                                                align="center"
                                                className={
                                                    row.serialNo == " "
                                                        ? "pa_bold"
                                                        : "pa_reg"
                                                }
                                            >
                                                {row.loanAmnt}
                                            </TableCell>
                                            <TableCell
                                                align="center"
                                                className={
                                                    row.serialNo == " "
                                                        ? "pa_bold"
                                                        : "pa_reg"
                                                }
                                            >
                                                {row.instAmnt}
                                            </TableCell>
                                            <TableCell
                                                align="center"
                                                className={
                                                    row.serialNo == " "
                                                        ? "pa_bold"
                                                        : "pa_reg"
                                                }
                                            >
                                                {row.totInstNo}
                                            </TableCell>
                                            <TableCell
                                                align="center"
                                                className={
                                                    row.serialNo == " "
                                                        ? "pa_bold"
                                                        : "pa_reg"
                                                }
                                            >
                                                {row.paidInstNo}
                                            </TableCell>
                                            <TableCell
                                                align="center"
                                                className={
                                                    row.serialNo == " "
                                                        ? "pa_bold"
                                                        : "pa_reg"
                                                }
                                            >
                                                {row.unpaidLoanAmnt}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>

                    <div className="prePersInfo">
                        <div className="prePersInfoLabel">
                            এই মর্মে নিশ্চয়তা দিচ্ছি যে, উপরোক্ত তথ্যাদি
                            সম্পূর্ণ সত্য ও সঠিক এবং নিয়মানুযায়ী গৃহীত ঋণের
                            কিস্তি পরিশোধে বাধ্য থাকিব। অন্যথায় কর্তৃপক্ষ কর্তৃক
                            নির্ধারিত দায়ভার বহন করিতে আপত্তি নেই। ঋণ গ্রহণের
                            পরে যদি কোনো তথ্য বা প্রদত্ত দলিলাদি সঠিক নয় বলে
                            প্রমাণিত হয় তবে সেক্ষেত্রে বিশ্ববিদ্যালয়ের যেকোনো
                            সিদ্ধান্ত বিনা আপত্তিতে মেনে নিতে বাধ্য থাকিব।
                        </div>
                    </div>

                    {/* <div className='preAppSignPic'>
                        <img className='preAppSignImg' src={preAppSign} />
                    </div> */}
                </div>
            </div>

            <Application applicationData={previewData} />

            <Footer />
        </div>
    );
}

{
    /* 
                        <div className="prePersInfo">
                            <div className="prePersInfoLabel">
                                ১২. বিশ্ববিদ্যালয় হইতে আনুমানিক প্রাপ্য (কম্পট্রোলার অফিস পূরণ করবে) :
                            </div>
                            <table>
                                {lastTable}
                            </table>
                            
                        </div> 
    */
}
