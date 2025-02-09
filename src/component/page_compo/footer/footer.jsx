import React, { useState } from "react";
import "./footer.css";
import Logo from "../logo/logo";
import { useNavigate } from "react-router";

export default function Footer() {
    const footerNavigate = useNavigate();
    return (
        <>
            <div className="footer_plate">
                <div className="logo_with_imp_links">
                    <Logo />

                    <div className="footer_imp_links">
                        <div className="footer_label">Important Links :</div>

                        <a
                            href="https://www.buet.ac.bd/"
                            style={{ textDecoration: "none" }}
                        >
                            <div className="imp_link">BUET Home</div>
                        </a>

                        <a
                            href="http://regoffice.buet.ac.bd/"
                            style={{ textDecoration: "none" }}
                        >
                            <div className="imp_link">Registrar Office</div>
                        </a>

                        <a
                            href="https://ictcell.buet.ac.bd/"
                            style={{ textDecoration: "none" }}
                        >
                            <div className="imp_link">ICT Cell</div>
                        </a>

                        <a
                            href="https://www.buet.ac.bd/web/#/notice/0"
                            style={{ textDecoration: "none" }}
                        >
                            <div className="imp_link">BUET Notice</div>
                        </a>
                    </div>

                    <div className="footer_contact">
                        <div className="footer_label">Contact :</div>

                        <a href="/contact" style={{ textDecoration: "none" }}>
                            <div className="contact_details">
                                Comptroller Office, <br />
                                Ground Floor, Dr. M. A. Rashid Administrative
                                Building, <br />
                                East BUET Campus, BUET, Dhaka - 1000,
                                Bangladesh. <br />
                                Phone: +880-22-23365615
                                <br />
                                Email: comp@comp.buet.ac.bd <br />
                            </div>
                        </a>
                    </div>
                </div>

                <div className="footer_copyright">
                    <div className="cr_text">
                        © {new Date().getFullYear()}, All Right Reserved by
                    </div>

                    <a href="/" style={{ textDecoration: "none" }}>
                        <div className="cr_link">
                            Comptroller Office - BUET.
                        </div>
                    </a>
                </div>
            </div>
        </>
    );
}
