import React from "react";
import "./aboutUs.css";

import NavBar from "../../component/page_compo/navBar/navBar";
import Footer from "../../component/page_compo/footer/footer";


export default function AboutUs(){

    
    const icon_len_n = "256";
    const icon_len = icon_len_n+"pt";
    const icon_len_v = "0 0 "+icon_len_n+" "+icon_len_n;
    const icon_transform = "translate(0.000000, "+icon_len_n+") scale(0.100000,-0.100000)"
    


    return(
        <>
            <NavBar hide={{nav_mid: true}} />
            <div className="about_us_page">
                <div className="about_us_nav">
                    <div className="about_us_nav_items">
                        <div className="about_us_nav_item">
                            <div className="about_us_nav_item_icon">
                                {/* <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
                                    width={icon_len} height={icon_len} viewBox={icon_len_v}
                                    preserveAspectRatio="xMidYMid meet">
                                    <g transform={icon_transform}
                                        fill="#000000" stroke="none">
                                        <path d="M2240 5105 c-389 -48 -766 -188 -1091 -404 -504 -335 -871 -825
                                            -1043 -1395 -41 -132 -81 -333 -96 -468 -13 -125 -13 -431 0 -556 108 -1014
                                            825 -1880 1804 -2176 132 -41 333 -81 468 -96 125 -13 431 -13 556 0 592 63
                                            1141 332 1563 766 289 299 494 645 613 1038 74 243 106 468 106 746 0 209 -10
                                            324 -46 505 -181 920 -867 1676 -1768 1949 -132 41 -333 81 -468 96 -131 14
                                            -469 11 -598 -5z m695 -254 c998 -170 1758 -940 1922 -1946 25 -155 25 -535 0
                                            -690 -166 -1017 -935 -1786 -1952 -1952 -155 -25 -535 -25 -690 0 -1017 166
                                            -1786 935 -1952 1952 -25 155 -25 535 0 690 82 501 307 944 657 1295 386 385
                                            878 616 1435 674 107 11 464 -3 580 -23z"/>
                                        <path d="M2710 3831 c-58 -19 -110 -53 -154 -101 -132 -148 -85 -360 101 -452
                                            61 -30 76 -33 158 -33 76 0 99 4 145 26 109 51 174 137 187 246 12 110 -60
                                            233 -171 290 -43 23 -66 27 -146 30 -52 1 -106 -1 -120 -6z"/>
                                        <path d="M2425 2981 c-79 -11 -123 -23 -282 -78 l-131 -46 -21 -81 c-11 -44
                                            -19 -82 -17 -83 1 -1 37 9 79 22 136 44 253 28 292 -38 15 -24 19 -48 18 -98
                                            -3 -87 -20 -162 -109 -465 -40 -138 -80 -288 -88 -334 -20 -106 -20 -214 0
                                            -274 35 -103 161 -198 299 -226 69 -14 214 -7 303 14 57 14 267 87 300 105 11
                                            6 24 36 35 82 10 39 16 73 14 75 -1 2 -31 -6 -66 -16 -77 -25 -204 -27 -259
                                            -5 -113 45 -104 147 58 700 97 329 103 479 27 592 -83 122 -252 180 -452 154z"/>
                                    </g>
                                </svg> */}
                            </div>
                            <div className="about_us_nav_item_name">
                                About
                            </div>
                        </div>
                        <div className="about_us_nav_item">
                            <div className="about_us_nav_item_icon">

                            </div>
                            <div className="about_us_nav_item_name">
                                Message from Comptroller
                            </div>
                        </div>

                        <div className="about_us_nav_item">
                            <div className="about_us_nav_item_icon">

                            </div>
                            <div className="about_us_nav_item_name">
                                Organogram
                            </div>
                        </div>
                    </div>
                </div>

                <div className="about_us_display">

                </div>

            </div>

            <Footer />
        </>
    );
}

