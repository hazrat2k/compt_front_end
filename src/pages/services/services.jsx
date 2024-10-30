import React from "react";
import "./services.css";

import NavBar from "../../component/page_compo/navBar/navBar";
import Footer from "../../component/page_compo/footer/footer";

export default function Services(){
    return(
        <>
            <NavBar hide={{nav_mid: true}} />
            <div>
                Services
            </div>

            <Footer />
        </>
    );
}
