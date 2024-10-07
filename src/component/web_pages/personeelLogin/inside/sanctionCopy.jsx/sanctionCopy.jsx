import React, { useEffect, useState } from "react";
import axios from "axios";

import "./sanctionCopy.css";


import NavBar from "../../../../page_compo/navBar/navBar";
import Footer from "../../../../page_compo/footer/footer";
import SanctionCopyForm from "../pdfCopy/sanctionCopyForm";
import { useLocation } from "react-router";


export default function SanctionCopy(){

    const [sc_sanc_loan_data, setSc_sanc_loan_data] = useState([]);
    const sc_sanc_loan_display = useState([]);

    const { state } = useLocation();

    const sc_loan_type = state["type"];

    const [selectedLoan, setSelectedLoan] = useState(state["sanctionedLoan"]);

    var a = ['','one ','two ','three ','four ', 'five ','six ','seven ','eight ','nine ','ten ','eleven ','twelve ','thirteen ','fourteen ','fifteen ','sixteen ','seventeen ','eighteen ','nineteen '];
    var b = ['', '', 'twenty','thirty','forty','fifty', 'sixty','seventy','eighty','ninety'];

    const inWords = (num) => {
        if ((num = num.toString()).length > 9) return 'overflow';
        var n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
        if (!n) return;
        var str = '';
        str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
        str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
        str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
        str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
        str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) : '';
        return str;
    }

    let nf = new Intl.NumberFormat('en-US');

    useEffect( () => {
        const fetch_sanction_loan_data = async () =>{

            const uploadLoanType = {
                "LOAN_TYPE" : sc_loan_type
            }

            try{
                const sanc_res = await axios.post("http://localhost:8800/sanction_loan", uploadLoanType);
                setSc_sanc_loan_data(sanc_res.data);

            }catch(err){
                console.log(err);
            }

        }
        fetch_sanction_loan_data();
    }, []);

    const onCheckBoxChange = (e) =>{

        const l_id = e.target.name;

        var temp = {...selectedLoan};

        temp[l_id] = !temp[l_id];

        console.log(temp);
        
        setSelectedLoan(temp);

    }

    const sc_table_col = (value, cn) => {
        cn = "sc_table_col " + cn;
        return(
            <div className={cn}>
                <div className="sc_table_cell">{value}</div> 
            </div>
        );
    }

    var count = 0;

    var total_sanction = 0;


    for(let i=0;i<sc_sanc_loan_data.length;i++){
        if(sc_sanc_loan_data[i]["SANC_STATUS"] == "IN PROCESS"){

            sc_sanc_loan_display.push(
                <div className="sc_table_row">
                    <input type="checkbox" name={sc_sanc_loan_data[i]["LOAN_ID"]} checked={selectedLoan[sc_sanc_loan_data[i]["LOAN_ID"]]} onChange={onCheckBoxChange} />
                    {sc_table_col(++count, "small_col")}
                    {sc_table_col(sc_sanc_loan_data[i]["LOAN_ID"], "large_col")}
                    {sc_table_col(sc_sanc_loan_data[i]["EMPLOYEE_NAME"], "large_col")}
                    {sc_table_col(sc_sanc_loan_data[i]["DESIGNATION"], "large_col")}
                    {sc_table_col(sc_sanc_loan_data[i]["OFFICE"], "small_col")}
                    {sc_table_col(sc_sanc_loan_data[i]["CATEGORY"], "small_col")}
                    {sc_table_col(sc_sanc_loan_data[i]["DATE_OF_BIRTH"], "small_col")}
                    {sc_table_col(sc_sanc_loan_data[i]["DATE_FIRST_JOIN"], "small_col")}
                    {sc_table_col(nf.format(sc_sanc_loan_data[i]["NET_PAY"]), "small_col")}
                    {sc_table_col(nf.format(sc_sanc_loan_data[i]["APPLY_AMOUNT"]), "small_col")}
                    {sc_table_col(nf.format(sc_sanc_loan_data[i]["ALLOW_AMOUNT"]), "small_col")}
                    {sc_table_col(nf.format(sc_sanc_loan_data[i]["SANCTION_AMOUNT"]), "large_col sc_bold")}
                    {sc_table_col(nf.format(sc_sanc_loan_data[i]["RECOVERY_AMOUNT"]), "large_col")}
                    {sc_table_col(nf.format(sc_sanc_loan_data[i]["INSTALL_AMOUNT"]), "small_col")}
                    {sc_table_col(nf.format(sc_sanc_loan_data[i]["TOTAL_INTEREST"]), "small_col")}
                    {sc_table_col(sc_sanc_loan_data[i]["INSTALL_NO"], "small_col")}
                    {sc_table_col(sc_sanc_loan_data[i]["BANK_ACCOUNT_NO"], "small_col")}
                    {sc_table_col(" ", "small_col")}
                    {sc_table_col(" ", "small_col")}
                </div>
            );

            if(selectedLoan[sc_sanc_loan_data[i]["LOAN_ID"]]){
                total_sanction += Number(sc_sanc_loan_data[i]["SANCTION_AMOUNT"]);
            }
        }
    }

    sc_sanc_loan_display.push(
        <div className="sc_table_row">
            {sc_table_col(" ", "small_col")}
            {sc_table_col(" ", "large_col")}
            {sc_table_col(" ", "large_col")}
            {sc_table_col(" ", "large_col")}
            {sc_table_col(" ", "large_col")}
            {sc_table_col(" ", "small_col")}
            {sc_table_col(" ", "small_col")}
            {sc_table_col(" ", "large_col")}
            {sc_table_col(" ", "large_col")}
            {sc_table_col("TOTAL", "small_col")}
            {sc_table_col(nf.format(total_sanction), "large_col sc_bold")}
        </div>
    );


    return(
        <>
            <NavBar hide={{nav_mid: true}} />

            <div className="sanction_copy">
                <div className="sc_page_title">Sanction Copy</div>

                <div className="sc_table">
                    <div className="sc_table_row sc_bold">
                        <input className="sc_checkbox" type="checkbox" />
                        {sc_table_col("SL NO", "small_col")}
                        {sc_table_col("LOAN ID", "large_col")}
                        {sc_table_col("NAME", "large_col")}
                        {sc_table_col("DESIGNATION", "large_col")}
                        {sc_table_col("OFFICE", "small_col")}
                        {sc_table_col("CATEGORY", "small_col")}
                        {sc_table_col("BIRTH DATE", "small_col")}
                        {sc_table_col("JOINING DATE", "small_col")}
                        {sc_table_col("NET PAY", "small_col")}
                        {sc_table_col("APPLY AMOUNT", "small_col")}
                        {sc_table_col("ALLOW AMOUNT", "small_col")}
                        {sc_table_col("SANCTION AMOUNT", "large_col")}
                        {sc_table_col("RECOVERY AMOUNT", "large_col")}
                        {sc_table_col("INSTALL AMOUNT", "small_col")}
                        {sc_table_col("TOTAL INTEREST", "small_col")}
                        {sc_table_col("INST NO", "small_col")}
                        {sc_table_col("ACCOUNT NO", "small_col")}
                        {sc_table_col("LAST AP N", "small_col")}
                        {sc_table_col("LAST LOAN D", "small_col")}
                    </div>
                    {sc_sanc_loan_display}
                </div>

                <div className="sc_in_words">
                    <div className="sc_text">
                        In Words : {inWords(total_sanction)} TK. Only
                    </div>
                </div>

                <SanctionCopyForm loan_type={sc_loan_type} sanctionedLoan={selectedLoan} />

            </div>

            
            <Footer />
        </>
    );
}