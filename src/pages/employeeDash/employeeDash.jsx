import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useMediaQuery } from "react-responsive";
import axios from "axios";
import moment from "moment";

import useLoanInfoStore from "../../stores/loanInfoStore";
import AppStatus from "../../utils/functions/appStatus";

import PropTypes from "prop-types";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import "./employeeDash.css";

import ToTitleCase from "../../utils/functions/toTitleCase";

import NavBar from "../../component/page_compo/navBar/navBar";
import Footer from "../../component/page_compo/footer/footer";

import DataField from "../../component/loan_apply/dataField/dataField";
import { Typography } from "@mui/material";
import { backend_site_address } from "../../stores/const/siteAddress";
import useEmployeeDataStore from "../../stores/employeeDataStore";

let nf = new Intl.NumberFormat("en-IN");

const createPlData = (loanId, loanType, loanAmnt, applyDate, loanStatus) => {
    return { loanId, loanType, loanAmnt, applyDate, loanStatus };
};

const createRlData = (
    loanId,
    loanType,
    totalRefAmnt,
    instAmnt,
    remAmnt,
    loanDate
) => {
    return { loanId, loanType, totalRefAmnt, instAmnt, remAmnt, loanDate };
};

const loanTypes = [
    "House Building Loan",
    "Consumer Loan",
    "Laptop Loan",
    "SBL House Loan",
    "SBL Multipurpose Loan",
];

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

