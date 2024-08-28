import React, {useState, useRef} from 'react';
import { useNavigate, useLocation } from 'react-router';
import "../css/basicInfo.css";
import imgfile from "../assets/uploadImg.png"
import DataField from "../jsx_component/dataField";
import DataCheckBoxField from '../jsx_component/dataCheckBoxField';
import Logo from '../jsx_component/logo';
import axios from "axios";


function BasicInfo(){

    const basicNavigate = useNavigate();
    const { state } = useLocation();
    var basic_data = state["info"];

    var state_used = "no";
    
    if(state["used"] === "yes"){
        state_used = "yes";
    }

    if(state["used"] === "no"){
        basic_data["PROFILE_PIC"] = imgfile;
        basic_data["PROFILE_PHOTO"] = imgfile;
        basic_data["LOAN_TYPE"] = "";
        basic_data["LOAN_AMNT"] = "";
        basic_data["REASON_FOR_LOAN"] = "";
    }

    

    const profilePicRef = useRef(null);
    const applicantNameRef = useRef(null);
    const designationRef = useRef(null);
    const officeDepartmentRef = useRef(null);
    const accountNoRef = useRef(null);
    const loanTypeRef = useRef(null);
    const loanAmountRef = useRef(null);
    const reasonForLoanRef = useRef(null);

    const [proPicFile, setProPicFile] = useState(basic_data["PROFILE_PIC"]);
    const [proPhoto, setProPhoto] = useState(basic_data["PROFILE_PHOTO"]);
    const [proPicFileError, setProPicFileError] = useState([]);

    const [applicantName, setApplicantName] = useState(basic_data["EMPLOYEE_NAME"]);
    const [designation, setDesignation] = useState(basic_data["DESIGNATION"]);
    const [officeDepartment, setOfficeDepartment] = useState(basic_data["OFFICE"]);
    const [accountNo, setAccountNo] = useState("44040"+basic_data["BANK_ACCOUNT_NO"]);

    const [loanType, setLoanType] = useState(basic_data["LOAN_TYPE"]);
    const [loanTypeError, setLoanTypeError] = useState("");

    const [loanAmount, setLoanAmount] = useState(basic_data["LOAN_AMNT"]);
    const [loanAmountError, setLoanAmountError] = useState("");

    const [reasonForLoan, setReasonForLoan] = useState(basic_data["REASON_FOR_LOAN"]);
    const [reasonForLoanError, setReasonForLoanError] = useState("");


    function handleChange(e) {
        setProPicFile(URL.createObjectURL(e.target.files[0]));
        setProPhoto(e.target.files[0]);
    }

    const scrollToSection = (elementRef) => {
        window.scrollTo({
            top: elementRef.current.offsetTop,
            behavior: "smooth",
        });
    };


    function validBasicInfo(){
        if(proPicFile === imgfile){
            const tem = [];
            tem.push(
                <span className='profilePictureErrorText'>আবেদনকারীর ছবি দিন***</span>
            );
            setProPicFileError(tem);
            scrollToSection(profilePicRef);
            return false;
        }else{
            setProPicFileError([]);
        }

        if(loanType === ""){
            setLoanTypeError("আবেদনকৃত ঋণের ধরণ নির্বাচন করুন***");
            scrollToSection(loanTypeRef);
            return false;
        }else{
            setLoanTypeError("");
        }

        if(loanAmount === ""){
            setLoanAmountError("আবেদনকৃত ঋণের পরিমাণ লিখুন***");
            scrollToSection(loanAmountRef);
            return false;
        }else{
            setLoanAmountError("");
        }

        if(reasonForLoan === ""){
            setReasonForLoanError("আবেদনকৃত ঋণ গ্রহণের কারণ লিখুন***");
            scrollToSection(reasonForLoanRef);
            return false;
        }else{
            setReasonForLoanError("");
        }

        return true;
    }


    async function onBasicAuthenticate(e){
        e.preventDefault();

        if(validBasicInfo()){
            
            basic_data["PROFILE_PIC"] = proPicFile;
            basic_data["PROFILE_PHOTO"] = proPhoto;
            basic_data["LOAN_TYPE"] = loanType;
            basic_data["LOAN_AMNT"] = loanAmount;
            basic_data["REASON_FOR_LOAN"] =  reasonForLoan;

            basicNavigate("/application/2", {state : {info: basic_data, used: state_used}});
        }


    }

    return(
        <div>
            <div className="basic_logo">
                <Logo />
            </div>
            <div className="basicField" >

                <div ref={profilePicRef} className='profileImg'>
                    <img className='proImgFile' src={proPicFile} />
                    <span className='profilePictureText'>আবেদনকারীর ছবি*</span>
                    {proPicFileError}
                    <input className='profileImgFile' type="file"  onChange={handleChange} />
                </div>

                <DataField 
                    id="applicantName" 
                    refer={applicantNameRef}
                    dataType="text"
                    validData="" 
                    label="১. আবেদনকারীর নাম* : " 
                    value={ applicantName }
                    setValue={(data) => {setApplicantName(data)}}
                    placeholder="i.e. Abu Hashem Mohammad"
                />

                <DataField 
                    id="designation" 
                    refer={designationRef}
                    dataType="text"
                    validData="" 
                    label="২. পদবী* : " 
                    value={ designation }
                    setValue={ (data) => {setDesignation(data)} }
                    placeholder="i.e. Lecturer"
                />

                <DataField 
                    id="officeDepartment" 
                    refer={ officeDepartmentRef }
                    dataType="text"
                    validData="" 
                    label="৩. অফিস/বিভাগ* : " 
                    value={ officeDepartment }
                    setValue={ (data) => {setOfficeDepartment(data)} }
                    placeholder="i.e. Chemistry"
                />

                <DataField 
                    id="accountNo" 
                    refer={ accountNoRef }
                    dataType="text"
                    validData="" 
                    label="৪. সোনালী ব্যাংক, বুয়েট শাখায় পরিচালিত হিসাব নম্বর* : " 
                    value={ accountNo }
                    setValue={ (data) => {setAccountNo(data)} }
                    placeholder="যেমন: 44040********"
                />

                <DataCheckBoxField
                    id="loanType"
                    refer={ loanTypeRef }
                    label="৫. যে ঋণের জন্যে আবেদন করা হয়েছে* : "
                    items={[["মোটরযান ক্রয়/গৃহ নির্মাণ/মেরামত/জমি ক্রয় ঋণ",
                            "ভোগ্যপণ্য ঋণ",
                            "ল্যাপটপ ঋণ",
                            "সোনালী ব্যাংকের গৃহ ক্রয়/গৃহ নির্মাণ/মেরামত/জমি ক্রয় ঋণ",
                            "সোনালী ব্যাংকের পারসোনাল/অন্যান্য (Any Purpose) ঋণ"
                            ], ["HOUSE BUILDING LOAN", "CONSUMER LOAN", "LAPTOP LOAN", "SONALI HOUSE BUILDING LOAN", "SONALI ANY PURPOSE LOAN"]]}
                    value={ loanType }
                    setValue={(data) => {setLoanType(data)}}
                    validData={loanTypeError}
                    
                />

                <DataField 
                    id="loanAmount" 
                    refer={ loanAmountRef }
                    dataType="text"
                    validData={ loanAmountError }
                    label="৬. আবেদনকৃত ঋণের পরিমাণ* : " 
                    value={ loanAmount }
                    setValue={(data) => {setLoanAmount(data)}}
                    placeholder="i.e. 100000"
                />


                <DataField 
                    id="reasonForLoan" 
                    refer={ reasonForLoanRef }
                    dataType="text"
                    validData={ reasonForLoanError }  
                    label="৭. আবেদনকৃত ঋণ গ্রহণের কারণ* : " 
                    value={ reasonForLoan }
                    setValue={(data) => {setReasonForLoan(data)}}
                    placeholder="i.e. Consumer Product"
                />

                <div className='bisingleButton'>
                    <button className='binormalButton' onClick={onBasicAuthenticate}>
                        পরবর্তী
                    </button>
                </div>



            </div>

            
        </div>
    )

}


export default BasicInfo;



