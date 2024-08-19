import React from "react";
import "../styles/css/personnelLogin.css";


import NavBar from "../jsx_compo/navBar";


export default function PersonnelLogin(){
    const pass_info = {nav_mid: true};

    return(
        <>
            <NavBar hide={{nav_mid: true}} />

            <div>
                Personnel Login
            </div>

        </>
    );
}