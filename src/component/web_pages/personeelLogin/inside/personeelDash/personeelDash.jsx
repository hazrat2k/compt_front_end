import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import axios from "axios";
import moment from "moment";

import "./personeelDash.css";

import NavBar from "../../../../page_compo/navBar/navBar";
import Footer from "../../../../page_compo/footer/footer";



export default function PersoneelDash(){

    const pd_navigate = useNavigate();
    const { state } = useLocation();

    const loan_personnel = ["ACCONT", "AO_FUND", "AD_FUND", "DP_COMPT", "COMPT", "DC_AUDIT", "ACCONT", "AO_FUND", "AD_FUND", "DP_COMPT", "COMPT", "DC_AUDIT", "ACCONT", "AD_FUND", "COMPT", "ACCONT",];

    var pending_loan_status = false;
    var processing_loan_status = false;
    var sanction_loan_status = false;
    var bill_loan_status = false;

    const pd_data = state["data"];


    const pd_buet_id = pd_data["buet_id"];
    const pd_pers_nam = pd_data["name"];
    const pd_desig = pd_data["designation"];
    const pd_off_dept = pd_data["office"];

    const pd_pend_loan_display = [];
    const pd_process_loan_display = [];

    const [pd_pend_loan_data, setPd_pend_loan_data] = useState([]);
    const [pd_sanc_loan_data, setPd_sanc_loan_data] = useState([]);


    useEffect( () => {
        const fetch_pending_loan_data = async () =>{
            try{
                const res = await axios.get("http://localhost:8800/processing_loan_info");
                setPd_pend_loan_data(res.data);

            }catch(err){
                console.log(err);
            }

            try{
                const sanc_res = await axios.get("http://localhost:8800/sanction_loan");
                setPd_sanc_loan_data(sanc_res.data);

            }catch(err){
                console.log(err);
            }


        }
        fetch_pending_loan_data();
    }, []);


    const dateFormation = ( date ) => {
        var temp_date = new Date(date);
        return moment(temp_date).format('DD MMM YYYY');
    };

    const onLoanIdClick = (e, data) => {
        e.preventDefault();
        data["sendFrom"] = pd_data["designation"];
        pd_navigate("/personnel_dashboard/pending_loan_details", {state : {data : data}});

    };

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

    for(let i=0;i<pd_pend_loan_data.length;i++){

        var temp_status = Number(pd_pend_loan_data[i]["APP_STATUS"]);
        
        if(pd_desig === loan_personnel[temp_status]){
            pending_loan_status = true;

            pd_pend_loan_display.push(
                <div className="pd_section_row">
                    <div className="pd_section_col linked_col" onClick={(e) => onLoanIdClick(e, pd_pend_loan_data[i])}><div className="pd_section_col_value">{pd_pend_loan_data[i]["LOAN_ID"]}</div></div>
                    <div className="pd_section_col"><div className="pd_section_col_value">{pd_pend_loan_data[i]["APPLICANT_NAME"]}</div></div>
                    <div className="pd_section_col"><div className="pd_section_col_value">{pd_pend_loan_data[i]["DESIGNATION"]}</div></div>
                    <div className="pd_section_col"><div className="pd_section_col_value">{pd_pend_loan_data[i]["OFFICE_DEPT"]}</div></div>
                    <div className="pd_section_col"><div className="pd_section_col_value">{pd_pend_loan_data[i]["LOAN_TYPE"]}</div></div>
                    <div className="pd_section_col"><div className="pd_section_col_value">{app_status(temp_status)}</div></div>
                    <div className="pd_section_col"><div className="pd_section_col_value">{dateFormation(pd_pend_loan_data[i]["LOAN_APPLICATION_DATE"])}</div></div>
                </div>
            );

        }else{
            processing_loan_status = true;
            
            pd_process_loan_display.push(
                <div className="pd_section_row">
                    <div className="pd_section_col linked_col" onClick={(e) => onLoanIdClick(e, pd_pend_loan_data[i])}><div className="pd_section_col_value">{pd_pend_loan_data[i]["LOAN_ID"]}</div></div>
                    <div className="pd_section_col"><div className="pd_section_col_value">{pd_pend_loan_data[i]["APPLICANT_NAME"]}</div></div>
                    <div className="pd_section_col"><div className="pd_section_col_value">{pd_pend_loan_data[i]["DESIGNATION"]}</div></div>
                    <div className="pd_section_col"><div className="pd_section_col_value">{pd_pend_loan_data[i]["OFFICE_DEPT"]}</div></div>
                    <div className="pd_section_col"><div className="pd_section_col_value">{pd_pend_loan_data[i]["LOAN_TYPE"]}</div></div>
                    <div className="pd_section_col"><div className="pd_section_col_value">{app_status(temp_status)}</div></div>
                    <div className="pd_section_col"><div className="pd_section_col_value">{dateFormation(pd_pend_loan_data[i]["LOAN_APPLICATION_DATE"])}</div></div>
                </div>
            );
        }
    }

    for(let i=0;i<pd_sanc_loan_data.length;i++){
        if(pd_sanc_loan_data[i]["SANC_STATUS"] == "IN PROCESS"){
            sanction_loan_status = true;
            break;
        }
        if(pd_sanc_loan_data[i]["SANC_STATUS"] == "BILL"){
            bill_loan_status = true;
            break;
        }
        
    }



    const pdSectionItem = (label, value) => {
        return(
            <div className="pd_section_item">
                <div className="pd_section_item_label">{label}</div>
                <div className="pd_section_item_colon">:</div>
                <div className="pd_section_item_value">{value}</div>
            </div>
        );
    };


    const onSanctionClick = (e) => {
        e.preventDefault();
        pd_navigate("/personnel_dashboard/sanction_copy");
    }

    const onBillClick = (e) => {
        e.preventDefault();
        pd_navigate("/personnel_dashboard/bill_copy");
    }

    return(
        <>
            <NavBar hide={{nav_mid: true}} />


            <div className="personnel_dashboard">

                <div className="pd_page_label">Personnel Dashboard</div>

                <div className="pd_section">
                    <div className="pd_section_label">
                        Personal Information :
                    </div>

                    <div className="pd_section_items profile">
                        <div className="pd_section_items_div">
                            {pdSectionItem("BUET ID", pd_buet_id)}
                            {pdSectionItem("Designation", pd_desig)}

                        </div>
                        <div className="section_items_div">
                            {pdSectionItem("Personnel Name", pd_pers_nam)}
                            {pdSectionItem("Office/Dept.", pd_off_dept)}
                        </div>
                    </div>
                </div>

                {
                    pd_desig === "ACCONT" ?
                    <div className="pd_section">
                        <div className="pd_section_label">
                            Preview Copy :
                        </div>

                        <div className="pd_section_copy">
                            {
                                sanction_loan_status ?
                                <div className="pd_butt" onClick={onSanctionClick}>
                                    Preview Sanction
                                </div>
                                :
                                <div className="no_pending_loan">
                                    No loan is available for sanction
                                </div>
                            }
                            {
                                bill_loan_status ?
                                <div className="pd_butt" onClick={onBillClick}>
                                    Preview Bill
                                </div>
                                :
                                <div className="no_pending_loan">
                                    No loan is available for billing
                                </div>
                            }


                        </div>

                        

                        
                        

                        
                    </div>
                    :
                    ""
                }

                <div className="pd_section">
                    <div className="pd_section_label">
                        Pending Loan :
                    </div>

                    {
                        pending_loan_status ? 
                        <div className="pd_section_items pending_loan">
                            <div className="pd_section_row pd_section_head_row">
                                <div className="pd_section_col"><div className="pd_section_col_value">LOAN ID</div></div>
                                <div className="pd_section_col"><div className="pd_section_col_value">APPLICANT NAME</div></div>
                                <div className="pd_section_col"><div className="pd_section_col_value">DESIGNATION</div></div>
                                <div className="pd_section_col"><div className="pd_section_col_value">OFFICE/DEPT.</div></div>
                                <div className="pd_section_col"><div className="pd_section_col_value">LOAN TYPE</div></div>
                                <div className="pd_section_col"><div className="pd_section_col_value">APPLICATION STATUS</div></div>
                                <div className="pd_section_col"><div className="pd_section_col_value">APPLIED TIME</div></div>
                            </div>

                            {pd_pend_loan_display}
                        </div>
                        
                        :

                        <div className="no_pending_loan">
                            No Pending Loan
                        </div>

                    }

                    
                </div>

                <div className="pd_section">
                    <div className="pd_section_label">
                        Processing Loan :
                    </div>

                    {
                        processing_loan_status ? 
                        <div className="pd_section_items pending_loan">
                            <div className="pd_section_row pd_section_head_row">
                                <div className="pd_section_col"><div className="pd_section_col_value">LOAN ID</div></div>
                                <div className="pd_section_col"><div className="pd_section_col_value">APPLICANT NAME</div></div>
                                <div className="pd_section_col"><div className="pd_section_col_value">DESIGNATION</div></div>
                                <div className="pd_section_col"><div className="pd_section_col_value">OFFICE/DEPT.</div></div>
                                <div className="pd_section_col"><div className="pd_section_col_value">LOAN TYPE</div></div>
                                <div className="pd_section_col"><div className="pd_section_col_value">APPLICATION STATUS</div></div>
                                <div className="pd_section_col"><div className="pd_section_col_value">APPLIED TIME</div></div>
                            </div>

                            {pd_process_loan_display}
                        </div>
                        
                        :

                        <div className="no_pending_loan">
                            No Processing Loan
                        </div>

                    }

                    
                </div>

                


            </div>



            <Footer />

        </>
    );
}





