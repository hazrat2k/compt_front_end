import React from "react";
import { useNavigate } from "react-router";

import "./logo.css";
import logo_image from "../../../assets/images/logo.png";

export default function Logo() {
    const logoNavigate = useNavigate();

    return (
        <div
            className="logo"
            onClick={() => {
                logoNavigate("/");
            }}
        >
            <div className="logo_img">
                <img className="l_img" src={logo_image} alt="BUET Logo" />
            </div>

            <div className="logo_text">
                <div className="logo_text_1">
                    বাংলাদেশ প্রকৌশল বিশ্ববিদ্যালয়
                </div>
                <div className="logo_text_2">
                    ল্যাপটপ, ভোগ্যপণ্য, মোটরযান ক্রয়/গৃহ নির্মাণ/মেরামত, জমি
                    ক্রয় ও সোনালী ব্যাংক হোলসেল ঋণের জন্য আবেদন
                </div>
            </div>
        </div>
    );
}
