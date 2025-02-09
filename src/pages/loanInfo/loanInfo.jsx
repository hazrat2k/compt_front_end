import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import axios from "axios";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import "./loanInfo.css";

import NavBar from "../../component/page_compo/navBar/navBar";
import Footer from "../../component/page_compo/footer/footer";

import ToTitleCase from "../../utils/functions/toTitleCase";

import Logo from "../../component/loan_apply/logo/logo";
import DoubleButton from "../../component/loan_apply/doubleButton/doubleButton";
import useEmployeeDataStore from "../../stores/employeeDataStore";
import useLoanInfoStore from "../../stores/loanInfoStore";

const createData = (
    serialNo,
    loanName,
    loanAmnt,
    instAmnt,
    totInstAmnt,
    paidInstNo,
    unpaidInstAmnt
) => {
    return {
        serialNo,
        loanName,
        loanAmnt,
        instAmnt,
        totInstAmnt,
        paidInstNo,
        unpaidInstAmnt,
    };
};

export default function LoanInfo() {
    const loanNavigate = useNavigate();
    let loan_data = useEmployeeDataStore((state) => state.employeeData);
    const loanField = useLoanInfoStore((state) => state.loanInfo);
    const loanAddLoanField = useLoanInfoStore((state) => state.addLoanField);
    const loan_file = loanField["file"]["loan"];
    const loan_type_file = loanField["file"]["loan_type"];

    const table_data = [
        [
            //গৃহ নির্মাণ/মেরামত/জমি ক্রয়/মোটরযান ক্রয়
            "০১",
            "গৃহ নির্মাণ ঋণ",
            "House Building Loan",
        ],
        ["০২", "ভোগ্যপণ্য ঋণ", "Consumer Loan"],
        ["০৩", "ল্যাপটপ ঋণ", "Laptop Loan"],
        ["০৪", "সোনালী ব্যাংকের হোলসেল ঋণ", "Sonali Bank Whole-Sale Loan"],
        [
            "০৫",
            "সোনালী ব্যাংকের গৃহ নির্মাণ ঋণ",
            "Sonali Bank House Building Loan",
        ],
        ["০৬", "অন্যান্য", "Others"],
        [" ", "মোট"],
    ];

    var loan_table_value = Array.from(Array(7), () => new Array(5).fill(0));

    var jsx_table_data = [];

    let nf = new Intl.NumberFormat("en-IN");

    var data_loan = [];

    for (let i = 0; i < loan_file.length; i++) {
        if (loan_file[i]["REMAINING_AMOUNT"] > 0) {
            data_loan.push(loan_file[i]);
        }
    }

    const checkLoanType = (loan_type_id) => {
        for (let i = 0; i < loan_type_file.length; i++) {
            if (loan_type_file[i]["LOAN_TYPE_ID"] == loan_type_id) {
                return loan_type_file[i]["LOAN_TYPE_NAME"];
            }
        }
    };

    for (let i = 0; i < data_loan.length; i++) {
        for (let j = 0; j < 7; j++) {
            var temp = checkLoanType(data_loan[i]["LOAN_TYPE_ID"]);

            if (temp.includes(table_data[j][2])) {
                loan_table_value[j][0] += Number(
                    data_loan[i]["TOTAL_AMOUNT_TO_REF"]
                );
                loan_table_value[j][1] += Number(
                    data_loan[i]["AMOUNT_OF_INSTALLMENT"]
                );
                loan_table_value[j][2] += Number(
                    data_loan[i]["NO_OF_INSTALLMENT"]
                );

                var temp =
                    Number(data_loan[i]["TOTAL_AMOUNT_TO_REF"]) -
                    Number(data_loan[i]["REMAINING_AMOUNT"]);
                temp -= Number(data_loan[i]["FIRST_INSTALLMENT"]);
                temp /= Number(data_loan[i]["AMOUNT_OF_INSTALLMENT"]);
                temp++;

                loan_table_value[j][3] += Math.round(temp);
                loan_table_value[j][4] += Number(
                    data_loan[i]["REMAINING_AMOUNT"]
                );

                loan_table_value[6][0] += Number(
                    data_loan[i]["TOTAL_AMOUNT_TO_REF"]
                );
                loan_table_value[6][1] += Number(
                    data_loan[i]["AMOUNT_OF_INSTALLMENT"]
                );
                loan_table_value[6][2] += Number(
                    data_loan[i]["NO_OF_INSTALLMENT"]
                );
                loan_table_value[6][3] += Math.round(temp);
                loan_table_value[6][4] += Number(
                    data_loan[i]["REMAINING_AMOUNT"]
                );
            }
        }
    }

    for (let i = 0; i < table_data.length; i++) {
        var loan_amount = "loanAmount" + i;
        var installment_amount = "installationAmount" + i;
        var total_installment_number = "totalInstallmentNumber" + i;
        var refined_installment_number = "refinedInstallmentNumber" + i;
        var unrefined_loan_amount = "unrefinedLoanAmount" + i;

        jsx_table_data.push(
            <tbody>
                <tr>
                    <td className="tableText">{table_data[i][0]}</td>
                    <td className="tableText">{table_data[i][1]}</td>
                    <td>
                        <input
                            className="tableDataInput"
                            type="text"
                            value={nf.format(loan_table_value[i][0])}
                            name={loan_amount}
                        />
                    </td>
                    <td>
                        <input
                            className="tableDataInput"
                            type="text"
                            value={nf.format(loan_table_value[i][1])}
                            name={installment_amount}
                        />
                    </td>
                    <td>
                        <input
                            className="tableDataInput"
                            type="text"
                            value={nf.format(loan_table_value[i][2])}
                            name={total_installment_number}
                        />
                    </td>
                    <td>
                        <input
                            className="tableDataInput"
                            type="text"
                            value={nf.format(loan_table_value[i][3])}
                            name={refined_installment_number}
                        />
                    </td>
                    <td>
                        <input
                            className="tableDataInput"
                            type="text"
                            value={nf.format(loan_table_value[i][4])}
                            name={unrefined_loan_amount}
                        />
                    </td>
                </tr>
            </tbody>
        );
    }

    const rows = [];

    for (let i = 0; i < loan_table_value.length; i++) {
        rows.push(
            createData(
                table_data[i][0],
                table_data[i][1],
                loan_table_value[i][0],
                loan_table_value[i][1],
                loan_table_value[i][2],
                loan_table_value[i][3],
                loan_table_value[i][4],
                loan_table_value[i][5],
                loan_table_value[i][6]
            )
        );
    }

    loan_table_value = loan_table_value[0].map((_, colIndex) =>
        loan_table_value.map((row) => row[colIndex])
    );

    const onLoanAuthenticate = (button) => {
        if (button == "first") {
            loanNavigate("/application/3");
        }

        if (button == "second") {
            loanNavigate("/application/preview");
        }
    };

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        loanAddLoanField("LOAN_DETAILS", loan_table_value);
    }, []);

    return (
        <div>
            <NavBar hide={{ nav_mid: true }} />

            <div className="loan_info">
                <div className="basic_label">
                    {loanField["LOAN_TYPE"]} Application Form
                </div>

                <div className="loanInfo">
                    <div className="loanInfoLabel">
                        ১০. বিশ্ববিদ্যালয় ও সোনালী ব্যাংক হতে গৃহীত ঋণের
                        তথ্যাবলী :
                    </div>
                    <div className="loanInfoTable">
                        <TableContainer component={Paper}>
                            <Table
                                sx={{ minWidth: 650 }}
                                aria-label="simple table"
                            >
                                <TableHead>
                                    <TableRow>
                                        <TableCell
                                            align="center"
                                            className="sal_bold"
                                        >
                                            ক্রমিক নং
                                        </TableCell>
                                        <TableCell
                                            align="center"
                                            className="sal_bold"
                                        >
                                            ঋণের নাম
                                        </TableCell>
                                        <TableCell
                                            align="center"
                                            className="sal_bold"
                                        >
                                            ঋণের পরিমাণ
                                        </TableCell>
                                        <TableCell
                                            align="center"
                                            className="sal_bold"
                                        >
                                            কিস্তির পরিমাণ
                                        </TableCell>
                                        <TableCell
                                            align="center"
                                            className="sal_bold"
                                        >
                                            মোট কিস্তির সংখ্যা
                                        </TableCell>
                                        <TableCell
                                            align="center"
                                            className="sal_bold"
                                        >
                                            পরিশোধিত কিস্তির সংখ্যা
                                        </TableCell>
                                        <TableCell
                                            align="center"
                                            className="sal_bold"
                                        >
                                            অপরিশোধিত ঋণের পরিমাণ (সুদ সহ)
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rows.map((row) => (
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
                                                className="sal_bold"
                                            >
                                                {row.serialNo}
                                            </TableCell>
                                            <TableCell
                                                align="justified"
                                                className={
                                                    row.serialNo == " "
                                                        ? "sal_bold"
                                                        : "sal_reg"
                                                }
                                            >
                                                {row.loanName}
                                            </TableCell>
                                            <TableCell
                                                align="center"
                                                className={
                                                    row.serialNo == " "
                                                        ? "sal_bold"
                                                        : "sal_reg"
                                                }
                                            >
                                                {row.loanAmnt}
                                            </TableCell>
                                            <TableCell
                                                align="center"
                                                className={
                                                    row.serialNo == " "
                                                        ? "sal_bold"
                                                        : "sal_reg"
                                                }
                                            >
                                                {row.instAmnt}
                                            </TableCell>
                                            <TableCell
                                                align="center"
                                                className={
                                                    row.serialNo == " "
                                                        ? "sal_bold"
                                                        : "sal_reg"
                                                }
                                            >
                                                {row.totInstAmnt}
                                            </TableCell>
                                            <TableCell
                                                align="center"
                                                className={
                                                    row.serialNo == " "
                                                        ? "sal_bold"
                                                        : "sal_reg"
                                                }
                                            >
                                                {row.paidInstNo}
                                            </TableCell>
                                            <TableCell
                                                align="center"
                                                className={
                                                    row.serialNo == " "
                                                        ? "sal_bold"
                                                        : "sal_reg"
                                                }
                                            >
                                                {row.unpaidInstAmnt}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                </div>

                <DoubleButton
                    firstButtonName="Previous"
                    secondButtonName="Next"
                    clickedButton={(clicked) => {
                        onLoanAuthenticate(clicked);
                    }}
                />
            </div>

            <Footer />
        </div>
    );
}
