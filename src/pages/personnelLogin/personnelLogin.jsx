import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./personnelLogin.css";
import axios from "axios";

import TextField from "@mui/material/TextField";
import NavBar from "../../component/page_compo/navBar/navBar";
import Footer from "../../component/page_compo/footer/footer";

export default function PersonnelLogin() {
    const perLoginNavigate = useNavigate();

    var personeelData = [];

    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const [userError, setUserError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [matchError, setMatchError] = useState("");

    const onButtonClick = async (e) => {
        e.preventDefault();

        if (user === "") {
            setMatchError("");
            setUserError("***Please enter your username");
            return;
        } else {
            setUserError("");
        }

        if (password === "") {
            setMatchError("");
            setPasswordError("***Please enter a password");
            return;
        } else {
            setPasswordError("");
        }

        const uploadData = {
            USERNAME: user,
            PASSWORD: password,
        };

        try {
            const res = await axios.post(
                "http://localhost:8800/personeel_login",
                uploadData
            );
            personeelData = res.data;
        } catch (err) {
            console.log(err);
        }

        if (personeelData.offset == 0) {
            setMatchError("***Database Error");
            return;
        } else if (personeelData.length == 0) {
            setMatchError("***UserName and Password doesn't match.");
            return;
        } else {
            setMatchError("");
            perLoginNavigate("/personnel_dashboard", {
                state: { data: personeelData[0], loan_type: "null" },
            });
        }
    };

    return (
        <>
            <NavBar hide={{ nav_mid: true }} />

            <div className="personnel_login">
                <div className="mainContainer">
                    <div className="titleContainer">
                        <div>Personnel Login</div>
                    </div>
                    
                    <TextField
                        error={userError != ""}
                        id="outlined-basic"
                        label="User ID"
                        className="log_font"
                        variant="outlined"
                        value={user}
                        onChange={(e) => setUser(e.target.value)}
                        helperText={userError}
                        style={{
                            width: "300px",
                            marginBottom: "5px",
                        }}
                    />
                    <br />
                    <TextField
                        error={passwordError != ""}
                        id="outlined-basic"
                        label="Password"
                        type="password"
                        className="log_font"
                        variant="outlined"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        helperText={passwordError}
                        style={{
                            width: "300px",
                            marginBottom: "5px",
                        }}
                    />
                    <div className="login_text_area">
                        <div
                            className="inputButton not-selectable"
                            onClick={onButtonClick}
                        >
                            LOGIN
                        </div>
                    </div>

                    <label className="errorLabel">{matchError}</label>
                </div>
            </div>

            <Footer />
        </>
    );
}
