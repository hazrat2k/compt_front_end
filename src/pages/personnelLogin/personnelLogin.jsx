import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./personnelLogin.css";
import axios from "axios";

import useLoanTypeStore from "../../stores/loanTypeStore";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import NavBar from "../../component/page_compo/navBar/navBar";
import Footer from "../../component/page_compo/footer/footer";
import { backend_site_address } from "../../stores/const/siteAddress";
import usePersonnelDataStore from "../../stores/personnelDataStore";

export default function PersonnelLogin() {
    const perLoginNavigate = useNavigate();

    const plSetPersonnelData = usePersonnelDataStore(
        (state) => state.setPersonnelData
    );

    const plResetPersonnelData = usePersonnelDataStore(
        (state) => state.resetPersonnelData
    );

    const resetLoanType = useLoanTypeStore((state) => state.resetLoanType);

    var personeelData = [];

    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const [userError, setUserError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [matchError, setMatchError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        resetLoanType();
        plResetPersonnelData();
    }, [resetLoanType, plResetPersonnelData]);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event) => {
        event.preventDefault();
    };

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
            USER_ID: user,
            PASSWORD: password,
        };

        try {
            const res = await axios.post(
                "http://" + backend_site_address + "/personeel_login",
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
            plSetPersonnelData(personeelData[0]);
            //perLoginNavigate("/personnel_dashboard");
            perLoginNavigate("/cashbook");
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

                    <FormControl
                        sx={{ width: "300px", marginBottom: "5px" }}
                        variant="outlined"
                    >
                        <InputLabel htmlFor="outlined-adornment-password">
                            Password
                        </InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-password"
                            type={showPassword ? "text" : "password"}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label={
                                            showPassword
                                                ? "hide the password"
                                                : "display the password"
                                        }
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        onMouseUp={handleMouseUpPassword}
                                        edge="end"
                                    >
                                        {showPassword ? (
                                            <VisibilityOff />
                                        ) : (
                                            <Visibility />
                                        )}
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Password"
                            className="log_font"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            helperText={passwordError}
                            error={passwordError != ""}
                        />
                    </FormControl>

                    <div className="login_text_area">
                        <div
                            className="inputButton not-selectable"
                            onClick={onButtonClick}
                        >
                            Login
                        </div>
                    </div>

                    <label className="errorLabel">{matchError}</label>
                </div>
            </div>

            <Footer />
        </>
    );
}
