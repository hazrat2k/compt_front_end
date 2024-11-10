import React, { useEffect, useMemo, useState } from "react";
import "./salaryInfo.css";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";


const createData = (month, basicSal, totalSal, totalDeduct, netSal) => {
    return { month, basicSal, totalSal, totalDeduct, netSal };
};

export default function SalaryInfo(props) {
    const salary_data = props.salary_data;
    const salary_file = props.salary_file;

    var mydate = new Date();
    var month = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];
    var prevMonthName = [];
    var currYear = mydate.getFullYear();
    var currMonth = mydate.getMonth();
    var prevMonthSal = [];
    const salText = [
        "ক) মূল বেতন : ",
        "খ) মোট বেতন : ",
        "গ) মোট কর্তন : ",
        "ঘ) নীট বেতন : ",
    ];

    const salData = [];

    let nf = new Intl.NumberFormat("en-US");

    for (let i = 0; i < salary_file.length; i++) {
        prevMonthSal.push([
            salary_file[i]["EMPLOYEE_BASIC"],
            salary_file[i]["GROSS_SALARY"],
            salary_file[i]["TOTAL_DEDUCTION"],
            salary_file[i]["NET_SALARY"],
        ]);
    }

    if (prevMonthSal.length != 0) {
        prevMonthSal = prevMonthSal.map((row) => row).reverse();
        var prevMonSal = [];
        var j = 0;

        for (let i = 2; i >= 0; i--) {
            prevMonthName.push(
                month[salary_file[i]["MONTH"] - 1] +
                    " " +
                    salary_file[i]["YEAR"]
            );
            prevMonSal.push([prevMonthName[j]]);
            prevMonSal[j] = [...prevMonSal[j], ...prevMonthSal[j]];
            j++;
        }
    }

    var prevSal = { PREV_MON_SAL: prevMonSal };


    const rows = [];

    for (let i = 0; i < prevMonSal.length; i++) {
        rows.push(
            createData(
                prevMonSal[i][0],
                prevMonSal[i][1],
                prevMonSal[i][2],
                prevMonSal[i][3],
                prevMonSal[i][4]
            )
        );
    }

    props.setSalData(prevSal);

    return (
        <div className="salaryInfo">
            <div className="salaryInfoLabel">
                ৯. বেতন সংক্রান্ত তথ্যাবলী (বিগত তিন মাসের) :
            </div>
            {/* <div className="fullTable">
                <table>
                    <thead>
                        <tr className="tableHead">
                            <th className="tableText">মাস</th>

                            <th>
                                <div className="tableDataInput">
                                    {" "}
                                    {prevMonthName[0]}{" "}
                                </div>
                            </th>
                            <th>
                                <div className="tableDataInput">
                                    {" "}
                                    {prevMonthName[1]}{" "}
                                </div>
                            </th>
                            <th>
                                <div className="tableDataInput">
                                    {" "}
                                    {prevMonthName[2]}{" "}
                                </div>
                            </th>
                        </tr>
                    </thead>

                    {salData}
                </table>
            </div> */}
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center" className="sal_bold">
                                মাস
                            </TableCell>
                            <TableCell align="center" className="sal_bold">
                                মূল বেতন
                            </TableCell>
                            <TableCell align="center" className="sal_bold">
                                মোট বেতন
                            </TableCell>
                            <TableCell align="center" className="sal_bold">
                                মোট কর্তন
                            </TableCell>
                            <TableCell align="center" className="sal_bold">
                                নীট বেতন
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <TableRow
                                key={row.month}
                                sx={{
                                    "&:last-child td, &:last-child th": {
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
                                    {row.month}
                                </TableCell>
                                <TableCell align="center" className="sal_reg">
                                    {row.basicSal}
                                </TableCell>
                                <TableCell align="center" className="sal_reg">
                                    {row.totalSal}
                                </TableCell>
                                <TableCell align="center" className="sal_reg">
                                    {row.totalDeduct}
                                </TableCell>
                                <TableCell align="center" className="sal_reg">
                                    {row.netSal}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}
