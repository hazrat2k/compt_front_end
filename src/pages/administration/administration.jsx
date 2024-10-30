import React from "react";
import "./administration.css";

import NavBar from "../../component/page_compo/navBar/navBar";
import Footer from "../../component/page_compo/footer/footer";

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