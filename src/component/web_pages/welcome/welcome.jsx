import React, { useState } from "react";
import "./welcome.css";
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'

import NavBar from "../../page_compo/navBar/navBar";
import Footer from "../../page_compo/footer/footer";

export default function Welcome(){

    const [buttonHovering, setButtonHovering] = useState(false);
    const [button2Hovering, setButton2Hovering] = useState(false);

    // const spanStyle = {
    //     padding: '2rem',
    //     background: '#efefef',
    //     color: '#000000'
    // }
        
    const divStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundSize: 'cover',
        height: '100vh'
    }

    const buttonStyle = {
        height: "50px",
        width: "50px",
        padding: "12px",
        background: buttonHovering ? "#3f8ba8" : "#ffffff",
        border: buttonHovering ? '2px Solid #ffffff' : '2px Solid #3f8ba8',
        borderRadius: "50px",
        marginLeft: "20px",
        marginRight: "20px"
    };

    const button2Style = {
        height: "50px",
        width: "50px",
        padding: "12px",
        background: button2Hovering ? "#3f8ba8" : "#ffffff",
        border: button2Hovering ? '2px Solid #ffffff' : '2px Solid #3f8ba8',
        borderRadius: "50px",
        marginLeft: "20px",
        marginRight: "20px"
    };
    
    const properties = {
        prevArrow: <button onMouseEnter={() => setButtonHovering(true)} onMouseLeave={() => setButtonHovering(false)} style={{ ...buttonStyle }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill={buttonHovering ? "#ffffff" : "#3f8ba8"}><path d="M242 180.6v-138L0 256l242 213.4V331.2h270V180.6z"/></svg></button>,
        nextArrow: <button onMouseEnter={() => setButton2Hovering(true)} onMouseLeave={() => setButton2Hovering(false)} style={{ ...button2Style }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill={button2Hovering ? "#ffffff" : "#3f8ba8"}><path d="M512 256L270 42.6v138.2H0v150.6h270v138z"/></svg></button>
    }

    const slideImages = [
        {
            url: 'https://s3.ap-south-1.amazonaws.com/gotouniv/cover_photo/2277/cover_photo_1500X500.jpg',
            caption: 'Slide 1'
        },
        {
            url: 'https://upload.wikimedia.org/wikipedia/commons/7/72/Registrar_Building_BUET_1.A.M.R.jpg',
            caption: 'Slide 2'
        },
        {
            url: 'https://www.tbsnews.net/sites/default/files/styles/big_3/public/images/2019/10/10/buet.jpg',
            caption: 'Slide 3'
        },
    ];



    return(
        <>
            <NavBar />

            <div className="welcome_body">

                <div className="photo_anime">
                    <Slide {...properties}>
                        {slideImages.map((slideImage, index)=> (
                            <div key={index}>
                                <div style={{ ...divStyle, 'backgroundImage': `url(${slideImage.url})` }}>
                                    {/* <span style={spanStyle}>{slideImage.caption}</span> */}
                                </div>
                            </div>
                        ))} 
                    </Slide>

                </div>

                






            </div>


            <Footer />
            
        </>
    );
}


