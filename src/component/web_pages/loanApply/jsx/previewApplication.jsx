import React from "react";
import { useLocation } from 'react-router';
import "../css/previewApplication.css";
import Logo from "../jsx_component/logo";
import PreviewText from "../jsx_component/previewText";
import Application from "./application";


function PreviewApplication(){

    const { state } = useLocation();

    var previewData = state["info"];

    const preAppPhoto = previewData["PROFILE_PIC"];
    const preAppApplicantName = previewData["EMPLOYEE_NAME"];
    const preAppDesignation = previewData["DESIGNATION"];
    const preAppOfficeDept = previewData["OFFICE"];
    const preAppAccountNo = "44040"+previewData["BANK_ACCOUNT_NO"];
    const preAppLoanType = previewData["LOAN_TYPE"];
    const preAppLoanAmnt = previewData["LOAN_AMNT"];
    const preAppLoanReas = previewData["REASON_FOR_LOAN"];

    const preAppPersoInfo = [["ক", "খ", "গ", "ঘ", "ঙ", "চ", "ছ", "জ", "ঝ"],
                            ["পিতা/স্বামীর নাম", "মাতার নাম", "নমিনীর নাম", "আপনার সাথে নমিনীর সম্পর্ক", "বর্তমান ঠিকানা",
                                 "স্থায়ী ঠিকানা", "জন্ম তারিখ", "আবেদনকারীর জাতীয় পরিচয়পত্র নম্বর", "নমিনীর জাতীয় পরিচয়পত্র নম্বর"],
                            [previewData["FATHERS_NAME"], previewData["MOTHERS_NAME"], previewData["NOMINEES_NAME"], previewData["NOMINEES_RELSHIP"], previewData["ADDRESS"],
                            previewData["ADDRESS"], previewData["DATE_OF_BIRTH"], previewData["NID_NO"], previewData["NOMINEES_NID"]]
                            ];


    const preAppServInfo = [["ক", "খ", "গ", "ঘ", "ঙ"],
                            ["বুয়েট আই.ডি. নং", "বিশ্ববিদ্যালয়ের চাকুরী", "বিশ্ববিদ্যালয়ে যোগদানের তারিখ", "এই বিশ্ববিদ্যালয়ে মোট চাকুরীকাল", "চাকুরীর বয়স পূর্তির তারিখ (শিক্ষকের বয়স ৬৫ বছর, কর্মকর্তা/কর্মচারীর বয়স ৬০ বছর)"],
                            [previewData["IDNO"], previewData["SERV_TYPE"] ? "স্থায়ী" : "অস্থায়ী", previewData["DATE_FIRST_JOIN"], previewData["SERV_PERIOD"], previewData["TIME_OF_RETIREMENT"]]
                            ];

    var preAppSalInfo = [[" ","ক", "খ", "গ", "ঘ"],
                        ["মাস", "মূল বেতন","মোট বেতন", "মোট কর্তন", "নীট বেতন"],
                            ];
    
    preAppSalInfo = [...preAppSalInfo, ...previewData["PREV_MON_SAL"]];

    var preAppLoanInfo = [["ক্রমিক নং", "০১", "০২", "০৩", "০৪", "০৫", "০৬", "০৭", "০৮"],
                            ["ঋণের নাম", "মোটরযান ক্রয়/গৃহ নির্মাণ/মেরামত/জমি ক্রয়", "ভোগ্যপণ্য ঋণ", "ল্যাপটপ ঋণ", "সোনালী ব্যাংকের হোলসেল ঋণের আওতায় প্রদত্ত পারসোনাল বা অন্যান্য বা এনি পারপোস লোন", "সোনালী ব্যাংকের হোলসেল ঋণের আওতায় প্রদত্ত গৃহ নির্মাণ ঋণ, গৃহ ক্রয়, নির্মাণ, মেরামত, জমি ক্রয় ঋণ", "বাংলাদেশ প্রকৌশল বিশ্ববিদ্যালয়ের শিক্ষক/কর্মচারীদের ব্যাংকিং ব্যবস্থার মাধ্যমে গৃহীত গৃহ নির্মাণ ঋণ", "অন্যান্য", "সমষ্টি"],
                            ["ঋণের পরিমাণ"],
                            ["কিস্তির পরিমাণ"],
                            ["মোট কিস্তির সংখ্যা"],
                            ["পরিশোধিত কিস্তির সংখ্যা"],
                            ["অপরিশোধিত ঋণের পরিমাণ (সুদ সহ)"]
                            ];

    for(let i=0;i<5;i++){
        preAppLoanInfo[i+2] = [...preAppLoanInfo[i+2], ...previewData["LOAN_DETAILS"][i]]
    }
    
    
    const preAppLastInfo = [["ক", "খ"],
                            ["পেনশন বাবদ (এককালীন পেনশন)", " "],
                            [" ", " "]
                            ];

    
    const preAppSign = previewData["SIGN_PIC"];
            
    const persoTable = [];

    for(let i=0;i<9;i++){
        persoTable.push(
            <tbody>
                <tr>
                    <th className='tableIndexCol'>{preAppPersoInfo[0][i]}</th>
                    <th className='tableLabelCol'>{preAppPersoInfo[1][i]}</th>
                    <th className='tableValueCol'>{preAppPersoInfo[2][i]}</th>
                </tr>
            </tbody>
        );
    }


    const servTable = [];

    for(let i=0;i<5;i++){
        servTable.push(
            <tbody>
                <tr>
                    <th className='tableIndexCol'>{preAppServInfo[0][i]}</th>
                    <th className='tableLabelCol'>{preAppServInfo[1][i]}</th>
                    <th className='tableValueCol'>{preAppServInfo[2][i]}</th>
                </tr>
            </tbody>
        );
    }


    const salTable = [];

    for(let i=0;i<5;i++){
        salTable.push(
            <tbody>
                <tr>
                    <th className='tableIndexCol'>{preAppSalInfo[0][i]}</th>
                    <th className='tableLabelCol'>{preAppSalInfo[1][i]}</th>
                    <th className='tableValueCol'>{preAppSalInfo[2][i]}</th>
                    <th className='tableValueCol'>{preAppSalInfo[3][i]}</th>
                    <th className='tableValueCol'>{preAppSalInfo[4][i]}</th>
                </tr>
            </tbody>
        );
    }


    const loanTable = [];

    for(let i=0;i<9;i++){
        loanTable.push(
            <tbody>
                <tr>
                    <th className='tableIndexCol'>{preAppLoanInfo[0][i]}</th>
                    <th className='tableLabelCol'>{preAppLoanInfo[1][i]}</th>
                    <th className='tableValueCol'>{preAppLoanInfo[2][i]}</th>
                    <th className='tableValueCol'>{preAppLoanInfo[3][i]}</th>
                    <th className='tableValueCol'>{preAppLoanInfo[4][i]}</th>
                    <th className='tableValueCol'>{preAppLoanInfo[5][i]}</th>
                    <th className='tableValueCol'>{preAppLoanInfo[6][i]}</th>
                </tr>
            </tbody>
        );
    }


    const lastTable = [];

    for(let i=0;i<2;i++){
        lastTable.push(
            <tbody>
                <tr>
                    <th className='tableIndexCol'>{preAppLastInfo[0][i]}</th>
                    <th className='tableLabelCol'>{preAppLastInfo[1][i]}</th>
                    <th className='tableValueCol'>{preAppLastInfo[2][i]}</th>
                    
                </tr>
            </tbody>
        );
    }

    return(
        <div>
            

            <div className="previewApp">
                    
                <div className="preview_logo">
                    <Logo />
                </div>

                <div className="pageLabel">
                    ঋণের জন্য আবেদন
                </div>
                <div className="allField">

                    <div className="preBasicFieldwithProPic">
                        <div className="preBasicField">
                            <PreviewText 
                                label="১. আবেদনকারীর নাম"
                                value={preAppApplicantName}
                            />

                            <PreviewText
                                label="২. পদবী"
                                value={preAppDesignation}
                            />

                            <PreviewText
                                label="৩. অফিস/বিভাগ"
                                value={preAppOfficeDept}
                            />

                            <PreviewText
                                label="৪. সোনালী ব্যাংক, বুয়েট শাখায় পরিচালিত হিসাব নম্বর"
                                value={preAppAccountNo}
                            />

                            <PreviewText
                                label="৫. যে ঋণের জন্যে আবেদন করা হয়েছে"
                                value={preAppLoanType}
                            />

                            <PreviewText
                                label="৬. আবেদনকৃত ঋণের পরিমাণ"
                                value={preAppLoanAmnt}
                            />

                            <PreviewText
                                label="৭. আবেদনকৃত ঋণ গ্রহণের কারণ"
                                value={preAppLoanReas}
                            />

                        </div>

                        <div className='preAppProPic'>
                            <img className='preAppProImg' src={preAppPhoto} />
                        </div>

                    </div>

    
                    <div className="prePersInfo">
                        <div className="prePersInfoLabel">
                            ৮. ব্যক্তিগত তথ্যাবলী :
                        </div>
                        <table>
                            {persoTable}
                        </table>

                    </div>


                    <div className="prePersInfo">
                        <div className="prePersInfoLabel">
                            ৯. আবেদনকারীর চাকুরী সংক্রান্ত তথ্যাবলী :
                        </div>
                        <table>
                            {servTable}
                        </table>

                    </div>


                    <div className="prePersInfo">
                        <div className="prePersInfoLabel">
                            ১০. বেতন সংক্রান্ত তথ্যাবলী (বিগত তিন মাসের) :
                        </div>
                        <table>
                            {salTable}
                        </table>
                    </div>


                    <div className="prePersInfo">
                        <div className="prePersInfoLabel">
                            ১১. বিশ্ববিদ্যালয় ও সোনালী ব্যাংক হতে গৃহীত ঋণের তথ্যাবলী (কম্পট্রোলার অফিস কর্তৃক যাচাইকৃত) :
                        </div>
                        <table>
                            {loanTable}
                        </table>

                    </div>



                    <div className="prePersInfo">
                        <div className="prePersInfoLabel">
                            এই মর্মে নিশ্চয়তা দিচ্ছি যে, উপরোক্ত তথ্যাদি সম্পূর্ণ সত্য ও সঠিক এবং নিয়মানুযায়ী গৃহীত ঋণের কিস্তি পরিশোধে বাধ্য থাকিব।
                            অন্যথায় কর্তৃপক্ষ কর্তৃক নির্ধারিত দায়ভার বহন করিতে আপত্তি নেই। ঋণ গ্রহণের পরে যদি কোনো তথ্য বা প্রদত্ত দলিলাদি সঠিক 
                            নয় বলে প্রমাণিত হয় তবে সেক্ষেত্রে বিশ্ববিদ্যালয়ের যেকোনো সিদ্ধান্ত বিনা আপত্তিতে মেনে নিতে বাধ্য থাকিব। 
                        </div>
                    </div>


                    <div className='preAppSignPic'>
                        <img className='preAppSignImg' src={preAppSign} />
                    </div>

                </div>

            </div>
 

            <Application applicationData={previewData}  />

        </div>
    );
}


export default PreviewApplication;




    {/* 
                        <div className="prePersInfo">
                            <div className="prePersInfoLabel">
                                ১২. বিশ্ববিদ্যালয় হইতে আনুমানিক প্রাপ্য (কম্পট্রোলার অফিস পূরণ করবে) :
                            </div>
                            <table>
                                {lastTable}
                            </table>
                            
                        </div> 
    */}