const LoanApply = (props) => {
    const { onLoanApplyClose, selectedValue, loanApplyOpen } = props;
    const edNavigate = useNavigate();

    const addLoanApplyField = useLoanInfoStore((state) => state.addLoanField);

    const [laDialogError, setLaDialogError] = useState("");
    const [laDEColor, setLaDEColor] = useState(false);

    const employ_data = props.data;

    const handleLoanApplyClose = () => {
        setLaDialogError("");
        onLoanApplyClose();
    };

    const checkValidation = (loanType, runningLoan) => {
        const duration = duration_calculation(employ_data["DATE_FIRST_JOIN"]);

        if (loanType == "House Building Loan") {
            if (runningLoan.length != 0) {
                setLaDEColor(!laDEColor);
                if (runningLoan[0].REMAINING_AMOUNT > 0) {
                    setLaDialogError(
                        "You already have a " + loanType + " running."
                    );
                } else {
                    setLaDialogError(
                        "You already have taken a " +
                            loanType +
                            " on " +
                            moment(runningLoan[0]["DATE_OF_LOAN"]).format(
                                "DD MMM YYYY"
                            ) +
                            ". " +
                            loanType +
                            " can be taken once in a sevice period."
                    );
                }
                return false;
            }
            // whether service period is more than 10 years or not.
            else if (duration["year"] < 10) {
                setLaDEColor(!laDEColor);
                setLaDialogError(
                    "Service period needs to be more than 10 years for " +
                        loanType +
                        ". Yours is " +
                        duration["year"] +
                        " years, " +
                        duration["month"] +
                        " months, " +
                        duration["day"] +
                        " days"
                );
                return false;
            } else {
                setLaDialogError("");
            }
        } else if (loanType == "Consumer Loan") {
            if (runningLoan.length != 0) {
                for (let i = 0; i < runningLoan.length; i++) {
                    if (runningLoan[i].REMAINING_AMOUNT > 0) {
                        setLaDEColor(!laDEColor);
                        setLaDialogError(
                            "You already have a " + loanType + " running."
                        );
                        return false;
                    }
                }
                // runningLoan.map((loan) => {
                //     if (loan.REMAINING_AMOUNT > 0) {
                //         setLaDEColor(!laDEColor);
                //         setLaDialogError(
                //             "You already have a " + loanType + " running."
                //         );
                //         console.log("Returned False");
                //         return false;
                //     }
                // });
            } else if (duration["year"] < 5) {
                setLaDEColor(!laDEColor);
                setLaDialogError(
                    "Service period needs to be more than 5 years for " +
                        loanType +
                        ". Yours is " +
                        duration["year"] +
                        " years, " +
                        duration["month"] +
                        " months, " +
                        duration["day"] +
                        " days"
                );
                return false;
            } else {
                setLaDialogError("");
            }
        } else if (loanType == "Laptop Loan") {
            if (runningLoan.length != 0) {
                let loanDate = 0;
                runningLoan.map((loan) => {
                    const loanDateValue = new Date(loan.DATE_OF_LOAN).valueOf();
                    loanDate =
                        loanDateValue > loanDate ? loanDateValue : loanDate;
                    if (loan.REMAINING_AMOUNT > 0) {
                        setLaDEColor(!laDEColor);
                        setLaDialogError(
                            "You already have a " + loanType + " running."
                        );
                        return false;
                    }
                });
                const laptopLoanPeriod = duration_calculation(loanDate);
                if (laptopLoanPeriod["year"] < 3) {
                    setLaDEColor(!laDEColor);
                    setLaDialogError(
                        "You can reapply after 3 years of paying off the loan. Yours is " +
                            duration["year"] +
                            " years, " +
                            duration["month"] +
                            " months, " +
                            duration["day"] +
                            " days"
                    );
                    return false;
                }
            } else if (duration["year"] < 3) {
                setLaDEColor(!laDEColor);
                setLaDialogError(
                    "Service period needs to be more than 3 years for " +
                        loanType +
                        ". Yours is " +
                        duration["year"] +
                        " years, " +
                        duration["month"] +
                        " months, " +
                        duration["day"] +
                        " days"
                );
                return false;
            } else {
                setLaDialogError("");
            }
        }

        return true;
    };

    const handleListItemClick = async (value) => {
        if (["SBL House Loan", "SBL Multipurpose Loan"].includes(value)) {
            setLaDEColor(!laDEColor);
            setLaDialogError(value + " is not being processed currently.");
        } else {
            setLaDialogError("");

            let runningLoanData = [];
            let processingLoanData = [];

            const loanTypewithEmpID = {
                EMPLOYEEID: employ_data["EMPLOYEEID"],
                LOAN_TYPE: value,
            };

            const loanTypewithSalID = {
                SALARY_ID: employ_data["EMPLOYEEID"],
                LOAN_TYPE: value,
            };

            try {
                const processing_loan_res = await axios.post(
                    "http://" +
                        backend_site_address +
                        "/processing_loan_info_with_emp_id",
                    loanTypewithSalID
                );

                processingLoanData = processing_loan_res.data;
            } catch (err) {
                console.log(err);
            }

            // does have more selected loan processing or not
            if (processingLoanData.length != 0) {
                setLaDEColor(!laDEColor);
                setLaDialogError(
                    "You already have a " + value + " processing."
                );
                return false;
            } else {
                setLaDialogError("");
            }

            try {
                const running_loan_res = await axios.post(
                    "http://" + backend_site_address + "/loan_with_type",
                    loanTypewithEmpID
                );
                runningLoanData = running_loan_res.data;
            } catch (err) {
                console.log(err);
            }

            if (checkValidation(value, runningLoanData)) {
                addLoanApplyField("LOAN_TYPE", value);
                edNavigate("/application/1");
            }
        }

        // onLoanApplyClose(value);
    };

    return (
        <Dialog
            onClose={handleLoanApplyClose}
            open={loanApplyOpen}
            maxWidth="xs"
            fullWidth={true}
        >
            <DialogTitle
                style={{
                    fontWeight: "bold",
                    fontFamily: "PT Serif",
                    textAlign: "center",
                }}
            >
                {props.title}
            </DialogTitle>

            <List sx={{ pt: 0, fontFamily: "PT Serif" }}>
                {loanTypes.map((loanType) => (
                    <ListItem disableGutters key={loanType}>
                        <ListItemButton
                            onClick={() => handleListItemClick(loanType)}
                        >
                            <ListItemText primary={loanType} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>

            {laDialogError == "" ? (
                ""
            ) : (
                <div
                    className="edShowError"
                    style={{ color: laDEColor ? "red" : "crimson" }}
                >
                    {laDialogError}
                </div>
            )}
        </Dialog>
    );
};

const LoanStatus = (props) => {
    const { onLoanStatusClose, selectedValue, loanStatusOpen } = props;

    const proLoan_row = props.proLoan;
    const runLoan_row = props.runLoan;

    const table_text_align = "center";
    const table_text_font = "PT Serif";
    const table_text_font_w = "bold";

    const handleLoanStatusClose = () => {
        onLoanStatusClose();
    };

    return (
        <Dialog
            onClose={handleLoanStatusClose}
            open={loanStatusOpen}
            maxWidth="md"
            fullWidth={true}
        >
            <DialogTitle
                style={{
                    fontWeight: "bold",
                    fontFamily: "PT Serif",
                    textAlign: "center",
                }}
            >
                {props.title}
            </DialogTitle>

            <div className="dia_body">
                <div className="dia_sec_label">Processing Loan :</div>

                {proLoan_row.length == 0 ? (
                    <Typography
                        fontFamily={"PT Serif"}
                        textAlign="center"
                        color="error"
                        marginBottom={"20px"}
                    >
                        No loan is being processed currently
                    </Typography>
                ) : (
                    <TableContainer
                        style={{ marginBottom: "20px" }}
                        component={Paper}
                    >
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell
                                        align={table_text_align}
                                        style={{
                                            fontFamily: table_text_font,
                                            fontWeight: table_text_font_w,
                                        }}
                                    >
                                        Loan ID
                                    </TableCell>

                                    <TableCell
                                        align={table_text_align}
                                        style={{
                                            fontFamily: table_text_font,
                                            fontWeight: table_text_font_w,
                                        }}
                                    >
                                        Loan Type
                                    </TableCell>

                                    <TableCell
                                        align={table_text_align}
                                        style={{
                                            fontFamily: table_text_font,
                                            fontWeight: table_text_font_w,
                                        }}
                                    >
                                        Loan Amount
                                    </TableCell>

                                    <TableCell
                                        align={table_text_align}
                                        style={{
                                            fontFamily: table_text_font,
                                            fontWeight: table_text_font_w,
                                        }}
                                    >
                                        Applied Date
                                    </TableCell>

                                    <TableCell
                                        align={table_text_align}
                                        style={{
                                            fontFamily: table_text_font,
                                            fontWeight: table_text_font_w,
                                        }}
                                    >
                                        Loan Status
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {proLoan_row.map((row) => (
                                    <TableRow
                                        key={row.loanId}
                                        sx={{
                                            "&:last-child td, &:last-child th":
                                                {
                                                    border: 0,
                                                },
                                        }}
                                    >
                                        <TableCell
                                            align={table_text_align}
                                            style={{
                                                fontFamily: table_text_font,
                                            }}
                                            component="th"
                                            scope="row"
                                        >
                                            {row.loanId}
                                        </TableCell>

                                        <TableCell
                                            align={table_text_align}
                                            style={{
                                                fontFamily: table_text_font,
                                            }}
                                        >
                                            {row.loanType}
                                        </TableCell>

                                        <TableCell
                                            align={table_text_align}
                                            style={{
                                                fontFamily: table_text_font,
                                            }}
                                        >
                                            {nf.format(row.loanAmnt)}
                                        </TableCell>

                                        <TableCell
                                            align={table_text_align}
                                            style={{
                                                fontFamily: table_text_font,
                                            }}
                                        >
                                            {row.applyDate}
                                        </TableCell>

                                        <TableCell
                                            align={table_text_align}
                                            style={{
                                                fontFamily: table_text_font,
                                            }}
                                        >
                                            {row.loanStatus}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}

                <div className="dia_sec_label">Running Loan :</div>

                {runLoan_row.length == 0 ? (
                    <Typography
                        fontFamily={"PT Serif"}
                        textAlign="center"
                        color="error"
                    >
                        No loan is running currently
                    </Typography>
                ) : (
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell
                                        align={table_text_align}
                                        style={{
                                            fontFamily: table_text_font,
                                            fontWeight: table_text_font_w,
                                        }}
                                    >
                                        Loan ID
                                    </TableCell>

                                    <TableCell
                                        align={table_text_align}
                                        style={{
                                            fontFamily: table_text_font,
                                            fontWeight: table_text_font_w,
                                        }}
                                    >
                                        Loan Type
                                    </TableCell>

                                    <TableCell
                                        align={table_text_align}
                                        style={{
                                            fontFamily: table_text_font,
                                            fontWeight: table_text_font_w,
                                        }}
                                    >
                                        Total Amount to Return
                                    </TableCell>

                                    <TableCell
                                        align={table_text_align}
                                        style={{
                                            fontFamily: table_text_font,
                                            fontWeight: table_text_font_w,
                                        }}
                                    >
                                        Installment Amount
                                    </TableCell>

                                    <TableCell
                                        align={table_text_align}
                                        style={{
                                            fontFamily: table_text_font,
                                            fontWeight: table_text_font_w,
                                        }}
                                    >
                                        Remaining Amount
                                    </TableCell>

                                    <TableCell
                                        align={table_text_align}
                                        style={{
                                            fontFamily: table_text_font,
                                            fontWeight: table_text_font_w,
                                        }}
                                    >
                                        Date of Loan
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {runLoan_row.map((row) => (
                                    <TableRow
                                        key={row.loanId}
                                        sx={{
                                            "&:last-child td, &:last-child th":
                                                {
                                                    border: 0,
                                                },
                                        }}
                                    >
                                        <TableCell
                                            align={table_text_align}
                                            style={{
                                                fontFamily: table_text_font,
                                            }}
                                            component="th"
                                            scope="row"
                                        >
                                            {row.loanId}
                                        </TableCell>
                                        <TableCell
                                            align={table_text_align}
                                            style={{
                                                fontFamily: table_text_font,
                                            }}
                                        >
                                            {row.loanType}
                                        </TableCell>
                                        <TableCell
                                            align={table_text_align}
                                            style={{
                                                fontFamily: table_text_font,
                                            }}
                                        >
                                            {nf.format(row.totalRefAmnt)}
                                        </TableCell>
                                        <TableCell
                                            align={table_text_align}
                                            style={{
                                                fontFamily: table_text_font,
                                            }}
                                        >
                                            {nf.format(row.instAmnt)}
                                        </TableCell>
                                        <TableCell
                                            align={table_text_align}
                                            style={{
                                                fontFamily: table_text_font,
                                            }}
                                        >
                                            {nf.format(row.remAmnt)}
                                        </TableCell>
                                        <TableCell
                                            align={table_text_align}
                                            style={{
                                                fontFamily: table_text_font,
                                            }}
                                        >
                                            {row.loanDate}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </div>
        </Dialog>
    );
};

LoanApply.propTypes = {
    onLoanApplyClose: PropTypes.func.isRequired,
    loanApplyOpen: PropTypes.bool.isRequired,
    // selectedValue: PropTypes.string.isRequired,
};

LoanStatus.propTypes = {
    onLoanStatusClose: PropTypes.func.isRequired,
    loanStatusOpen: PropTypes.bool.isRequired,
    // selectedValue: PropTypes.string.isRequired,
};

export default function EmployeeDash() {
    const ed_data = useEmployeeDataStore((state) => state.employeeData);

    const isMobile = useMediaQuery({ query: "(max-width: 800px)" });
    const fSize = isMobile ? "14px" : "18px";

    const ed_navigate = useNavigate();

    const plRows = [];
    const rlRows = [];

    const [loanApplyOpen, setLoanApplyOpen] = useState(false);
    const [loanStatusOpen, setLoanStatusOpen] = useState(false);
    // const [selectedValue, setSelectedValue] = useState("");

    const [ed_pro_loan_data, setEd_pro_loan_data] = useState([]);
    const [ed_run_loan_data, setEd_run_loan_data] = useState([]);

    const resetLoanInfo = useLoanInfoStore((state) => state.resetLoanInfo);

    useEffect(() => {
        const diaFetchProLoan = async () => {
            const uploadId = {
                SALARY_ID: ed_data["EMPLOYEEID"],
            };

            const uploadId2 = {
                EMPLOYEEID: ed_data["EMPLOYEEID"],
            };

            try {
                const res = await axios.post(
                    "http://" +
                        backend_site_address +
                        "/processing_loan_info_with_emp_id",
                    uploadId
                );
                setEd_pro_loan_data(res.data);

                const run_res = await axios.post(
                    "http://" + backend_site_address + "/loan_with_type",
                    uploadId2
                );
                setEd_run_loan_data(run_res.data);
            } catch (err) {
                console.log(err);
            }
        };
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        diaFetchProLoan();
        resetLoanInfo();
    }, [resetLoanInfo]);

    for (let i = 0; i < ed_pro_loan_data.length; i++) {
        plRows.push(
            createPlData(
                ed_pro_loan_data[i]["LOAN_ID"],
                ed_pro_loan_data[i]["LOAN_TYPE"],
                ed_pro_loan_data[i]["LOAN_AMOUNT"],
                moment(ed_pro_loan_data[i]["LOAN_APP_DATE"]).format(
                    "DD MMM YYYY"
                ),
                AppStatus(ed_pro_loan_data[i]["APP_POS"])
            )
        );
    }

    for (let i = 0; i < ed_run_loan_data.length; i++) {
        rlRows.push(
            createRlData(
                ed_run_loan_data[i]["LOAN_ID"],
                ed_run_loan_data[i]["LOAN_TYPE_NAME"],
                ed_run_loan_data[i]["TOTAL_AMOUNT_TO_REF"],
                ed_run_loan_data[i]["AMOUNT_OF_INSTALLMENT"],
                ed_run_loan_data[i]["REMAINING_AMOUNT"],
                moment(ed_run_loan_data[i]["DATE_OF_LOAN"]).format(
                    "DD MMM YYYY"
                )
            )
        );
    }

    const onHandleLoanApply = (e) => {
        e.preventDefault();

        setLoanApplyOpen(true);
    };

    const onHandleLoanStatus = (e) => {
        e.preventDefault();
        setLoanStatusOpen(true);
    };

    const handleLoanApplyClose = () => {
        setLoanApplyOpen(false);
    };

    const handleLoanStatusClose = () => {
        setLoanStatusOpen(false);
    };

    return (
        <>
            <NavBar hide={{ nav_mid: true }} />

            <div className="ed_body">
                <div className="ed_label">Employee Dashboard</div>

                <div className="ed_section">
                    <div className="ed_sec_label">Personal Information : </div>
                    <div className="ed_double_items">
                        <DataField
                            type="data"
                            label="Name"
                            value={ed_data["EMPLOYEE_NAME"]}
                            fontSize={fSize}
                        />
                        <DataField
                            type="data"
                            label="Designation"
                            value={ed_data["DESIGNATION"]}
                            fontSize={fSize}
                        />
                    </div>
                    <div className="ed_double_items">
                        <DataField
                            type="data"
                            label="Office"
                            value={ed_data["OFFICE"]}
                            fontSize={fSize}
                        />

                        <DataField
                            type="data"
                            label="BUET ID"
                            value={ed_data["EMPLOYEE_ID"]}
                            fontSize={fSize}
                        />
                    </div>
                </div>

                <div className="ld_button">
                    <div
                        className="ed_button"
                        onClick={() => {
                            ed_navigate("/employeelogin");
                        }}
                    >
                        Log out
                    </div>
                </div>

                <div className="ed_section">
                    <div className="ed_sec_label"> Loan Section : </div>
                    <div className="ed_double_button_items">
                        <div className="ed_button" onClick={onHandleLoanStatus}>
                            Check Loan Status
                        </div>
                        <div className="ed_button" onClick={onHandleLoanApply}>
                            Apply for Loan
                        </div>
                    </div>
                </div>

                <LoanApply
                    // selectedValue={selectedValue}
                    loanApplyOpen={loanApplyOpen}
                    data={ed_data}
                    onLoanApplyClose={handleLoanApplyClose}
                    title="Select Loan to Apply"
                />

                <LoanStatus
                    // selectedValue={selectedValue}
                    loanStatusOpen={loanStatusOpen}
                    proLoan={plRows}
                    runLoan={rlRows}
                    onLoanStatusClose={handleLoanStatusClose}
                    title="Current Loan Status"
                />
            </div>

            <Footer />
        </>
    );
}
