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

    const pd_data = state["data"];

    const loan_personnel = ["accntt_fund", "ao_fund", "ad_fund", "dp_compt", "compt", "dc_audit", "accntt_fund", "ao_fund", "ad_fund", "dp_compt", "compt", "dc_audit", "accntt_fund", "ad_fund", "compt", "accntt_fund", "accntt_cash", "accntt_fund"];

    var sanction_loan_id = {};

    const [pd_select, setPd_select] = useState(state["loan_type"]);

    var pending_loan_status = false;
    var processing_loan_status = false;
    var sanction_loan_status = false;
    var bill_loan_status = false;

    const pd_userName = pd_data["USERNAME"];
    const pd_buet_id = pd_data["EMPLOYEE_ID"];
    const pd_pers_nam = pd_data["EMPLOYEE_NAME"];
    const pd_desig = pd_data["DESIGNATION"];
    const pd_off_dept = pd_data["OFFICE"];

    const pd_pend_loan_display = [];
    const pd_process_loan_display = [];

    const [pd_pend_loan_data, setPd_pend_loan_data]  = useState([]);

    const [pd_sanc_loan_data, setPd_sanc_loan_data] = useState([]);



    const [pd_pend_loan_id, setPd_pend_loan_id] = useState("");

    const [pd_pend_app_nam, setPd_pend_app_nam] = useState("");


    const fetch_data = async (fd_l_type) => {
        if(fd_l_type != "null"){

            const uploadValue = {
                "LOAN_TYPE" : fd_l_type
            }

            try{
                const res = await axios.post("http://localhost:8800/processing_loan_info", uploadValue);
                setPd_pend_loan_data(res.data);
    
            }catch(err){
                console.log(err);
            }

            try{
                const sanc_res = await axios.post("http://localhost:8800/sanction_loan", uploadValue);
                setPd_sanc_loan_data(sanc_res.data);

            }catch(err){
                console.log(err);
            }
        }
    }

    useEffect(() => {
        fetch_data(pd_select);
    }, []);

    const dateFormation = ( date ) => {
        var temp_date = new Date(date);
        return moment(temp_date).format('DD MMM YYYY');
    };

    const onPendLoanIDFilter = async (e) => {

        const f_loan_id = e.target.value;

        setPd_pend_loan_id(f_loan_id);

        if(f_loan_id == ""){
            const uploadValue = {
                "LOAN_TYPE" : pd_select
            }

            try{
                const res = await axios.post("http://localhost:8800/processing_loan_info", uploadValue);
                setPd_pend_loan_data(res.data);
    
            }catch(err){
                console.log(err);
            }
        }else{
            const uploadId = {
                "LOAN_ID" : f_loan_id,
                "LOAN_TYPE" : pd_select
            }
    
            try{
                const res = await axios.post("http://localhost:8800/processing_loan_id_filter", uploadId);
                setPd_pend_loan_data(res.data);
    
            }catch(err){
                console.log(err);
            }
        }

        
    }

    const onPendAppNamFilter = async (e) => {

        var f_app_nam = e.target.value;

        f_app_nam = f_app_nam.toUpperCase();

        setPd_pend_app_nam(f_app_nam);

        if(f_app_nam == ""){

            const uploadValue = {
                "LOAN_TYPE" : pd_select
            }

            try{
                const res = await axios.post("http://localhost:8800/processing_loan_info", uploadValue);
                setPd_pend_loan_data(res.data);
            }catch(err){
                console.log(err);
            }
        }else{

            const uploadNam = {
                "EMPLOYEE_NAME" : f_app_nam,
                "LOAN_TYPE" : pd_select
            }
            try{
                const res = await axios.post("http://localhost:8800/processing_app_nam_filter", uploadNam);
                setPd_pend_loan_data(res.data);
    
            }catch(err){
                console.log(err);
            }
        }

    }

    const onLoanIdClick = (e, data) => {
        data["sendFrom"] = pd_data["USERNAME"];
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

        var temp_status = Number(pd_pend_loan_data[i]["APP_POS"]);
        
        if(pd_userName === loan_personnel[temp_status]){
            pending_loan_status = true;

            pd_pend_loan_display.push(
                <div className="pd_section_row">
                    <div className="pd_section_col linked_col" onClick={(e) => onLoanIdClick(e, pd_pend_loan_data[i])}><div className="pd_section_col_value">{pd_pend_loan_data[i]["LOAN_ID"]}</div></div>
                    <div className="pd_section_col"><div className="pd_section_col_value">{pd_pend_loan_data[i]["EMPLOYEE_NAME"]}</div></div>
                    <div className="pd_section_col"><div className="pd_section_col_value">{pd_pend_loan_data[i]["DESIGNATION"]}</div></div>
                    <div className="pd_section_col"><div className="pd_section_col_value">{pd_pend_loan_data[i]["OFFICE"]}</div></div>
                    <div className="pd_section_col"><div className="pd_section_col_value">{pd_pend_loan_data[i]["LOAN_TYPE"]}</div></div>
                    <div className="pd_section_col"><div className="pd_section_col_value">{app_status(temp_status)}</div></div>
                    <div className="pd_section_col"><div className="pd_section_col_value">{dateFormation(pd_pend_loan_data[i]["LOAN_APP_DATE"])}</div></div>
                </div>
            );

        }else{
            processing_loan_status = true;
            
            pd_process_loan_display.push(
                <div className="pd_section_row">
                    <div className="pd_section_col linked_col" onClick={(e) => onLoanIdClick(e, pd_pend_loan_data[i])}><div className="pd_section_col_value">{pd_pend_loan_data[i]["LOAN_ID"]}</div></div>
                    <div className="pd_section_col"><div className="pd_section_col_value">{pd_pend_loan_data[i]["EMPLOYEE_NAME"]}</div></div>
                    <div className="pd_section_col"><div className="pd_section_col_value">{pd_pend_loan_data[i]["DESIGNATION"]}</div></div>
                    <div className="pd_section_col"><div className="pd_section_col_value">{pd_pend_loan_data[i]["OFFICE"]}</div></div>
                    <div className="pd_section_col"><div className="pd_section_col_value">{pd_pend_loan_data[i]["LOAN_TYPE"]}</div></div>
                    <div className="pd_section_col"><div className="pd_section_col_value">{app_status(temp_status)}</div></div>
                    <div className="pd_section_col"><div className="pd_section_col_value">{dateFormation(pd_pend_loan_data[i]["LOAN_APP_DATE"])}</div></div>
                </div>
            );
        }

    }


    for(let i=0;i<pd_sanc_loan_data.length;i++){

        if(pd_sanc_loan_data[i]["SANC_STATUS"] == "IN PROCESS"){
            sanction_loan_status = true;
            const temp = {}
            temp[pd_sanc_loan_data[i]["LOAN_ID"]] = false;
            sanction_loan_id = {...sanction_loan_id, ...temp};

        }

        if(pd_sanc_loan_data[i]["SANC_STATUS"] == "BILL"){
            bill_loan_status = true;
            
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

    const onLoanSelect = async (e) => {

        var selected_type = e.target.value;

        setPd_select(selected_type);

        if(selected_type != "null"){

            const uploadValue = {
                "LOAN_TYPE" : selected_type
            }

            try{
                const res = await axios.post("http://localhost:8800/processing_loan_info", uploadValue);
                setPd_pend_loan_data(res.data);
    
            }catch(err){
                console.log(err);
            }

            try{
                const sanc_res = await axios.post("http://localhost:8800/sanction_loan", uploadValue);
                setPd_sanc_loan_data(sanc_res.data);

            }catch(err){
                console.log(err);
            }
        }

    }


    const onSanctionClick = (e) => {
        e.preventDefault();
        pd_navigate("/personnel_dashboard/sanction_copy", {state : {type: pd_select, sanctionedLoan: sanction_loan_id}});
    }

    const onBillClick = (e) => {
        e.preventDefault();
        pd_navigate("/personnel_dashboard/bill_copy", {state : {type: pd_select}});
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

                <select className="pd_select" onChange={onLoanSelect} defaultValue={pd_select}>
                    <option value="null">Select a Loan Type......</option>
                    <option value="HOUSE BUILDING LOAN">HOUSE BUILDING LOAN</option>
                    <option value="CONSUMER LOAN">CONSUMER LOAN</option>
                    <option value="LAPTOP LOAN">LAPTOP LOAN</option>
                </select>

                {
                    pd_select == "null" ?
                    <div className="no_pending_loan">
                        Select a Loan Type to Display
                    </div>
                    :
                    <>
                        {
                            pd_userName === "accntt_fund" ?
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

                        <div className="pd_section_filter">
                            <input className="pd_section_item_filter" type="text" value={pd_pend_loan_id} placeholder="Search by Loan ID" onChange={onPendLoanIDFilter}/>
                            <input className="pd_section_item_filter" type="text" value={pd_pend_app_nam} placeholder="Search by Applicant Name" onChange={onPendAppNamFilter}/>
                        </div>

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
                    </>
                    

                }


            </div>

            <Footer />

        </>
    );
}





