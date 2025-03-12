import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { redirect } from "react-router-dom";
import axios from "axios";
import loanPersonnel from "../../stores/const/loanPersonnel";
import AppStatus from "../../utils/functions/appStatus";

import "./loanPage.css";
import useLoanTypeStore from "../../stores/loanTypeStore";

import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";

import { dateFormation } from "../../utils/functions/dateFormation";
import NavBar from "../../component/page_compo/navBar/navBar";
import Footer from "../../component/page_compo/footer/footer";
import { backend_site_address } from "../../stores/const/siteAddress";
import usePersonnelDataStore from "../../stores/personnelDataStore";

const pendProcColumns = [
    { id: "loan_id", label: "Loan ID", minWidth: 150, align: "center" },
    {
        id: "applicant_name",
        label: "Applicant Name",
        minWidth: 200,
        align: "center",
    },
    {
        id: "designation",
        label: "Designation",
        minWidth: 100,
        align: "center",
    },
    {
        id: "office",
        label: "Office",
        minWidth: 50,
        align: "center",
    },
    {
        id: "loan_amnt",
        label: "Loan Amount",
        minWidth: 50,
        align: "center",
        format: (value) => value.toLocaleString("en-IN"),
    },
    {
        id: "application_status",
        label: "Application Status",
        minWidth: 100,
        align: "center",
    },
    {
        id: "applied_time",
        label: "Applied Time",
        minWidth: 50,
        align: "center",
    },
];

const sancBillColumns = [
    { id: "loan_id", label: "Loan ID", minWidth: 600, align: "center" },
    {
        id: "total_amount",
        label: "Total Amount",
        minWidth: 100,
        align: "center",
        format: (value) => value.toLocaleString("en-IN"),
    },
    {
        id: "date",
        label: "Processed Date",
        minWidth: 100,
        align: "center",
    },
];

const createPendProcessData = (
    loan_id,
    applicant_name,
    designation,
    office,
    loan_amnt,
    application_status,
    applied_time
) => {
    return {
        loan_id,
        applicant_name,
        designation,
        office,
        loan_amnt,
        application_status,
        applied_time,
    };
};

const createSancBillData = (loan_id, total_amount, date) => {
    return {
        loan_id,
        total_amount,
        date,
    };
};

