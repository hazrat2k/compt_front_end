import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import "./cashBookReceivePayment.css";
import axios from "axios";

import NavBar from "../../component/page_compo/navBar/navBar";
import Footer from "../../component/page_compo/footer/footer";
import { backend_site_address } from "../../stores/const/siteAddress";

import PropTypes from "prop-types";
import Box from "@mui/material/Box";

import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useTheme } from "@mui/material/styles";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import useCashBookEntryStore from "../../stores/cashBookEntryStore";
import usePersonnelDataStore from "../../stores/personnelDataStore";

import * as XLSX from "xlsx";

/* import jsPDF from "jspdf";
import "jspdf-autotable"; */

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const TablePaginationActions = (props) => {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPageButtonClick = (event) => {
        onPageChange(event, 0);
    };

    const handleBackButtonClick = (event) => {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event) => {
        onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <Box sx={{ flexShrink: 0, ml: 2.5 }}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === "rtl" ? (
                    <LastPageIcon />
                ) : (
                    <FirstPageIcon />
                )}
            </IconButton>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}
                aria-label="previous page"
            >
                {theme.direction === "rtl" ? (
                    <KeyboardArrowRight />
                ) : (
                    <KeyboardArrowLeft />
                )}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === "rtl" ? (
                    <KeyboardArrowLeft />
                ) : (
                    <KeyboardArrowRight />
                )}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === "rtl" ? (
                    <FirstPageIcon />
                ) : (
                    <LastPageIcon />
                )}
            </IconButton>
        </Box>
    );
};

TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
};

const tableStyle = {
    upperHead: {
        fontFamily: "PT Serif",
        fontWeight: "bold",
        fontSize: "16pt",
        color: "green",
        paddingLeft: 5,
        paddingRight: 5,
        paddingTop: 5,
        paddingBottom: 5,
    },

    head: {
        fontFamily: "PT Serif",
        fontWeight: "bold",
        fontSize: "12pt",
        padding: 0,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 4,
        paddingBottom: 4,
        // backgroundColor: "#FF7F7F",
        // width: "80pt",
        // height: "35pt",
    },

    /*  body: {
        fontFamily: "PT Serif",
        padding: 0,
        paddingLeft: 10,
        paddingRight: 10,
        textAlign: "right",
        // height: "35pt",
        // overflow: "hidden", // Prevents text from wrapping
        // textOverflow: "ellipsis", // Enables ellipsis
        // width: "80pt",
    },
    description: {
        fontFamily: "PT Serif",
        padding: 0,
        paddingLeft: 10,
        paddingRight: 10,
        // height: "35pt",
        // overflow: "hidden", // Prevents text from wrapping
        // textOverflow: "ellipsis", // Enables ellipsis
        // display: "block",
        // width: "80pt",
    },

    lastColumn: {
        fontFamily: "PT Serif",
        padding: 0,
        paddingLeft: 10,
        paddingRight: 10,
        cursor: "pointer",
        // color: "blue",
        textDecoration: "underline",
        alignItems: "center",
    }, */
};

