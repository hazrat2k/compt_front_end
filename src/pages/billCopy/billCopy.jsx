import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import axios from "axios";

import "./billCopy.css";

import NavBar from "../../component/page_compo/navBar/navBar";
import Footer from "../../component/page_compo/footer/footer";

import { dateFormation } from "../../utils/functions/dateFormation";

import InWords from "../../utils/functions/inWords";

import { backend_site_address } from "../../stores/const/siteAddress";
import BillCopyForm from "../../utils/pdfCopy/billCopyForm";
import BankCopyForm from "../../utils/pdfCopy/bankCopyForm";
import useLoanTypeStore from "../../stores/loanTypeStore";

export default function BillCopy() {
    const bcLoanType = useLoanTypeStore((state) => state.loanType);

    const { state } = useLocation();

    const bc_loan_type = bcLoanType;

    const bc_sent_from = state["sentFrom"];

    const bc_sanc_status = bc_sent_from == "acct_fund" ? "BILL" : "BILLED";

    const bc_app_pos = state["app_pos"];

    const [selectedLoan, setSelectedLoan] = useState(state["billedLoan"]);

    var billStatus = false;

    const [bc_sanc_loan_data, setBc_sanc_loan_data] = useState([]);
    const bc_sanc_loan_display = useState([]);
    const sal_sanc_loan_display = useState([]);

    const [selectedCategory, setSelectedCategory] = useState("null");

    let nf = new Intl.NumberFormat("en-US");

    useEffect(() => {
        const fetch_bill_loan_data = async () => {
            const uploadLoanType = {
                LOAN_TYPE: bc_loan_type,
                SANC_STATUS: bc_sanc_status,
            };

            try {
                const sanc_res = await axios.post(
                    "http://" + backend_site_address + "/sanction_loan",
                    uploadLoanType
                );
                setBc_sanc_loan_data(sanc_res.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetch_bill_loan_data();
    }, []);

    const bc_table_col = (value, cn) => {
        cn = "bc_table_col " + cn;
        return (
            <div className={cn}>
                <div className="bc_table_cell">{value}</div>
            </div>
        );
    };

    const sal_table_col = (value, cn) => {
        cn = "sal_table_col " + cn;
        return (
            <div className={cn}>
                <div className="sal_table_cell">{value}</div>
            </div>
        );
    };

    const onCheckBoxChange = (e) => {
        const l_id = e.target.name;

        var temp = { ...selectedLoan };

        temp[l_id] = !temp[l_id];

        setSelectedLoan(temp);
    };

    var count = 0;

    var total_sanction = 0;

    if (bc_sent_from == "acct_fund") {
        count = 0;
        total_sanction = 0;

        for (let i = 0; i < bc_sanc_loan_data.length; i++) {
            if (bc_sanc_loan_data[i]["CATEGORY"] == selectedCategory) {
                billStatus = true;
                bc_sanc_loan_display.push(
                    <div className="bc_table_row">
                        <input
                            type="checkbox"
                            name={bc_sanc_loan_data[i]["LOAN_ID"]}
                            checked={
                                selectedLoan[bc_sanc_loan_data[i]["LOAN_ID"]]
                            }
                            onChange={onCheckBoxChange}
                        />
                        {bc_table_col(++count, "small_col")}
                        {bc_table_col(
                            bc_sanc_loan_data[i]["LOAN_ID"],
                            "large_col"
                        )}
                        {bc_table_col(
                            bc_sanc_loan_data[i]["EMPLOYEE_NAME"],
                            "large_col"
                        )}
                        {bc_table_col(
                            bc_sanc_loan_data[i]["DESIGNATION"],
                            "large_col"
                        )}
                        {bc_table_col(
                            bc_sanc_loan_data[i]["OFFICE"],
                            "small_col"
                        )}
                        {bc_table_col(
                            dateFormation(
                                bc_sanc_loan_data[i]["DATE_OF_BIRTH"]
                            ),
                            "small_col"
                        )}
                        {bc_table_col(
                            dateFormation(
                                bc_sanc_loan_data[i]["DATE_FIRST_JOIN"]
                            ),
                            "small_col"
                        )}
                        {bc_table_col(
                            nf.format(bc_sanc_loan_data[i]["NET_SALARY"]),
                            "small_col"
                        )}
                        {bc_table_col(
                            nf.format(bc_sanc_loan_data[i]["APPLY_AMOUNT"]),
                            "small_col"
                        )}
                        {bc_table_col(
                            nf.format(bc_sanc_loan_data[i]["ALLOW_AMOUNT"]),
                            "small_col"
                        )}
                        {bc_table_col(
                            nf.format(bc_sanc_loan_data[i]["SANCTION_AMOUNT"]),
                            "large_col"
                        )}
                        {bc_table_col(
                            nf.format(bc_sanc_loan_data[i]["RECOVERY_AMOUNT"]),
                            "large_col"
                        )}
                        {bc_table_col(
                            bc_sanc_loan_data[i]["INSTALL_NO"],
                            "small_col"
                        )}
                        {bc_table_col(
                            nf.format(bc_sanc_loan_data[i]["INSTALL_AMOUNT"]),
                            "small_col"
                        )}
                        {bc_table_col(" ", "small_col")}
                        {bc_table_col(
                            nf.format(bc_sanc_loan_data[i]["SANCTION_AMOUNT"]),
                            "small_col bc_bold"
                        )}
                        {bc_table_col(10, "small_col")}
                        {bc_table_col(
                            nf.format(
                                bc_sanc_loan_data[i]["SANCTION_AMOUNT"] - 10
                            ),
                            "small_col bc_bold"
                        )}
                    </div>
                );
                sal_sanc_loan_display.push(
                    <div className="bc_table_row">
                        <input
                            type="checkbox"
                            name={bc_sanc_loan_data[i]["LOAN_ID"]}
                            checked={
                                selectedLoan[bc_sanc_loan_data[i]["LOAN_ID"]]
                            }
                            onChange={onCheckBoxChange}
                        />
                        {sal_table_col(count)}
                        {sal_table_col(bc_sanc_loan_data[i]["EMPLOYEE_ID"])}
                        {sal_table_col(bc_sanc_loan_data[i]["EMPLOYEE_NAME"])}
                        {sal_table_col(bc_sanc_loan_data[i]["DESIGNATION"])}
                        {sal_table_col(bc_sanc_loan_data[i]["OFFICE"])}
                        {sal_table_col(bc_sanc_loan_data[i]["BANK_ACCOUNT_NO"])}
                        {sal_table_col(
                            nf.format(
                                bc_sanc_loan_data[i]["SANCTION_AMOUNT"] - 10
                            ),
                            "bc_bold"
                        )}
                    </div>
                );
                total_sanction += Number(
                    bc_sanc_loan_data[i]["SANCTION_AMOUNT"]
                );
            }
        }
    } else {
        count = 0;
        total_sanction = 0;

        for (let i = 0; i < bc_sanc_loan_data.length; i++) {
            if (selectedLoan[bc_sanc_loan_data[i]["LOAN_ID"]]) {
                billStatus = true;
                bc_sanc_loan_display.push(
                    <div className="bc_table_row">
                        {bc_table_col(++count, "small_col")}
                        {bc_table_col(
                            bc_sanc_loan_data[i]["LOAN_ID"],
                            "large_col"
                        )}
                        {bc_table_col(
                            bc_sanc_loan_data[i]["EMPLOYEE_NAME"],
                            "large_col"
                        )}
                        {bc_table_col(
                            bc_sanc_loan_data[i]["DESIGNATION"],
                            "large_col"
                        )}
                        {bc_table_col(
                            bc_sanc_loan_data[i]["OFFICE"],
                            "small_col"
                        )}
                        {bc_table_col(
                            dateFormation(
                                bc_sanc_loan_data[i]["DATE_OF_BIRTH"]
                            ),
                            "small_col"
                        )}
                        {bc_table_col(
                            dateFormation(
                                bc_sanc_loan_data[i]["DATE_FIRST_JOIN"]
                            ),
                            "small_col"
                        )}
                        {bc_table_col(
                            nf.format(bc_sanc_loan_data[i]["NET_SALARY"]),
                            "small_col"
                        )}
                        {bc_table_col(
                            nf.format(bc_sanc_loan_data[i]["APPLY_AMOUNT"]),
                            "small_col"
                        )}
                        {bc_table_col(
                            nf.format(bc_sanc_loan_data[i]["ALLOW_AMOUNT"]),
                            "small_col"
                        )}
                        {bc_table_col(
                            nf.format(bc_sanc_loan_data[i]["SANCTION_AMOUNT"]),
                            "large_col"
                        )}
                        {bc_table_col(
                            nf.format(bc_sanc_loan_data[i]["RECOVERY_AMOUNT"]),
                            "large_col"
                        )}
                        {bc_table_col(
                            bc_sanc_loan_data[i]["INSTALL_NO"],
                            "small_col"
                        )}
                        {bc_table_col(
                            nf.format(bc_sanc_loan_data[i]["INSTALL_AMOUNT"]),
                            "small_col"
                        )}
                        {bc_table_col(" ", "small_col")}
                        {bc_table_col(
                            nf.format(bc_sanc_loan_data[i]["SANCTION_AMOUNT"]),
                            "small_col bc_bold"
                        )}
                        {bc_table_col(10, "small_col")}
                        {bc_table_col(
                            nf.format(
                                bc_sanc_loan_data[i]["SANCTION_AMOUNT"] - 10
                            ),
                            "small_col bc_bold"
                        )}
                    </div>
                );

                sal_sanc_loan_display.push(
                    <div className="bc_table_row">
                        {sal_table_col(count)}
                        {sal_table_col(bc_sanc_loan_data[i]["EMPLOYEE_ID"])}
                        {sal_table_col(bc_sanc_loan_data[i]["EMPLOYEE_NAME"])}
                        {sal_table_col(bc_sanc_loan_data[i]["DESIGNATION"])}
                        {sal_table_col(bc_sanc_loan_data[i]["OFFICE"])}
                        {sal_table_col(bc_sanc_loan_data[i]["BANK_ACCOUNT_NO"])}
                        {sal_table_col(
                            nf.format(
                                bc_sanc_loan_data[i]["SANCTION_AMOUNT"] - 10
                            ),
                            "bc_bold"
                        )}
                    </div>
                );

                total_sanction += Number(
                    bc_sanc_loan_data[i]["SANCTION_AMOUNT"]
                );
            }
        }
    }

    bc_sanc_loan_display.push(
        <div className="bc_table_row">
            {bc_table_col(" ", "small_col")}
            {bc_table_col(" ", "large_col")}
            {bc_table_col(" ", "large_col")}
            {bc_table_col(" ", "small_col")}
            {bc_table_col(" ", "small_col")}
            {bc_table_col(" ", "small_col")}
            {bc_table_col(" ", "large_col")}
            {bc_table_col(" ", "large_col")}
            {bc_table_col(" ", "large_col")}
            {bc_table_col(" ", "large_col")}
            {bc_table_col(" ", "large_col")}
            {bc_table_col(" ", "large_col")}
            {bc_table_col(" ", "large_col")}
            {bc_table_col(" ", "large_col")}
            {bc_table_col(" ", "large_col")}
            {bc_table_col("TOTAL", "small_col bc_bold")}
            {bc_table_col(nf.format(total_sanction), "large_col sc_bold")}
            {bc_table_col(" ", "small_col")}
            {bc_table_col(
                nf.format(total_sanction - count * 10),
                "large_col sc_bold"
            )}
        </div>
    );

    sal_sanc_loan_display.push(
        <div className="bc_table_row sc_bold">
            {sal_table_col("")}
            {sal_table_col("")}
            {sal_table_col("")}
            {sal_table_col("")}
            {sal_table_col("")}
            {sal_table_col("TOTAL")}
            {sal_table_col(nf.format(total_sanction - count * 10))}
        </div>
    );

    return (
        <>
            <NavBar hide={{ nav_mid: true }} />

            <div className="bill_copy">
                {bc_sent_from == "acct_fund" ? (
                    <select
                        className="bc_select"
                        onChange={(e) => {
                            setSelectedCategory(e.target.value);
                        }}
                    >
                        <option value="null">Select a Category......</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                    </select>
                ) : (
                    ""
                )}

                <div className="bc_page_title">{bc_loan_type} Bill Copy</div>

                {billStatus ? (
                    <>
                        <div className="bc_table">
                            <div className="bc_table_row bc_bold">
                                {bc_sent_from == "acct_fund" ? (
                                    <input
                                        className="sc_checkbox"
                                        type="checkbox"
                                    />
                                ) : (
                                    ""
                                )}
                                {bc_table_col("SL NO", "small_col")}
                                {bc_table_col("LOAN ID", "large_col")}
                                {bc_table_col("NAME", "large_col")}
                                {bc_table_col("DESIGNATION", "large_col")}
                                {bc_table_col("OFFICE/ DEPT.", "small_col")}
                                {bc_table_col("BIRTH DATE", "small_col")}
                                {bc_table_col("JOINING DATE", "small_col")}
                                {bc_table_col("NET PAY", "small_col")}
                                {bc_table_col("APPLY AMOUNT", "small_col")}
                                {bc_table_col("ALLOW AMOUNT", "small_col")}
                                {bc_table_col("SANCTION AMOUNT", "large_col")}
                                {bc_table_col("RECOVERY AMOUNT", "large_col")}
                                {bc_table_col("INST NO", "small_col")}
                                {bc_table_col("INSTALL AMOUNT", "small_col")}
                                {bc_table_col(" ", "small_col")}
                                {bc_table_col("BILL AMOUNT", "small_col")}
                                {bc_table_col("REVENUE STAMP", "small_col")}
                                {bc_table_col("NET PAY", "small_col")}
                            </div>
                            {bc_sanc_loan_display}
                        </div>

                        <div className="bc_in_words">
                            In Words :
                            <div className="bc_text">
                                {InWords(total_sanction - count * 10)}
                            </div>
                            TK. Only
                        </div>

                        {bc_sent_from == "acct_fund" ? (
                            <BillCopyForm
                                category={selectedCategory}
                                loan_type={bc_loan_type}
                                billedLoan={selectedLoan}
                                sentFrom={bc_sent_from}
                            />
                        ) : (
                            ""
                        )}
                    </>
                ) : (
                    <div className="no_billing_loan">
                        No bill copy is available for {selectedCategory + " "}
                        category
                    </div>
                )}

                <div className="bc_page_title">{bc_loan_type} Bank Copy</div>

                {billStatus ? (
                    <>
                        <div className="bc_table">
                            <div className="bc_table_row bc_bold">
                                {bc_sent_from == "acct_fund" ? (
                                    <input
                                        className="sc_checkbox"
                                        type="checkbox"
                                    />
                                ) : (
                                    ""
                                )}
                                {sal_table_col("SERIAL NO")}
                                {sal_table_col("BUET ID")}
                                {sal_table_col("EMPLOYEE NAME")}
                                {sal_table_col("DESIGNATION")}
                                {sal_table_col("OFFICE/ DEPT.")}
                                {selectedCategory == "ALL"
                                    ? sal_table_col("CATEGORY")
                                    : ""}
                                {sal_table_col("ACCOUNT NO")}
                                {sal_table_col("NET PAY")}
                            </div>
                            {sal_sanc_loan_display}
                        </div>

                        <div className="bc_in_words">
                            In Words :
                            <div className="bc_text">
                                {InWords(total_sanction - count * 10)}
                            </div>
                            TK. Only
                        </div>

                        <BankCopyForm
                            category={selectedCategory}
                            loan_type={bc_loan_type}
                            app_pos={bc_app_pos}
                            billedLoan={selectedLoan}
                            sentFrom={bc_sent_from}
                        />
                    </>
                ) : (
                    <div className="no_billing_loan">
                        No bank copy is available for {selectedCategory + " "}
                        category
                    </div>
                )}
            </div>

            <Footer />
        </>
    );
}
