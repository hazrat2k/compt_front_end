import React from "react";
import "./contact.css";

import NavBar from "../../component/page_compo/navBar/navBar";
import Footer from "../../component/page_compo/footer/footer";

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
