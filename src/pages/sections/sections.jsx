import React from "react";
import "./sections.css";

import NavBar from "../../component/page_compo/navBar/navBar";
import Footer from "../../component/page_compo/footer/footer";

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