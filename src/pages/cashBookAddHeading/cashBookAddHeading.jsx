import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import "./cashBookAddHeading.css";
import useLoanTypeStore from "../../stores/loanTypeStore";
import axios from "axios";
import moment from "moment";

import NavBar from "../../component/page_compo/navBar/navBar";
import Footer from "../../component/page_compo/footer/footer";
import usePersonnelDataStore from "../../stores/personnelDataStore";

import Autocomplete from "@mui/material/Autocomplete";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Snackbar from "@mui/material/Snackbar";
import Textarea from "@mui/joy/Textarea";
import TextField from "@mui/material/TextField";
import GetFinancialYear from "../../utils/functions/getFinancialYear";
import { backend_site_address } from "../../stores/const/siteAddress";
import useCashBookEntryStore from "../../stores/cashBookEntryStore";

export default function CashBookAddHeading() {
    const entryData = useCashBookEntryStore((state) => state.entryData);
    const cb_data = usePersonnelDataStore((state) => state.personnelData);
    const cbe_navigate = useNavigate();
    const [cb_account_list, setcb_account_list] = useState([]);
    const [cb_account_object, setcb_account_object] = useState(null);
    const [cb_main_code_description, setcb_main_code_description] = useState(
        []
    );

    const [createMainHead, setCreateMainHead] = useState(false);
    const [cb_main_code_object, setcb_main_code_object] = useState(null);
    const [cb_sub_code_description, setcb_sub_code_description] = useState([]);
    const [cb_sub_code_object, setcb_sub_code_object] = useState(null);

    const [open, setOpen] = useState(false);

    const cb_userName = cb_data["USER_NAME"];
    const [cbAccountNo, setcbAccountNo] = useState("");
    const [cbAccountName, setcbAccountName] = useState("");
    const [cbMainCodeNo, setcbMainCodeNo] = useState("");
    const [cbMainCodeName, setcbMainCodeName] = useState("");
    const [cbSubCodeNo, setcbSubCodeNo] = useState("");
    const [cbSubCodeName, setcbSubCodeName] = useState("");

    const headTypeList = ["Income", "Expense"];
    const [headTypeName, setHeadTypeName] = useState("");

    const [cbAccountNameError, setcbAccountNameError] = useState("");
    const [cbMainCodeNameError, setcbMainCodeNameError] = useState("");
    const [cbSubCodeNameError, setcbSubCodeNameError] = useState("");
    const [headTypeNameError, setHeadTypeNameError] = useState("");

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
            // try {
            //     const res = await axios.post(
            //         "http://" + backend_site_address + "/sub_code_list",
            //         {
            //             ACCOUNT_NO: cbAccountNo,
            //             MAIN_CODE_NO: value.MAIN_CODE_NO,
            //         }
            //     );
            //     setcb_sub_code_description(res.data);
            // } catch (err) {
            //     console.log(err);
            // }
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
                {createMainHead ? (
                    <TextField
                        style={{ width: "60%" }}
                        error={cbMainCodeNameError != ""}
                        helperText={cbMainCodeNameError}
                        id="standard-basic"
                        variant="standard"
                        type="text"
                        value={cbMainCodeName}
                        onChange={(e) => setcbMainCodeName(e.target.value)}
                    />
                ) : (
                    <Autocomplete
                        disablePortal
                        value={cb_main_code_object}
                        onChange={(e, v) => mainCodeNoSet(v)}
                        options={cb_main_code_description}
                        getOptionLabel={(option) =>
                            option.MAIN_CODE_DESCRIPTION
                        }
                        sx={{ width: "60%" }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                error={cbMainCodeNameError !== ""}
                                helperText={cbMainCodeNameError}
                            />
                        )}
                    />
                )}
                <Checkbox
                    checked={createMainHead}
                    onChange={(event) =>
                        setCreateMainHead(event.target.checked)
                    }
                    inputProps={{ "aria-label": "controlled" }}
                />
            </div>
        );
    };

    const cbSubCodeSelectItem = () => {
        return (
            <div className="pd_section_item">
                <div className="pd_section_item_label">Sub Head</div>
                <div className="pd_section_item_colon">:</div>
                <TextField
                    style={{ width: "60%" }}
                    error={cbSubCodeNameError != ""}
                    helperText={cbSubCodeNameError}
                    id="standard-basic"
                    variant="standard"
                    type="text"
                    value={cbSubCodeName}
                    onChange={(e) => setcbSubCodeName(e.target.value)}
                />
            </div>
        );
    };

    const cbHeadTypeSelectItem = () => {
        return (
            <div className="pd_section_item">
                <div className="pd_section_item_label">Head Type</div>
                <div className="pd_section_item_colon">:</div>
                <Autocomplete
                    disablePortal
                    value={headTypeName}
                    onChange={(e, v) => setHeadTypeName(v)}
                    options={headTypeList}
                    sx={{ width: "60%" }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            error={headTypeNameError !== ""}
                            helperText={headTypeNameError}
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
        } else {
            setcbAccountNameError("");
        }

        if (headTypeName === "") {
            setHeadTypeNameError("Select a Head Type");
            return false;
        } else {
            setHeadTypeNameError("");
        }

        if (cbMainCodeName === "") {
            setcbMainCodeNameError("Select a Main Head");
            return false;
        } else {
            setcbMainCodeNameError("");
        }

        if (cbSubCodeName === "") {
            setcbSubCodeNameError("Select a Sub Head");
            return false;
        } else {
            setcbSubCodeNameError("");
        }

        return true;
    };

    const resetAllField = () => {
        setcbAccountNo("");
        setcbAccountName("");
        setcbMainCodeNo("");
        setcbMainCodeName("");
        setcbSubCodeNo("");
        setcbSubCodeName("");
        setHeadTypeName("");
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

    const saveAddHeading = async () => {
        if (checkValidation()) {
            let mainHeadCodeno = 0;
            if (createMainHead) {
                try {
                    const max_main_res = await axios.post(
                        "http://" + backend_site_address + "/get_max_main_code",
                        { ACCOUNT_NO: cbAccountNo }
                    );
                    console.log({ max_main_res: max_main_res });

                    mainHeadCodeno =
                        Number(max_main_res.data[0].MAX_MAIN_CODE_NO) + 1;
                    mainHeadCodeno = mainHeadCodeno.toString().padStart(2, "0");
                    // console.log();
                } catch (err) {
                    console.log(err);
                }
                const cbData = {
                    ACCOUNT_NO: cbAccountNo,
                    ACCOUNT_NAME: cbAccountName,
                    MAIN_CODE_NO: mainHeadCodeno,

                    MAIN_CODE_DESCRIPTION: cbMainCodeName,
                    INC_EXP: headTypeName === "Income" ? "I" : "E",
                };
                console.log(cbData);

                try {
                    const add_main_res = await axios.post(
                        "http://" + backend_site_address + "/add_main_code",
                        cbData
                    );
                    console.log({ add_main_res: add_main_res });
                } catch (err) {
                    console.log(err);
                }
            } else {
                mainHeadCodeno = cbMainCodeNo;
            }
            let subHeadCodeno = 0;

            try {
                const max_sub_res = await axios.post(
                    "http://" + backend_site_address + "/get_max_sub_code",
                    { ACCOUNT_NO: cbAccountNo, MAIN_CODE_NO: mainHeadCodeno }
                );

                subHeadCodeno =
                    max_sub_res.data.length === 0
                        ? 1
                        : Number(max_sub_res.data[0].MAX_SUB_CODE_NO) + 1;
                subHeadCodeno = subHeadCodeno.toString().padStart(3, "0");
            } catch (err) {
                console.log(err);
            }

            const cbData2 = {
                ACCOUNT_NO: cbAccountNo,
                MAIN_CODE_NO: mainHeadCodeno,
                SUB_CODE_NO: subHeadCodeno,
                SUB_CODE_DESCRIPTION: cbSubCodeName,
                INC_EXP: headTypeName === "Income" ? "I" : "E",
            };

            try {
                const add_sub_res = await axios.post(
                    "http://" + backend_site_address + "/add_sub_code",
                    cbData2
                );
                console.log({ add_sub_res: add_sub_res });
            } catch (err) {
                console.log(err);
            }
        }
    };

    return (
        <>
            <NavBar hide={{ nav_mid: true }} />

            <div className="cash_book_dashboard">
                <div className="cb_page_label">Add Main Head</div>

                <div className="pd_section">
                    <form className="cash_book">
                        <div className="cb_section_items">
                            <div className="pd_section_items_div">
                                {cbAccountNameSelectItem()}
                            </div>
                            <div className="section_items_div">
                                {cbTextItem("Account No.", cbAccountNo)}
                            </div>
                        </div>
                        <div className="cb_section_items">
                            <div className="section_items_div">
                                {cbHeadTypeSelectItem()}
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
                                onClick={saveAddHeading}
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
