import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import "./personeelDash.css";
import useLoanTypeStore from "../../stores/loanTypeStore";

import NavBar from "../../component/page_compo/navBar/navBar";
import Footer from "../../component/page_compo/footer/footer";
import usePersonnelDataStore from "../../stores/personnelDataStore";
import { Button } from "@mui/material";

export default function PersoneelDash() {
    const pdLoanType = useLoanTypeStore((state) => state.loanType);
    const pdSetLoanType = useLoanTypeStore((state) => state.setLoanType);

    const pd_data = usePersonnelDataStore((state) => state.personnelData);

    const pd_navigate = useNavigate();

    const pd_userName = pd_data["USER_ID"];
    const pd_buet_id = pd_data["EMPLOYEE_ID"];
    const pd_pers_nam = pd_data["EMPLOYEE_NAME"];
    const pd_desig = pd_data["DESIGNATION"];
    const pd_off_dept = pd_data["OFFICE"];

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }, []);

    const pdSectionItem = (label, value) => {
        return (
            <div className="pd_section_item">
                <div className="pd_section_item_label">{label}</div>
                <div className="pd_section_item_colon">:</div>
                <div className="pd_section_item_value">{value}</div>
            </div>
        );
    };

    return (
        <>
            <NavBar hide={{ nav_mid: true }} />

            <div className="personnel_dashboard">
                <div className="pd_page_label">Personnel Dashboard</div>

                <div className="pd_section">
                    <div className="pd_section_label">
                        Personal Information :
                    </div>

                    <div className="pd_section_items profile">
                        <div className="pd_section_items_div">
                            {pdSectionItem("BUET ID", pd_buet_id)}
                            {pdSectionItem("Designation", pd_desig)}
                        </div>
                        <div className="section_items_div">
                            {pdSectionItem("Personnel Name", pd_pers_nam)}
                            {pdSectionItem("Office/Dept.", pd_off_dept)}
                        </div>
                    </div>
                </div>

                <div className="ld_button">
                    <div
                        className="ld_forward"
                        onClick={() => {
                            pd_navigate("/login");
                        }}
                    >
                        Log out
                    </div>
                </div>

                <div className="pd_section">
                    <div className="pd_section_label">Module :</div>

                    <div className="ld_button">
                        <Button
                            href="/processing_loan"
                            variant="outlined"
                            style={{
                                fontWeight: "bold",
                                fontFamily: "PT Serif",
                                fontSize: "12pt",
                            }}
                        >
                            Loan Processing
                        </Button>
                        <Button
                            href="/cashbook"
                            variant="outlined"
                            style={{
                                fontWeight: "bold",
                                fontFamily: "PT Serif",
                                fontSize: "12pt",
                            }}
                        >
                            Cash Book
                        </Button>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}
