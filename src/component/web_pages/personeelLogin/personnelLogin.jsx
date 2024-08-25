import React from "react";
import "./personnelLogin.css";


import NavBar from "../../page_compo/navBar/navBar";
import Footer from "../../page_compo/footer/footer";


export default function PersonnelLogin(){
    const pass_info = {nav_mid: true};

    return(
        <>
            <NavBar hide={{nav_mid: true}} />

            <div>
                Personnel Login
            </div>

            <Footer />

        </>
    );
}