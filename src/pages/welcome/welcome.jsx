import React, { useState } from "react";
import "./welcome.css";
import { Slide } from "react-slideshow-image";
import { useMediaQuery } from "react-responsive";
import "react-slideshow-image/dist/styles.css";
import { primary, secondary } from "../../stores/const/colors";



import NavBar from "../../component/page_compo/navBar/navBar";
import Footer from "../../component/page_compo/footer/footer";
// import { isMobile } from "../../stores/const/mediaQuery";

export default function Welcome() {
    const [buttonHovering, setButtonHovering] = useState(false);
    const [button2Hovering, setButton2Hovering] = useState(false);
    var isMobile = useMediaQuery({ query: "(max-width: 600px)" });
    

    // const spanStyle = {
    //     padding: '2rem',
    //     background: '#efefef',
    //     color: '#000000'
    // }

    const divStyle = {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundSize: "cover",
        height: isMobile ? "30vh" : "100vh",
        //height: "100vh",
    };

    const diameter = "25px";

    const buttonStyle = {
        height: diameter,
        width: diameter,
        padding: "12px",
        background: "transparent",
        border: "2px Solid",
        borderColor: buttonHovering ? "transparent" : secondary,
        borderRadius: "50px",
        marginLeft: "20px",
        marginRight: "20px",
    };

    const button2Style = {
        height: diameter,
        width: diameter,
        padding: "12px",
        background: "transparent",
        border: "2px Solid",
        borderColor: button2Hovering ? "transparent" : secondary,
        borderRadius: "50px",
        marginLeft: "20px",
        marginRight: "20px",
    };

    const properties = {
        prevArrow: (
            <div
                onMouseEnter={() => setButtonHovering(true)}
                onMouseLeave={() => setButtonHovering(false)}
                style={{ ...buttonStyle }}
            >
                {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill={buttonHovering ? "#ffffff" : "#3f8ba8"}><path d="M242 180.6v-138L0 256l242 213.4V331.2h270V180.6z"/></svg> */}
                <svg
                    fill={buttonHovering ? "#ffffff" : secondary}
                    width={diameter}
                    height={diameter}
                    viewBox="0 0 32 32"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M 26 6 L 6 15.21875 L 6 16.78125 L 26 26 L 26 23.84375 L 9.46875 16 L 26 8.15625 Z" />
                </svg>
            </div>
        ),
        nextArrow: (
            <button
                onMouseEnter={() => setButton2Hovering(true)}
                onMouseLeave={() => setButton2Hovering(false)}
                style={{ ...button2Style }}
            >
                {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill={button2Hovering ? "#ffffff" : "#3f8ba8"}><path d="M512 256L270 42.6v138.2H0v150.6h270v138z"/></svg> */}
            </button>
        ),
    };

    const slideImages = [
        {
            url: "https://s3.ap-south-1.amazonaws.com/gotouniv/cover_photo/2277/cover_photo_1500X500.jpg",
            caption: "Slide 1",
        },
        {
            url: "https://upload.wikimedia.org/wikipedia/commons/7/72/Registrar_Building_BUET_1.A.M.R.jpg",
            caption: "Slide 2",
        },
        {
            url: "https://www.buet.ac.bd/web/assets/img/UgImg/large_new_1.jpg",
            caption: "Slide 3",
        },
        {
            url: "https://www.buet.ac.bd/web/assets/img/UgImg/large_new_2.jpg",
            caption: "Slide 4",
        },
        {
            url: "https://www.tbsnews.net/sites/default/files/styles/big_3/public/images/2019/10/10/buet.jpg",
            caption: "Slide 5",
        },
    ];

    return (
        <>
            <NavBar />

            <div className="welcome_body">
                <div className="photo_anime">
                    <Slide>
                        {slideImages.map((slideImage, index) => (
                            <div key={index}>
                                <div
                                    style={{
                                        ...divStyle,
                                        backgroundImage: `url(${slideImage.url})`,
                                    }}
                                >
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
