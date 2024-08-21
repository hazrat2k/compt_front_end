import React, { useState } from "react";
import "../styles/css_compo/footer.css";
import Logo from "./logo";
import { useNavigate } from "react-router";

export default function Footer(){
    const footerNavigate = useNavigate();
    return(
        <>
            <div className="footer_plate">

                <div className="logo_with_imp_links">
                    
                    <Logo />
                        
                    <div className="footer_imp_links">

                        <div className="footer_label">
                            Important Links : 
                        </div>
                        
                        <div className="imp_link" onClick={() => {window.open("https://www.buet.ac.bd/")}}>
                            BUET Home
                        </div>

                        <div className="imp_link" onClick={() => {window.open("http://regoffice.buet.ac.bd/")}}>
                            Registrar Office
                        </div>

                        <div className="imp_link" onClick={() => {window.open("https://ictcell.buet.ac.bd/")}}>
                            ICT Cell 
                        </div>

                        <div className="imp_link" onClick={() => {window.open("https://www.buet.ac.bd/web/#/notice/0")}}>
                            BUET Notice
                        </div>

                    </div>

                    <div className="footer_contact">
                        <div className="footer_label">
                            Contact :
                        </div>
                        
                        <div className="contact_details" onClick={() => {footerNavigate("/contact")}}>
                            Comptroller Office, <br />
                            Ground Floor, Dr. M. A. Rashid Administrative Building, <br />
                            East BUET Campus, BUET, Dhaka - 1000, Bangladesh. <br />
                            Phone: 880-22-23365615<br />
                            Email: comp@comp.buet.ac.bd <br />
                        </div>

                    </div>

                </div>

                <div className="footer_copyright">
                    <div className="cr_text">
                        © 2024, All Right Reserved by 
                    </div>

                    <div className="cr_link" onClick={() => {footerNavigate("/")}}>
                        Comptroller Office - BUET.
                    </div>
                     
                </div>

            </div>


        </>
    );
}


