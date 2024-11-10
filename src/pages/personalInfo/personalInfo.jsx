import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import axios from "axios";
import moment from "moment";

import "./personalInfo.css";

import NavBar from "../../component/page_compo/navBar/navBar";
import Footer from "../../component/page_compo/footer/footer";

import ToTitleCase from "../../utils/functions/toTitleCase";
import DataField from "../../component/loan_apply/dataField/dataField";
import nomineeRelations from "../../stores/const/nomineeRelations";
import DoubleButton from "../../component/loan_apply/doubleButton/doubleButton";

export default function PersonalInfo() {
    const personalNavigate = useNavigate();
    const { state } = useLocation();

    const [salary_file, setSalary_file] = useState([]);

    var personal_data = state["info"];

    useEffect(() => {
        const fetch_salServ_data = async () => {
            try {
                const res = await axios.post("http://localhost:8800/salary", {
                    SALARY_ID: personal_data["EMPLOYEEID"],
                });
                setSalary_file(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetch_salServ_data();
    }, []);

    var state_used = "no";

    if (state["used"] === "yes") {
        state_used = "yes";
    }

    if (state["used"] === "no") {
        personal_data["MOTHERS_NAME"] = "";
        personal_data["NOMINEES_NAME"] = "";
        personal_data["NOMINEES_RELSHIP"] = "";
        personal_data["NOMINEES_NID"] = "";
    }

    const piFatherNameRef = useRef(null);
    const piMotherNameRef = useRef(null);
    const piNomineeNameRef = useRef(null);
    const piNomineeRelshipRef = useRef(null);
    const piDOBRef = useRef(null);
    const piNIDRef = useRef(null);
    const piNomineeNIDRef = useRef(null);

    const scrollToSection = (elementRef) => {
        window.scrollTo({
            top: elementRef.current.offsetTop,
            behavior: "smooth",
        });
    };

    const fatherName = personal_data["FATHERS_NAME"];

    const [motherName, setMotherName] = useState(personal_data["MOTHERS_NAME"]);
    const [motherNameError, setMotherNameError] = useState("");

    const [nomineeName, setNomineeName] = useState(
        personal_data["NOMINEES_NAME"]
    );
    const [nomineeNameError, setNomineeNameError] = useState("");

    const [nomineeRelship, setNomineeRelship] = useState(
        personal_data["NOMINEES_RELSHIP"]
    );
    const [nomineeRelshipError, setNomineeRelshipError] = useState("");

    const dob = moment(new Date(personal_data["DATE_OF_BIRTH"])).format(
        "DD MMM YYYY"
    );
    // const [nID, setNID] = useState(personal_data["NID_NO"]);

    const [nomineeNID, setNomineeNID] = useState(personal_data["NOMINEES_NID"]);
    const [nomineeNIDError, setNomineeNIDError] = useState("");

    const presentAddressValue = personal_data["ADDRESS"];
    const permanantAddressValue = personal_data["ADDRESS"];

    const validPersonalInfo = () => {
        if (motherName == "") {
            setMotherNameError("আপনার মাতার নাম লিখুন***");
            scrollToSection(piMotherNameRef);
            return false;
        } else {
            setMotherNameError("");
        }

        if (nomineeName == "") {
            setNomineeNameError("আপনার নমিনীর নাম লিখুন***");
            scrollToSection(piNomineeNameRef);
            return false;
        } else {
            setNomineeNameError("");
        }

        if (nomineeRelship == "" || nomineeRelship === undefined) {
            setNomineeRelshipError("আপনার সাথে নমিনীর সম্পর্ক লিখুন***");
            scrollToSection(piNomineeRelshipRef);
            return false;
        } else {
            setNomineeRelshipError("");
        }

        if (nomineeNID == "") {
            setNomineeNIDError("নমিনীর জাতীয় পরিচয়পত্র নম্বর লিখুন***");
            scrollToSection(piNomineeNIDRef);
            return false;
        } else if (nomineeNID.length != 10 || Number(nomineeNID.length) <= 0) {
            setNomineeNIDError("সঠিক জাতীয় পরিচয়পত্র নম্বর লিখুন***");
            scrollToSection(piNomineeNIDRef);
            return false;
        } else {
            setNomineeNIDError("");
        }

        return true;
    };

    const onPersonalAuthenticate = (button) => {
        if (button == "first") {
            personalNavigate("/application/1", {
                state: { info: personal_data, used: "yes" },
            });
        }

        if (button == "second") {
            if (validPersonalInfo()) {
                personal_data["MOTHERS_NAME"] = motherName;
                personal_data["NOMINEES_NAME"] = nomineeName;

                console.log(personal_data["NOMINEES_RELSHIP"]);
                console.log(nomineeRelship["title"]);

                if (state["used"] === "no") {
                    personal_data["NOMINEES_RELSHIP"] = nomineeRelship["title"];
                } else if (
                    nomineeRelship["title"] !== undefined &&
                    personal_data["NOMINEES_RELSHIP"] != nomineeRelship["title"]
                ) {
                    personal_data["NOMINEES_RELSHIP"] = nomineeRelship["title"];
                }
                // personal_data["NID_NO"] = nID;
                personal_data["NOMINEES_NID"] = nomineeNID;

                const file = { salary: salary_file };
                personalNavigate("/application/3", {
                    state: {
                        info: personal_data,
                        file: file,
                        used: state_used,
                    },
                });
            }
        }
    };

    return (
        <div>
            <NavBar hide={{ nav_mid: true }} />

            <div className="perInfo">
                <div className="basic_label">
                    {ToTitleCase(personal_data["LOAN_TYPE"])} Application Form
                </div>
                <div className="personalInfo">
                    <div className="personalInfoLabel">
                        ৭. ব্যক্তিগত তথ্যাবলী :
                    </div>

                    <DataField
                        refer={piFatherNameRef}
                        type="data"
                        label="ক) পিতা/স্বামীর নাম "
                        value={fatherName}
                    />

                    <DataField
                        refer={piMotherNameRef}
                        helperText={motherNameError}
                        type="input"
                        dataType="text"
                        label="খ) মাতার নাম "
                        value={motherName}
                        setValue={(data) => {
                            setMotherName(data);
                        }}
                        placeholder="i.e. ANOWARA BEGUM"
                    />

                    <DataField
                        refer={piNomineeNameRef}
                        helperText={nomineeNameError}
                        type="input"
                        dataType="text"
                        label="গ) নমিনীর নাম "
                        value={nomineeName}
                        setValue={(data) => {
                            setNomineeName(data);
                        }}
                        placeholder="i.e. TAHMID AHMED"
                    />

                    <DataField
                        refer={piNomineeRelshipRef}
                        helperText={nomineeRelshipError}
                        type="suggestedInput"
                        label="ঘ) আপনার সাথে নমিনীর সম্পর্ক "
                        options={nomineeRelations}
                        value={nomineeRelship}
                        setValue={(data) => {
                            setNomineeRelship(data);
                        }}
                        placeholder="i.e. SON"
                    />

                    <DataField
                        refer={piFatherNameRef}
                        type="data"
                        label="ঙ) বর্তমান ঠিকানা "
                        value={presentAddressValue}
                    />

                    <DataField
                        refer={piFatherNameRef}
                        type="data"
                        label="চ) স্থায়ী ঠিকানা "
                        value={permanantAddressValue}
                    />

                    <DataField
                        refer={piDOBRef}
                        type="data"
                        label="ছ) জন্ম তারিখ "
                        value={dob}
                    />

                    {/* <DataField
                        refer={piNIDRef}
                        type="data"
                        label="জ) আবেদনকারীর জাতীয় পরিচয়পত্র নম্বর "
                        value={nID}
                    /> */}

                    <DataField
                        refer={piNomineeNIDRef}
                        helperText={nomineeNIDError}
                        type="input"
                        dataType="number"
                        label="জ) নমিনীর জাতীয় পরিচয়পত্র নম্বর"
                        value={nomineeNID}
                        setValue={(data) => {
                            setNomineeNID(data);
                        }}
                        placeholder="i.e. 1234567890"
                    />
                </div>

                <DoubleButton
                    firstButtonName="Previous"
                    secondButtonName="Next"
                    clickedButton={(clicked) => {
                        onPersonalAuthenticate(clicked);
                    }}
                />
            </div>

            <Footer />
        </div>
    );
}
