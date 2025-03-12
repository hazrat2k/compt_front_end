import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import "./cashBookReceivePayment.css";
import axios from "axios";
import moment from "moment";

import NavBar from "../../component/page_compo/navBar/navBar";
import Footer from "../../component/page_compo/footer/footer";
import { backend_site_address } from "../../stores/const/siteAddress";
import editIcon from "../../assets/images/edit.png";
import ReceiveMoney from "../../utils/pdfCopy/receiveMoney";

import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useTheme } from "@mui/material/styles";
import Checkbox from "@mui/material/Checkbox";
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
import { blue } from "@mui/material/colors";

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
        padding: 0,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 5,
        paddingBottom: 5,
    },

    head: {
        fontFamily: "PT Serif",
        fontWeight: "bold",
        fontSize: "13pt",
        padding: 0,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 5,
        paddingBottom: 5,
        // backgroundColor: "#FF7F7F",
        // width: "80pt",
        // height: "35pt",
    },

    body: {
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
    },
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

    const [incomeExpenseAccountList, setIncomeExpenseAccountList] = useState(
        []
    );
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

            const res = await axios.get(
                "http://" + backend_site_address + "/get_total_income_expense"
            );
            // setPreviewData(res.data);
            // setTempPreviewData(res.data);
            setIncomeExpenseAccountList(res.data);
            setTempIncomeExpenseAccountList(res.data);
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
                        width: "800px",
                        flexDirection: "row",
                    }}
                >
                    <TableContainer
                        component={Paper}
                        sx={{
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Table
                            sx={{
                                maxWidth: 800,
                                alignSelf: "center",
                                alignItems: "center",
                            }}
                            aria-label="custom pagination table"
                        >
                            <TableHead>
                                <TableRow>
                                    {/* <TableCell
                                        align="center"
                                        colSpan={2}
                                        style={tableStyle.upperHead}
                                    >
                                        Income
                                    </TableCell> */}
                                    <TableCell
                                        align="center"
                                        colSpan={2}
                                        style={tableStyle.upperHead}
                                    >
                                        Income
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell style={tableStyle.head}>
                                        Main Head
                                    </TableCell>
                                    <TableCell
                                        style={tableStyle.head}
                                        sx={{ textAlign: "right" }}
                                    >
                                        Taka
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    // (rowsPerPage > 0
                                    //     ? expenseAccountList.slice(
                                    //           page * rowsPerPage,
                                    //           page * rowsPerPage + rowsPerPage
                                    //       )
                                    //     : previewData
                                    // )
                                    incomeExpenseAccountList
                                        .filter((item) => item.TOTAL_INCOME > 0)
                                        .map((row) => (
                                            <TableRow
                                                key={row.MAIN_CODE_DESCRIPTION}
                                                // sx={{
                                                //     backgroundColor:
                                                //         row.TRANSACTION_ID % 2 == 0
                                                //             ? "lightgreen"
                                                //             : "lightblue",
                                                // }}
                                            >
                                                <TableCell
                                                    style={
                                                        tableStyle.description
                                                    }
                                                >
                                                    {row.MAIN_CODE_DESCRIPTION}
                                                </TableCell>
                                                <TableCell
                                                    style={tableStyle.body}
                                                >
                                                    {row.TOTAL_INCOME}
                                                </TableCell>

                                                {/* {cbp_userName == row.ENTRY_USER ? (
                                            <TableCell
                                                style={{
                                                    fontFamily: "PT Serif",
                                                    padding: 0,
                                                    paddingLeft: 10,
                                                    paddingRight: 10,
                                                    cursor: "pointer",
                                                    color: "blue",
                                                    textDecoration: "underline",
                                                }}
                                                onClick={handleEditEntry}
                                            >
                                                {"Edit"}
                                            </TableCell>
                                        ) : (
                                            <TableCell style={tableStyle.body}>
                                                {"Edit"}
                                            </TableCell>
                                        )} */}
                                            </TableRow>
                                        ))
                                }
                                {emptyRows > 0 && (
                                    <TableRow
                                        style={{ height: 53 * emptyRows }}
                                    >
                                        <TableCell colSpan={6} />
                                    </TableRow>
                                )}
                            </TableBody>
                            {/* <TableFooter>
                                <TableRow>
                                    <TablePagination
                                        rowsPerPageOptions={[
                                            5,
                                            10,
                                            25,
                                            { label: "All", value: -1 },
                                        ]}
                                        colSpan={17}
                                        count={previewData.length}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        slotProps={{
                                            select: {
                                                inputProps: {
                                                    "aria-label":
                                                        "rows per page",
                                                },
                                                native: true,
                                            },
                                        }}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={
                                            handleChangeRowsPerPage
                                        }
                                        ActionsComponent={
                                            TablePaginationActions
                                        }
                                    />
                                </TableRow>
                            </TableFooter> */}
                        </Table>
                    </TableContainer>
                    <TableContainer
                        component={Paper}
                        sx={{
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Table
                            sx={{
                                maxWidth: 800,
                                alignSelf: "center",
                                alignItems: "center",
                            }}
                            aria-label="custom pagination table"
                        >
                            <TableHead>
                                <TableRow>
                                    {/* <TableCell
                                        align="center"
                                        colSpan={2}
                                        style={tableStyle.upperHead}
                                    >
                                        Income
                                    </TableCell> */}
                                    <TableCell
                                        align="center"
                                        colSpan={2}
                                        style={tableStyle.upperHead}
                                    >
                                        Expense
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell style={tableStyle.head}>
                                        Main Head
                                    </TableCell>
                                    <TableCell
                                        style={tableStyle.head}
                                        sx={{ textAlign: "right" }}
                                    >
                                        Taka
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    // (rowsPerPage > 0
                                    //     ? expenseAccountList.slice(
                                    //           page * rowsPerPage,
                                    //           page * rowsPerPage + rowsPerPage
                                    //       )
                                    //     : previewData
                                    // )
                                    incomeExpenseAccountList
                                        .filter(
                                            (item) => item.TOTAL_EXPENSE > 0
                                        )
                                        .map((row) => (
                                            <TableRow
                                                key={row.TRANSACTION_ID}
                                                // sx={{
                                                //     backgroundColor:
                                                //         row.TRANSACTION_ID % 2 == 0
                                                //             ? "lightgreen"
                                                //             : "lightblue",
                                                // }}
                                            >
                                                <TableCell
                                                    style={
                                                        tableStyle.description
                                                    }
                                                >
                                                    {row.MAIN_CODE_DESCRIPTION}
                                                </TableCell>
                                                <TableCell
                                                    style={tableStyle.body}
                                                >
                                                    {row.TOTAL_EXPENSE}
                                                </TableCell>

                                                {/* {cbp_userName == row.ENTRY_USER ? (
                                            <TableCell
                                                style={{
                                                    fontFamily: "PT Serif",
                                                    padding: 0,
                                                    paddingLeft: 10,
                                                    paddingRight: 10,
                                                    cursor: "pointer",
                                                    color: "blue",
                                                    textDecoration: "underline",
                                                }}
                                                onClick={handleEditEntry}
                                            >
                                                {"Edit"}
                                            </TableCell>
                                        ) : (
                                            <TableCell style={tableStyle.body}>
                                                {"Edit"}
                                            </TableCell>
                                        )} */}
                                            </TableRow>
                                        ))
                                }
                                {emptyRows > 0 && (
                                    <TableRow
                                        style={{ height: 53 * emptyRows }}
                                    >
                                        <TableCell colSpan={6} />
                                    </TableRow>
                                )}
                            </TableBody>
                            {/* <TableFooter>
                                <TableRow>
                                    <TablePagination
                                        rowsPerPageOptions={[
                                            5,
                                            10,
                                            25,
                                            { label: "All", value: -1 },
                                        ]}
                                        colSpan={17}
                                        count={previewData.length}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        slotProps={{
                                            select: {
                                                inputProps: {
                                                    "aria-label":
                                                        "rows per page",
                                                },
                                                native: true,
                                            },
                                        }}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={
                                            handleChangeRowsPerPage
                                        }
                                        ActionsComponent={
                                            TablePaginationActions
                                        }
                                    />
                                </TableRow>
                            </TableFooter> */}
                        </Table>
                    </TableContainer>
                </Box>
                <div className="ld_button">
                    <div className="ld_forward">PDF File</div>
                    <div className="ld_forward">Excel File</div>
                </div>
            </div>

            {/* <ReceiveMoney /> */}

            <Footer />
        </>
    );
}
