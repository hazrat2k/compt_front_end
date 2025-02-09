import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import axios from "axios";

import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";

import "./sanctionCopy.css";

import { dateFormation } from "../../utils/functions/dateFormation";

import InWords from "../../utils/functions/inWords";
import NavBar from "../../component/page_compo/navBar/navBar";
import Footer from "../../component/page_compo/footer/footer";
import { backend_site_address } from "../../stores/const/siteAddress";

import SanctionCopyForm from "../../utils/pdfCopy/sanctionCopyForm";
import useLoanTypeStore from "../../stores/loanTypeStore";

const scColumns = [
    { field: "LOAN_ID", headerName: "Loan ID", width: 130 },
    { field: "EMPLOYEE_NAME", headerName: "Employee Name", width: 130 },
    { field: "DESIGNATION", headerName: "Designation", width: 100 },
    { field: "OFFICE", headerName: "Office", width: 100 },
    { field: "CATEGORY", headerName: "Category", width: 100 },
    { field: "DATE_OF_BIRTH", headerName: "Birth Date", width: 100 },
    { field: "DATE_FIRST_JOIN", headerName: "Joining Date", width: 100 },
    { field: "NET_SALARY", headerName: "Net Pay", width: 100, type: "number" },
    {
        field: "APPLY_AMOUNT",
        headerName: "Apply Amount",
        width: 100,
        type: "number",
    },
    {
        field: "ALLOW_AMOUNT",
        headerName: "Allow Amount",
        width: 100,
        type: "number",
    },
    {
        field: "SANCTION_AMOUNT",
        headerName: "Sanction Amount",
        width: 100,
        type: "number",
    },
    {
        field: "RECOVERY_AMOUNT",
        headerName: "Recovery Amount",
        width: 100,
        type: "number",
    },
    {
        field: "INSTALL_AMOUNT",
        headerName: "Installment Amount",
        width: 100,
        type: "number",
    },
    {
        field: "TOTAL_INTEREST",
        headerName: "Total Interest",
        width: 100,
        type: "number",
    },
    {
        field: "INSTALL_NO",
        headerName: "Installment No",
        width: 100,
        type: "number",
    },
    {
        field: "BANK_ACCOUNT_NO",
        headerName: "Account No",
        width: 100,
        type: "number",
    },
];

const paginationModel = { page: 0, pageSize: 5 };

