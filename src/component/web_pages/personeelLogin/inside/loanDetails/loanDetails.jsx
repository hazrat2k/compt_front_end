import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import axios from "axios";
import moment from "moment";

import "./loanDetails.css";

import NavBar from "../../../../page_compo/navBar/navBar";
import Footer from "../../../../page_compo/footer/footer";


export default function LoanDetails(){

    const ld_navigate = useNavigate();
    const { state } = useLocation();

    const ld_data = state["data"];

    const loan_personnel = ["COMPT", "DP_COMPT", "AD_FUND", "AO_FUND", "ACCONT"];

    

    const [ld_pers_data, setLd_pers_data] = useState([]);
    const [ld_pl_pers_serv, setLd_pl_pers_serv] = useState([]);
    const [ld_pl_sal, setLd_pl_sal] = useState([]);
    const [ld_pl_hl_cl, setLd_pl_hl_cl] = useState([]);
    const [ld_pl_ll_sbwsl, setLd_pl_ll_sbwsl] = useState([]);
    const [ld_pl_sbhl_buetl, setLd_pl_sbhl_buetl] = useState([]);
    const [ld_pl_oth_sum, setLd_pl_oth_sum] = useState([]);
    const [ld_pl_remarks, setLd_pl_remarks] = useState([]);

    const [ld_remarks, setLd_remarks] = useState("");
    const [ld_remarks_error, setLd_remarks_error] = useState(false);

    const pension_rate_table = [0, 0, 0, 0, 0,
                                21, 24, 27, 30, 33,
                                36, 39, 43, 47, 51,
                                54, 57, 63, 65, 69, 
                                72, 75, 79, 83, 87, 90];

    const ld_loan_id = ld_data["LOAN_ID"];
    const ld_buet_id = ld_data["BUET_ID"];
    const ld_applicant_name = ld_data["APPLICANT_NAME"];
    const ld_designation = ld_data["DESIGNATION"];
    const ld_office_dept = ld_data["OFFICE_DEPT"];

    const ld_user = ld_data["sendFrom"] === ld_data["APP_STATUS"];

    var ld_processing = true;

    var ld_dob = "";

    var ld_joining_date = "";
    var ld_mos = "";
    var ld_serv_len_y = 0;
    var ld_rem_serv_m = 0;

    var ld_basic_salary = 0;
    var ld_gross_salary = 0;
    var ld_deduct = 0;
    var ld_net_salary = 0;

    var ld_pens_gra = 0;
    var ld_leav_sal = 0;
    var ld_25_mon_gran = 0;
    var ld_tot_rec = 0;

    var ld_hb_loan = 0;
    var ld_consu_loan = 0;
    var ld_lap_loan = 0;
    var ld_sblws_loan = 0;
    var ld_tot_pay = 0;
    var ld_net_rec = 0;
    
    var ld_hb_loan_ins_amnt = 0;
    var ld_consu_loan_ins_amnt = 0;
    var ld_lap_loan_ins_amnt = 0;
    var ld_sblws_loan_ins_amnt = 0;
    var ld_tot_loan_ins_amnt = 0;

    var ld_75_pens = 0;
    var ld_app_amnt = Number(ld_data["LOAN_AMOUNT"]);
    var ld_prop_amnt = 0;
    var ld_inst_amnt = 0;
    var ld_tot_no_ins = 0;
    var ld_tot_ins_amnt = 0;
    var ld_60_basic_sal = 0;

    const ld_comment_display = [];

    const ld_remarks_display = [];

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

    useEffect( () => {
        const fetch_processing_loan_data = async () =>{
            try{

                const pers_data_res = await axios.get("http://localhost:8800/personeel_login");
                setLd_pers_data(pers_data_res.data);

                const pers_serv_res = await axios.get("http://localhost:8800/processing_loan_pers_serv");
                setLd_pl_pers_serv(pers_serv_res.data);

                const sal_res = await axios.get("http://localhost:8800/processing_loan_salary");
                setLd_pl_sal(sal_res.data);

                const hl_cl_res = await axios.get("http://localhost:8800/processing_loan_hl_cl");
                setLd_pl_hl_cl(hl_cl_res.data);

                const ll_sbwsl_res = await axios.get("http://localhost:8800/processing_loan_ll_sbwsl");
                setLd_pl_ll_sbwsl(ll_sbwsl_res.data);

                const sbhl_buetl_res = await axios.get("http://localhost:8800/processing_loan_sbhl_buetl");
                setLd_pl_sbhl_buetl(sbhl_buetl_res.data);

                const oth_sum_res = await axios.get("http://localhost:8800/processing_loan_others_sum");
                setLd_pl_oth_sum(oth_sum_res.data);

                const remarks_res = await axios.get("http://localhost:8800/processing_loan_remarks");
                setLd_pl_remarks(remarks_res.data);

            }catch(err){
                console.log(err);
            }
        }
        fetch_processing_loan_data();
    }, []);


    for(let i=0;i<ld_pl_pers_serv.length;i++){
        if(ld_data["BUET_ID"] === ld_pl_pers_serv[i]["BUET_ID"]){

            ld_dob = dateFormation(ld_pl_pers_serv[i]["DATE_OF_BIRTH"]);

            ld_joining_date = dateFormation(ld_pl_pers_serv[i]["UNI_JOINING_DATE"]);

            ld_mos = dateFormation(ld_pl_pers_serv[i]["SERVICE_COMPLETION_DATE"]);

            ld_serv_len_y = Number(ld_pl_pers_serv[i]["TOTAL_SERVICE_PERIOD"].split(" ")[0]);

            var ld_duration = timeDuration(ld_pl_pers_serv[i]["SERVICE_COMPLETION_DATE"], new Date());

            ld_rem_serv_m = ld_duration[0] * 12 + ld_duration[1]; 

            break;
        }
    }

    var ld_gra_rate = 0;

    if(ld_serv_len_y >= 5 && ld_serv_len_y < 10){
        ld_gra_rate = 265;
    }else if(ld_serv_len_y >= 10 && ld_serv_len_y < 15){
        ld_gra_rate = 260;
    }else if(ld_serv_len_y >= 15 && ld_serv_len_y < 20){
        ld_gra_rate = 245;
    }else if(ld_serv_len_y >= 20){
        ld_gra_rate = 230;
    }

    var ld_pens_rate = ld_serv_len_y > 25 ? pension_rate_table[25] : pension_rate_table[ld_serv_len_y];


    for(let i=0;i<ld_pl_sal.length;i++){
        if(ld_data["LOAN_ID"] === ld_pl_sal[i]["LOAN_ID"]){

            ld_basic_salary = Number(ld_pl_sal[i]["LAST_MONTH_BASIC_SAL"]);
            ld_gross_salary = Number(ld_pl_sal[i]["LAST_MONTH_TOTAL_SAL"]);
            ld_deduct = Number(ld_pl_sal[i]["LAST_MONTH_TOTAL_DEDUCT"]);
            ld_net_salary = Number(ld_pl_sal[i]["LAST_MONTH_NET_SAL"]);

            break;
        }
    }


    ld_pens_gra = (ld_basic_salary * 0.5 * ld_pens_rate * ld_gra_rate) / 100;
    ld_25_mon_gran = ld_serv_len_y * ld_basic_salary;
    ld_tot_rec = ld_pens_gra + ld_leav_sal + ld_25_mon_gran;


    for(let i=0;i<ld_pl_hl_cl.length;i++){
        if(ld_data["LOAN_ID"] === ld_pl_hl_cl[i]["LOAN_ID"]){

            ld_hb_loan = ld_pl_hl_cl[i]["HL_REMAIN_INST_AMNT"];
            ld_consu_loan = ld_pl_hl_cl[i]["CL_REMAIN_INST_AMNT"];

            ld_hb_loan_ins_amnt = ld_pl_hl_cl[i]["HL_INST_AMNT"];
            ld_consu_loan_ins_amnt = ld_pl_hl_cl[i]["CL_INST_AMNT"];

            break;
        }
    }


    for(let i=0;i<ld_pl_ll_sbwsl.length;i++){
        if(ld_data["LOAN_ID"] === ld_pl_ll_sbwsl[i]["LOAN_ID"]){

            ld_lap_loan = ld_pl_ll_sbwsl[i]["LL_REMAIN_INST_AMNT"];
            ld_sblws_loan = ld_pl_ll_sbwsl[i]["SBWSL_REMAIN_INST_AMNT"];

            ld_lap_loan_ins_amnt = ld_pl_ll_sbwsl[i]["LL_INST_AMNT"];
            ld_sblws_loan_ins_amnt = ld_pl_ll_sbwsl[i]["SBWSL_INST_AMNT"];

            break;
        }
    }

    ld_tot_pay = ld_hb_loan + ld_consu_loan + ld_lap_loan + ld_sblws_loan;
    ld_net_rec = ld_tot_rec - ld_tot_pay;

    ld_tot_loan_ins_amnt = ld_hb_loan_ins_amnt + ld_consu_loan_ins_amnt + ld_lap_loan_ins_amnt + ld_sblws_loan_ins_amnt;

    

    ld_75_pens = ld_pens_gra * 0.75;
    
    ld_60_basic_sal = ld_basic_salary * 0.6;

    var calc_mon = 0;

    var available_ins_amount = ld_60_basic_sal - ld_tot_loan_ins_amnt;

    var temp_prop_amnt = ld_app_amnt;

    var temp_inst_amnt = ld_app_amnt;

    var interest_rate = 7.75;

    

    if(ld_rem_serv_m < 10){

        temp_prop_amnt = 0;
        temp_inst_amnt = 0;
        ld_tot_no_ins = 0;
        ld_processing = false;

        ld_comment_display.push(
            <div className="assessment_comment">
               - Remaining Service Period is less than 10 months.
            </div>
        );
        
    }else {
        if(ld_rem_serv_m >= 10 && ld_rem_serv_m < 30){
            calc_mon = 10;
        }else if(ld_rem_serv_m >= 30 && ld_rem_serv_m < 50){
            calc_mon = 30;
        }else if(ld_rem_serv_m >= 50 && ld_rem_serv_m < 80){
            calc_mon = 50;
        }else if(ld_rem_serv_m >= 80 && ld_rem_serv_m < 100){
            calc_mon = 80;
        }else{
            calc_mon = 100;
        }

        // console.log("available_ins_amount : "+available_ins_amount);

        // console.log("temp_inst_amnt : "+temp_inst_amnt);

        while(temp_inst_amnt > available_ins_amount){
            temp_inst_amnt = Math.ceil(((2 * temp_prop_amnt) * (1200 + calc_mon * interest_rate))/(calc_mon * (2400 - interest_rate + calc_mon * interest_rate)));
            temp_prop_amnt = temp_prop_amnt - 10000;
        }

        // console.log("amount : "+(temp_prop_amnt+10000)+", installment : "+temp_inst_amnt);

    }

    if(temp_prop_amnt != 0){
        ld_prop_amnt = temp_prop_amnt + 10000;
    }

    ld_tot_no_ins = calc_mon;

    ld_inst_amnt = temp_inst_amnt;

    ld_tot_ins_amnt = ld_tot_loan_ins_amnt + ld_inst_amnt;

    

    const remarksItem = (label, value) => {
        return(
            <div className="section_item">
                <div className="remarks_item_label sec_item_def">{label}</div>
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

    for(let i=0;i<ld_pl_remarks.length;i++){
        if(ld_data["LOAN_ID"] === ld_pl_remarks[i]["LOAN_ID"]){

            for(let j=0;j<loan_personnel.length;j++){
                if(ld_pl_remarks[i][loan_personnel[j]] !== null){
                    ld_remarks_display.push(remarksItem(loan_personnel[j], ld_pl_remarks[i][loan_personnel[j]]));
                }
            }

            break;
        }
    }

    var ld_personnel_data = [];

    for(let i=0;i<ld_pers_data.length;i++){
        if (ld_data["APP_STATUS"] === ld_pers_data[i]["designation"]) {
            ld_personnel_data = ld_pers_data[i];
            break;
        }
    }

    const onForwarClick = async e =>{
        e.preventDefault();

        if(ld_remarks === ""){
            setLd_remarks_error(true);
            return;
        }else{
            setLd_remarks_error(false);
        }



        const updateRemarksData = {
            "LOAN_ID": ld_loan_id,
            "REMARKER": ld_data["APP_STATUS"],
            "REMARKS": ld_remarks,
        };


        try{
            await axios.put("http://localhost:8800/processing_loan_remarks/", updateRemarksData);
            
            ld_navigate("/personnel_dashboard", {state : {data : ld_personnel_data}});

        }catch(err){
            console.log(err);
        }




    };

    return(
        <>

            <NavBar hide={{nav_mid: true}} />

            <div className="loan_assessment_form">

                <div className="page_label">Loan Assessment Form</div>

                <div className="assessment_section personal_information">
                    <div className="section_label">
                        A) Personal Information :

                    </div>

                    <div className="section_items">
                        <div className="section_items_div">
                            {sectionItem("1", "LOAN ID", ld_loan_id)}
                            {sectionItem("2", "BUET ID", ld_buet_id)}
                            {sectionItem("3", "Applicant Name", ld_applicant_name)}
                            {sectionItem("4", "Designation", ld_designation)}
                            {sectionItem("5", "Office/Dept.", ld_office_dept)}
                            {sectionItem("6", "Date of Birth", ld_dob)}
                            {
                                ld_user ? 
                                ""
                                :
                                sectionItem("7", "Application Status", ld_data["APP_STATUS"])
                            }

                        </div>
                        <div className="section_items_div">
                            {/* <img className="pro_photo" src="../../../../../../../../backend/public/images/pro_photo/profile_photo_1725167297255.jpg">
                             */}
                        </div>
                    </div>
                </div>
                
                <div className="assessment_section employment_information">
                    <div className="section_label">B) Employment Information :</div>
                    
                    <div className="section_items">
                        <div className="section_items_div">
                            {sectionItem("1", "Joining Date", ld_joining_date)}
                            {sectionItem("3", "Maturity of Service (including PRL)", ld_mos)}
                        </div>
                        <div className="section_items_div">
                            {sectionItem("2", "Service Length (Year)", ld_serv_len_y)}
                            {sectionItem("4", "Remaining Service (No of Month)", ld_rem_serv_m)}
                        </div>
                    </div>
                </div>

                <div className="assessment_section salary_information">
                    <div className="section_label">C) Salary Information :</div>
                    
                    <div className="section_items">
                        <div className="section_items_div">
                            {sectionItem("1", "Basic Salary", ld_basic_salary)}
                            {sectionItem("3", "Deduction", ld_deduct)}
                        </div>
                        <div className="section_items_div">
                            {sectionItem("2", "Gross Salary", ld_gross_salary)}
                            {sectionItem("4", "Net Salary", ld_net_salary)}
                        </div>
                    </div>
                </div>

                <div className="assessment_section financial_position">
                    <div className="section_label">D) Financial Position :</div>
                    
                    
                    <div className="subsection_label">Receivables</div>
                    <div className="section_items">
                        <div className="section_items_div">
                            {sectionItem("1", "Pension/Gratuity", ld_pens_gra)}
                        </div>
                        <div className="section_items_div">
                            {sectionItem("2", "Leave Salary", ld_leav_sal)}
                        </div>
                        
                    </div>
                    {sectionItem("3", "25 Months Grant (Trust Fund) (Service Length × Basic Salary", ld_25_mon_gran)}
                    {sectionItem("4", "Total Receivable (TR) (1.+2.+3.)", ld_tot_rec)}


                    <div className="subsection_label">Payables</div>
                    <div className="section_items">
                        <div className="section_items_div">
                            {sectionItem("5", "House Building Loan", ld_hb_loan)}
                            {sectionItem("7", "Laptop Loan", ld_lap_loan)}
                        </div>
                        <div className="section_items_div">
                            {sectionItem("6", "Consumer Loan", ld_consu_loan)}
                            {sectionItem("8", "SBL Whole Sale Loan", ld_sblws_loan)}
                        </div>
                        
                    </div>
                    {sectionItem("9", "Total Payable (TP) (5.+6.+7.+8.)", ld_tot_pay)}
                    {sectionItem("10", "Net Receivable (TR-TP) (4.-9.)", ld_net_rec)}


                    <div className="subsection_label">Installment Amount of Loan</div>
                    <div className="section_items">
                        <div className="section_items_div">
                            {sectionItem("11", "House Building Loan", ld_hb_loan_ins_amnt)}
                            {sectionItem("13", "Laptop Loan", ld_lap_loan_ins_amnt)}
                        </div>
                        <div className="section_items_div">
                            {sectionItem("12", "Consumer Loan", ld_consu_loan_ins_amnt)}
                            {sectionItem("14", "SBL Whole Sale Loan", ld_sblws_loan_ins_amnt)}
                        </div>
                        
                    </div>
                    {sectionItem("15", "Total Installment Amount of Loan(11.+12.+13.+14.)", ld_tot_loan_ins_amnt)}


                </div>

                <div className="assessment_section loan_assessment">
                    <div className="section_label">E) Loan Assessment :</div>
                    
                    <div className="section_items">
                        <div className="section_items_div">
                            {sectionItem("1", "75% of Pension", ld_75_pens)}
                            {sectionItem("3", "Proposed Amount", ld_prop_amnt)}
                            {sectionItem("5", "Total Number of Installment", ld_tot_no_ins)}
                            {sectionItem("7", "60% of Basic Salary", ld_60_basic_sal)}
                        </div>
                        <div className="section_items_div">
                            {sectionItem("2", "Applied Amount", ld_app_amnt)}
                            {sectionItem("4", "Installment Amount", ld_inst_amnt)}
                            {sectionItem("6", "Total Installment Amount (D15.+E4.)", ld_tot_ins_amnt)}
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
                            <div className="remarks_item">
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
                        <div className="ld_forward" onClick={onForwarClick}>
                            Forward
                        </div>
                    </div>
                    :
                    ""

                }


                




            </div>


            <Footer />

        </>
    );
}

