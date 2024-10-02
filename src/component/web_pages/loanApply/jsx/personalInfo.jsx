import React, {useState, useRef, useEffect} from 'react';
import { useNavigate, useLocation } from 'react-router';
import axios from 'axios';
import moment from 'moment';

import "../css/personalInfo.css";

import PiDataField from '../jsx_component/piDataField';
import Logo from '../jsx_component/logo';
import DoubleButton from '../jsx_component/doubleButton';


export default function PersonalInfo(){

    const personalNavigate = useNavigate();
    const { state } = useLocation();

    const [salary_file, setSalary_file] = useState([]);

    var personal_data = state["info"];
    
    useEffect( () => {
        const fetch_salServ_data = async () =>{
            try{
                const res = await axios.post("http://localhost:8800/salary", {"SALARY_ID" : personal_data["EMPLOYEEID"]});
                setSalary_file(res.data);

            }catch(err){
                console.log(err);
            }
        }
        fetch_salServ_data();
    }, []);


    var state_used = "no";
    
    if(state["used"] === "yes"){
        state_used = "yes";
    }
    
    if(state["used"] === "no"){
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


    const [fatherName, setFatherName] = useState(personal_data["FATHERS_NAME"]);

    const [motherName, setMotherName] = useState(personal_data["MOTHERS_NAME"]);
    const [motherNameError, setMotherNameError] = useState("");
    
    const [nomineeName, setNomineeName] = useState(personal_data["NOMINEES_NAME"]);
    const [nomineeNameError, setNomineeNameError] = useState("");

    const [nomineeRelship, setNomineeRelship] = useState(personal_data["NOMINEES_RELSHIP"]);
    const [nomineeRelshipError, setNomineeRelshipError] = useState("");

    const [dob, setDOB] = useState(moment(new Date(personal_data["DATE_OF_BIRTH"])).format("DD MMM YYYY"));
    const [nID, setNID] = useState(personal_data["NID_NO"]);

    const [nomineeNID, setNomineeNID] = useState(personal_data["NOMINEES_NID"]);
    const [nomineeNIDError, setNomineeNIDError] = useState("");

    const [presentAddressValue, setPresentAddressValue] = useState(personal_data["ADDRESS"]);
    const [permanantAddressValue, setPermanantAddressValue] = useState(personal_data["ADDRESS"]);


    const validPersonalInfo = () => {

        if(motherName === ""){
            setMotherNameError("খ) আপনার মাতার নাম লিখুন***");
            scrollToSection(piMotherNameRef);
            return false;
        }else{
            setMotherNameError("");
        }

        if(nomineeName === ""){
            setNomineeNameError("গ) আপনার নমিনীর নাম লিখুন***");
            scrollToSection(piNomineeNameRef);
            return false;
        }else{
            setNomineeNameError("");
        }

        if(nomineeRelship === ""){
            setNomineeRelshipError("ঘ) আপনার সাথে নমিনীর সম্পর্ক লিখুন***");
            scrollToSection(piNomineeRelshipRef);
            return false;
        }else{
            setNomineeRelshipError("");
        }

        if(nomineeNID === ""){
            setNomineeNIDError("ঝ) নমিনীর জাতীয় পরিচয়পত্র নম্বর লিখুন***");
            scrollToSection(piNomineeNIDRef);
            return false;
        }else{
            setNomineeNIDError("");
        }


        return true;
    }

    const onPersonalAuthenticate = (button) => {

        personal_data["MOTHERS_NAME"] = motherName;
        personal_data["NOMINEES_NAME"] = nomineeName;
        personal_data["NOMINEES_RELSHIP"] = nomineeRelship;
        personal_data["NID_NO"] = nID;
        personal_data["NOMINEES_NID"] = nomineeNID;

        if(button == "first"){
            personalNavigate('/application/1', { state: {info: personal_data, used: "yes"} });
        }
            

        if(button == "second"){
            if(validPersonalInfo()){
                const file = {salary: salary_file};
                personalNavigate('/application/3', { state: {info: personal_data, file: file, used: state_used} });
            }
        }

    }


    return(

        <div>
            
            <div className="loan_logo">
                <Logo />
            </div>

            <div className='perInfo'>

                <div className="personalInfo">
                    <div className="personalInfoLabel">
                        ৮. ব্যক্তিগত তথ্যাবলী : 
                    </div>


                    <PiDataField 
                        id="piFatherName" 
                        refer={ piFatherNameRef }
                        dataType="text"
                        validData="" 
                        label="ক) পিতা/স্বামীর নাম* : " 
                        value={ fatherName }
                        setValue={(data) => {setFatherName(data)}}
                        placeholder="i.e Abul Hashem"
                    />

                    <PiDataField 
                        id="piMotherName" 
                        refer={ piMotherNameRef }
                        dataType="text"
                        validData={motherNameError} 
                        label="খ) মাতার নাম* : " 
                        value={ motherName }
                        setValue={(data) => {setMotherName(data)}}
                        placeholder="i.e. Anowara Begum"
                    />

                    <PiDataField 
                        id="piNomineeName" 
                        refer={ piNomineeNameRef }
                        dataType="text"
                        validData={nomineeNameError}
                        label="গ) নমিনীর নাম* : " 
                        value={ nomineeName }
                        setValue={(data) => {setNomineeName(data)}}
                        placeholder="i.e. Tahmid Ahmed"
                    />

                    <PiDataField
                        id="piNomineeRelation" 
                        refer={ piNomineeRelshipRef }
                        dataType="text"
                        validData={ nomineeRelshipError } 
                        label="ঘ) আপনার সাথে নমিনীর সম্পর্ক* : " 
                        value={ nomineeRelship }
                        setValue={(data) => {setNomineeRelship(data)}}
                        placeholder="i.e. Son"
                    />



                    <div className="piDataField" data-validate="আপনার বর্তমান ঠিকানা লিখুন">
                        <span className="piDataLabel">
                            ঙ) বর্তমান ঠিকানা* : 
                        </span>

                        <div className='piDataInputField'>
                            <textarea className="piDataInput" style={{height: "1.75rem"}} name="piPresentAddress" placeholder="i.e. Vill: , P.O.: , P.S.: and Dist.: " 
                            value={presentAddressValue} onChange={(e) => {setPresentAddressValue(e.target.value);}} />

                            <button className="piDataClearBtn" onClick={(e) => {e.preventDefault(); setPresentAddressValue("");}}>×</button>
                        </div>
                        

                    </div>


                    <div className="piDataField" data-validate="আপনার স্থায়ী ঠিকানা লিখুন">
                        <span className="piDataLabel">
                            চ) স্থায়ী ঠিকানা* : 
                        </span>

                        <div className='piDataInputField'>
                            <textarea className="piDataInput" style={{height: "1.75rem"}} name="piPermanantAddress" placeholder="i.e. Vill: , P.O.: , P.S.: and Dist.: " 
                            value={permanantAddressValue} onChange={(e) => {setPermanantAddressValue(e.target.value);}} />

                            <button className="piDataClearBtn" onClick={(e) => {e.preventDefault(); setPermanantAddressValue("");}}>×</button>
                        </div>

                    </div>


                    <PiDataField
                        id="piDOB" 
                        refer={ piDOBRef }
                        dataType="date"
                        validData="" 
                        label="ছ) জন্ম তারিখ* : " 
                        value={ dob }
                        setValue={(data) => {setDOB(data)}}
                        placeholder="i.e. 1980/05/16"
                    />


                    <PiDataField
                        id="piNID" 
                        refer={ piNIDRef }
                        dataType="text"
                        validData="" 
                        label="জ) আবেদনকারীর জাতীয় পরিচয়পত্র নম্বর* : " 
                        value={ nID }
                        setValue={(data) => {setNID(data)}}
                        placeholder="i.e. 1253141559"
                    />



                    <PiDataField
                        id="piNomineeNID" 
                        refer={ piNomineeNIDRef }
                        dataType="text"
                        validData={ nomineeNIDError } 
                        label="ঝ) নমিনীর জাতীয় পরিচয়পত্র নম্বর* : " 
                        value={ nomineeNID }
                        setValue={(data) => {setNomineeNID(data)}}
                        placeholder="i.e. 125632454565545179"
                    />

                    
                </div>

                <DoubleButton 
                    firstButtonName="পূর্ববর্তী"
                    secondButtonName="পরবর্তী"
                    clickedButton={(clicked) => {onPersonalAuthenticate(clicked)}}
                />

            </div>

        </div>
    )

}

