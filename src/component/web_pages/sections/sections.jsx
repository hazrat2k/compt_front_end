import React from "react";
import "./sections.css";

import NavBar from "../../page_compo/navBar/navBar";
import Footer from "../../page_compo/footer/footer";

export default function Sections(){
    return(
        <>
            <NavBar hide={{nav_mid: true}} />
            <div>
                Sections
            </div>

            <Footer />
        </>
    );
}