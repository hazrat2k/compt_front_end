import React, { useState, useEffect, useRef } from "react";
import "./cashBookNewEntry.css";
import axios from "axios";

import NavBar from "../../component/page_compo/navBar/navBar";
import Footer from "../../component/page_compo/footer/footer";
import usePersonnelDataStore from "../../stores/personnelDataStore";

import { Autocomplete, TextField, Snackbar, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Textarea from "@mui/joy/Textarea";
import GetFinancialYear from "../../utils/functions/getFinancialYear";
import { backend_site_address } from "../../stores/const/siteAddress";

export default function CashBookNewEntry() {
    const cb_data = usePersonnelDataStore((state) => state.personnelData);
    const [cb_account_list, setcb_account_list] = useState([]);
    const [cb_account_object, setcb_account_object] = useState(null);
    const [cb_main_code_description, setcb_main_code_description] = useState(
        []
    );
    const [cb_main_code_object, setcb_main_code_object] = useState(null);
    const [cb_sub_code_description, setcb_sub_code_description] = useState([]);
    const [cb_sub_code_object, setcb_sub_code_object] = useState(null);

    const [open, setOpen] = useState(false);
    const mainHeadRef = useRef(null);
    const subHeadRef = useRef(null);

    const voucherNoRef = useRef(null);
    const voucherDateRef = useRef(null);
    const checkNoRef = useRef(null);
    const checkDateRef = useRef(null);
    const incomeRef = useRef(null);
    const expenseRef = useRef(null);

    const descriptionRef = useRef(null);
    const saveButtonRef = useRef(null);

    const cb_userName = cb_data["USER_NAME"];
    const [cbAccountNo, setcbAccountNo] = useState("");
    const [cbAccountName, setcbAccountName] = useState("");
    const [cbMainCodeNo, setcbMainCodeNo] = useState("");
    const [cbMainCodeName, setcbMainCodeName] = useState("");
    const [cbSubCodeNo, setcbSubCodeNo] = useState("");
    const [cbSubCodeName, setcbSubCodeName] = useState("");
    const [cbVoucherDescription, setcbVoucherDescription] = useState("");

    const [cbVoucherScrollNo, setcbVoucherScrollNo] = useState("");
    const [cbVoucherDate, setcbVoucherDate] = useState("");
    const [cbChequeNo, setcbChequeNo] = useState("");
    const [cbChequeDate, setcbChequeDate] = useState("");
    const [cbIncome, setcbIncome] = useState("");
    const [cbExpense, setcbExpense] = useState("");
    const [cbIncomeTrue, setcbIncomeTrue] = useState(true);

    const [cbAccountNameError, setcbAccountNameError] = useState("");
    const [cbMainCodeNameError, setcbMainCodeNameError] = useState("");
    const [cbSubCodeNameError, setcbSubCodeNameError] = useState("");

    const [cbVoucherDescriptionErrorText, setcbVoucherDescriptionErrorText] =
        useState("");
    const [cbVoucherScrollNoErrorText, setcbVoucherScrollNoErrorText] =
        useState("");
    const [cbVoucherDateErrorText, setcbVoucherDateErrorText] = useState("");
    const [cbChequeNoErrorText, setcbChequeNoErrorText] = useState("");
    const [cbChequeDateErrorText, setcbChequeDateErrorText] = useState("");
    const [cbIncomeErrorText, setcbIncomeErrorText] = useState("");
    const [cbExpenseErrorText, setcbExpenseErrorText] = useState("");

    //const [cbChequeNo, setcbChequeNo] = useState("");
    const [chequeSuggestions, setChequeSuggestions] = useState([]);

    useState("");

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        const loadData = async () => {
            try {
                const res = await axios.get(
                    "http://" + backend_site_address + "/account_list"
                );
                setcb_account_list(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        loadData();
    }, []);

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setOpen(false);
    };
    const handleKeyDown = (event, nextRef) => {
        if (event.key === "Enter") {
            event.preventDefault();
            nextRef?.current?.focus();
        }
    };

    const cbFieldItem = (label, value, setValue, type, errorText, inpuRef) => {
        return (
            <div className="pd_section_item">
                <div className="pd_section_item_label">{label}</div>
                <div className="pd_section_item_colon">:</div>
                <TextField
                    style={{ width: "25%" }}
                    error={errorText != ""}
                    helperText={errorText}
                    id="standard-basic"
                    variant="standard"
                    type={type}
                    value={value}
                    inputRef={inpuRef}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={
                        label === "Voucher_Scroll No"
                            ? (e) => handleKeyDown(e, inpuRef)
                            : undefined
                    }
                />
            </div>
        );
    };

    const cbTextItem = (label, value) => {
        return (
            <div className="pd_section_item">
                <div className="pd_section_item_label">{label}</div>
                <div className="pd_section_item_colon">:</div>
                <div className="pd_section_item_value">{value}</div>
            </div>
        );
    };

    const accountNameNoSet = async (value) => {
        if (value !== cb_account_object) {
            setcbAccountNameError("");
            setcb_main_code_object(null);
            setcbMainCodeNo("");

            setcb_sub_code_object(null);
            setcbSubCodeNo("");

            setcb_account_object(value);
            setcbAccountName(value.TAHBIL_NAME);
            setcbAccountNo(value.ACCOUNT_NO);
            try {
                const res = await axios.post(
                    "http://" + backend_site_address + "/main_code_list",
                    { ACCOUNT_NO: value.ACCOUNT_NO }
                );
                setcb_main_code_description(res.data);
            } catch (err) {
                console.log(err);
            }
        }
    };

    const mainCodeNoSet = async (value) => {
        if (value !== cb_main_code_object) {
            setcbMainCodeNameError("");
            setcb_sub_code_object(null);
            setcbSubCodeNo("");

            setcb_main_code_object(value);
            setcbMainCodeName(value.MAIN_CODE_DESCRIPTION);
            setcbMainCodeNo(value.MAIN_CODE_NO);
            try {
                const res = await axios.post(
                    "http://" + backend_site_address + "/sub_code_list",
                    {
                        ACCOUNT_NO: cbAccountNo,
                        MAIN_CODE_NO: value.MAIN_CODE_NO,
                    }
                );
                setcb_sub_code_description(res.data);
            } catch (err) {
                console.log(err);
            }
        }
    };

    const subCodeNoSet = (value) => {
        setcbSubCodeNameError("");
        setcb_sub_code_object(value);
        setcbSubCodeName(value.SUB_CODE_DESCRIPTION);
        setcbSubCodeNo(value.SUB_CODE_NO);
        if (value.INC_EXP == "I") {
            setcbIncomeTrue(true);
        } else {
            setcbIncomeTrue(false);
        }
    };

    const cbAccountNameSelectItem = () => {
        return (
            <div className="pd_section_item">
                <div className="pd_section_item_label">Account Name</div>
                <div className="pd_section_item_colon">:</div>
                <Autocomplete
                    disablePortal
                    value={cb_account_object}
                    //onChange={(e, v) => accountNameNoSet(v)}
                    onChange={(e, v) => {
                        accountNameNoSet(v);
                        setTimeout(() => {
                            mainHeadRef.current?.focus();
                        });
                    }}
                    options={cb_account_list}
                    getOptionLabel={(option) => option.TAHBIL_NAME}
                    sx={{ width: "50%" }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            error={cbAccountNameError !== ""}
                            helperText={cbAccountNameError}
                            sx={{
                                "& .MuiInputBase-root": {
                                    height: 40, // Total height of the input box
                                },
                                "& .MuiInputBase-input": {
                                    padding: "10px 14px", // Controls the internal text padding
                                },
                            }}
                        />
                    )}
                />
            </div>
        );
    };

    const cbMainCodeSelectItem = () => {
        return (
            <div className="pd_section_item">
                <div className="pd_section_item_label">Main Head</div>
                <div className="pd_section_item_colon">:</div>
                <Autocomplete
                    disablePortal
                    value={cb_main_code_object}
                    //onChange={(e, v) => mainCodeNoSet(v)}
                    onChange={(e, v) => {
                        mainCodeNoSet(v);
                        setTimeout(() => {
                            subHeadRef.current?.focus();
                        });
                    }}
                    options={cb_main_code_description}
                    getOptionLabel={(option) => option.MAIN_CODE_DESCRIPTION}
                    sx={{ width: "50%" }}
                    renderInput={(params) => (
                        <TextField
                            inputRef={mainHeadRef}
                            {...params}
                            error={cbMainCodeNameError !== ""}
                            helperText={cbMainCodeNameError}
                            sx={{
                                "& .MuiInputBase-root": {
                                    height: 40, // Total height of the input box
                                },
                                "& .MuiInputBase-input": {
                                    padding: "10px 14px", // Controls the internal text padding
                                },
                            }}
                        />
                    )}
                />
            </div>
        );
    };

    const cbSubCodeSelectItem = () => {
        return (
            <div className="pd_section_item">
                <div className="pd_section_item_label">Sub Head</div>
                <div className="pd_section_item_colon">:</div>
                <Autocomplete
                    disablePortal
                    value={cb_sub_code_object}
                    //onChange={(e, v) => subCodeNoSet(v)}
                    onChange={(e, v) => {
                        subCodeNoSet(v);
                        resetAllHeadChange();
                        setTimeout(() => {
                            voucherNoRef.current?.focus();
                        });
                    }}
                    options={cb_sub_code_description}
                    getOptionLabel={(option) =>
                        option.SUB_CODE_DESCRIPTION +
                        " (" +
                        option.INC_EXP +
                        ") "
                    }
                    sx={{ width: "50%" }}
                    renderInput={(params) => (
                        <TextField
                            inputRef={subHeadRef}
                            {...params}
                            error={cbSubCodeNameError !== ""}
                            helperText={cbSubCodeNameError}
                            sx={{
                                "& .MuiInputBase-root": {
                                    height: 40, // Total height of the input box
                                },
                                "& .MuiInputBase-input": {
                                    padding: "10px 14px", // Controls the internal text padding
                                },
                            }}
                        />
                    )}
                />
            </div>
        );
    };

    const checkValidation = () => {
        if (cbAccountName === "") {
            setcbAccountNameError("Select a Account Name");
            return false;
        }

        if (cbMainCodeName === "") {
            setcbMainCodeNameError("Select a Main Head");
            return false;
        }

        if (cbSubCodeName === "") {
            setcbSubCodeNameError("Select a Sub Head");
            return false;
        }

        if (cbIncomeTrue) {
            if (cbIncome === "") {
                setcbIncomeErrorText("Income can't be empty");
                return false;
            } else {
                setcbIncomeErrorText("");
            }
        } else {
            if (cbExpense === "") {
                setcbExpenseErrorText("Expense can't be empty");
                return false;
            } else {
                setcbExpenseErrorText("");
            }
        }

        if (cbVoucherDescription === "") {
            setcbVoucherDescriptionErrorText(
                "Voucher Description can't be empty"
            );
            return false;
        } else {
            setcbVoucherDescriptionErrorText("");
        }
        return true;
    };

    const resetAllField = () => {
        // setcbAccountNo("");
        // setcbAccountName("");
        // setcbMainCodeNo("");
        // setcbMainCodeName("");
        // setcbSubCodeNo("");
        // setcbSubCodeName("");
        setcbVoucherDescription("");
        //setcbVoucherScrollNo("");
        //setcbVoucherDate("");
        //setcbChequeNo("");
        //setcbChequeDate("");
        setcbIncome("");
        setcbExpense("");
    };
    const resetAllHeadChange = () => {
        // setcbAccountNo("");
        // setcbAccountName("");
        // setcbMainCodeNo("");
        // setcbMainCodeName("");
        // setcbSubCodeNo("");
        // setcbSubCodeName("");
        setcbVoucherDescription("");
        setcbVoucherScrollNo("");
        setcbVoucherDate("");
        setcbChequeNo("");
        setcbChequeDate("");
        setcbIncome("");
        setcbExpense("");
    };

    const action = (
        <React.Fragment>
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleClose}
            >
                <CloseIcon fontSize="small" />
            </IconButton>
        </React.Fragment>
    );

    const cashDataInsert = async () => {
        const transaction_res = await axios.get(
            "http://" + backend_site_address + "/get_transaction_id"
        );
        const transaction_id = transaction_res.data[0].MAX_TRANSACTION_ID + 1;

        if (checkValidation()) {
            const cbData = {
                TRANSACTION_ID: transaction_id,
                ACCOUNT_NO: cbAccountNo,
                ACCOUNT_NAME: cbAccountName,
                MAIN_CODE_NO: cbMainCodeNo,
                SUB_CODE_NO: cbSubCodeNo,
                VOUCHER_DESCRIPTION: cbVoucherDescription,
                VOUCHER_SCROLL_NO: cbVoucherScrollNo,
                VOUCHER_DATE: new Date(cbVoucherDate).toLocaleDateString(
                    "en-US"
                ),
                INCOME: cbIncome == "" ? 0 : cbIncome,
                EXPENSE: cbExpense == "" ? 0 : cbExpense,
                ENTRY_DATE: new Date().toLocaleDateString("en-US"),
                FIN_YEAR: GetFinancialYear(),
                USER_NAME: cb_userName,
                CHEQUE_NO: cbChequeNo,
                CHEQUE_DATE: new Date(cbChequeDate).toLocaleDateString("en-US"),
            };

            try {
                const insert_res = await axios.post(
                    "http://" + backend_site_address + "/cash_book_insert",
                    cbData
                );
                console.log(insert_res);
                if (insert_res.data === "") {
                    setOpen(true);
                    resetAllField();
                }
            } catch (err) {
                console.log(err);
            }
        }
    };

    // New for autoComplete

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("chequeNoList")) || [];
        setChequeSuggestions(saved);
    }, []);

    const handleChequeChange = (e) => {
        setcbChequeNo(e.target.value);
    };

    const handleChequeEnter = (e) => {
        if (e.key === "Enter") {
            const saved =
                JSON.parse(localStorage.getItem("chequeNoList")) || [];
            if (!saved.includes(cbChequeNo) && cbChequeNo.trim() !== "") {
                const updated = [cbChequeNo, ...saved].slice(0, 10); // max 10 items
                localStorage.setItem("chequeNoList", JSON.stringify(updated));
                setChequeSuggestions(updated);
            }
            checkDateRef.current?.focus();
        }
    };

    //

    return (
        <>
            <NavBar hide={{ nav_mid: true }} />

            <div className="cash_book_dashboard">
                <div className="cb_page_label">New Entry (Cash Book)</div>

                <div className="pd_section">
                    <form className="cash_book" autoComplete="on">
                        <div className="cb_section_items">
                            <div className="pd_section_items_div">
                                {cbAccountNameSelectItem()}
                            </div>
                            <div className="section_items_div">
                                {cbTextItem("Account No.", cbAccountNo)}
                            </div>
                        </div>
                        <div className="cb_section_items">
                            <div className="pd_section_items_div">
                                {cbMainCodeSelectItem()}
                            </div>
                        </div>

                        <div className="cb_section_items">
                            <div className="section_items_div">
                                {cbSubCodeSelectItem()}
                            </div>
                        </div>

                        <div className="pd_section_item">
                            <span className="cb_section_item_label">
                                Entry/Vou/Scrl No :
                            </span>
                            <TextField
                                inputRef={voucherNoRef}
                                variant="outlined"
                                size="small"
                                style={{ width: "150px" }}
                                value={cbVoucherScrollNo}
                                name="voucher-scroll-no"
                                autoComplete="on"
                                onChange={(e) =>
                                    setcbVoucherScrollNo(e.target.value)
                                }
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        /* console.log("Enter was pressed!"); */
                                        voucherDateRef.current?.focus();
                                    }
                                }}
                            />
                            <span className="cb_section_left_margin_label">
                                Entry/Vouc/Scrl Date:
                            </span>
                            <TextField
                                inputRef={voucherDateRef}
                                type="date"
                                variant="outlined"
                                size="small"
                                style={{ width: "180px" }}
                                value={cbVoucherDate}
                                onChange={(e) =>
                                    setcbVoucherDate(e.target.value)
                                }
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        /* console.log("Enter was pressed!"); */
                                        checkNoRef.current?.focus();
                                    }
                                }}
                            />
                        </div>
                        <div className="pd_section_item">
                            <span className="cb_section_item_label">
                                Check No.
                            </span>

                            <Autocomplete
                                freeSolo
                                options={chequeSuggestions}
                                inputValue={cbChequeNo}
                                onInputChange={(event, newInputValue) => {
                                    setcbChequeNo(newInputValue);
                                }}
                                onKeyDown={handleChequeEnter}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        inputRef={checkNoRef}
                                        //label="Cheque No"
                                        size="small"
                                        variant="outlined"
                                        style={{ width: "150px" }}
                                    />
                                )}
                            />
                            {/* <TextField
                                inputRef={checkNoRef}
                                variant="outlined"
                                size="small"
                                //name="cheque-number"
                                style={{ width: "150px" }}
                                value={cbChequeNo}
                                //autoComplete="on"
                                onChange={(e) => setcbChequeNo(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        checkDateRef.current?.focus();
                                    }
                                }}
                            /> */}
                            {/* <input
                                ref={checkNoRef}
                                type="text"
                                name="cheque-number"
                                autoComplete="on"
                                value={cbChequeNo}
                                onChange={(e) => setcbChequeNo(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        checkDateRef.current?.focus();
                                    }
                                }}
                                style={{
                                    width: "150px",
                                    height: "40px",
                                    border: "1px solid #ccc",
                                    borderRadius: "4px",
                                    paddingLeft: "8px",
                                    fontSize: "14px",
                                }}
                            /> */}
                            <span className="cb_section_left_margin_label">
                                Check Date:
                            </span>
                            <TextField
                                inputRef={checkDateRef}
                                type="date"
                                variant="outlined"
                                size="small"
                                style={{ width: "180px" }}
                                value={cbChequeDate}
                                onChange={(e) =>
                                    setcbChequeDate(e.target.value)
                                }
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        descriptionRef.current?.focus();
                                    }
                                }}
                                /* onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        cbIncomeTrue
                                            ? incomeRef.current?.focus()
                                            : expenseRef.current?.focus();
                                    }
                                }} */
                            />
                        </div>
                        <div className="pd_section_item">
                            <div className="cb_section_item_label">
                                Description Details
                            </div>
                            <div className="pd_section_item_colon">:</div>
                            <TextField
                                inputRef={descriptionRef}
                                style={{ width: "50%" }}
                                minRows={2}
                                variant="outlined"
                                size="small"
                                error={cbVoucherDescriptionErrorText != ""}
                                helperText={cbVoucherDescriptionErrorText}
                                value={cbVoucherDescription}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        cbIncomeTrue
                                            ? incomeRef.current?.focus()
                                            : expenseRef.current?.focus();
                                    }
                                }}
                                /* onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        saveButtonRef.current?.focus();
                                    }
                                }} */
                                onChange={(e) =>
                                    setcbVoucherDescription(e.target.value)
                                }
                            />
                        </div>
                        <div className="pd_section_item">
                            {cbIncomeTrue ? (
                                <>
                                    <span className="cb_section_item_label">
                                        Income Amount:
                                    </span>
                                    <TextField
                                        inputRef={incomeRef}
                                        style={{ width: "20%" }}
                                        error={cbIncomeErrorText != ""}
                                        helperText={cbIncomeErrorText}
                                        id="standard-basic"
                                        variant="outlined"
                                        size="small"
                                        value={cbIncome}
                                        onChange={(e) =>
                                            setcbIncome(e.target.value)
                                        }
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                saveButtonRef.current?.focus();
                                            }
                                        }}
                                    />
                                </>
                            ) : (
                                <>
                                    <span className="cb_section_item_label">
                                        Expense Amount:
                                    </span>
                                    <TextField
                                        inputRef={expenseRef}
                                        style={{ width: "50%" }}
                                        error={cbExpenseErrorText != ""}
                                        helperText={cbExpenseErrorText}
                                        id="standard-basic"
                                        variant="outlined"
                                        size="small"
                                        value={cbExpense}
                                        onChange={(e) =>
                                            setcbExpense(e.target.value)
                                        }
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                /* console.log(
                                                    "Enter was pressed!"
                                                ); */
                                                saveButtonRef.current?.focus();
                                            }
                                        }}
                                    />
                                </>
                            )}
                        </div>

                        <Snackbar
                            open={open}
                            autoHideDuration={6000}
                            onClose={handleClose}
                            message="Successfully Submitted"
                            action={action}
                        />

                        <div className="ld_button">
                            <a
                                className="ld_forward"
                                href="/cashbook/preview"
                                style={{ textDecoration: "None" }}
                            >
                                Preview
                            </a>
                            <div
                                className="ld_forward"
                                onClick={cashDataInsert}
                                //onSubmit={cashDataInsert}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        cashDataInsert();
                                    }
                                }}
                                ref={saveButtonRef}
                                tabIndex={-1}
                            >
                                Save
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <Footer />
        </>
    );
}
