import React from "react";
import "./reactFirst.css";

import NavBar from "../../component/page_compo/navBar/navBar";
import Footer from "../../component/page_compo/footer/footer";

export default function ReactFirst() {
    return (
        <>
            <NavBar hide={{ nav_mid: true }} />
            <div>React First</div>

            <Footer />
        </>
    );
}
