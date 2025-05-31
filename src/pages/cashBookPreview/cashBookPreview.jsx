import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import "./cashBookPreview.css";
import axios from "axios";
import moment from "moment";

import NavBar from "../../component/page_compo/navBar/navBar";
import Footer from "../../component/page_compo/footer/footer";
import { backend_site_address } from "../../stores/const/siteAddress";
import editIcon from "../../assets/images/edit.png";

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
    head: {
        fontFamily: "PT Serif",
        fontWeight: "bold",
        padding: 0,
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: "#FF7F7F",
        width: "80pt",
        height: "35pt",
    },

    body: {
        fontFamily: "PT Serif",
        padding: 0,
        paddingLeft: 10,
        paddingRight: 10,
        height: "35pt",
        overflow: "hidden", // Prevents text from wrapping
        textOverflow: "ellipsis", // Enables ellipsis
        width: "80pt",
    },
    description: {
        fontFamily: "PT Serif",
        padding: 0,
        paddingLeft: 10,
        paddingRight: 10,
        height: "35pt",
        overflow: "hidden", // Prevents text from wrapping
        textOverflow: "ellipsis", // Enables ellipsis
        display: "block",
        width: "80pt",
    },

    lastColumn: {
        fontFamily: "PT Serif",
        padding: 0,
        paddingLeft: 10,
        paddingRight: 10,
        cursor: "pointer",
        color: "blue",
        textDecoration: "underline",
        alignItems: "center",
    },
};

