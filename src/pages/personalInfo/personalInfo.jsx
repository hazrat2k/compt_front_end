import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import axios from "axios";
import moment from "moment";

import useLoanInfoStore from "../../stores/loanInfoStore";

import "./personalInfo.css";

import NavBar from "../../component/page_compo/navBar/navBar";
import Footer from "../../component/page_compo/footer/footer";

import { null_array } from "../../stores/const/nullArray";
import ToTitleCase from "../../utils/functions/toTitleCase";
import DataField from "../../component/loan_apply/dataField/dataField";
import nomineeRelations from "../../stores/const/nomineeRelations";
import DoubleButton from "../../component/loan_apply/doubleButton/doubleButton";

import { backend_site_address } from "../../stores/const/siteAddress";

export default function PersonalInfo() {
    const personalNavigate = useNavigate();
    const { state } = useLocation();

    const [salary_file, setSalary_file] = useState([]);

    var personal_data = state["info"];

    const addPersonalField = useLoanInfoStore((state) => state.addField);
    const personalDataField = useLoanInfoStore((state) => state.info);

    useEffect(() => {
        const fetch_salServ_data = async () => {
            try {
                const res = await axios.post(
                    "http://" + backend_site_address + "/salary",
                    {
                        SALARY_ID: personal_data["EMPLOYEEID"],
                    }
                );
                setSalary_file(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        fetch_salServ_data();
        addPersonalField("PRESENT_ADDRESS", personal_data["ADDRESS"]);
        addPersonalField("PERMANENT_ADDRESS", personal_data["ADDRESS"]);
        addPersonalField("CONTACT_NO", personal_data["CONTACT_NO"]);
    }, []);

    const piFatherNameRef = useRef(null);
    const piMotherNameRef = useRef(null);
    const piNomineeNameRef = useRef(null);
    const piNomineeRelshipRef = useRef(null);
    const piPresentAddressRef = useRef(null);
    const piPermanantAddressRef = useRef(null);
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

    const [motherNameError, setMotherNameError] = useState("");

    const [nomineeNameError, setNomineeNameError] = useState("");

    const [nomineeRelshipError, setNomineeRelshipError] = useState("");

    const dob = moment(new Date(personal_data["DATE_OF_BIRTH"])).format(
        "DD MMM YYYY"
    );
    // const [nID, setNID] = useState(personal_data["NID_NO"]);

    const [nomineeNIDError, setNomineeNIDError] = useState("");

    const [presentAddressValueError, setPresentAddressValueError] =
        useState("");

    const [permanentAddressValueError, setpermanentAddressValueError] =
        useState("");

    const [contactNumberError, setContactNumberError] = useState("");

    const validPersonalInfo = () => {
        if (null_array.includes(personalDataField["MOTHERS_NAME"])) {
            setMotherNameError("আপনার মাতার নাম লিখুন***");
            scrollToSection(piMotherNameRef);
            return false;
        } else {
            setMotherNameError("");
        }

        if (null_array.includes(personalDataField["NOMINEES_NAME"])) {
            setNomineeNameError("আপনার নমিনীর নাম লিখুন***");
            scrollToSection(piNomineeNameRef);
            return false;
        } else {
            setNomineeNameError("");
        }

        if (null_array.includes(personalDataField["NOMINEES_RELSHIP"])) {
            setNomineeRelshipError("আপনার সাথে নমিনীর সম্পর্ক লিখুন***");
            scrollToSection(piNomineeRelshipRef);
            return false;
        } else {
            setNomineeRelshipError("");
        }

        if (null_array.includes(personalDataField["PRESENT_ADDRESS"])) {
            setPresentAddressValueError("আপনার বর্তমান ঠিকানা লিখুন***");
            scrollToSection(piPresentAddressRef);
            return false;
        } else {
            setPresentAddressValueError("");
        }

        if (null_array.includes(personalDataField["PERMANENT_ADDRESS"])) {
            setpermanentAddressValueError("আপনার স্থায়ী ঠিকানা লিখুন***");
            scrollToSection(piPermanantAddressRef);
            return false;
        } else {
            setpermanentAddressValueError("");
        }

        const NidLength = [10, 13, 17];

        if (null_array.includes(personalDataField["NOMINEES_NID"])) {
            setNomineeNIDError("নমিনীর জাতীয় পরিচয়পত্র নম্বর লিখুন***");
            scrollToSection(piNomineeNIDRef);
            return false;
        } else if (
            !NidLength.includes(personalDataField["NOMINEES_NID"].length)
        ) {
            setNomineeNIDError("সঠিক জাতীয় পরিচয়পত্র নম্বর লিখুন***");
            scrollToSection(piNomineeNIDRef);
            return false;
        } else {
            setNomineeNIDError("");
        }

        if (null_array.includes(personalDataField["CONTACT_NO"])) {
            setContactNumberError("আপনার মোবাইল নং লিখুন***");
            scrollToSection(piNomineeNIDRef);
            return false;
        } else if (
            personalDataField["CONTACT_NO"].length != 11 ||
            !personalDataField["CONTACT_NO"].startsWith("01")
        ) {
            setContactNumberError("সঠিক মোবাইল নং লিখুন***");
            scrollToSection(piNomineeNIDRef);
            return false;
        } else {
            setContactNumberError("");
        }

        return true;
    };

    const onPersonalAuthenticate = (button) => {
        if (button == "first") {
            personalNavigate("/application/1", {
                state: { info: personal_data },
            });
        }

        if (button == "second") {
            if (validPersonalInfo()) {
                const file = { salary: salary_file };
                personalNavigate("/application/3", {
                    state: {
                        info: personal_data,
                        file: file,
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
                    {personalDataField["LOAN_TYPE"]} Application Form
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
                        value={personalDataField["MOTHERS_NAME"]}
                        setValue={(data) => {
                            addPersonalField("MOTHERS_NAME", data);
                        }}
                        placeholder="i.e. ANOWARA BEGUM"
                    />

                    <DataField
                        refer={piNomineeNameRef}
                        helperText={nomineeNameError}
                        type="input"
                        dataType="text"
                        label="গ) নমিনীর নাম "
                        value={personalDataField["NOMINEES_NAME"]}
                        setValue={(data) => {
                            addPersonalField("NOMINEES_NAME", data);
                        }}
                        placeholder="i.e. TAHMID AHMED"
                    />

                    <DataField
                        refer={piNomineeRelshipRef}
                        helperText={nomineeRelshipError}
                        type="suggestedInput"
                        label="ঘ) আপনার সাথে নমিনীর সম্পর্ক "
                        options={nomineeRelations}
                        value={personalDataField["NOMINEES_RELSHIP"]}
                        setValue={(data) => {
                            addPersonalField("NOMINEES_RELSHIP", data["title"]);
                        }}
                        placeholder="i.e. SON"
                    />

                    <DataField
                        refer={piFatherNameRef}
                        helperText={presentAddressValueError}
                        type="input"
                        dataType="text"
                        label="ঙ) বর্তমান ঠিকানা "
                        value={personalDataField["PRESENT_ADDRESS"]}
                        setValue={(data) => {
                            addPersonalField("PRESENT_ADDRESS", data);
                        }}
                    />

                    <DataField
                        refer={piFatherNameRef}
                        helperText={permanentAddressValueError}
                        type="input"
                        dataType="text"
                        label="চ) স্থায়ী ঠিকানা "
                        value={personalDataField["PERMANENT_ADDRESS"]}
                        setValue={(data) => {
                            addPersonalField("PERMANENT_ADDRESS", data);
                        }}
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
                        value={personalDataField["NOMINEES_NID"]}
                        setValue={(data) => {
                            addPersonalField("NOMINEES_NID", data);
                        }}
                        placeholder="i.e. 1234567890"
                    />

                    <DataField
                        refer={piNomineeNIDRef}
                        helperText={contactNumberError}
                        type="input"
                        dataType="number"
                        label="ঝ) মোবাইল নং"
                        value={personalDataField["CONTACT_NO"]}
                        setValue={(data) => {
                            addPersonalField("CONTACT_NO", data);
                        }}
                        placeholder="i.e. 01712334798"
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