export default function SanctionCopy() {
    const scLoanType = useLoanTypeStore((state) => state.loanType);
    const [sc_sanc_loan_data, setSc_sanc_loan_data] = useState([]);
    const sc_sanc_loan_display = useState([]);

    const { state } = useLocation();

    const sc_loan_type = scLoanType;

    const sc_sent_from = state["sentFrom"];

    const sc_sanc_status =
        sc_sent_from == "acct_fund" ? "IN PROCESS" : "SANCTIONED";

    const sc_app_pos = state["app_pos"];

    const [selectedLoan, setSelectedLoan] = useState(state["sanctionedLoan"]);

    let nf = new Intl.NumberFormat("en-IN");

    useEffect(() => {
        const fetch_sanction_loan_data = async () => {
            const uploadLoanType = {
                LOAN_TYPE: sc_loan_type,
                SANC_STATUS: sc_sanc_status,
            };

            try {
                const sanc_res = await axios.post(
                    "http://" + backend_site_address + "/sanction_loan",
                    uploadLoanType
                );
                setSc_sanc_loan_data(sanc_res.data);
            } catch (err) {
                console.log(err);
            }
        };
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        fetch_sanction_loan_data();
    }, []);

    const onCheckBoxChange = (e) => {
        const l_id = e.target.name;

        var temp = { ...selectedLoan };

        temp[l_id] = !temp[l_id];

        setSelectedLoan(temp);
    };

    const sc_table_col = (value, cn) => {
        var clsN = "sc_table_col " + cn;
        return (
            <div className={clsN}>
                <div className="sc_table_cell">{value}</div>
            </div>
        );
    };

    var count = 0;

    var total_sanction = 0;

    if (sc_sent_from == "acct_fund") {
        for (let i = 0; i < sc_sanc_loan_data.length; i++) {
            if (sc_sanc_loan_data[i]["SANC_STATUS"] == "IN PROCESS") {
                sc_sanc_loan_display.push(
                    <div className="sc_table_row">
                        <input
                            type="checkbox"
                            name={sc_sanc_loan_data[i]["LOAN_ID"]}
                            checked={
                                selectedLoan[sc_sanc_loan_data[i]["LOAN_ID"]]
                            }
                            onChange={onCheckBoxChange}
                        />
                        {sc_table_col(++count, "sc_small_col")}
                        {sc_table_col(
                            sc_sanc_loan_data[i]["LOAN_ID"],
                            "sc_large_col"
                        )}
                        {sc_table_col(
                            sc_sanc_loan_data[i]["EMPLOYEE_NAME"],
                            "sc_large_col"
                        )}
                        {sc_table_col(
                            sc_sanc_loan_data[i]["DESIGNATION"],
                            "sc_large_col"
                        )}
                        {sc_table_col(
                            sc_sanc_loan_data[i]["OFFICE"],
                            "sc_small_col"
                        )}
                        {sc_table_col(
                            sc_sanc_loan_data[i]["CATEGORY"],
                            "sc_small_col"
                        )}
                        {sc_table_col(
                            dateFormation(
                                sc_sanc_loan_data[i]["DATE_OF_BIRTH"]
                            ),
                            "sc_small_col"
                        )}
                        {sc_table_col(
                            dateFormation(
                                sc_sanc_loan_data[i]["DATE_FIRST_JOIN"]
                            ),
                            "sc_small_col"
                        )}
                        {sc_table_col(
                            nf.format(sc_sanc_loan_data[i]["NET_SALARY"]),
                            "sc_small_col"
                        )}
                        {sc_table_col(
                            nf.format(sc_sanc_loan_data[i]["APPLY_AMOUNT"]),
                            "sc_small_col"
                        )}
                        {sc_table_col(
                            nf.format(sc_sanc_loan_data[i]["ALLOW_AMOUNT"]),
                            "sc_large_col"
                        )}
                        {sc_table_col(
                            nf.format(sc_sanc_loan_data[i]["SANCTION_AMOUNT"]),
                            "sc_large_col sc_bold"
                        )}
                        {sc_table_col(
                            nf.format(sc_sanc_loan_data[i]["RECOVERY_AMOUNT"]),
                            "sc_large_col"
                        )}
                        {sc_table_col(
                            nf.format(sc_sanc_loan_data[i]["INSTALL_AMOUNT"]),
                            "sc_small_col"
                        )}
                        {sc_table_col(
                            nf.format(sc_sanc_loan_data[i]["TOTAL_INTEREST"]),
                            "sc_small_col"
                        )}
                        {sc_table_col(
                            sc_sanc_loan_data[i]["INSTALL_NO"],
                            "sc_small_col"
                        )}
                        {sc_table_col(
                            sc_sanc_loan_data[i]["BANK_ACCOUNT_NO"],
                            "sc_small_col"
                        )}
                        {/* {sc_table_col(" ", "sc_small_col")}
                        {sc_table_col(" ", "sc_small_col")} */}
                    </div>
                );

                if (selectedLoan[sc_sanc_loan_data[i]["LOAN_ID"]]) {
                    total_sanction += Number(
                        sc_sanc_loan_data[i]["SANCTION_AMOUNT"]
                    );
                }
            }
        }
        sc_sanc_loan_display.push(
            <div className="sc_table_row">
                {sc_table_col(" ", "sc_small_col")}
                {sc_table_col(" ", "sc_small_col")}
                {sc_table_col(" ", "sc_small_col")}
                {sc_table_col(" ", "sc_small_col")}
                {sc_table_col(" ", "sc_small_col")}
                {sc_table_col(" ", "sc_small_col")}
                {sc_table_col(" ", "sc_small_col")}
                {sc_table_col(" ", "sc_small_col")}
                {sc_table_col(" ", "sc_small_col")}
                {sc_table_col(" ", "sc_large_col")}
                {sc_table_col("TOTAL", "sc_large_col sc_bold")}
                {sc_table_col(
                    nf.format(total_sanction),
                    "sc_large_col sc_bold"
                )}
            </div>
        );
    } else {
        for (let i = 0; i < sc_sanc_loan_data.length; i++) {
            if (selectedLoan[sc_sanc_loan_data[i]["LOAN_ID"]]) {
                sc_sanc_loan_display.push(
                    <div className="sc_table_row">
                        {sc_table_col(++count, "sc_small_col")}
                        {sc_table_col(
                            sc_sanc_loan_data[i]["LOAN_ID"],
                            "sc_large_col"
                        )}
                        {sc_table_col(
                            sc_sanc_loan_data[i]["EMPLOYEE_NAME"],
                            "sc_large_col"
                        )}
                        {sc_table_col(
                            sc_sanc_loan_data[i]["DESIGNATION"],
                            "sc_large_col"
                        )}
                        {sc_table_col(
                            sc_sanc_loan_data[i]["OFFICE"],
                            "sc_small_col"
                        )}
                        {sc_table_col(
                            sc_sanc_loan_data[i]["CATEGORY"],
                            "sc_small_col"
                        )}
                        {sc_table_col(
                            dateFormation(
                                sc_sanc_loan_data[i]["DATE_OF_BIRTH"]
                            ),
                            "sc_small_col"
                        )}
                        {sc_table_col(
                            dateFormation(
                                sc_sanc_loan_data[i]["DATE_FIRST_JOIN"]
                            ),
                            "sc_small_col"
                        )}
                        {sc_table_col(
                            nf.format(sc_sanc_loan_data[i]["NET_SALARY"]),
                            "sc_small_col"
                        )}
                        {sc_table_col(
                            nf.format(sc_sanc_loan_data[i]["APPLY_AMOUNT"]),
                            "sc_small_col"
                        )}
                        {sc_table_col(
                            nf.format(sc_sanc_loan_data[i]["ALLOW_AMOUNT"]),
                            "sc_small_col"
                        )}
                        {sc_table_col(
                            nf.format(sc_sanc_loan_data[i]["SANCTION_AMOUNT"]),
                            "sc_large_col sc_bold"
                        )}
                        {sc_table_col(
                            nf.format(sc_sanc_loan_data[i]["RECOVERY_AMOUNT"]),
                            "sc_large_col"
                        )}
                        {sc_table_col(
                            nf.format(sc_sanc_loan_data[i]["INSTALL_AMOUNT"]),
                            "sc_small_col"
                        )}
                        {sc_table_col(
                            nf.format(sc_sanc_loan_data[i]["TOTAL_INTEREST"]),
                            "sc_small_col"
                        )}
                        {sc_table_col(
                            sc_sanc_loan_data[i]["INSTALL_NO"],
                            "sc_small_col"
                        )}
                        {sc_table_col(
                            sc_sanc_loan_data[i]["BANK_ACCOUNT_NO"],
                            "sc_small_col"
                        )}
                        {/* {sc_table_col(" ", "sc_small_col")}
                        {sc_table_col(" ", "sc_small_col")} */}
                    </div>
                );

                if (selectedLoan[sc_sanc_loan_data[i]["LOAN_ID"]]) {
                    total_sanction += Number(
                        sc_sanc_loan_data[i]["SANCTION_AMOUNT"]
                    );
                }
            }
        }
        sc_sanc_loan_display.push(
            <div className="sc_table_row">
                {sc_table_col(" ", "sc_small_col")}
                {sc_table_col(" ", "sc_small_col")}
                {sc_table_col(" ", "sc_small_col")}
                {sc_table_col(" ", "sc_small_col")}
                {sc_table_col(" ", "sc_small_col")}
                {sc_table_col(" ", "sc_small_col")}
                {sc_table_col(" ", "sc_small_col")}
                {sc_table_col(" ", "sc_small_col")}
                {sc_table_col(" ", "sc_small_col")}
                {sc_table_col(" ", "sc_small_col")}
                {sc_table_col("TOTAL", "sc_large_col sc_bold")}
                {sc_table_col(
                    nf.format(total_sanction),
                    "sc_large_col sc_bold"
                )}
            </div>
        );
    }

    console.log(sc_sanc_loan_data);

    return (
        <>
            <NavBar hide={{ nav_mid: true }} />

            <div className="sanction_copy">
                <div className="sc_page_title">
                    {sc_loan_type} Sanction Copy
                </div>

                {/* <Paper sx={{ height: 400, width: "100%" }}>
                    <DataGrid
                        rows={sc_sanc_loan_data}
                        getRowId={(row) => row.LOAN_ID}
                        columns={scColumns}
                        initialState={{ pagination: { paginationModel } }}
                        pageSizeOptions={[5, 10]}
                        checkboxSelection
                        sx={{ border: 0 }}
                    />
                </Paper> */}

                <div className="sc_table">
                    <div className="sc_table_row sc_bold">
                        {sc_sent_from == "acct_fund" ? (
                            <input className="sc_checkbox" type="checkbox" />
                        ) : (
                            ""
                        )}

                        {sc_table_col("SL NO", "sc_small_col")}
                        {sc_table_col("LOAN ID", "sc_large_col")}
                        {sc_table_col("NAME", "sc_large_col")}
                        {sc_table_col("DESIGNATION", "sc_large_col")}
                        {sc_table_col("OFFICE", "sc_small_col")}
                        {sc_table_col("CATEGORY", "sc_small_col")}
                        {sc_table_col("BIRTH DATE", "sc_small_col")}
                        {sc_table_col("JOINING DATE", "sc_small_col")}
                        {sc_table_col("NET PAY", "sc_small_col")}
                        {sc_table_col("APPLY AMOUNT", "sc_small_col")}
                        {sc_table_col("ALLOW AMOUNT", "sc_small_col")}
                        {sc_table_col("SANCTION AMOUNT", "sc_large_col")}
                        {sc_table_col("RECOVERY AMOUNT", "sc_large_col")}
                        {sc_table_col("INSTALL AMOUNT", "sc_small_col")}
                        {sc_table_col("TOTAL INTEREST", "sc_small_col")}
                        {sc_table_col("INST NO", "sc_small_col")}
                        {sc_table_col("ACCOUNT NO", "sc_small_col")}
                        {/* {sc_table_col("LAST AP N", "sc_small_col")}
                        {sc_table_col("LAST LOAN D", "sc_small_col")} */}
                    </div>
                    {sc_sanc_loan_display}
                </div>

                <div className="sc_in_words">
                    <div className="sc_text">
                        In Words : {InWords(total_sanction)} TK. Only
                    </div>
                </div>

                <SanctionCopyForm
                    loan_type={sc_loan_type}
                    app_pos={sc_app_pos}
                    sanctionedLoan={selectedLoan}
                    sentFrom={sc_sent_from}
                />
            </div>

            <Footer />
        </>
    );
}
