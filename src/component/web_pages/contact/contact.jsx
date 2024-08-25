import React from "react";
import "./contact.css";

import NavBar from "../../page_compo/navBar/navBar";
import Footer from "../../page_compo/footer/footer";

export default function Contact(){
    return(
        <>
            <NavBar hide={{nav_mid: true}} />
            <div>
                Contact
            </div>

            <Footer />
        </>
    );
}
