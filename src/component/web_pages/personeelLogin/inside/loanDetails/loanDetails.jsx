import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import axios from "axios";
import moment from "moment";

import "./loanDetails.css";

import NavBar from "../../../../page_compo/navBar/navBar";
import Footer from "../../../../page_compo/footer/footer";
import LoanAssesmentForm from "../pdfCopy/loanAssesmentForm";
import OfficeOrderCopy from "../pdfCopy/officeOrderCopy";

export default function LoanDetails(){

    const ld_navigate = useNavigate();
    const { state } = useLocation();

    const ld_data = state["data"];

    const loan_personnel = ["accntt_fund", "ao_fund", "ad_fund", "dp_compt", "compt", "dc_audit", "accntt_fund", "ao_fund", "ad_fund", "dp_compt", "compt", "dc_audit", "accntt_fund", "ad_fund", "compt", "accntt_fund", "accntt_cash", "accntt_fund"];
    
    const [ld_pers_data, setLd_pers_data] = useState([]);
    const [ld_pl_sal, setLd_pl_sal] = useState([]);
    const [ld_pl_prev_loan_1, setLd_pl_prev_loan_1] = useState([]);
    const [ld_pl_remarks, setLd_pl_remarks] = useState([]);

    useEffect(() => {

        const fetch_data = async () => {
            try{
                var uploadData = {
                    "USERNAME" : ld_data["sendFrom"]
                }
        
                const pers_data_res = await axios.post("http://localhost:8800/personeel_login", uploadData);
                setLd_pers_data(pers_data_res.data);
        
                uploadData = {
                    "LOAN_ID" : ld_data["LOAN_ID"]
                }
        
                const sal_res = await axios.post("http://localhost:8800/processing_loan_salary", uploadData);
                setLd_pl_sal(sal_res.data);
        
                const prev_loan_1_res = await axios.post("http://localhost:8800/processing_loan_prev_loan_1", uploadData);
                setLd_pl_prev_loan_1(prev_loan_1_res.data);
        
                const remarks_res = await axios.post("http://localhost:8800/processing_loan_remarks", uploadData);
                setLd_pl_remarks(remarks_res.data);
        
            }catch(err){
                console.log(err);
            }
        }
    
        fetch_data();
    }, []);

    const dateFormation = ( date ) => {
        var temp_date = new Date(date);
        return moment(temp_date).format('DD MMM YYYY');
    };

    const timeDuration = (date1, date2) => {
        const now = new Date(date1);
        const first_join_date = new Date(date2);
    
        var currentYear = now.getFullYear();
        var currentMonth = now.getMonth();
        var currentDate = now.getDate();
    
        var first_join_dateYear = first_join_date.getFullYear();
        var first_join_dateMonth = first_join_date.getMonth();
        var first_join_dateDate = first_join_date.getDate();
    
        var yearDuration = currentYear - first_join_dateYear;
        var monthDuration = 0;
        var dateDuration = 0;
    
        if(currentMonth >= first_join_dateMonth)
            monthDuration = currentMonth - first_join_dateMonth;
        else{
            yearDuration--;
            monthDuration = 12 + currentMonth - first_join_dateMonth;
        }
    
        if(currentDate >= first_join_dateDate)
            dateDuration = currentDate - first_join_dateDate;
        else{
            monthDuration--;
            dateDuration = 31 + currentDate - first_join_dateDate;
            if(monthDuration < 0){
                monthDuration = 11;
                yearDuration--;
            }
        }

        return [yearDuration, monthDuration, dateDuration];
    
    
    };

    

    const [ld_remarks, setLd_remarks] = useState("");
    const [ld_remarks_error, setLd_remarks_error] = useState(false);

    const pension_rate_table = [0, 0, 0, 0, 0,
                                21, 24, 27, 30, 33,
                                36, 39, 43, 47, 51,
                                54, 57, 63, 65, 69, 
                                72, 75, 79, 83, 87, 90];

    var ld_value = {}                          
    ld_value["loan_id"] = ld_data["LOAN_ID"];
    ld_value["loan_app_date"] = dateFormation(ld_data["LOAN_APP_DATE"]);
    ld_value["salary_id"] = ld_data["EMPLOYEEID"];
    ld_value["loan_type"] = ld_data["LOAN_TYPE"];
    ld_value["buet_id"] = ld_data["EMPLOYEE_ID"];
    ld_value["applicant_name"] = ld_data["EMPLOYEE_NAME"];
    ld_value["designation"] = ld_data["DESIGNATION"];
    ld_value["account_no"] = ld_data["ACCOUNT_NO"];
    ld_value["category"] = ld_data["CATEGORY"];
    ld_value["office_dept"] = ld_data["OFFICE"];
    ld_value["account_no"] = ld_data["BANK_ACCOUNT_NO"];

    const ld_loan_type = ld_value["loan_type"].toLowerCase();

    var temp_status = Number(ld_data["APP_POS"]);

    const ld_user = ld_data["sendFrom"] === loan_personnel[temp_status];
    

    const app_status = (value) =>{
        var ret_val = "";

        if(value <= 5){
            ret_val = "Loan Assesment ("+loan_personnel[value]+")";
        }else if(value > 5 && value <= 11){
            ret_val = "Sanction ("+loan_personnel[value]+")";
        }else if(value > 11 && value <= 14){
            ret_val = "Office Order ("+loan_personnel[value]+")";
        }else if(value > 14){
            ret_val = "Bill ("+loan_personnel[value]+")";
        }

        return ret_val;
    }

    var temp_status_t = app_status(temp_status);
    

    var ld_processing = true;

    ld_value["dob"] = dateFormation(ld_data["DATE_OF_BIRTH"]);

    ld_value["joining_date"] = dateFormation(ld_data["DATE_FIRST_JOIN"]);

    ld_value["mos"] = dateFormation(ld_data["DATE_OF_RETIREMENT"]);

    ld_value["serv_len_y"] = Number(ld_data["TOTAL_SERVICE_PERIOD"].split(" ")[0]);

    var ld_duration = timeDuration(ld_data["DATE_OF_RETIREMENT"], new Date());

    ld_value["rem_serv_m"] = ld_duration[0] * 12 + ld_duration[1]; 

    ld_value["basic_salary"] = 0;
    ld_value["gross_salary"] = 0;
    ld_value["deduct"] = 0;
    ld_value["net_salary"] = 0;

    ld_value["pens_gra"] = 0;
    ld_value["leav_sal"] = 0;
    ld_value["25_mon_gran"] = 0;
    ld_value["tot_rec"] = 0;

    ld_value["hb_loan"] = 0;
    ld_value["consu_loan"] = 0;
    ld_value["lap_loan"] = 0;
    ld_value["sblws_loan"] = 0;
    ld_value["tot_pay"] = 0;
    ld_value["net_rec"] = 0;
    
    ld_value["hb_loan_ins_amnt"] = 0;
    ld_value["consu_loan_ins_amnt"] = 0;
    ld_value["lap_loan_ins_amnt"] = 0;
    ld_value["sblws_loan_ins_amnt"] = 0;
    ld_value["tot_loan_ins_amnt"] = 0;

    ld_value["75_pens"] = 0;
    ld_value["app_amnt"] = Number(ld_data["LOAN_AMOUNT"]);
    ld_value["prop_amnt"] = 0;
    ld_value["inst_amnt"] = 0;
    ld_value["tot_no_ins"] = 0;
    ld_value["tot_ins_amnt"] = 0;
    ld_value["60_basic_sal"] = 0;

    const ld_comment_display = [];

    const ld_remarks_display = [];

    


    var ld_gra_rate = 0;

    if(ld_value["serv_len_y"] >= 5 && ld_value["serv_len_y"] < 10){
        ld_gra_rate = 265;
    }else if(ld_value["serv_len_y"] >= 10 && ld_value["serv_len_y"] < 15){
        ld_gra_rate = 260;
    }else if(ld_value["serv_len_y"] >= 15 && ld_value["serv_len_y"] < 20){
        ld_gra_rate = 245;
    }else if(ld_value["serv_len_y"] >= 20){
        ld_gra_rate = 230;
    }

    var ld_pens_rate = ld_value["serv_len_y"] > 25 ? pension_rate_table[25] : pension_rate_table[ld_value["serv_len_y"]];

    for(let i=0;i<ld_pl_sal.length;i++){
        ld_value["basic_salary"] = Number(ld_pl_sal[0]["LAST_MON_BASIC_SAL"]);
        ld_value["gross_salary"] = Number(ld_pl_sal[0]["LAST_MON_TOTAL_SAL"]);
        ld_value["deduct"] = Number(ld_pl_sal[0]["LAST_MON_TOTAL_DEDUCT"]);
        ld_value["net_salary"] = Number(ld_pl_sal[0]["LAST_MON_NET_SAL"]);
    }
    


    ld_value["pens_gra"] = (ld_value["basic_salary"] * 0.5 * ld_pens_rate * ld_gra_rate) / 100;
    ld_value["25_mon_gran"] = ld_value["serv_len_y"] * ld_value["basic_salary"];
    ld_value["tot_rec"] = ld_value["pens_gra"] + ld_value["leav_sal"] + ld_value["25_mon_gran"];


    for(let i=0;i<ld_pl_prev_loan_1.length;i++){

        ld_value["hb_loan"] = ld_pl_prev_loan_1[0]["HL_REM_INST_AMNT"];
        ld_value["consu_loan"] = ld_pl_prev_loan_1[0]["CL_REM_INST_AMNT"];
        ld_value["lap_loan"] = ld_pl_prev_loan_1[0]["LL_REM_INST_AMNT"];
        ld_value["sblws_loan"] = ld_pl_prev_loan_1[0]["SBWSL_REM_INST_AMNT"];

        ld_value["hb_loan_ins_amnt"] = ld_pl_prev_loan_1[0]["HL_INST_AMNT"];
        ld_value["consu_loan_ins_amnt"] = ld_pl_prev_loan_1[0]["CL_INST_AMNT"];
        ld_value["lap_loan_ins_amnt"] = ld_pl_prev_loan_1[0]["LL_INST_AMNT"];
        ld_value["sblws_loan_ins_amnt"] = ld_pl_prev_loan_1[0]["SBWSL_INST_AMNT"];

    }


    ld_value["tot_pay"] = ld_value["hb_loan"] + ld_value["consu_loan"] + ld_value["lap_loan"] + ld_value["sblws_loan"];
    ld_value["net_rec"] = ld_value["tot_rec"] - ld_value["tot_pay"];

    ld_value["tot_loan_ins_amnt"] = ld_value["hb_loan_ins_amnt"] + ld_value["consu_loan_ins_amnt"] + ld_value["lap_loan_ins_amnt"] + ld_value["sblws_loan_ins_amnt"];


    ld_value["75_pens"] = Math.round(ld_value["pens_gra"] * 0.75);
    
    ld_value["60_basic_sal"] = ld_value["basic_salary"] * 0.6;

    var calc_mon = 0;

    var rounding_figure = 10000;

    var available_ins_amount = ld_value["60_basic_sal"] - ld_value["tot_loan_ins_amnt"];

    var temp_prop_amnt = ld_value["app_amnt"] > ld_value["75_pens"] ? ld_value["75_pens"] : ld_value["app_amnt"];

    temp_prop_amnt = Math.floor(temp_prop_amnt / rounding_figure); 

    temp_prop_amnt *= rounding_figure;

    var temp_inst_amnt = ld_value["app_amnt"];

    var interest_rate = 7.75;


    if(ld_value["rem_serv_m"] < 10){

        temp_prop_amnt = 0;
        temp_inst_amnt = 0;
        ld_value["tot_no_ins"] = 0;
        ld_processing = false;

        ld_comment_display.push(
            <div className="assessment_comment">
               - Remaining Service Period is less than 10 months.
            </div>
        );
        
    }else {
        if(ld_value["rem_serv_m"] >= 10 && ld_value["rem_serv_m"] < 30){
            calc_mon = 10;
        }else if(ld_value["rem_serv_m"] >= 30 && ld_value["rem_serv_m"] < 50){
            calc_mon = 30;
        }else if(ld_value["rem_serv_m"] >= 50 && ld_value["rem_serv_m"] < 80){
            calc_mon = 50;
        }else if(ld_value["rem_serv_m"] >= 80 && ld_value["rem_serv_m"] < 100){
            calc_mon = 80;
        }else if(ld_value["rem_serv_m"] >= 100 && ld_value["rem_serv_m"] < 120){
            calc_mon = 100;
        }else if(ld_value["rem_serv_m"] >= 120 && ld_value["rem_serv_m"] < 150){
            calc_mon = 120;
        }else if(ld_value["rem_serv_m"] >= 150 && ld_value["rem_serv_m"] < 180){
            calc_mon = 150;
        }else{
            calc_mon = 180;
        }

        // console.log("available_ins_amount : "+available_ins_amount);

        // console.log("temp_inst_amnt : "+temp_inst_amnt);



        while(temp_inst_amnt > available_ins_amount){
            temp_inst_amnt = Math.ceil(((2 * temp_prop_amnt) * (1200 + calc_mon * interest_rate))/(calc_mon * (2400 - interest_rate + calc_mon * interest_rate)));
            temp_prop_amnt = temp_prop_amnt - rounding_figure;
        }

        // console.log("amount : "+(temp_prop_amnt+rounding_figure)+", installment : "+temp_inst_amnt);

    }

    if(temp_prop_amnt != 0){
        ld_value["prop_amnt"] = temp_prop_amnt + rounding_figure;
    }

    ld_value["tot_no_ins"] = calc_mon;

    ld_value["inst_amnt"] = temp_inst_amnt;

    ld_value["recov_amnt"] = calc_mon * temp_inst_amnt;

    ld_value["tot_intest"] = ld_value["recov_amnt"] - ld_value["prop_amnt"];

    ld_value["tot_ins_amnt"] = ld_value["tot_loan_ins_amnt"] + ld_value["inst_amnt"];

    

    const remarksItem = (label, value) => {
        return(
            <div className="remarks_item">
                <div className="remarks_item_label sec_item_def">{app_status(label)}</div>
                <div className="section_item_colon sec_item_def">:</div>
                <div className="section_item_value">{value}</div>
            </div>
        );
    };

    const sectionItem = (index, label, value) => {
        return(
            <div className="section_item">
                <div className="sec_item_def">{index}</div>
                <div className="section_item_colon sec_item_def">.</div>
                <div className="section_item_label sec_item_def">{label}</div>
                <div className="section_item_colon sec_item_def">:</div>
                <div className="section_item_value">{value}</div>
            </div>
        );
    };

    console.log(ld_pl_remarks);

    for(let i=0;i<ld_pl_remarks.length;i++){

        for(let j=0;j<temp_status;j++){
            if(ld_pl_remarks[i][j+"_"] !== null){

                ld_remarks_display.push(remarksItem(j, ld_pl_remarks[i][j+"_"]));
            
            }
        }

        break;
    }


    var ld_personnel_data = [];
    if(ld_pers_data.length != 0){
        ld_personnel_data = ld_pers_data[0];
    }
    


    const onForwardClick = async e =>{
        e.preventDefault();

        if(ld_remarks === ""){
            setLd_remarks_error(true);
            return;
        }else{
            setLd_remarks_error(false);
        }



        if(ld_user && 
            (ld_data["sendFrom"] == "dc_audit") && 
            temp_status < 6 && 
            ld_value["inst_amnt"] != 0){

            try{
                await axios.post("http://localhost:8800/sanction_register", ld_value);
    
            }catch(err){
                console.log(err);
            }

        }

        if(ld_user && 
            (ld_data["sendFrom"] == "dc_audit") && 
            temp_status > 6 ){

            try{
                await axios.put("http://localhost:8800/sanction", {"loan_id" : ld_value["loan_id"], "status" : "OFF_ORD"});
    
            }catch(err){
                console.log(err);
            }

        }

        if(ld_user && 
            (ld_data["sendFrom"] == "compt") && 
            temp_status > 13 ){

            try{
                await axios.put("http://localhost:8800/sanction", {"loan_id" : ld_value["loan_id"], "status" : "BILL"});
    
            }catch(err){
                console.log(err);
            }

        }



        const updateRemarksData = {
            "LOAN_ID": ld_value["loan_id"],
            "REMARKER": temp_status,
            "REMARKS": ld_remarks,
        };


        try{
            await axios.put("http://localhost:8800/processing_loan_remarks_update", updateRemarksData);
            
            ld_navigate("/personnel_dashboard", {state : {data : ld_personnel_data, loan_type: ld_value["loan_type"]}});

        }catch(err){
            console.log(err);
        }




    };

    const off_or_copy = {
        name: ld_value["applicant_name"],
        desig: ld_value["designation"],
        off_dept: ld_value["office_dept"],
        amnt: ld_value["prop_amnt"],
        ins_amnt: ld_value["inst_amnt"],
        tot_ins: ld_value["tot_no_ins"]
    }

    let nf = new Intl.NumberFormat('en-US');


    return(
        <>

            <NavBar hide={{nav_mid: true}} />



            <div className="loan_assessment_form">

                <div className="page_label">{ld_loan_type} Assessment Form</div>

                <div className="assessment_section personal_information">
                    <div className="section_label">
                        A) Personal Information :

                    </div>

                    <div className="section_items">
                        <div className="section_items_div">
                            {sectionItem("1", "Loan ID", ld_value["loan_id"])}
                            {sectionItem("2", "Loan Application Date", ld_value["loan_app_date"])}
                            {sectionItem("3", "Loan Type", ld_value["loan_type"])}
                            {sectionItem("4", "BUET ID", ld_value["buet_id"])}
                            {sectionItem("5", "Applicant Name", ld_value["applicant_name"])}
                            {sectionItem("6", "Designation", ld_value["designation"])}
                            {sectionItem("7", "Office/Dept.", ld_value["office_dept"])}
                            {sectionItem("8", "Date of Birth", ld_value["dob"])}
                            {
                                ld_user ? 
                                ""
                                :
                                sectionItem("9", "Application Status", temp_status_t)
                            }

                        </div>
                        <div className="section_items_div">
                            
                        </div>
                    </div>
                </div>
                
                <div className="assessment_section employment_information">
                    <div className="section_label">B) Employment Information :</div>
                    
                    <div className="section_items">
                        <div className="section_items_div">
                            {sectionItem("1", "Joining Date", ld_value["joining_date"])}
                            {sectionItem("3", "Maturity of Service (including PRL)", ld_value["mos"])}
                        </div>
                        <div className="section_items_div">
                            {sectionItem("2", "Service Length (Year)", ld_value["serv_len_y"])}
                            {sectionItem("4", "Remaining Service (No of Month)", ld_value["rem_serv_m"])}
                        </div>
                    </div>
                </div>

                <div className="assessment_section salary_information">
                    <div className="section_label">C) Salary Information :</div>
                    
                    <div className="section_items">
                        <div className="section_items_div">
                            {sectionItem("1", "Basic Salary", nf.format(ld_value["basic_salary"]))}
                            {sectionItem("3", "Deduction", nf.format(ld_value["deduct"]))}
                        </div>
                        <div className="section_items_div">
                            {sectionItem("2", "Gross Salary", nf.format(ld_value["gross_salary"]))}
                            {sectionItem("4", "Net Salary", nf.format(ld_value["net_salary"]))}
                        </div>
                    </div>
                </div>

                <div className="assessment_section financial_position">
                    <div className="section_label">D) Financial Position :</div>
                    
                    
                    <div className="subsection_label">Receivables</div>
                    <div className="section_items">
                        <div className="section_items_div">
                            {sectionItem("1", "Pension/Gratuity", nf.format(ld_value["pens_gra"]))}
                        </div>
                        <div className="section_items_div">
                            {sectionItem("2", "Leave Salary", nf.format(ld_value["leav_sal"]))}
                        </div>
                        
                    </div>
                    {sectionItem("3", "25 Months Grant (Trust Fund) (Service Length × Basic Salary)", nf.format(ld_value["25_mon_gran"]))}
                    {sectionItem("4", "Total Receivable (TR) (1.+2.+3.)", nf.format(ld_value["tot_rec"]))}


                    <div className="subsection_label">Payables</div>
                    <div className="section_items">
                        <div className="section_items_div">
                            {sectionItem("5", "House Building Loan", nf.format(ld_value["hb_loan"]))}
                            {sectionItem("7", "Laptop Loan", nf.format(ld_value["lap_loan"]))}
                        </div>
                        <div className="section_items_div">
                            {sectionItem("6", "Consumer Loan", nf.format(ld_value["consu_loan"]))}
                            {sectionItem("8", "SBL Whole Sale Loan", nf.format(ld_value["sblws_loan"]))}
                        </div>
                        
                    </div>
                    {sectionItem("9", "Total Payable (TP) (5.+6.+7.+8.)", nf.format(ld_value["tot_pay"]))}
                    {sectionItem("10", "Net Receivable (TR-TP) (4.-9.)", nf.format(ld_value["net_rec"]))}


                    <div className="subsection_label">Installment Amount of Loan</div>
                    <div className="section_items">
                        <div className="section_items_div">
                            {sectionItem("11", "House Building Loan", nf.format(ld_value["hb_loan_ins_amnt"]))}
                            {sectionItem("13", "Laptop Loan", nf.format(ld_value["lap_loan_ins_amnt"]))}
                        </div>
                        <div className="section_items_div">
                            {sectionItem("12", "Consumer Loan", nf.format(ld_value["consu_loan_ins_amnt"]))}
                            {sectionItem("14", "SBL Whole Sale Loan", nf.format(ld_value["sblws_loan_ins_amnt"]))}
                        </div>
                        
                    </div>
                    {sectionItem("15", "Total Installment Amount of Loan (11.+12.+13.+14.)", nf.format(ld_value["tot_loan_ins_amnt"]))}


                </div>

                <div className="assessment_section loan_assessment">
                    <div className="section_label">E) Loan Assessment :</div>
                    
                    <div className="section_items">
                        <div className="section_items_div">
                            {sectionItem("1", "75% of Pension", nf.format(ld_value["75_pens"]))}
                            {sectionItem("3", "Proposed Amount", nf.format(ld_value["prop_amnt"]))}
                            {sectionItem("5", "Total Number of Installment", nf.format(ld_value["tot_no_ins"]))}
                            {sectionItem("7", "60% of Basic Salary", nf.format(ld_value["60_basic_sal"]))}
                        </div>
                        <div className="section_items_div">
                            {sectionItem("2", "Applied Amount", nf.format(ld_value["app_amnt"]))}
                            {sectionItem("4", "Installment Amount", nf.format(ld_value["inst_amnt"]))}
                            {sectionItem("6", "Total Installment Amount (D15.+E4.)", nf.format(ld_value["tot_ins_amnt"]))}
                        </div>
                    </div>

                    

                </div>

                {
                    ld_processing ? 
                    ""
                    :
                    <div className="assessment_comment_label">
                        Comment : 
                        {ld_comment_display}
                    </div>

                }

                <div className="assessment_section remarks">
                    <div className="section_label">F) Remarks :</div>

                    {
                        ld_remarks_error ?
                        <div className="remarks_input" style={{color: "red"}}>
                            ***Remarks must be written
                        </div>
                
                        : ""    
                    }
                    
                    <div className="remarks_items">
                        {ld_remarks_display}

                        {
                            ld_user ?
                            <div className="remarks_input_item">
                                <textarea className="remarks_input" placeholder="write your remarks about the loan" type="text" value={ld_remarks} onChange={(e) => {setLd_remarks(e.target.value)}} />
                            </div>
                            :
                            ""

                        }

                        
                        
                    </div>

                </div>


                {
                    ld_user ? 
                    <div className="ld_button">
                        <div className="ld_forward" onClick={onForwardClick}>
                            Forward
                        </div>
                        {
                            (ld_data["sendFrom"] === "accntt_fund") ?
                                <LoanAssesmentForm lafData={ld_value}/>
                            :
                            ""
                        }
                        {
                            (ld_data["sendFrom"] === "accntt_fund") && (temp_status > 11)?
                                <OfficeOrderCopy data={off_or_copy} />
                            :
                            ""
                        }


                    </div>
                    :
                    ""

                }



            </div>


            

            
            <Footer />

        </>
    );
}

