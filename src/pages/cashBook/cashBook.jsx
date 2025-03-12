import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import "./cashBook.css";

import NavBar from "../../component/page_compo/navBar/navBar";
import Footer from "../../component/page_compo/footer/footer";

import { Button } from "@mui/material";

export default function CashBook() {
    return (
        <>
            <NavBar hide={{ nav_mid: true }} />

            <div className="cash_book_dashboard">
                <div className="cb_page_label">Cash Book</div>

                <div className="pd_section">
                    <div className="ld_button">
                        <Button
                            href="/cashbook/newentry"
                            variant="outlined"
                            style={{
                                fontWeight: "bold",
                                fontFamily: "PT Serif",
                                fontSize: "12pt",
                            }}
                        >
                            New Entry
                        </Button>

                        <Button
                            href="/cashbook/preview"
                            variant="outlined"
                            style={{
                                fontWeight: "bold",
                                fontFamily: "PT Serif",
                                fontSize: "12pt",
                            }}
                        >
                            Preview Entry
                        </Button>

                        <Button
                            href="/cashbook/addheading"
                            variant="outlined"
                            style={{
                                fontWeight: "bold",
                                fontFamily: "PT Serif",
                                fontSize: "12pt",
                            }}
                        >
                            Add Heading
                        </Button>

                        <Button
                            href="/cashbook/receivepayment"
                            variant="outlined"
                            style={{
                                fontWeight: "bold",
                                fontFamily: "PT Serif",
                                fontSize: "12pt",
                            }}
                        >
                            Receive Payment
                        </Button>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}
