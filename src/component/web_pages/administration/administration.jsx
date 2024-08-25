import React from "react";
import "./administration.css";

import NavBar from "../../page_compo/navBar/navBar";
import Footer from "../../page_compo/footer/footer";

export default function Administration(){
    return(
        <>
            <NavBar hide={{nav_mid: true}} />
            <div>
                Administration
            </div>

            <Footer />
        </>
    );
}