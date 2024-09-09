import React from 'react';
import { useNavigate, useLocation } from 'react-router';
import "../css/loanInfo.css";
import Logo from '../jsx_component/logo';
import DoubleButton from '../jsx_component/doubleButton';


function LoanInfo(){

    const loanNavigate = useNavigate();
    const { state } = useLocation();
    var loan_data = state["info"];
    const loan_file = state["file"]["loan"];

    var state_used = "no";
    
    if(state["used"] === "yes"){
        state_used = "yes";
    }


    const table_data = [
        ["০১","মোটরযান ক্রয়/গৃহ নির্মাণ/মেরামত/জমি ক্রয়", "House Building Loan"],
        ["০২","ভোগ্যপণ্য ঋণ", "Consumer Loan"],
        ["০৩","ল্যাপটপ ঋণ", "Laptop Loan"],
        ["০৪","সোনালী ব্যাংকের হোলসেল ঋণের আওতায় প্রদত্ত পারসোনাল বা অন্যান্য বা এনি পারপোস লোন", "Any Purpose Loan"],
        ["০৫","সোনালী ব্যাংকের হোলসেল ঋণের আওতায় প্রদত্ত গৃহ নির্মাণ ঋণ, গৃহ ক্রয়, নির্মাণ, মেরামত, জমি ক্রয় ঋণ", "Whole-Sale House Building Loan"],
        ["০৬","বাংলাদেশ প্রকৌশল বিশ্ববিদ্যালয়ের শিক্ষক/কর্মচারীদের ব্যাংকিং ব্যবস্থার মাধ্যমে গৃহীত গৃহ নির্মাণ ঋণ", "Whole-Sale House Building Loan"],
        ["০৭","অন্যান্য", "Others"],
        ["০৮","সমষ্টি"],
    ];

    var loan_table_value = Array.from(Array(8), () => new Array(5).fill(0));

    var jsx_table_data = [];


    var data_loan = [];

    for(let i=0;i<loan_file.length;i++){
        if((loan_data["EMPLOYEEID"] === loan_file[i]["EMPLOYEEID"]) && 
        (loan_file[i]["REMAINING_AMOUNT"] > 0)){

            data_loan.push(loan_file[i]);

        }
        
    }

    console.log(data_loan);

    for(let i=0;i<data_loan.length;i++){
        for(let j=0;j<7;j++){
            if(data_loan[i]["LOAN_TYPE_NAME"] === table_data[j][2]){
                loan_table_value[j][0] += Number(data_loan[i]["TOTAL_AMOUNT_TO_REF"]);
                loan_table_value[j][1] += Number(data_loan[i]["AMOUNT_OF_INSTALLMENT"]);
                loan_table_value[j][2] += Number(data_loan[i]["NO_OF_INSTALLMENT"]);
                loan_table_value[j][3] += Number(data_loan[i]["REC_INSTALL"]);
                loan_table_value[j][4] += Number(data_loan[i]["REMAINING_AMOUNT"]);

                loan_table_value[7][0] += Number(data_loan[i]["TOTAL_AMOUNT_TO_REF"]);
                loan_table_value[7][1] += Number(data_loan[i]["AMOUNT_OF_INSTALLMENT"]);
                loan_table_value[7][2] += Number(data_loan[i]["NO_OF_INSTALLMENT"]);
                loan_table_value[7][3] += Number(data_loan[i]["REC_INSTALL"]);
                loan_table_value[7][4] += Number(data_loan[i]["REMAINING_AMOUNT"]);
            }
        }
        
    }
    

    for(let i=0;i<table_data.length;i++){

        var loan_amount = "loanAmount"+i
        var installment_amount = "installationAmount"+i
        var total_installment_number = "totalInstallmentNumber"+i
        var refined_installment_number = "refinedInstallmentNumber"+i
        var unrefined_loan_amount = "unrefinedLoanAmount"+i

        jsx_table_data.push(
            <tbody>
                <tr>
                    <td className='tableText'>{table_data[i][0]}</td>
                    <td className='tableText'>{table_data[i][1]}</td>
                    <td><input className='tableDataInput' type='text' value={loan_table_value[i][0]} name={loan_amount} /></td>
                    <td><input className='tableDataInput' type='text' value={loan_table_value[i][1]} name={installment_amount} /></td>
                    <td><input className='tableDataInput' type='text' value={loan_table_value[i][2]} name={total_installment_number} /></td>
                    <td><input className='tableDataInput' type='text' value={loan_table_value[i][3]} name={refined_installment_number} /></td>
                    <td><input className='tableDataInput' type='text' value={loan_table_value[i][4]} name={unrefined_loan_amount} /></td>
                </tr>
            </tbody>
        )
    }

    loan_table_value = loan_table_value[0].map((_, colIndex) => loan_table_value.map(row => row[colIndex]));

    loan_data["LOAN_DETAILS"] = loan_table_value;
    
    function onLoanAuthenticate(button){

        if(button == "first"){
            const file = state["file"];
            loanNavigate("/application/3", {state: {info: loan_data, file: file, used: "yes"}});
        }
            

        if(button == "second"){
            const file = state["file"];
            loanNavigate("/application/5", {state: {info: loan_data, file: file, used: state_used}});
        }

    }


    return(
        <div>
            <div className="loan_logo">
                <Logo />
            </div>
            <div className='loan_info'>
                <div className="loanInfo">
                    <div className="loanInfoLabel">
                        ১১. বিশ্ববিদ্যালয় ও সোনালী ব্যাংক হতে গৃহীত ঋণের তথ্যাবলী (কম্পট্রোলার অফিস কর্তৃক যাচাইকৃত) : 
                    </div>
                    <div className='loanInfoTable'>
                        <table>
                            <thead>
                                <tr className='tableHead'>
                                    <th className='tableHeadText'>ক্রমিক নং</th>
                                    <th className='tableHeadText'>ঋণের নাম</th>
                                    <th className='tableHeadText'>ঋণের পরিমাণ</th>
                                    <th className='tableHeadText'>কিস্তির পরিমাণ</th>
                                    <th className='tableHeadText'>মোট কিস্তির সংখ্যা</th>
                                    <th className='tableHeadText'>পরিশোধিত কিস্তির সংখ্যা</th>
                                    <th className='tableHeadText'>অপরিশোধিত ঋণের পরিমাণ (সুদ সহ)</th>
                                    
                                </tr>
                            </thead>

        
                            {jsx_table_data}


                        </table>
                    </div>

                </div>

                <DoubleButton 
                    firstButtonName="পূর্ববর্তী"
                    secondButtonName="পরবর্তী"
                    clickedButton={(clicked) => {onLoanAuthenticate(clicked)}}
                />
                
            </div>
            
            
        </div>
    )
}

export default LoanInfo