export default function CashBookPreview() {
    const cbp_data = usePersonnelDataStore((state) => state.personnelData);
    const cbp_userName = cbp_data["USER_NAME"];
    const cbpNavigation = useNavigate();
    const resetEntryData = useCashBookEntryStore(
        (state) => state.resetEntryData
    );
    const setEntryData = useCashBookEntryStore((state) => state.setEntryData);

    const [approvedList, setApprovedList] = useState({});

    const [cbpAccountList, setCbpAccountList] = useState([]);
    const [cbpAccountName, setCbpAccountName] = useState({});

    const [filterDate_1, setFilterDate_1] = useState("");
    const [filterDate_2, setFilterDate_2] = useState("");
    const [transType, setTransType] = useState("");
    const transList = ["Income", "Expense"];

    const [previewData, setPreviewData] = useState([]);
    const [tempPreviewData, setTempPreviewData] = useState([]);

    const [transactionId, setTransactionId] = useState("");
    const [testData, setTestData] = useState([]);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    let flag = false; // Flag to indicate if transactionId search is active
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
                "http://" + backend_site_address + "/get_unapproved_transaction"
            );
            setPreviewData(res.data);
            setTempPreviewData(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        resetEntryData();

        loadPreviewData();
    }, [resetEntryData]);

    // New From Hazrat Ali

    /*     const transIdSrch = async (transactionId) => {
        try {
            const res = await axios.post(
                "http://" + backend_site_address + "/trans_id_search",
                { EntryId: transactionId }
            );
            setTestData(res.data);
        } catch (err) {
            console.log(err);
        }
    }; */
    // End From Hazrat Ali

    const handleFilter = () => {
        let filteredPreviewData = tempPreviewData;

        if (flag === true && transactionId !== "") {
            filteredPreviewData = filteredPreviewData.filter((record) => {
                return record.TRANSACTION_ID == transactionId;
            });
        } else {
            if (cbpAccountName !== "") {
                filteredPreviewData = filteredPreviewData.filter((record) => {
                    return record.ACCOUNT_NAME === cbpAccountName;
                });
            }

            if (transType !== "") {
                filteredPreviewData = filteredPreviewData.filter((record) => {
                    if (transType === "Income") {
                        return record.INCOME > 0;
                    }
                    if (transType === "Expense") {
                        return record.EXPENSE > 0;
                    }
                });
            }

            if (filterDate_1 !== "" && filterDate_2 !== "") {
                filteredPreviewData = filteredPreviewData.filter((record) => {
                    const from = new Date(filterDate_1);
                    from.setHours(0, 0, 0, 0); // Start of the day (00:00:00)
                    const to = new Date(filterDate_2);
                    to.setHours(23, 59, 59, 999); // End of the day (23:59:59)
                    const recordDate = new Date(record.ENTRY_DATE);
                    recordDate.setHours(0, 0, 0, 0); // Normalize entry date
                    return recordDate >= from && recordDate <= to;
                });
            }
        }
        setPreviewData(filteredPreviewData);
        setPage(0);
    };

    const handleApprove = async () => {
        console.log(approvedList);

        // Convert approvedList object to array format
        const approvedListArray = Object.entries(approvedList).map(
            ([transId, data]) => ({
                transId,
                ...data,
            })
        );

        console.log(approvedListArray);

        // Filter only approved records
        const approvedRecords = approvedListArray.filter(
            (item) => item.approved
        );

        // Send API requests sequentially (recommended for better error handling)
        for (const record of approvedRecords) {
            try {
                const upAppUser = await axios.put(
                    `http://${backend_site_address}/update_approved_user`,
                    {
                        TRANSACTION_ID: record.transId,
                        USERNAME: record.username,
                    }
                );
                console.log("Success:", upAppUser.data);
            } catch (err) {
                console.error("Error updating:", err);
            }
        }
    };

    const handleCheckboxChange = (transId, username) => {
        setApprovedList((prev) => ({
            ...prev,
            [transId]: {
                username: username, // Store username
                approved: !(prev[transId]?.approved || false), // Toggle true/false
            },
        }));
    };

    return (
        <>
            <NavBar hide={{ nav_mid: true }} />

            <div className="cash_book_dashboard">
                <div className="cb_page_label">Cash Book Preview</div>
                <div className="cbp_section_items">
                    <span>TransId:</span>
                    <TextField
                        sx={{
                            width: "10%",
                            "& .MuiInputBase-root": { height: 40 },
                        }}
                        id="standard-basic"
                        variant="outlined"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                //transIdSrch(transactionId);
                                flag = true;
                                handleFilter(transactionId);
                            }
                        }}
                    />

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
                        onChange={(e) => setCbpAccountName(e.target.value)}
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

                    <Select
                        labelId="demo-simple-select-label"
                        style={{
                            width: "80pt",
                            marginRight: "10pt",
                            marginLeft: "20pt",
                            height: "30pt",
                        }}
                        id="demo-simple-select"
                        value={transType}
                        onChange={(e) => setTransType(e.target.value)}
                    >
                        {transList.map((trans) => (
                            <MenuItem key={trans} value={trans}>
                                {trans}
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

                <div className="cbp_section">
                    <TableContainer component={Paper}>
                        <Table
                            sx={{ minWidth: 500 }}
                            aria-label="custom pagination table"
                        >
                            <TableHead>
                                <TableRow>
                                    <TableCell style={tableStyle.head}>
                                        Trans ID
                                    </TableCell>
                                    <TableCell style={tableStyle.head}>
                                        FIN Year
                                    </TableCell>
                                    <TableCell style={tableStyle.head}>
                                        Account No
                                    </TableCell>
                                    <TableCell style={tableStyle.head}>
                                        Account Name
                                    </TableCell>
                                    {/* <TableCell style={tableStyle.head}>
                                        Main Code No
                                    </TableCell> */}
                                    <TableCell style={tableStyle.head}>
                                        Vou/Scr No
                                    </TableCell>
                                    <TableCell style={tableStyle.head}>
                                        Main Head
                                    </TableCell>
                                    {/* <TableCell style={tableStyle.head}>
                                        Sub Code No
                                    </TableCell> */}
                                    <TableCell style={tableStyle.head}>
                                        Voucher_Date
                                    </TableCell>

                                    <TableCell style={tableStyle.head}>
                                        Sub Head
                                    </TableCell>

                                    <TableCell style={tableStyle.head}>
                                        Cheq No
                                    </TableCell>
                                    <TableCell style={tableStyle.head}>
                                        Cheque_Date
                                    </TableCell>
                                    <TableCell style={tableStyle.head}>
                                        Vou Desc
                                    </TableCell>
                                    <TableCell style={tableStyle.head}>
                                        Income
                                    </TableCell>
                                    <TableCell style={tableStyle.head}>
                                        Expense
                                    </TableCell>
                                    <TableCell style={tableStyle.head}>
                                        Entry_Date
                                    </TableCell>
                                    <TableCell style={tableStyle.head}>
                                        Edit
                                    </TableCell>
                                    {/*                                     <TableCell style={tableStyle.head}>
                                        Approved
                                    </TableCell> */}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {(rowsPerPage > 0
                                    ? previewData.slice(
                                          page * rowsPerPage,
                                          page * rowsPerPage + rowsPerPage
                                      )
                                    : previewData
                                ).map((row) => (
                                    <TableRow
                                        key={row.TRANSACTION_ID}
                                        sx={{
                                            backgroundColor:
                                                row.TRANSACTION_ID % 2 == 0
                                                    ? "lightgreen"
                                                    : "lightblue",
                                        }}
                                    >
                                        <TableCell
                                            component="th"
                                            scope="row"
                                            style={tableStyle.body}
                                        >
                                            {row.TRANSACTION_ID}
                                        </TableCell>
                                        <TableCell style={tableStyle.body}>
                                            {row.FIN_YEAR}
                                        </TableCell>
                                        <TableCell style={tableStyle.body}>
                                            {row.ACCOUNT_NO}
                                        </TableCell>
                                        <TableCell
                                            style={tableStyle.description}
                                        >
                                            {row.ACCOUNT_NAME}
                                        </TableCell>

                                        <TableCell style={tableStyle.body}>
                                            {row.VOUCHER_SCROLL_NO}
                                        </TableCell>
                                        <TableCell
                                            style={tableStyle.description}
                                        >
                                            {row.MAIN_CODE_DESCRIPTION}
                                        </TableCell>

                                        <TableCell style={tableStyle.body}>
                                            {moment(row.VOUCHER_DATE).format(
                                                "DD-MM-YYYY"
                                            )}
                                        </TableCell>

                                        <TableCell
                                            style={tableStyle.description}
                                        >
                                            {row.SUB_CODE_DESCRIPTION}
                                        </TableCell>

                                        <TableCell style={tableStyle.body}>
                                            {row.CHK_NO}
                                        </TableCell>
                                        <TableCell style={tableStyle.body}>
                                            {moment(row.CHK_DATE).format(
                                                "DD-MM-YYYY"
                                            )}
                                        </TableCell>

                                        <TableCell
                                            style={tableStyle.description}
                                        >
                                            {row.VOUCHER_DESCRIPTION}
                                        </TableCell>
                                        <TableCell
                                            align="right"
                                            style={tableStyle.body}
                                        >
                                            {row.INCOME}
                                        </TableCell>
                                        <TableCell
                                            align="right"
                                            style={tableStyle.body}
                                        >
                                            {row.EXPENSE}
                                        </TableCell>

                                        <TableCell style={tableStyle.body}>
                                            {moment(row.ENTRY_DATE).format(
                                                "DD-MM-YYYY"
                                            )}
                                        </TableCell>

                                        <TableCell
                                            style={tableStyle.lastColumn}
                                            onClick={() => {
                                                setEntryData(row);
                                                cbpNavigation(
                                                    "/cashbook/editentry"
                                                );
                                            }}
                                        >
                                            <img
                                                src={editIcon}
                                                style={{
                                                    width: "20px",
                                                    height: "20px",
                                                }}
                                                alt="logo"
                                            />
                                        </TableCell>

                                        {/* <TableCell style={tableStyle.body}>
                                            <Checkbox
                                                checked={
                                                    approvedList[
                                                        row.TRANSACTION_ID
                                                    ]?.approved || false
                                                }
                                                onChange={() =>
                                                    handleCheckboxChange(
                                                        row.TRANSACTION_ID,
                                                        cbp_userName
                                                    )
                                                }
                                                inputProps={{
                                                    "aria-label": "controlled",
                                                }}
                                            />
                                        </TableCell> */}
                                    </TableRow>
                                ))}
                                {emptyRows > 0 && (
                                    <TableRow
                                        style={{ height: 53 * emptyRows }}
                                    >
                                        <TableCell colSpan={6} />
                                    </TableRow>
                                )}
                            </TableBody>
                            <TableFooter>
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
                            </TableFooter>
                        </Table>
                    </TableContainer>
                </div>
                {/*                 <div className="ld_button">
                    <div className="ld_forward" onClick={handleApprove}>
                        Approve
                    </div>
                </div> */}
            </div>

            <Footer />
        </>
    );
}
