import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import "./cashBookEdit.css";
import useLoanTypeStore from "../../stores/loanTypeStore";
import axios from "axios";
import moment from "moment";

import NavBar from "../../component/page_compo/navBar/navBar";
import Footer from "../../component/page_compo/footer/footer";
import usePersonnelDataStore from "../../stores/personnelDataStore";

import Autocomplete from "@mui/material/Autocomplete";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Snackbar from "@mui/material/Snackbar";
import Textarea from "@mui/joy/Textarea";
import TextField from "@mui/material/TextField";
import GetFinancialYear from "../../utils/functions/getFinancialYear";
import { backend_site_address } from "../../stores/const/siteAddress";
import useCashBookEntryStore from "../../stores/cashBookEntryStore";

export default function CashBookEdit() {
    const entryData = useCashBookEntryStore((state) => state.entryData);
    const cb_data = usePersonnelDataStore((state) => state.personnelData);
    const cbe_navigate = useNavigate();
    const [cb_account_list, setcb_account_list] = useState([]);
    const [cb_account_object, setcb_account_object] = useState(null);
    const [cb_main_code_description, setcb_main_code_description] = useState(
        []
    );
    const [cb_main_code_object, setcb_main_code_object] = useState(null);
    const [cb_sub_code_description, setcb_sub_code_description] = useState([]);
    const [cb_sub_code_object, setcb_sub_code_object] = useState(null);

    const [open, setOpen] = useState(false);

    const cb_userName = cb_data["USER_NAME"];
    const cbTransactionId = entryData.TRANSACTION_ID;
    const [cbAccountNo, setcbAccountNo] = useState(entryData.ACCOUNT_NO);
    const [cbAccountName, setcbAccountName] = useState(entryData.ACCOUNT_NAME);
    const [cbMainCodeNo, setcbMainCodeNo] = useState(entryData.MAIN_CODE_NO);
    const [cbMainCodeName, setcbMainCodeName] = useState(
        entryData.MAIN_CODE_DESCRIPTION
    );
    const [cbSubCodeNo, setcbSubCodeNo] = useState(entryData.SUB_CODE_NO);
    const [cbSubCodeName, setcbSubCodeName] = useState(
        entryData.SUB_CODE_DESCRIPTION
    );
    const [cbVoucherDescription, setcbVoucherDescription] = useState(
        entryData.VOUCHER_DESCRIPTION
    );
    const [cbVoucherScrollNo, setcbVoucherScrollNo] = useState(
        entryData.VOUCHER_SCROLL_NO
    );
    const [cbVoucherDate, setcbVoucherDate] = useState(
        moment(entryData.VOUCHER_DATE).format("YYYY-MM-DD")
    );
    const [cbChequeNo, setcbChequeNo] = useState(entryData.CHK_NO);
    const [cbChequeDate, setcbChequeDate] = useState(
        moment(entryData.CHK_DATE).format("YYYY-MM-DD")
    );
    const [cbIncome, setcbIncome] = useState(entryData.INCOME);
    const [cbExpense, setcbExpense] = useState(entryData.EXPENSE);
    const [cbIncomeTrue, setcbIncomeTrue] = useState(
        entryData.INCOME > 0 ? true : false
    );

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
    const [cbBalanceAmountErrorText, setcbBalanceAmountErrorText] =
        useState("");

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        const loadData = async () => {
            try {
                const res = await axios.get(
                    "http://" + backend_site_address + "/account_list"
                );
                setcb_account_list(res.data);
                setcb_account_object(
                    res.data.find(
                        (account) => account.ACCOUNT_NO === cbAccountNo
                    )
                );

                const main_res = await axios.post(
                    "http://" + backend_site_address + "/main_code_list",
                    { ACCOUNT_NO: cbAccountNo }
                );
                setcb_main_code_description(main_res.data);

                setcb_main_code_object(
                    main_res.data.find(
                        (account) => account.MAIN_CODE_NO === cbMainCodeNo
                    )
                );

                const sub_res = await axios.post(
                    "http://" + backend_site_address + "/sub_code_list",
                    { ACCOUNT_NO: cbAccountNo, MAIN_CODE_NO: cbMainCodeNo }
                );
                setcb_sub_code_description(sub_res.data);

                setcb_sub_code_object(
                    sub_res.data.find(
                        (account) => account.SUB_CODE_NO === cbSubCodeNo
                    )
                );
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

    const cbFieldItem = (label, value, setValue, type, errorText) => {
        return (
            <div className="pd_section_item">
                <div className="pd_section_item_label">{label}</div>
                <div className="pd_section_item_colon">:</div>
                <TextField
                    style={{ width: "50%" }}
                    error={errorText != ""}
                    helperText={errorText}
                    id="standard-basic"
                    variant="standard"
                    type={type}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
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
                    onChange={(e, v) => accountNameNoSet(v)}
                    options={cb_account_list}
                    getOptionLabel={(option) => option.TAHBIL_NAME}
                    sx={{ width: "60%" }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            error={cbAccountNameError !== ""}
                            helperText={cbAccountNameError}
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
                    onChange={(e, v) => mainCodeNoSet(v)}
                    options={cb_main_code_description}
                    getOptionLabel={(option) => option.MAIN_CODE_DESCRIPTION}
                    sx={{ width: "60%" }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            error={cbMainCodeNameError !== ""}
                            helperText={cbMainCodeNameError}
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
                    onChange={(e, v) => subCodeNoSet(v)}
                    options={cb_sub_code_description}
                    getOptionLabel={(option) =>
                        option.SUB_CODE_DESCRIPTION +
                        " (" +
                        option.INC_EXP +
                        ") "
                    }
                    sx={{ width: "60%" }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            error={cbSubCodeNameError !== ""}
                            helperText={cbSubCodeNameError}
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
        // setcbVoucherScrollNo("");
        // setcbVoucherDate("");
        // setcbChequeNo("");
        // setcbChequeDate("");
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

    const cashDataUpdate = async () => {
        if (checkValidation()) {
            const cbData = {
                TRANSACTION_ID: cbTransactionId,
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
                const update_res = await axios.put(
                    "http://" + backend_site_address + "/update_transaction",
                    cbData
                );

                if (update_res.data === "") {
                    setOpen(true);
                    cbe_navigate("/cashbook/preview");
                }
            } catch (err) {
                console.log(err);
            }
        }
    };

    return (
        <>
            <NavBar hide={{ nav_mid: true }} />

            <div className="cash_book_dashboard">
                <div className="cb_page_label">Edit Entry</div>

                <div className="pd_section">
                    <form className="cash_book">
                        <div className="cb_section_items">
                            <div className="section_items_div">
                                {cbTextItem("Transaction ID.", cbTransactionId)}
                            </div>
                        </div>
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

                        <div className="cb_section_items">
                            <div className="pd_section_items_div">
                                {cbFieldItem(
                                    "Voucher/Scroll No",
                                    cbVoucherScrollNo,
                                    setcbVoucherScrollNo,
                                    "number",
                                    cbVoucherScrollNoErrorText
                                )}
                            </div>
                            <div className="section_items_div">
                                {cbFieldItem(
                                    "Cheque/FDR No",
                                    cbChequeNo,
                                    setcbChequeNo,
                                    "number",
                                    cbChequeNoErrorText
                                )}
                            </div>
                        </div>

                        <div className="cb_section_items">
                            <div className="pd_section_items_div">
                                {cbFieldItem(
                                    "Voucher Date",
                                    cbVoucherDate,
                                    setcbVoucherDate,
                                    "date",
                                    cbVoucherDateErrorText
                                )}
                            </div>
                            <div className="section_items_div">
                                {cbFieldItem(
                                    "Cheque/FDR Date",
                                    cbChequeDate,
                                    setcbChequeDate,
                                    "date",
                                    cbChequeDateErrorText
                                )}
                            </div>
                        </div>

                        <div
                            className="pd_section_item"
                            style={{ width: "60%", color: "crimson" }}
                        >
                            {cbIncomeTrue ? (
                                <>
                                    <div className="pd_section_item_label">
                                        Income Amount
                                    </div>
                                    <div className="pd_section_item_colon">
                                        :
                                    </div>
                                    <TextField
                                        style={{ width: "50%" }}
                                        error={cbIncomeErrorText != ""}
                                        helperText={cbIncomeErrorText}
                                        id="standard-basic"
                                        variant="standard"
                                        value={cbIncome}
                                        onChange={(e) =>
                                            setcbIncome(e.target.value)
                                        }
                                    />
                                </>
                            ) : (
                                <>
                                    <div className="pd_section_item_label">
                                        Expense Amount
                                    </div>
                                    <div className="pd_section_item_colon">
                                        :
                                    </div>
                                    <TextField
                                        style={{ width: "50%" }}
                                        error={cbExpenseErrorText != ""}
                                        helperText={cbExpenseErrorText}
                                        id="standard-basic"
                                        variant="standard"
                                        value={cbExpense}
                                        onChange={(e) =>
                                            setcbExpense(e.target.value)
                                        }
                                    />
                                </>
                            )}
                        </div>

                        <div
                            className="pd_section_item"
                            style={{ color: "crimson" }}
                        >
                            <div className="pd_section_item_label">
                                Details Description
                            </div>
                            <div className="pd_section_item_colon">:</div>
                            <TextField
                                style={{ width: "100%" }}
                                minRows={2}
                                variant="standard"
                                error={cbVoucherDescriptionErrorText != ""}
                                helperText={cbVoucherDescriptionErrorText}
                                value={cbVoucherDescription}
                                onChange={(e) =>
                                    setcbVoucherDescription(e.target.value)
                                }
                            />
                        </div>

                        <Snackbar
                            open={open}
                            autoHideDuration={500}
                            onClose={handleClose}
                            message="Successfully Updated"
                            action={action}
                        />

                        <div className="ld_button">
                            <div
                                className="ld_forward"
                                onClick={cashDataUpdate}
                            >
                                Update
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <Footer />
        </>
    );
}