export default function LoanPage() {
    const pdLoanType = useLoanTypeStore((state) => state.loanType);
    const pdSetLoanType = useLoanTypeStore((state) => state.setLoanType);

    const pd_data = usePersonnelDataStore((state) => state.personnelData);

    const [pendPage, setPendPage] = useState(0);
    const [procPage, setProcPage] = useState(0);

    const [sancPage, setSancPage] = useState(0);
    const [billPage, setBillPage] = useState(0);

    const [pendRowsPerPage, setPendRowsPerPage] = useState(5);
    const [procRowsPerPage, setProcRowsPerPage] = useState(5);

    const [sancRowsPerPage, setSancRowsPerPage] = useState(5);
    const [billRowsPerPage, setBillRowsPerPage] = useState(5);

    const pending_rows = [];
    const processing_rows = [];

    const sanced_rows = [];
    const billed_rows = [];

    const handleChangePendPage = (event, newPage) => {
        setPendPage(newPage);
    };

    const handleChangeProcPage = (event, newPage) => {
        setProcPage(newPage);
    };

    const handleChangeSancPage = (event, newPage) => {
        setSancPage(newPage);
    };

    const handleChangeBillPage = (event, newPage) => {
        setBillPage(newPage);
    };

    const handleChangePendRowsPerPage = (event) => {
        setPendRowsPerPage(+event.target.value);
        setPendPage(0);
    };

    const handleChangeProcRowsPerPage = (event) => {
        setProcRowsPerPage(+event.target.value);
        setProcPage(0);
    };

    const handleChangeSancRowsPerPage = (event) => {
        setSancRowsPerPage(+event.target.value);
        setSancPage(0);
    };

    const handleChangeBillRowsPerPage = (event) => {
        setBillRowsPerPage(+event.target.value);
        setBillPage(0);
    };

    const pd_navigate = useNavigate();

    var sanction_loan_id = {};

    var bill_loan_id = {};

    var pending_loan_status = false;
    var processing_loan_status = false;
    var sanction_loan_status = false;
    var sanctioned_loan_status = false;
    var billed_loan_status = false;
    var bill_loan_status = false;

    const pd_userName = pd_data["USER_ID"];

    const [pd_pend_loan_data, setPd_pend_loan_data] = useState([]);

    const [pd_sanc_loan_data, setPd_sanc_loan_data] = useState([]);

    const [pd_sanced_loan_data, setPd_sanced_loan_data] = useState([]);
    const [pd_billed_loan_data, setPd_billed_loan_data] = useState([]);

    const [pd_pend_loan_id, setPd_pend_loan_id] = useState("");

    const [pd_pend_app_nam, setPd_pend_app_nam] = useState("");

    const fetch_data = async (fd_l_type) => {
        if (fd_l_type != "null") {
            const uploadValue = {
                LOAN_TYPE: fd_l_type,
            };

            try {
                const res = await axios.post(
                    "http://" + backend_site_address + "/processing_loan_info",
                    uploadValue
                );
                setPd_pend_loan_data(res.data);
            } catch (err) {
                console.log(err);
            }

            try {
                const sanc_res = await axios.post(
                    "http://" + backend_site_address + "/sanction_loan",
                    uploadValue
                );
                setPd_sanc_loan_data(sanc_res.data);
            } catch (err) {
                console.log(err);
            }

            try {
                const sanced_res = await axios.post(
                    "http://" + backend_site_address + "/sanctioned_loan",
                    uploadValue
                );
                setPd_sanced_loan_data(sanced_res.data);
            } catch (err) {
                console.log(err);
            }

            try {
                const billed_res = await axios.post(
                    "http://" + backend_site_address + "/billed_loan",
                    uploadValue
                );
                setPd_billed_loan_data(billed_res.data);
            } catch (err) {
                console.log(err);
            }
        }
    };

    useEffect(() => {
        fetch_data(pdLoanType);
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }, []);

    const onPendLoanIDFilter = async (e) => {
        const f_loan_id = e.target.value;

        setPd_pend_loan_id(f_loan_id);

        if (f_loan_id == "") {
            const uploadValue = {
                LOAN_TYPE: pdLoanType,
            };

            try {
                const res = await axios.post(
                    "http://" + backend_site_address + "/processing_loan_info",
                    uploadValue
                );
                setPd_pend_loan_data(res.data);
            } catch (err) {
                console.log(err);
            }
        } else {
            const uploadId = {
                LOAN_ID: f_loan_id,
                LOAN_TYPE: pdLoanType,
            };

            try {
                const res = await axios.post(
                    "http://" +
                        backend_site_address +
                        "/processing_loan_id_filter",
                    uploadId
                );
                setPd_pend_loan_data(res.data);
            } catch (err) {
                console.log(err);
            }
        }
    };

    const onPendAppNamFilter = async (e) => {
        var f_app_nam = e.target.value;

        f_app_nam = f_app_nam.toUpperCase();

        setPd_pend_app_nam(f_app_nam);

        if (f_app_nam == "") {
            const uploadValue = {
                LOAN_TYPE: pdLoanType,
            };

            try {
                const res = await axios.post(
                    "http://" + backend_site_address + "/processing_loan_info",
                    uploadValue
                );
                setPd_pend_loan_data(res.data);
            } catch (err) {
                console.log(err);
            }
        } else {
            const uploadNam = {
                EMPLOYEE_NAME: f_app_nam,
                LOAN_TYPE: pdLoanType,
            };
            try {
                const res = await axios.post(
                    "http://" +
                        backend_site_address +
                        "/processing_app_nam_filter",
                    uploadNam
                );
                setPd_pend_loan_data(res.data);
            } catch (err) {
                console.log(err);
            }
        }
    };

    const onLoanIdClick = async (e, data) => {
        var uploadData = {
            LOAN_ID: data,
        };

        try {
            const info_res = await axios.post(
                "http://" + backend_site_address + "/processing_loan_id_filter",
                uploadData
            );
            data = info_res.data[0];

            const sal_res = await axios.post(
                "http://" + backend_site_address + "/processing_loan_salary",
                uploadData
            );
            data["loan_data"] = sal_res.data;
        } catch (err) {
            console.log(err);
        }

        data["sendFrom"] = pd_data["USER_ID"];
        pd_navigate("/processing_loan/loan_details", {
            state: { data: data },
        });
    };

    const onSancedLoanIdClick = (e, data) => {
        const personnel = ["ao_fund", "ad_fund", "dc", "compt", "dc_audit"];

        var sanced_loan_id_str = data;

        sanced_loan_id_str = sanced_loan_id_str.split(", ");

        var clicked_sanced_loan_id = {};

        for (let i = 0; i < sanced_loan_id_str.length; i++) {
            const temp = {};
            temp[sanced_loan_id_str[i]] = true;
            clicked_sanced_loan_id = { ...clicked_sanced_loan_id, ...temp };
        }

        pd_navigate("/processing_loan/sanction_copy", {
            state: {
                app_pos: personnel.indexOf(pd_userName) + 7,
                sanctionedLoan: clicked_sanced_loan_id,
                sentFrom: pd_userName,
            },
        });
    };

    const onBilledLoanIdClick = (e, data) => {
        const personnel = [
            "ao_fund",
            "ad_fund",
            "dc",
            "compt",
            "dc_audit",
            "acct_cash",
        ];
        var billed_loan_id_str = data;

        billed_loan_id_str = billed_loan_id_str.split(", ");

        var clicked_billed_loan_id = {};

        for (let i = 0; i < billed_loan_id_str.length; i++) {
            const temp = {};
            temp[billed_loan_id_str[i]] = true;
            clicked_billed_loan_id = { ...clicked_billed_loan_id, ...temp };
        }

        pd_navigate("/processing_loan/bill_copy", {
            state: {
                app_pos: personnel.indexOf(pd_userName) + 16,
                billedLoan: clicked_billed_loan_id,
                sentFrom: pd_userName,
            },
        });
    };

    for (let i = 0; i < pd_pend_loan_data.length; i++) {
        var temp_status = Number(pd_pend_loan_data[i]["APP_POS"]);

        if (pd_userName === loanPersonnel[temp_status]) {
            pending_loan_status = true;

            pending_rows.push(
                createPendProcessData(
                    pd_pend_loan_data[i]["LOAN_ID"],
                    pd_pend_loan_data[i]["EMPLOYEE_NAME"],
                    pd_pend_loan_data[i]["DESIGNATION"],
                    pd_pend_loan_data[i]["OFFICE"],
                    pd_pend_loan_data[i]["LOAN_AMOUNT"],
                    AppStatus(temp_status),
                    dateFormation(pd_pend_loan_data[i]["LOAN_APP_DATE"])
                )
            );
        } else {
            processing_loan_status = true;

            processing_rows.push(
                createPendProcessData(
                    pd_pend_loan_data[i]["LOAN_ID"],
                    pd_pend_loan_data[i]["EMPLOYEE_NAME"],
                    pd_pend_loan_data[i]["DESIGNATION"],
                    pd_pend_loan_data[i]["OFFICE"],
                    pd_pend_loan_data[i]["LOAN_AMOUNT"],
                    AppStatus(temp_status),
                    dateFormation(pd_pend_loan_data[i]["LOAN_APP_DATE"])
                )
            );
        }
    }

    for (let i = 0; i < pd_sanc_loan_data.length; i++) {
        const temp = {};
        temp[pd_sanc_loan_data[i]["LOAN_ID"]] = false;

        if (pd_sanc_loan_data[i]["SANC_STATUS"] == "IN PROCESS") {
            sanction_loan_status = true;
            sanction_loan_id = { ...sanction_loan_id, ...temp };
        }

        if (pd_sanc_loan_data[i]["SANC_STATUS"] == "BILL") {
            bill_loan_status = true;
            bill_loan_id = { ...bill_loan_id, ...temp };
        }
    }

    for (let i = 0; i < pd_sanced_loan_data.length; i++) {
        var sanced_status = pd_sanced_loan_data[i]["APP_POS"];

        if (pd_userName === loanPersonnel[sanced_status]) {
            sanctioned_loan_status = true;
            sanced_rows.push(
                createSancBillData(
                    pd_sanced_loan_data[i]["LOAN_ID"],
                    pd_sanced_loan_data[i]["TOTAL_AMOUNT"],
                    dateFormation(pd_sanced_loan_data[i]["SANC_DATE"])
                )
            );
        }
    }

    for (let i = 0; i < pd_billed_loan_data.length; i++) {
        var billed_status = pd_billed_loan_data[i]["APP_POS"];

        if (pd_userName === loanPersonnel[billed_status]) {
            billed_loan_status = true;

            billed_rows.push(
                createSancBillData(
                    pd_billed_loan_data[i]["LOAN_ID"],
                    pd_billed_loan_data[i]["TOTAL_AMOUNT"],
                    dateFormation(pd_billed_loan_data[i]["BILL_DATE"])
                )
            );
        }
    }

    const onLoanSelect = async (e) => {
        var selected_type = e.target.value;

        pdSetLoanType(selected_type);

        if (selected_type != "null") {
            const uploadValue = {
                LOAN_TYPE: selected_type,
            };

            try {
                const res = await axios.post(
                    "http://" + backend_site_address + "/processing_loan_info",
                    uploadValue
                );
                setPd_pend_loan_data(res.data);
            } catch (err) {
                console.log(err);
            }

            try {
                const sanc_res = await axios.post(
                    "http://" + backend_site_address + "/sanction_loan",
                    uploadValue
                );
                setPd_sanc_loan_data(sanc_res.data);
            } catch (err) {
                console.log(err);
            }

            try {
                const sanced_res = await axios.post(
                    "http://" + backend_site_address + "/sanctioned_loan",
                    uploadValue
                );
                setPd_sanced_loan_data(sanced_res.data);
            } catch (err) {
                console.log(err);
            }

            try {
                const billed_res = await axios.post(
                    "http://" + backend_site_address + "/billed_loan",
                    uploadValue
                );
                setPd_billed_loan_data(billed_res.data);
            } catch (err) {
                console.log(err);
            }
        }
    };

    const onSanctionClick = (e) => {
        e.preventDefault();
        pd_navigate("/processing_loan/sanction_copy", {
            state: {
                sanctionedLoan: sanction_loan_id,
                sentFrom: pd_userName,
            },
        });
    };

    const onBillClick = (e) => {
        e.preventDefault();
        pd_navigate("/processing_loan/bill_copy", {
            state: {
                billedLoan: bill_loan_id,
                sentFrom: pd_userName,
            },
        });
    };

    return (
        <>
            <NavBar hide={{ nav_mid: true }} />
            <div className="personnel_dashboard">
                {pdLoanType === "" ? (
                    <div className="pd_page_label">Loan Processing</div>
                ) : (
                    <div className="pd_page_label">{pdLoanType} Processing</div>
                )}

                <select
                    className="pd_select"
                    onChange={onLoanSelect}
                    defaultValue={pdLoanType}
                >
                    <option value="">Select a Loan Type......</option>
                    <option value="House Building Loan">
                        House Building Loan
                    </option>
                    <option value="Consumer Loan">Consumer Loan</option>
                    <option value="Laptop Loan">Laptop Loan</option>
                </select>

                {pdLoanType == "" ? (
                    <div className="no_pending_loan">
                        Select a Loan Type to Display
                    </div>
                ) : (
                    <>
                        {pd_userName === "acct_fund" ? (
                            <div className="pd_section">
                                <div className="pd_section_label">
                                    Preview Copy :
                                </div>

                                <div className="pd_section_copy">
                                    {sanction_loan_status ? (
                                        <div
                                            className="pd_butt"
                                            onClick={onSanctionClick}
                                        >
                                            Preview Sanction
                                        </div>
                                    ) : (
                                        <div className="no_pending_loan">
                                            No loan is available for sanction
                                        </div>
                                    )}
                                    {bill_loan_status ? (
                                        <div
                                            className="pd_butt"
                                            onClick={onBillClick}
                                        >
                                            Preview Bill
                                        </div>
                                    ) : (
                                        <div className="no_pending_loan">
                                            No loan is available for billing
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="pd_section">
                                    <div className="pd_section_label">
                                        Sanctioned Loan :
                                    </div>
                                    {sanctioned_loan_status ? (
                                        <Paper
                                            sx={{
                                                width: "98%",
                                                overflow: "hidden",
                                                alignSelf: "center",
                                            }}
                                        >
                                            <TableContainer
                                                sx={{ maxHeight: 440 }}
                                            >
                                                <Table
                                                    stickyHeader
                                                    aria-label="sticky table"
                                                >
                                                    <TableHead>
                                                        <TableRow>
                                                            {sancBillColumns.map(
                                                                (column) => (
                                                                    <TableCell
                                                                        key={
                                                                            column.id
                                                                        }
                                                                        align={
                                                                            column.align
                                                                        }
                                                                        style={{
                                                                            minWidth:
                                                                                column.minWidth,
                                                                            fontFamily:
                                                                                "PT Serif",
                                                                            fontWeight:
                                                                                "bold",
                                                                            fontSize:
                                                                                "13pt",
                                                                        }}
                                                                    >
                                                                        {
                                                                            column.label
                                                                        }
                                                                    </TableCell>
                                                                )
                                                            )}
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {sanced_rows
                                                            .slice(
                                                                sancPage *
                                                                    sancRowsPerPage,
                                                                sancPage *
                                                                    sancRowsPerPage +
                                                                    sancRowsPerPage
                                                            )
                                                            .map((row) => {
                                                                return (
                                                                    <TableRow
                                                                        hover
                                                                        role="checkbox"
                                                                        tabIndex={
                                                                            -1
                                                                        }
                                                                        key={
                                                                            row.loan_id
                                                                        }
                                                                    >
                                                                        {sancBillColumns.map(
                                                                            (
                                                                                column
                                                                            ) => {
                                                                                const value =
                                                                                    row[
                                                                                        column
                                                                                            .id
                                                                                    ];

                                                                                return column.id ==
                                                                                    "loan_id" ? (
                                                                                    <TableCell
                                                                                        key={
                                                                                            column.id
                                                                                        }
                                                                                        align={
                                                                                            column.align
                                                                                        }
                                                                                        style={{
                                                                                            fontFamily:
                                                                                                "PT Serif",
                                                                                            fontSize:
                                                                                                "11pt",
                                                                                            textDecoration:
                                                                                                "underline",
                                                                                            color: "dodgerblue",
                                                                                            cursor: "pointer",
                                                                                        }}
                                                                                        onClick={(
                                                                                            e
                                                                                        ) =>
                                                                                            onSancedLoanIdClick(
                                                                                                e,
                                                                                                row[
                                                                                                    "loan_id"
                                                                                                ]
                                                                                            )
                                                                                        }
                                                                                    >
                                                                                        {column.format &&
                                                                                        typeof value ===
                                                                                            "number"
                                                                                            ? column.format(
                                                                                                  value
                                                                                              )
                                                                                            : value}
                                                                                    </TableCell>
                                                                                ) : (
                                                                                    <TableCell
                                                                                        key={
                                                                                            column.id
                                                                                        }
                                                                                        align={
                                                                                            column.align
                                                                                        }
                                                                                        style={{
                                                                                            fontFamily:
                                                                                                "PT Serif",
                                                                                            fontSize:
                                                                                                "11pt",
                                                                                        }}
                                                                                    >
                                                                                        {column.format &&
                                                                                        typeof value ===
                                                                                            "number"
                                                                                            ? column.format(
                                                                                                  value
                                                                                              )
                                                                                            : value}
                                                                                    </TableCell>
                                                                                );
                                                                            }
                                                                        )}
                                                                    </TableRow>
                                                                );
                                                            })}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                            <TablePagination
                                                rowsPerPageOptions={[
                                                    1, 5, 10, 15, 20, 25, 50,
                                                    100,
                                                ]}
                                                component="div"
                                                count={sanced_rows.length}
                                                rowsPerPage={sancRowsPerPage}
                                                page={sancPage}
                                                onPageChange={
                                                    handleChangeSancPage
                                                }
                                                onRowsPerPageChange={
                                                    handleChangeSancRowsPerPage
                                                }
                                            />
                                        </Paper>
                                    ) : (
                                        <div className="no_pending_loan">
                                            No Sanctioned Loan
                                        </div>
                                    )}
                                </div>

                                <div className="pd_section">
                                    <div className="pd_section_label">
                                        Billed Loan :
                                    </div>
                                    {billed_loan_status ? (
                                        <Paper
                                            sx={{
                                                width: "98%",
                                                overflow: "hidden",
                                                alignSelf: "center",
                                            }}
                                        >
                                            <TableContainer
                                                sx={{ maxHeight: 440 }}
                                            >
                                                <Table
                                                    stickyHeader
                                                    aria-label="sticky table"
                                                >
                                                    <TableHead>
                                                        <TableRow>
                                                            {sancBillColumns.map(
                                                                (column) => (
                                                                    <TableCell
                                                                        key={
                                                                            column.id
                                                                        }
                                                                        align={
                                                                            column.align
                                                                        }
                                                                        style={{
                                                                            minWidth:
                                                                                column.minWidth,
                                                                            fontFamily:
                                                                                "PT Serif",
                                                                            fontWeight:
                                                                                "bold",
                                                                            fontSize:
                                                                                "13pt",
                                                                        }}
                                                                    >
                                                                        {
                                                                            column.label
                                                                        }
                                                                    </TableCell>
                                                                )
                                                            )}
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {billed_rows
                                                            .slice(
                                                                billPage *
                                                                    billRowsPerPage,
                                                                billPage *
                                                                    billRowsPerPage +
                                                                    billRowsPerPage
                                                            )
                                                            .map((row) => {
                                                                return (
                                                                    <TableRow
                                                                        hover
                                                                        role="checkbox"
                                                                        tabIndex={
                                                                            -1
                                                                        }
                                                                        key={
                                                                            row.loan_id
                                                                        }
                                                                    >
                                                                        {sancBillColumns.map(
                                                                            (
                                                                                column
                                                                            ) => {
                                                                                const value =
                                                                                    row[
                                                                                        column
                                                                                            .id
                                                                                    ];

                                                                                return column.id ==
                                                                                    "loan_id" ? (
                                                                                    <TableCell
                                                                                        key={
                                                                                            column.id
                                                                                        }
                                                                                        align={
                                                                                            column.align
                                                                                        }
                                                                                        style={{
                                                                                            fontFamily:
                                                                                                "PT Serif",
                                                                                            fontSize:
                                                                                                "11pt",
                                                                                            textDecoration:
                                                                                                "underline",
                                                                                            color: "dodgerblue",
                                                                                            cursor: "pointer",
                                                                                        }}
                                                                                        onClick={(
                                                                                            e
                                                                                        ) =>
                                                                                            onBilledLoanIdClick(
                                                                                                e,
                                                                                                row[
                                                                                                    "loan_id"
                                                                                                ]
                                                                                            )
                                                                                        }
                                                                                    >
                                                                                        {column.format &&
                                                                                        typeof value ===
                                                                                            "number"
                                                                                            ? column.format(
                                                                                                  value
                                                                                              )
                                                                                            : value}
                                                                                    </TableCell>
                                                                                ) : (
                                                                                    <TableCell
                                                                                        key={
                                                                                            column.id
                                                                                        }
                                                                                        align={
                                                                                            column.align
                                                                                        }
                                                                                        style={{
                                                                                            fontFamily:
                                                                                                "PT Serif",
                                                                                            fontSize:
                                                                                                "11pt",
                                                                                        }}
                                                                                    >
                                                                                        {column.format &&
                                                                                        typeof value ===
                                                                                            "number"
                                                                                            ? column.format(
                                                                                                  value
                                                                                              )
                                                                                            : value}
                                                                                    </TableCell>
                                                                                );
                                                                            }
                                                                        )}
                                                                    </TableRow>
                                                                );
                                                            })}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                            <TablePagination
                                                rowsPerPageOptions={[
                                                    1, 5, 10, 15, 20, 25, 50,
                                                    100,
                                                ]}
                                                component="div"
                                                count={billed_rows.length}
                                                rowsPerPage={billRowsPerPage}
                                                page={billPage}
                                                onPageChange={
                                                    handleChangeBillPage
                                                }
                                                onRowsPerPageChange={
                                                    handleChangeBillRowsPerPage
                                                }
                                            />
                                        </Paper>
                                    ) : (
                                        <div className="no_pending_loan">
                                            No Billed Loan
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        <div className="pd_section_filter">
                            <input
                                className="pd_section_item_filter"
                                type="text"
                                value={pd_pend_loan_id}
                                placeholder="Search by Loan ID"
                                onChange={onPendLoanIDFilter}
                            />
                            <input
                                className="pd_section_item_filter"
                                type="text"
                                value={pd_pend_app_nam}
                                placeholder="Search by Applicant Name"
                                onChange={onPendAppNamFilter}
                            />
                        </div>

                        <div className="pd_section">
                            <div className="pd_section_label">
                                Pending Loan :
                            </div>

                            {pending_loan_status ? (
                                <Paper
                                    sx={{
                                        width: "98%",
                                        overflow: "hidden",
                                        alignSelf: "center",
                                    }}
                                >
                                    <TableContainer sx={{ maxHeight: 440 }}>
                                        <Table
                                            stickyHeader
                                            aria-label="sticky table"
                                        >
                                            <TableHead>
                                                <TableRow>
                                                    {pendProcColumns.map(
                                                        (column) => (
                                                            <TableCell
                                                                key={column.id}
                                                                align={
                                                                    column.align
                                                                }
                                                                style={{
                                                                    minWidth:
                                                                        column.minWidth,
                                                                    fontFamily:
                                                                        "PT Serif",
                                                                    fontWeight:
                                                                        "bold",
                                                                    fontSize:
                                                                        "13pt",
                                                                }}
                                                            >
                                                                {column.label}
                                                            </TableCell>
                                                        )
                                                    )}
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {pending_rows
                                                    .slice(
                                                        pendPage *
                                                            pendRowsPerPage,
                                                        pendPage *
                                                            pendRowsPerPage +
                                                            pendRowsPerPage
                                                    )
                                                    .map((row) => {
                                                        return (
                                                            <TableRow
                                                                hover
                                                                role="checkbox"
                                                                tabIndex={-1}
                                                                key={
                                                                    row.loan_id
                                                                }
                                                            >
                                                                {pendProcColumns.map(
                                                                    (
                                                                        column
                                                                    ) => {
                                                                        const value =
                                                                            row[
                                                                                column
                                                                                    .id
                                                                            ];

                                                                        return column.id ==
                                                                            "loan_id" ||
                                                                            column.id ==
                                                                                "applicant_name" ? (
                                                                            <TableCell
                                                                                key={
                                                                                    column.id
                                                                                }
                                                                                align={
                                                                                    column.align
                                                                                }
                                                                                style={{
                                                                                    fontFamily:
                                                                                        "PT Serif",
                                                                                    fontSize:
                                                                                        "11pt",
                                                                                    textDecoration:
                                                                                        "underline",
                                                                                    color: "dodgerblue",
                                                                                    cursor: "pointer",
                                                                                }}
                                                                                onClick={(
                                                                                    e
                                                                                ) =>
                                                                                    onLoanIdClick(
                                                                                        e,
                                                                                        row[
                                                                                            "loan_id"
                                                                                        ]
                                                                                    )
                                                                                }
                                                                            >
                                                                                {column.format &&
                                                                                typeof value ===
                                                                                    "number"
                                                                                    ? column.format(
                                                                                          value
                                                                                      )
                                                                                    : value}
                                                                            </TableCell>
                                                                        ) : (
                                                                            <TableCell
                                                                                key={
                                                                                    column.id
                                                                                }
                                                                                align={
                                                                                    column.align
                                                                                }
                                                                                style={{
                                                                                    fontFamily:
                                                                                        "PT Serif",
                                                                                    fontSize:
                                                                                        "11pt",
                                                                                }}
                                                                            >
                                                                                {column.format &&
                                                                                typeof value ===
                                                                                    "number"
                                                                                    ? column.format(
                                                                                          value
                                                                                      )
                                                                                    : value}
                                                                            </TableCell>
                                                                        );
                                                                    }
                                                                )}
                                                            </TableRow>
                                                        );
                                                    })}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    <TablePagination
                                        rowsPerPageOptions={[
                                            1, 5, 10, 15, 20, 25, 50, 100,
                                        ]}
                                        component="div"
                                        count={pending_rows.length}
                                        rowsPerPage={pendRowsPerPage}
                                        page={pendPage}
                                        onPageChange={handleChangePendPage}
                                        onRowsPerPageChange={
                                            handleChangePendRowsPerPage
                                        }
                                    />
                                </Paper>
                            ) : (
                                <div className="no_pending_loan">
                                    No Pending Loan
                                </div>
                            )}
                        </div>

                        <div className="pd_section">
                            <div className="pd_section_label">
                                Processing Loan :
                            </div>

                            {processing_loan_status ? (
                                <Paper
                                    sx={{
                                        width: "98%",
                                        overflow: "hidden",
                                        alignSelf: "center",
                                    }}
                                >
                                    <TableContainer sx={{ maxHeight: 440 }}>
                                        <Table
                                            stickyHeader
                                            aria-label="sticky table"
                                        >
                                            <TableHead>
                                                <TableRow>
                                                    {pendProcColumns.map(
                                                        (column) => (
                                                            <TableCell
                                                                key={column.id}
                                                                align={
                                                                    column.align
                                                                }
                                                                style={{
                                                                    minWidth:
                                                                        column.minWidth,
                                                                    fontFamily:
                                                                        "PT Serif",
                                                                    fontWeight:
                                                                        "bold",
                                                                    fontSize:
                                                                        "13pt",
                                                                }}
                                                            >
                                                                {column.label}
                                                            </TableCell>
                                                        )
                                                    )}
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {processing_rows
                                                    .slice(
                                                        procPage *
                                                            procRowsPerPage,
                                                        procPage *
                                                            procRowsPerPage +
                                                            procRowsPerPage
                                                    )
                                                    .map((row) => {
                                                        return (
                                                            <TableRow
                                                                hover
                                                                role="checkbox"
                                                                tabIndex={-1}
                                                                key={
                                                                    row.loan_id
                                                                }
                                                            >
                                                                {pendProcColumns.map(
                                                                    (
                                                                        column
                                                                    ) => {
                                                                        const value =
                                                                            row[
                                                                                column
                                                                                    .id
                                                                            ];

                                                                        return column.id ==
                                                                            "loan_id" ||
                                                                            column.id ==
                                                                                "applicant_name" ? (
                                                                            <TableCell
                                                                                key={
                                                                                    column.id
                                                                                }
                                                                                align={
                                                                                    column.align
                                                                                }
                                                                                style={{
                                                                                    fontFamily:
                                                                                        "PT Serif",
                                                                                    fontSize:
                                                                                        "11pt",
                                                                                    textDecoration:
                                                                                        "underline",
                                                                                    color: "dodgerblue",
                                                                                    cursor: "pointer",
                                                                                }}
                                                                                onClick={(
                                                                                    e
                                                                                ) =>
                                                                                    onLoanIdClick(
                                                                                        e,
                                                                                        row[
                                                                                            "loan_id"
                                                                                        ]
                                                                                    )
                                                                                }
                                                                            >
                                                                                {column.format &&
                                                                                typeof value ===
                                                                                    "number"
                                                                                    ? column.format(
                                                                                          value
                                                                                      )
                                                                                    : value}
                                                                            </TableCell>
                                                                        ) : (
                                                                            <TableCell
                                                                                key={
                                                                                    column.id
                                                                                }
                                                                                align={
                                                                                    column.align
                                                                                }
                                                                                style={{
                                                                                    fontFamily:
                                                                                        "PT Serif",
                                                                                    fontSize:
                                                                                        "11pt",
                                                                                }}
                                                                            >
                                                                                {column.format &&
                                                                                typeof value ===
                                                                                    "number"
                                                                                    ? column.format(
                                                                                          value
                                                                                      )
                                                                                    : value}
                                                                            </TableCell>
                                                                        );
                                                                    }
                                                                )}
                                                            </TableRow>
                                                        );
                                                    })}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    <TablePagination
                                        rowsPerPageOptions={[
                                            1, 5, 10, 15, 20, 25, 50, 100,
                                        ]}
                                        component="div"
                                        count={processing_rows.length}
                                        rowsPerPage={procRowsPerPage}
                                        page={procPage}
                                        onPageChange={handleChangeProcPage}
                                        onRowsPerPageChange={
                                            handleChangeProcRowsPerPage
                                        }
                                    />
                                </Paper>
                            ) : (
                                <div className="no_pending_loan">
                                    No Processing Loan
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
            <Footer />
        </>
    );
}
