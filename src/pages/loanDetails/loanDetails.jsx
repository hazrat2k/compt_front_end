import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";

import loanPersonnel from "../../stores/const/loanPersonnel";
import AppStatus from "../../utils/functions/appStatus";

import axios from "axios";

import "./loanDetails.css";

import SectionEditItem from "../../component/loan_details/sectionItemEdit";

import { dateFormation } from "../../utils/functions/dateFormation";
import { timeDuration } from "../../utils/functions/timeDuration";

import NavBar from "../../component/page_compo/navBar/navBar";
import Footer from "../../component/page_compo/footer/footer";
import LoanAssesmentForm from "../../utils/pdfCopy/loanAssesmentForm";
import OfficeOrderCopy from "../../utils/pdfCopy/officeOrderCopy";
import { backend_site_address } from "../../stores/const/siteAddress";
import LoanAmountCheck from "../../utils/functions/loanAmountCheck";
import LoanInstallmentNoCheck from "../../utils/functions/loanInstallmentNoCheck";
import CalculateInterest from "../../utils/functions/calculateInterest";

export default function LoanDetails() {
    const ld_navigate = useNavigate();
    const { state } = useLocation();

    const ld_data = state["data"];

    const ld_loan_data = ld_data["loan_data"];

    const [ld_pers_data, setLd_pers_data] = useState([]);
    const [ld_pl_prev_loan_1, setLd_pl_prev_loan_1] = useState([]);
    const [ld_pl_prev_loan_2, setLd_pl_prev_loan_2] = useState([]);
    const [ld_pl_remarks, setLd_pl_remarks] = useState([]);

    const principal_installment_percentage = 66.66;

    const [ld_basic_salary, setLd_basic_salary] = useState(
        Number(ld_loan_data[0]["LAST_MON_BASIC_SAL"])
    );
    const [ld_gross_salary, setLd_gross_salary] = useState(
        Number(ld_loan_data[0]["LAST_MON_TOTAL_SAL"])
    );
    const [ld_total_deduct, setLd_total_deduct] = useState(
        Number(ld_loan_data[0]["LAST_MON_TOTAL_DEDUCT"])
    );

    const [ld_remarks, setLd_remarks] = useState("");
    const [ld_remarks_error, setLd_remarks_error] = useState(false);

    const pension_rate_table = [
        0, 0, 0, 0, 0, 21, 24, 27, 30, 33, 36, 39, 43, 47, 51, 54, 57, 63, 65,
        69, 72, 75, 79, 83, 87, 90,
    ];

    const interest_rate = 7.75;
    const rounding_figure = 10000;
    var ld_value = {};
    var ld_loan_type = "";
    var temp_status = Number(ld_data["APP_POS"]);
    const ld_user = ld_data["sendFrom"] === loanPersonnel[temp_status];
    var temp_status_t = AppStatus(temp_status);
    var ld_processing = true;
    var ld_duration = [];
    const ld_comment_display = [];
    const ld_remarks_display = [];
    var ld_gra_rate = 0;
    var ld_pens_rate = 0;
    var calc_mon = 0;
    var available_ins_amount = 0;
    var temp_prop_amnt = 0;
    var temp_inst_amnt = 0;
    let principal_installment_no = 0;
    let interest_installment_no = 0;
    let principal_amount = 0;
    let principal_installment_amount = 0;
    let interest_amount = 0;
    let interest_installment_amount = 0;
    let check_installment_amount = 0;
    var ld_personnel_data = [];
    let nf = new Intl.NumberFormat("en-IN");

    const remarksItem = (label, value) => {
        return (
            <div className="remarks_item">
                <div className="remarks_item_label sec_item_def">
                    {AppStatus(label)}
                </div>
                <div className="section_item_colon sec_item_def">:</div>
                <div className="section_item_value">{value}</div>
            </div>
        );
    };

    const sectionItem = (index, label, value) => {
        return (
            <div className="section_item">
                <div className="sec_item_def">{index}</div>
                <div className="section_item_colon sec_item_def">.</div>
                <div className="section_item_label sec_item_def">{label}</div>
                <div className="section_item_colon sec_item_def">:</div>
                <div className="section_item_value">{value}</div>
            </div>
        );
    };

    const onForwardClick = async (e) => {
        e.preventDefault();

        if (ld_remarks === "") {
            setLd_remarks_error(true);
            return;
        } else {
            setLd_remarks_error(false);
        }

        if (
            ld_user &&
            ld_data["sendFrom"] == "dc_audit" &&
            temp_status < 6 &&
            ld_value["inst_amnt"] != 0
        ) {
            try {
                await axios.post(
                    "http://" + backend_site_address + "/sanction_register",
                    ld_value
                );
            } catch (err) {
                console.log(err);
            }
        }

        if (ld_user && ld_data["sendFrom"] == "compt" && temp_status > 13) {
            try {
                await axios.put(
                    "http://" + backend_site_address + "/sanction",
                    {
                        loan_id: ld_value["loan_id"],
                        status: "BILL",
                    }
                );
            } catch (err) {
                console.log(err);
            }
        }

        const updateRemarksData = {
            LOAN_ID: ld_value["loan_id"],
            REMARKER: temp_status,
            REMARKS: ld_remarks,
        };

        try {
            await axios.put(
                "http://" +
                    backend_site_address +
                    "/processing_loan_remarks_update",
                updateRemarksData
            );

            ld_navigate("/personnel_dashboard", {
                state: {
                    data: ld_personnel_data,
                    loan_type: ld_value["loan_type"],
                },
            });
        } catch (err) {
            console.log(err);
        }
    };

    const onBackwardClick = async () => {
        if (ld_remarks === "") {
            setLd_remarks_error(true);
            return;
        } else {
            setLd_remarks_error(false);
        }

        if (ld_data["sendFrom"] == "acct_fund") {
            try {
                await axios.put("http://" + backend_site_address + "/rejBack");

                ld_navigate("/personnel_dashboard", {
                    state: {
                        data: ld_personnel_data,
                        loan_type: ld_value["loan_type"],
                    },
                });
            } catch (err) {
                console.log(err);
            }
        }
    };

    useEffect(() => {
        const fetch_data = async () => {
            try {
                var uploadData = {
                    USERNAME: ld_data["sendFrom"],
                };

                const pers_data_res = await axios.post(
                    "http://" + backend_site_address + "/personeel_login",
                    uploadData
                );
                setLd_pers_data(pers_data_res.data);

                uploadData = {
                    LOAN_ID: ld_data["LOAN_ID"],
                };

                const prev_loan_1_res = await axios.post(
                    "http://" +
                        backend_site_address +
                        "/processing_loan_prev_loan_1",
                    uploadData
                );
                setLd_pl_prev_loan_1(prev_loan_1_res.data);

                const prev_loan_2_res = await axios.post(
                    "http://" +
                        backend_site_address +
                        "/processing_loan_prev_loan_2",
                    uploadData
                );
                setLd_pl_prev_loan_2(prev_loan_2_res.data);

                const remarks_res = await axios.post(
                    "http://" +
                        backend_site_address +
                        "/processing_loan_remarks",
                    uploadData
                );
                setLd_pl_remarks(remarks_res.data);
            } catch (err) {
                console.log(err);
            }
        };
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        fetch_data();
    }, []);

    const ldInit = () => {};

    ld_value["loan_id"] = ld_data["LOAN_ID"];
    ld_value["loan_app_date"] = new Date(
        ld_data["LOAN_APP_DATE"]
    ).toLocaleDateString("en-US");
    ld_value["salary_id"] = ld_data["SALARY_ID"];
    ld_value["loan_type"] = ld_data["LOAN_TYPE"];
    ld_value["buet_id"] = ld_data["EMPLOYEE_ID"];
    ld_value["applicant_name"] = ld_data["EMPLOYEE_NAME"];
    ld_value["designation"] = ld_data["DESIGNATION"];
    ld_value["account_no"] = ld_data["ACCOUNT_NO"];
    ld_value["category"] = ld_data["CATEGORY"];
    ld_value["office_dept"] = ld_data["OFFICE"];
    ld_value["account_no"] = ld_data["BANK_ACCOUNT_NO"];
    ld_value["category"] = ld_data["CATEGORY"];

    ld_loan_type = ld_value["loan_type"].toLowerCase();

    ld_value["dob"] = new Date(ld_data["DATE_OF_BIRTH"]).toLocaleDateString(
        "en-US"
    );

    ld_value["joining_date"] = new Date(
        ld_data["DATE_FIRST_JOIN"]
    ).toLocaleDateString("en-US");

    ld_value["mos"] = new Date(
        ld_data["DATE_OF_RETIREMENT"]
    ).toLocaleDateString("en-US");

    ld_value["serv_len_y"] = Number(
        ld_data["TOTAL_SERVICE_PERIOD"].split(" ")[0]
    );

    ld_duration = timeDuration(ld_data["DATE_OF_RETIREMENT"], new Date());

    ld_value["rem_serv_m"] = ld_duration[0] * 12 + ld_duration[1];

    ld_value["basic_salary"] = ld_basic_salary;
    ld_value["gross_salary"] = ld_gross_salary;
    ld_value["deduct"] = ld_total_deduct;
    ld_value["net_salary"] = 0;

    ld_value["pens_gra"] = 0;
    ld_value["leav_sal"] = 0;
    // ld_value["25_mon_gran"] = 0;
    ld_value["tot_rec"] = 0;

    ld_value["hb_loan"] = 0;
    ld_value["consu_loan"] = 0;
    ld_value["lap_loan"] = 0;
    ld_value["sblws_loan"] = 0;
    ld_value["sblh_loan"] = 0;
    ld_value["tot_pay"] = 0;
    ld_value["net_rec"] = 0;

    ld_value["hb_loan_ins_amnt"] = 0;
    ld_value["consu_loan_ins_amnt"] = 0;
    ld_value["lap_loan_ins_amnt"] = 0;
    ld_value["sblws_loan_ins_amnt"] = 0;
    ld_value["sblh_loan_ins_amnt"] = 0;
    ld_value["tot_loan_ins_amnt"] = 0;

    ld_value["75_pens"] = 0;
    ld_value["app_amnt"] = Number(ld_data["LOAN_AMOUNT"]);
    ld_value["prop_amnt"] = 0;
    ld_value["inst_amnt"] = 0;
    ld_value["tot_no_ins"] = 0;
    ld_value["tot_ins_amnt"] = 0;
    ld_value["60_basic_sal"] = 0;

    if (ld_value["serv_len_y"] >= 5 && ld_value["serv_len_y"] < 10) {
        ld_gra_rate = 265;
    } else if (ld_value["serv_len_y"] >= 10 && ld_value["serv_len_y"] < 15) {
        ld_gra_rate = 260;
    } else if (ld_value["serv_len_y"] >= 15 && ld_value["serv_len_y"] < 20) {
        ld_gra_rate = 245;
    } else if (ld_value["serv_len_y"] >= 20) {
        ld_gra_rate = 230;
    }

    ld_pens_rate =
        ld_value["serv_len_y"] > 25
            ? pension_rate_table[25]
            : pension_rate_table[ld_value["serv_len_y"]];

    // for (let i = 0; i < ld_pl_sal.length; i++) {
    //     ld_value["basic_salary"] = Number(ld_pl_sal[0]["LAST_MON_BASIC_SAL"]);
    //     ld_value["gross_salary"] = Number(ld_pl_sal[0]["LAST_MON_TOTAL_SAL"]);
    //     ld_value["deduct"] = Number(ld_pl_sal[0]["LAST_MON_TOTAL_DEDUCT"]);
    // }

    ld_value["net_salary"] = ld_gross_salary - ld_total_deduct;

    ld_value["pens_gra"] = Math.round(
        (ld_basic_salary * 0.5 * ld_pens_rate * ld_gra_rate) / 100
    );
    //ld_value["25_mon_gran"] = ld_value["serv_len_y"] * ld_basic_salary;
    ld_value["tot_rec"] = ld_value["pens_gra"] + ld_value["leav_sal"];

    for (let i = 0; i < ld_pl_prev_loan_1.length; i++) {
        ld_value["hb_loan"] = ld_pl_prev_loan_1[0]["HL_REM_INST_AMNT"];
        ld_value["consu_loan"] = ld_pl_prev_loan_1[0]["CL_REM_INST_AMNT"];
        ld_value["lap_loan"] = ld_pl_prev_loan_1[0]["LL_REM_INST_AMNT"];
        ld_value["sblws_loan"] = ld_pl_prev_loan_1[0]["SBWSL_REM_INST_AMNT"];

        ld_value["hb_loan_ins_amnt"] = ld_pl_prev_loan_1[0]["HL_INST_AMNT"];
        ld_value["consu_loan_ins_amnt"] = ld_pl_prev_loan_1[0]["CL_INST_AMNT"];
        ld_value["lap_loan_ins_amnt"] = ld_pl_prev_loan_1[0]["LL_INST_AMNT"];
        ld_value["sblws_loan_ins_amnt"] =
            ld_pl_prev_loan_1[0]["SBWSL_INST_AMNT"];
    }

    for (let i = 0; i < ld_pl_prev_loan_2.length; i++) {
        ld_value["sblh_loan"] = ld_pl_prev_loan_2[0]["SBHL_REM_INST_AMNT"];

        ld_value["sblh_loan_ins_amnt"] = ld_pl_prev_loan_2[0]["SBHL_INST_AMNT"];
    }

    ld_value["tot_pay"] =
        ld_value["hb_loan"] +
        ld_value["consu_loan"] +
        ld_value["lap_loan"] +
        ld_value["sblws_loan"] +
        ld_value["sblh_loan"];

    ld_value["net_rec"] = ld_value["tot_rec"] - ld_value["tot_pay"];

    ld_value["tot_loan_ins_amnt"] =
        ld_value["hb_loan_ins_amnt"] +
        ld_value["consu_loan_ins_amnt"] +
        ld_value["lap_loan_ins_amnt"] +
        ld_value["sblws_loan_ins_amnt"] +
        ld_value["sblh_loan_ins_amnt"];

    ld_value["75_pens"] = Math.round(ld_value["pens_gra"] * 0.75);

    ld_value["60_basic_sal"] = Math.round(ld_basic_salary * 0.6);

    calc_mon = 0;

    available_ins_amount =
        ld_value["60_basic_sal"] - ld_value["tot_loan_ins_amnt"];

    temp_prop_amnt =
        ld_value["app_amnt"] > ld_value["75_pens"]
            ? ld_value["75_pens"]
            : ld_value["app_amnt"];

    temp_prop_amnt = Math.floor(temp_prop_amnt / rounding_figure);

    temp_prop_amnt *= rounding_figure;

    temp_inst_amnt = LoanAmountCheck(
        ld_value["category"],
        ld_value["loan_type"],
        ld_value["app_amnt"]
    );


    if (ld_value["rem_serv_m"] < 10) {
        temp_prop_amnt = 0;
        temp_inst_amnt = 0;
        ld_value["tot_no_ins"] = 0;
        ld_processing = false;

        ld_comment_display.push(
            <div className="assessment_comment">
                - Remaining Service Period is less than 10 months.
            </div>
        );
    } else {
        calc_mon = LoanInstallmentNoCheck(
            ld_value["rem_serv_m"],
            ld_value["loan_type"]
        );

        // console.log("available_ins_amount : "+available_ins_amount);

        // console.log("temp_inst_amnt : "+temp_inst_amnt);

        principal_installment_no = Math.round(
            calc_mon * (principal_installment_percentage / 100)
        );

        interest_installment_no = calc_mon - principal_installment_no;

        principal_amount = ld_value["app_amnt"] + rounding_figure;

        do {
            principal_amount = principal_amount - rounding_figure;

            principal_installment_amount = Math.round(
                principal_amount / principal_installment_no
            );

            interest_amount = CalculateInterest(
                principal_amount,
                principal_installment_no
            );

            interest_installment_amount =
                interest_amount / interest_installment_no;

            check_installment_amount =
                interest_installment_amount > principal_installment_amount
                    ? interest_installment_amount
                    : principal_installment_amount;
        } while (check_installment_amount > available_ins_amount);

        // while (temp_inst_amnt > available_ins_amount) {
        //     temp_inst_amnt = Math.ceil(
        //         (2 * temp_prop_amnt * (1200 + calc_mon * interest_rate)) /
        //             (calc_mon *
        //                 (2400 - interest_rate + calc_mon * interest_rate))
        //     );
        //     temp_prop_amnt = temp_prop_amnt - rounding_figure;
        // }

        // console.log("amount : "+(temp_prop_amnt+rounding_figure)+", installment : "+temp_inst_amnt);
    }

    ld_value["pri_amnt"] = principal_amount;
    ld_value["pri_inst_no"] = principal_installment_no;
    ld_value["pri_first_inst_amnt"] =
        principal_amount -
        principal_installment_amount * (principal_installment_no - 1);
    ld_value["pri_inst_amnt"] = principal_installment_amount;

    ld_value["inter_amnt"] = interest_amount;
    ld_value["inter_inst_no"] = interest_installment_no;
    ld_value["inter_first_inst_amnt"] =
        interest_amount -
        interest_installment_amount * (interest_installment_no - 1);
    ld_value["inter_inst_amnt"] = interest_installment_amount;

    if (temp_prop_amnt != 0) {
        ld_value["prop_amnt"] = temp_prop_amnt + rounding_figure;
    }

    ld_value["tot_no_ins"] = calc_mon;

    ld_value["inst_amnt"] = temp_inst_amnt;

    ld_value["recov_amnt"] = calc_mon * temp_inst_amnt;

    ld_value["tot_intest"] = ld_value["recov_amnt"] - ld_value["prop_amnt"];

    ld_value["tot_ins_amnt"] =
        ld_value["tot_loan_ins_amnt"] + ld_value["inst_amnt"];

    for (let i = 0; i < ld_pl_remarks.length; i++) {
        for (let j = 0; j < temp_status; j++) {
            if (ld_pl_remarks[i][j + "_"] !== null) {
                ld_remarks_display.push(
                    remarksItem(j, ld_pl_remarks[i][j + "_"])
                );
            }
        }

        break;
    }

    if (ld_pers_data.length != 0) {
        ld_personnel_data = ld_pers_data[0];
    }

    const off_or_copy = {
        loan_id: ld_value["loan_id"],
        name: ld_value["applicant_name"],
        desig: ld_value["designation"],
        off_dept: ld_value["office_dept"],
        amnt: ld_value["prop_amnt"],
        ins_amnt: ld_value["inst_amnt"],
        tot_ins: ld_value["tot_no_ins"],
    };

    

    return (
        <>
            <NavBar hide={{ nav_mid: true }} />

            <div className="loan_assessment_form">
                <div className="page_label">{ld_loan_type} Assessment Form</div>

                <div className="assessment_section personal_information">
                    <div className="section_label">
                        A) Personal Information :
                    </div>

                    <div className="section_items">
                        <div className="section_items_div">
                            {sectionItem(
                                "1",
                                "Applicant Name",
                                ld_value["applicant_name"]
                            )}
                            {sectionItem(
                                "3",
                                "Office/Dept.",
                                ld_value["office_dept"]
                            )}
                            {sectionItem("5", "Category", ld_value["category"])}
                            {sectionItem("7", "Loan ID", ld_value["loan_id"])}

                            {sectionItem(
                                "9",
                                "Loan Type",
                                ld_value["loan_type"]
                            )}
                        </div>
                        <div className="section_items_div">
                            {sectionItem(
                                "2",
                                "Designation",
                                ld_value["designation"]
                            )}
                            {sectionItem("4", "BUET ID", ld_value["buet_id"])}
                            {sectionItem(
                                "6",
                                "Date of Birth",
                                dateFormation(ld_value["dob"])
                            )}
                            {sectionItem(
                                "8",
                                "Application Date",
                                dateFormation(ld_value["loan_app_date"])
                            )}

                            {ld_user
                                ? ""
                                : sectionItem(
                                      "10",
                                      "Application Status",
                                      temp_status_t
                                  )}
                        </div>
                    </div>
                </div>

                <div className="assessment_section employment_information">
                    <div className="section_label">
                        B) Employment Information :
                    </div>

                    <div className="section_items">
                        <div className="section_items_div">
                            {sectionItem(
                                "1",
                                "First Joining Date",
                                dateFormation(ld_value["joining_date"])
                            )}
                            {sectionItem(
                                "3",
                                "Remaining Service (No of Month)",
                                ld_value["rem_serv_m"]
                            )}
                        </div>
                        <div className="section_items_div">
                            {sectionItem(
                                "2",
                                "Service Length (Year)",
                                ld_value["serv_len_y"]
                            )}
                            {sectionItem(
                                "4",
                                "Retirement Date (Approx.)",
                                dateFormation(ld_value["mos"])
                            )}
                        </div>
                    </div>
                </div>

                <div className="assessment_section salary_information">
                    <div className="section_label">C) Salary Information :</div>

                    <div className="section_items">
                        <div className="section_items_div">
                            {sectionItem(
                                "1",
                                "Basic Salary",
                                nf.format(ld_basic_salary)
                            )}

                            {sectionItem(
                                "3",
                                "Deduction",
                                nf.format(ld_total_deduct)
                            )}
                        </div>
                        <div className="section_items_div">
                            {sectionItem(
                                "2",
                                "Gross Salary",
                                nf.format(ld_gross_salary)
                            )}
                            {sectionItem(
                                "4",
                                "Net Salary",
                                nf.format(ld_value["net_salary"])
                            )}
                        </div>
                    </div>
                </div>

                <div className="assessment_section financial_position">
                    <div className="section_label">D) Financial Position :</div>

                    <div className="subsection_label">Receivables</div>
                    <div className="section_items">
                        <div className="section_items_div">
                            {sectionItem(
                                "1",
                                "Pension/Gratuity",
                                nf.format(ld_value["pens_gra"])
                            )}
                        </div>
                        <div className="section_items_div">
                            {sectionItem(
                                "2",
                                "Leave Salary",
                                nf.format(ld_value["leav_sal"])
                            )}
                        </div>
                    </div>
                    {sectionItem(
                        "3",
                        "Total Receivable (TR) (1.+2.)",
                        nf.format(ld_value["tot_rec"])
                    )}

                    <div className="subsection_label">Payables</div>
                    <div className="section_items">
                        <div className="section_items_div">
                            {sectionItem(
                                "4",
                                "House Building Loan",
                                nf.format(ld_value["hb_loan"])
                            )}
                            {sectionItem(
                                "6",
                                "Laptop Loan",
                                nf.format(ld_value["lap_loan"])
                            )}
                            {sectionItem(
                                "8",
                                "SBL Multipurpose Loan",
                                nf.format(ld_value["sblws_loan"])
                            )}
                        </div>
                        <div className="section_items_div">
                            {sectionItem(
                                "5",
                                "Consumer Loan",
                                nf.format(ld_value["consu_loan"])
                            )}
                            {sectionItem(
                                "7",
                                "SBL House Loan",
                                nf.format(ld_value["sblh_loan"])
                            )}
                            {sectionItem(
                                "9",
                                "Total Payable (TP) (4.+5.+6.+7.+8.)",
                                nf.format(ld_value["tot_pay"])
                            )}
                        </div>
                    </div>

                    {sectionItem(
                        "10",
                        "Net Receivable (TR-TP) (3.-9.)",
                        nf.format(ld_value["net_rec"])
                    )}

                    <div className="subsection_label">
                        Installment Amount of Loan
                    </div>
                    <div className="section_items">
                        <div className="section_items_div">
                            {sectionItem(
                                "11",
                                "House Building Loan",
                                nf.format(ld_value["hb_loan_ins_amnt"])
                            )}
                            {sectionItem(
                                "13",
                                "Laptop Loan",
                                nf.format(ld_value["lap_loan_ins_amnt"])
                            )}

                            {sectionItem(
                                "15",
                                "SBL Multipurpose Loan",
                                nf.format(ld_value["sblws_loan_ins_amnt"])
                            )}
                        </div>
                        <div className="section_items_div">
                            {sectionItem(
                                "12",
                                "Consumer Loan",
                                nf.format(ld_value["consu_loan_ins_amnt"])
                            )}
                            {sectionItem(
                                "14",
                                "SBL House Loan",
                                nf.format(ld_value["sblh_loan_ins_amnt"])
                            )}

                            {sectionItem(
                                "16",
                                "Total Installment Amount of Loan (11.+12.+13.+14.+15.)",
                                nf.format(ld_value["tot_loan_ins_amnt"])
                            )}
                        </div>
                    </div>
                </div>

                <div className="assessment_section loan_assessment">
                    <div className="section_label">E) Loan Assessment :</div>

                    <div className="section_items">
                        <div className="section_items_div">
                            {sectionItem(
                                "1",
                                "75% of Pension",
                                nf.format(ld_value["75_pens"])
                            )}
                            {/* {
                            sectionItem(
                                "3",
                                "Proposed Amount",
                                nf.format(ld_value["prop_amnt"])
                            )}
                            {sectionItem(
                                "5",
                                "Total Number of Installment",
                                nf.format(ld_value["tot_no_ins"])
                            )}
                            {sectionItem(
                                "7",
                                "60% of Basic Salary",
                                nf.format(ld_value["60_basic_sal"])
                            )} */}
                            {sectionItem(
                                "3",
                                "Proposed Principal Amount",
                                nf.format(ld_value["pri_amnt"])
                            )}
                            {sectionItem(
                                "5",
                                "Proposed Principal Installment No",
                                nf.format(ld_value["pri_inst_no"])
                            )}
                            {sectionItem(
                                "7",
                                "Proposed Principal First Installment Amount",
                                nf.format(ld_value["pri_first_inst_amnt"])
                            )}
                            {sectionItem(
                                "9",
                                "Proposed Principal Installment Amount (PIA)",
                                nf.format(ld_value["pri_inst_amnt"])
                            )}

                            {sectionItem(
                                "11",
                                "Total Installment Amount with PIA (D16.+E9.)",
                                nf.format(
                                    ld_value["pri_inst_amnt"] +
                                        ld_value["tot_loan_ins_amnt"]
                                )
                            )}
                            {sectionItem(
                                "13",
                                "60% of Basic Salary",
                                nf.format(ld_value["60_basic_sal"])
                            )}
                        </div>
                        <div className="section_items_div">
                            {sectionItem(
                                "2",
                                "Applied Amount",
                                nf.format(ld_value["app_amnt"])
                            )}
                            {/* {sectionItem(
                                "4",
                                "Installment Amount",
                                nf.format(ld_value["inst_amnt"])
                            )}
                            {sectionItem(
                                "6",
                                "Total Installment Amount (D16.+E4.)",
                                nf.format(ld_value["tot_ins_amnt"])
                            )} */}
                            {sectionItem(
                                "4",
                                "Proposed Interest Amount",
                                nf.format(ld_value["inter_amnt"])
                            )}
                            {sectionItem(
                                "6",
                                "Proposed Interest Installment No",
                                nf.format(ld_value["inter_inst_no"])
                            )}
                            {sectionItem(
                                "8",
                                "Proposed Interest First Installment Amount",
                                nf.format(ld_value["inter_first_inst_amnt"])
                            )}
                            {sectionItem(
                                "10",
                                "Proposed Interest Installment Amount (IIA)",
                                nf.format(ld_value["inter_inst_amnt"])
                            )}
                            {sectionItem(
                                "12",
                                "Total Installment Amount with IIA (D16.+E10.)",
                                nf.format(
                                    ld_value["inter_inst_amnt"] +
                                        ld_value["tot_loan_ins_amnt"]
                                )
                            )}
                        </div>
                    </div>
                </div>

                {ld_processing ? (
                    ""
                ) : (
                    <div className="assessment_comment_label">
                        Comment :{ld_comment_display}
                    </div>
                )}

                <div className="assessment_section remarks">
                    <div className="section_label">F) Remarks :</div>

                    {ld_remarks_error ? (
                        <div className="remarks_input" style={{ color: "red" }}>
                            ***Remarks must be written
                        </div>
                    ) : (
                        ""
                    )}

                    <div className="remarks_items">
                        {ld_remarks_display}

                        {ld_user &&
                        (temp_status < 6 ||
                            (temp_status > 11 && temp_status < 15)) ? (
                            <div className="remarks_input_item">
                                <textarea
                                    className="remarks_input"
                                    placeholder="write your remarks about the loan"
                                    type="text"
                                    value={ld_remarks}
                                    onChange={(e) => {
                                        setLd_remarks(e.target.value);
                                    }}
                                />
                            </div>
                        ) : (
                            ""
                        )}
                    </div>
                </div>

                <div className="ld_button">
                    {ld_user &&
                    (temp_status < 6 ||
                        (temp_status > 11 && temp_status < 15)) ? (
                        <>
                            <div
                                className="ld_forward"
                                onClick={onForwardClick}
                            >
                                Forward
                            </div>

                            <div
                                className="ld_forward"
                                onClick={onBackwardClick}
                            >
                                {ld_data["sendFrom"] === "acct_fund"
                                    ? "Reject"
                                    : "Backward"}
                            </div>
                        </>
                    ) : (
                        ""
                    )}
                    {ld_data["sendFrom"] === "acct_fund" ? (
                        <LoanAssesmentForm lafData={ld_value} />
                    ) : (
                        ""
                    )}
                    {ld_data["sendFrom"] === "acct_fund" && temp_status > 11 ? (
                        <OfficeOrderCopy data={off_or_copy} />
                    ) : (
                        ""
                    )}
                </div>
            </div>

            <Footer />
        </>
    );
}
