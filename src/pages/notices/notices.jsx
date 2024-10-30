import React from "react";
import "./notices.css";

import NavBar from "../../component/page_compo/navBar/navBar";
import Footer from "../../component/page_compo/footer/footer";

export default function Notices(){
    return(
        <>
            <NavBar hide={{nav_mid: true}} />
            <div>
                Notices
            </div>

            <Footer />
        </>
    );
}
