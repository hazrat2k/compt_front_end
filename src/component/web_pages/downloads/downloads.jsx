import React from "react";
import "./downloads.css";

import NavBar from "../../page_compo/navBar/navBar";
import Footer from "../../page_compo/footer/footer";

export default function Downloads(){
    return(
        <>
            <NavBar hide={{nav_mid: true}} />
            <div>
                Downloads
            </div>

            <Footer />
        </>
    );
}
