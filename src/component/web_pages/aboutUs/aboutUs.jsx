import React from "react";
import "./aboutUs.css";

import NavBar from "../../page_compo/navBar/navBar";
import Footer from "../../page_compo/footer/footer";


export default function AboutUs(){
    return(
        <>
            <NavBar hide={{nav_mid: true}} />
            <div>
                About Us
            </div>

            <Footer />
        </>
    );
}

