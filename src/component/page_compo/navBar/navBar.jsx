import React, { useState, useEffect } from "react";
import { gsap } from "gsap";
import { useNavigate } from "react-router";
import { useMediaQuery } from 'react-responsive';
import "./navBar.css";
import Logo from "../logo/logo";

export default function NavBar(props){


    const navNavigate = useNavigate();

    var tl = gsap.timeline({ defaults: { duration: 0.5, ease: 'expo.inOut' } });
    var isMobile = useMediaQuery({query: '(max-width: 600px)'});
    var height_ = isMobile ? "40vh" : "80vh";

    var nav_mid_display = (

        <div className="navbar_middle_items">
            <div className="nav_mid mem_login" onClick={() => {navNavigate("/login");}}>
                Personnel Login
            </div>

            <div className="nav_mid loan_apply" onClick={() => {navNavigate("/loanApplication");}}>
                Loan Application
            </div>
        </div>
    );


    if(props.hide !== undefined){
        if(props.hide["nav_mid"]){
            nav_mid_display = [];
        }
    }
        

    const onNavOpen = () => {

        if (tl.reversed()) {
            tl.play();
        } else {
            tl.to('.nav_items_with_close', { right: "-50vw"})
                .to('.nav_items_with_close', { opacity: 1, right: 0})
                .to('.nav_items_with_close', { height: height_ }, '-=.1')
                .to('.navbar_item', { opacity: 1, pointerEvents: 'all', stagger: .2 }, '-=.8')
                .to('.close', { opacity: 1, pointerEvents: 'all' }, "-=.8");
                
        }

    };


    const onNavClose = () => {
        tl.reverse();
    };


    const [padVal, setpadVal] = useState("5rem");
    const [height, setheight] = useState("9rem");
    const listenScrollEvent = () => {
        window.scrollY > 10 ? setpadVal("1rem") : setpadVal("5rem");
        window.scrollY > 10 ? setheight("6rem") : setheight("9rem");
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        window.addEventListener("scroll", listenScrollEvent);
        return () => {
          window.removeEventListener("scroll", listenScrollEvent);
        };
      }, []);

    return(
        <> 
            <div className="logo_and_navbar" style={{height: height,paddingLeft: padVal, paddingRight: padVal, transition: "all 0.5s"}}>
                <div className="logo_with_nav_mid">

                    <Logo />
                    {nav_mid_display}
                    
                </div>


                <div className="navbar_items">

                    <div className="container" onClick={onNavOpen}>
                        <div className="bars"></div>
                    </div>

                    <div className="nav_items_with_close">
                        <div className="close" onClick={onNavClose} >
                            <div></div>
                        </div>

                        <div className="nav_items">
                            <div className="navbar_item nav_about" onClick={() => {navNavigate("/aboutus")}}>
                                About Us
                            </div>

                            <div className=" navbar_item nav_personnel" onClick={() => {navNavigate("/administration")}}>
                                Administration
                            </div>

                            <div className="navbar_item nav_services" onClick={() => {navNavigate("/services")}}>
                                Services
                            </div>

                            <div className="navbar_item nav_sections" onClick={() => {navNavigate("/sections")}}>
                                Sections
                            </div>

                            <div className="navbar_item nav_downloads" onClick={() => {navNavigate("/downloads")}}>
                                Downloads
                            </div>

                            <div className="navbar_item nav_notices" onClick={() => {navNavigate("/notices")}}>
                                Notices
                            </div>

                            <div className="navbar_item nav_contact" onClick={() => {navNavigate("/contact")}}>
                                Contact
                            </div>
                        </div>
                    </div>




                </div>
                
            </div>
        </>

    );
}