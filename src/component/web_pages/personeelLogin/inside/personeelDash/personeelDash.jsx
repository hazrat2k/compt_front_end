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

    var pending_loan_status = false;

    const pd_data = state["data"];


    const pd_buet_id = pd_data["buet_id"];
    const pd_pers_nam = pd_data["name"];
    const pd_desig = pd_data["designation"];
    const pd_off_dept = pd_data["office"];

    const pd_pend_loan_display = [];

    const [pd_pend_loan_data, setPd_pend_loan_data] = useState([]);

    useEffect( () => {
        const fetch_pending_loan_data = async () =>{
            try{
                const res = await axios.get("http://localhost:8800/processing_loan_info");
                setPd_pend_loan_data(res.data);

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
        pd_navigate("/personnel_dashboard/pending_loan_details", {state : {data : data}});

    };

    for(let i=0;i<pd_pend_loan_data.length;i++){
        if(pd_data["designation"] === pd_pend_loan_data[i]["APP_STATUS"]){
            pending_loan_status = true;
            pd_pend_loan_display.push(
                <div className="pd_section_row">
                    <div className="pd_section_col linked_col" onClick={(e) => onLoanIdClick(e, pd_pend_loan_data[i])}>{pd_pend_loan_data[i]["LOAN_ID"]}</div>
                    <div className="pd_section_col">{pd_pend_loan_data[i]["APPLICANT_NAME"]}</div>
                    <div className="pd_section_col">{pd_pend_loan_data[i]["DESIGNATION"]}</div>
                    <div className="pd_section_col">{pd_pend_loan_data[i]["OFFICE_DEPT"]}</div>
                    <div className="pd_section_col">{pd_pend_loan_data[i]["LOAN_TYPE"]}</div>
                    <div className="pd_section_col">{dateFormation(pd_pend_loan_data[i]["LOAN_APPLICATION_DATE"])}</div>
                </div>
            );

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

                <div className="pd_section">
                    <div className="pd_section_label">
                        Pending Loan :
                    </div>

                    {
                        pending_loan_status ? 
                        <div className="pd_section_items pending_loan">
                            <div className="pd_section_row pd_section_head_row">
                                <div className="pd_section_col">LOAN ID</div>
                                <div className="pd_section_col">APPLICANT NAME</div>
                                <div className="pd_section_col">DESIGNATION</div>
                                <div className="pd_section_col">OFFICE/DEPT.</div>
                                <div className="pd_section_col">LOAN TYPE</div>
                                <div className="pd_section_col">APPLIED TIME</div>
                            </div>

                            {pd_pend_loan_display}
                        </div>
                        
                        :

                        <div className="no_pending_loan">
                            No Pending Loan
                        </div>

                    }

                    
                </div>


            </div>



            <Footer />

        </>
    );
}





