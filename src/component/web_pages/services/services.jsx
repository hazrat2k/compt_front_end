import React from "react";
import "./services.css";

import NavBar from "../../page_compo/navBar/navBar";
import Footer from "../../page_compo/footer/footer";

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