export default function CashBookReceivePayment() {
    const cbp_data = usePersonnelDataStore((state) => state.personnelData);
    const cbp_userName = cbp_data["USER_NAME"];
    const cbpNavigation = useNavigate();
    const resetEntryData = useCashBookEntryStore(
        (state) => state.resetEntryData
    );
    const setEntryData = useCashBookEntryStore((state) => state.setEntryData);

    const [cbpAccountList, setCbpAccountList] = useState([]);
    const [cbpAccountName, setCbpAccountName] = useState({});
    const [cbpAccountNo, setCbpAccountNo] = useState("");
    const [openCloseAmt, setOpenCloseAmt] = useState([]);

    const [incomeExpenseList, setIncomeExpenseList] = useState([]);
    const [receivePaymentAmt, setReceivePaymentAmt] = useState([]);
    const [tempIncomeExpenseAccountList, setTempIncomeExpenseAccountList] =
        useState([]);
    // const [incomeAccountList, setIncomeAccountList] = useState([]);

    const [filterDate_1, setFilterDate_1] = useState("");
    const [filterDate_2, setFilterDate_2] = useState("");
    const [transType, setTransType] = useState("");
    const transList = ["Income", "Expense"];

    const [previewData, setPreviewData] = useState([]);
    const [tempPreviewData, setTempPreviewData] = useState([]);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0
            ? Math.max(0, (1 + page) * rowsPerPage - previewData.length)
            : 0;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleEditEntry = (value) => {
        // setEntryData(value);
        cbpNavigation("/cashbook/editentry");
    };

    const cbpFieldItem = (label, value, setValue, type) => {
        return (
            <div className="cbp_section_item">
                <div className="cbp_section_item_label">{label}</div>
                <div className="pd_section_item_colon">:</div>
                <TextField
                    style={{ width: "70%" }}
                    id="standard-basic"
                    variant="standard"
                    type={type}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />
            </div>
        );
    };

    const loadPreviewData = async () => {
        try {
            const resAcc = await axios.get(
                "http://" + backend_site_address + "/account_list"
            );
            setCbpAccountList(resAcc.data);

            //Openning and Closing the account list
            const openCloseBalance = await axios.get(
                "http://" + backend_site_address + "/openningClosing_balance"
            );
            setOpenCloseAmt(openCloseBalance.data);
            //console.log(openCloseBalance.data);
            //Openning and Closing the account list

            const resPay = await axios.get(
                "http://" + backend_site_address + "/get_total_income_expense"
            );
            setReceivePaymentAmt(resPay.data);
            //console.log(setReceivePaymentAmt);
            setTempIncomeExpenseAccountList(resPay.data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        resetEntryData();

        loadPreviewData();
    }, [resetEntryData]);

    const handleFilter = async () => {
        // console.log(cbpAccountName);
    };

    const downloadExcel = () => {
        // Step 1: Opening balance row
        const openingRow = {
            IN_TRANS_ID: "Opening Balance",
            IN_CODE: "",
            IN_DESC: "",
            IN_AMOUNT: openCloseAmt[0]?.CLOSING_BALANCE || 0,
            EX_TRANS_ID: "",
            EX_CODE: "",
            EX_DESC: "",
            EX_AMOUNT: "",
        };

        // Step 2: Combine opening + main data
        const allRows = [openingRow, ...receivePaymentAmt];

        // Step 3: Compute totals
        const totalIN = receivePaymentAmt.reduce(
            (sum, row) => sum + Number(row.IN_AMOUNT || 0),
            0
        );
        const totalEX = receivePaymentAmt.reduce(
            (sum, row) => sum + Number(row.EX_AMOUNT || 0),
            0
        );
        const opening = Number(openCloseAmt[0]?.CLOSING_BALANCE || 0);
        const finalIncome = Number(totalIN + opening);

        // Step 4: Summary row
        const summaryRow = {
            IN_TRANS_ID: "Total Income",
            IN_CODE: "",
            IN_DESC: "",
            IN_AMOUNT: finalIncome,
            EX_TRANS_ID: "Total Expense",
            EX_CODE: "",
            EX_DESC: "",
            EX_AMOUNT: totalEX,
        };

        // Step 5: Add summary at the bottom
        allRows.push(summaryRow);

        // Step 6: Export to Excel
        const worksheet = XLSX.utils.json_to_sheet(allRows);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");
        XLSX.writeFile(workbook, "receivePayment.xlsx");
    };

    const downloadPDF = () => {
        const doc = new jsPDF();

        doc.setFontSize(16);
        doc.text("Bangladesh University of Engineering and Technology", 14, 10); // Title at the top

        doc.setFontSize(12);
        doc.text("Oncome and Expense Report", 14, 20); // Subtitle

        const tableColumn = [
            "TransId",
            "MainCodeId",
            "MainCodeDescription",
            "Income Amount",
            "TransId",
            "MainCodeId",
            "MainCodeDescription",
            "Expense Amount",
        ];
        const tableRows = [];

        receivePaymentAmt.forEach((row) => {
            const rowData = [
                row.IN_TRANS_ID,
                row.IN_CODE,
                row.IN_DESC,
                row.IN_AMOUNT,
                row.EX_TRANS_ID,
                row.EX_CODE,
                row.EX_DESC,
                row.EX_AMOUNT,
            ];
            tableRows.push(rowData);
        });

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 30,
        });

        const blob = doc.output("blob");
        const url = URL.createObjectURL(blob);
        window.open(url);
    };

    // Calculate total income and expense amounts start
    const totalIN = receivePaymentAmt.reduce(
        (sum, row) => sum + Number(row.IN_AMOUNT || 0),
        0
    );
    const totalEX = receivePaymentAmt.reduce(
        (sum, row) => sum + Number(row.EX_AMOUNT || 0),
        0
    );
    // Calculate total income and expense amounts end
    return (
        <>
            <NavBar hide={{ nav_mid: true }} />

            <div className="cash_book_dashboard">
                <div className="cb_page_label">Receive Payment</div>
                <div
                    className="cbp_section_items"
                    style={{ alignSelf: "center" }}
                >
                    <div className="section_label" style={{ color: "crimson" }}>
                        Filter :
                    </div>

                    <Select
                        labelId="demo-simple-select-label"
                        style={{
                            width: "150pt",
                            marginRight: "10pt",
                            marginLeft: "20pt",
                            height: "30pt",
                        }}
                        id="demo-simple-select"
                        value={cbpAccountName}
                        onChange={(e) => {
                            const account = cbpAccountList.filter(
                                (item) => item.TAHBIL_NAME === e.target.value
                            );

                            setCbpAccountNo(account[0].ACCOUNT_NO);
                            setCbpAccountName(e.target.value);
                        }}
                    >
                        {cbpAccountList.map((trans) => (
                            <MenuItem
                                key={trans.ACCOUNT_NO}
                                value={trans.TAHBIL_NAME}
                            >
                                {trans.TAHBIL_NAME}
                            </MenuItem>
                        ))}
                    </Select>

                    <>
                        {cbpFieldItem(
                            "From",
                            filterDate_1,
                            setFilterDate_1,
                            "date"
                        )}
                    </>
                    <>
                        {cbpFieldItem(
                            "To",
                            filterDate_2,
                            setFilterDate_2,
                            "date"
                        )}
                    </>

                    <Button variant="contained" onClick={handleFilter}>
                        Filter
                    </Button>
                </div>

                <Box
                    sx={{
                        display: "flex", // Flexbox layout
                        alignSelf: "center",
                        width: "1200px",
                        flexDirection: "row",
                    }}
                >
                    <TableContainer component={Paper}>
                        <Table
                            sx={{
                                maxWidth: 1200,
                            }}
                        >
                            <TableHead>
                                <TableRow>
                                    <TableCell
                                        align="center"
                                        colSpan={4}
                                        style={tableStyle.upperHead}
                                    >
                                        Income
                                    </TableCell>
                                    <TableCell
                                        align="center"
                                        colSpan={4}
                                        style={tableStyle.upperHead}
                                    >
                                        Expense
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell style={tableStyle.head}>
                                        TransId
                                    </TableCell>
                                    <TableCell style={tableStyle.head}>
                                        MainCodeId
                                    </TableCell>
                                    <TableCell style={tableStyle.head}>
                                        MainCodeDescription
                                    </TableCell>
                                    <TableCell style={tableStyle.head}>
                                        Income Amount
                                    </TableCell>
                                    <TableCell style={tableStyle.head}>
                                        TransId
                                    </TableCell>
                                    <TableCell style={tableStyle.head}>
                                        MainCodeId
                                    </TableCell>
                                    <TableCell style={tableStyle.head}>
                                        MainCodeDescription
                                    </TableCell>
                                    <TableCell style={tableStyle.head}>
                                        Expense Amount
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {openCloseAmt.length > 0 && (
                                    <TableRow>
                                        {/* <TableCell colSpan={3} sx={{ py: 0.4 }}>
                                            Opening Balance
                                        </TableCell>
                                        <TableCell
                                            sx={{
                                                textAlign: "right",
                                                py: 0.4,
                                                
                                            }}
                                        >
                                            {openCloseAmt[0].CLOSING_BALANCE}
                                        </TableCell> */}
                                        {/* <TableCell
                                            colSpan={3}
                                            sx={{ fontWeight: "bold" }}
                                        >
                                            Closing Balance
                                        </TableCell>
                                        <TableCell
                                            sx={{
                                                textAlign: "right",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            {openCloseAmt[0].CLOSING_BALANCE}
                                        </TableCell> */}
                                    </TableRow>
                                )}
                                {receivePaymentAmt.map((row, index) => (
                                    <TableRow key={index}>
                                        {
                                            <TableCell sx={{ py: 0.4 }}>
                                                {row.IN_TRANS_ID}
                                            </TableCell>
                                        }
                                        <TableCell sx={{ py: 0.4 }}>
                                            {row.IN_CODE}
                                        </TableCell>
                                        <TableCell sx={{ py: 0.4 }}>
                                            {row.IN_DESC}
                                        </TableCell>
                                        <TableCell
                                            sx={{
                                                py: 0.4,
                                                textAlign: "right",
                                                width: "10%",
                                            }}
                                        >
                                            {row.IN_AMOUNT}
                                        </TableCell>
                                        <TableCell sx={{ py: 0.4 }}>
                                            {row.EX_TRANS_ID}
                                        </TableCell>
                                        <TableCell sx={{ py: 0.4 }}>
                                            {row.EX_CODE}
                                        </TableCell>
                                        <TableCell sx={{ py: 0.4 }}>
                                            {row.EX_DESC}
                                        </TableCell>
                                        <TableCell
                                            sx={{
                                                py: 0.4,
                                                textAlign: "right",
                                            }}
                                        >
                                            {row.EX_AMOUNT}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                <TableRow>
                                    <TableCell
                                        colSpan={3}
                                        sx={{
                                            py: 0.4,
                                            fontWeight: "bold",
                                            textAlign: "right",
                                        }}
                                    >
                                        Total Income
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            py: 0.4,
                                            textAlign: "right",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {/* {(
                                            totalIN +
                                            Number(
                                                openCloseAmt[0]
                                                    ?.CLOSING_BALANCE || 0
                                            )
                                        ).toFixed(0)} */}
                                        {totalIN.toFixed(0)}
                                    </TableCell>
                                    <TableCell
                                        colSpan={3}
                                        sx={{
                                            py: 0.4,
                                            fontWeight: "bold",
                                            textAlign: "right",
                                        }}
                                    >
                                        Total Expense
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            py: 0.4,
                                            textAlign: "right",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {totalEX.toFixed(0)}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell
                                        colSpan={3}
                                        sx={{
                                            py: 0.4,
                                            fontWeight: "bold",
                                            textAlign: "right",
                                        }}
                                    >
                                        Opening Balance
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            py: 0.4,
                                            textAlign: "right",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {Number(
                                            openCloseAmt[0]?.CLOSING_BALANCE ||
                                                0
                                        ).toFixed(0)}
                                    </TableCell>
                                    <TableCell
                                        colSpan={3}
                                        sx={{
                                            py: 0.4,
                                            fontWeight: "bold",
                                            textAlign: "right",
                                        }}
                                    >
                                        Closing Balance
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            py: 0.4,
                                            textAlign: "right",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {(
                                            totalIN +
                                            Number(
                                                openCloseAmt[0]
                                                    ?.CLOSING_BALANCE || 0
                                            ) -
                                            totalEX
                                        ).toFixed(0)}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell
                                        colSpan={3}
                                        sx={{
                                            py: 0.4,
                                            fontWeight: "bold",
                                            textAlign: "right",
                                        }}
                                    >
                                        Grand Total
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            py: 0.4,
                                            textAlign: "right",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {(
                                            totalIN +
                                            Number(
                                                openCloseAmt[0]
                                                    ?.CLOSING_BALANCE || 0
                                            )
                                        ).toFixed(0)}
                                    </TableCell>
                                    <TableCell
                                        colSpan={3}
                                        sx={{
                                            py: 0.4,
                                            fontWeight: "bold",
                                            textAlign: "right",
                                        }}
                                    >
                                        Grand Total
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            py: 0.4,
                                            textAlign: "right",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {(
                                            totalIN +
                                            Number(
                                                openCloseAmt[0]
                                                    ?.CLOSING_BALANCE || 0
                                            )
                                        ).toFixed(0)}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
                <div className="ld_button">
                    <div className="ld_forward" onClick={downloadPDF}>
                        PDF File
                    </div>
                    <div className="ld_forward" onClick={downloadExcel}>
                        Excel File
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}
