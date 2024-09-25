import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import axios from "axios";

import "./billCopy.css";


import NavBar from "../../../../page_compo/navBar/navBar";
import Footer from "../../../../page_compo/footer/footer";
import BillCopyForm from "../pdfCopy/billCopyForm";
import BankCopyForm from "../pdfCopy/bankCopyForm";


export default function BillCopy(){

    const { state } = useLocation();

    const loan_type = state["type"];

    var billStatus = false;


    const [bc_sanc_loan_data, setbc_sanc_loan_data] = useState([]);
    const bc_sanc_loan_display = useState([]);
    const sal_sanc_loan_display = useState([]);

    const [selectedCategory, setSelectedCategory] = useState("null");

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
        const fetch_bill_loan_data = async () =>{
            try{
                const bill_res = await axios.get("http://localhost:8800/sanction_loan");
                setbc_sanc_loan_data(bill_res.data);

            }catch(err){
                console.log(err);
            }


        }
        fetch_bill_loan_data();
    }, []);

    const bc_table_col = (value, cn) => {
        cn = "bc_table_col " + cn;
        return(
            <div className={cn}>
                <div className="bc_table_cell">{value}</div> 
            </div>
        );
    }

    const sal_table_col = (value) =>{
        return(
            <div className="sal_table_col">
                <div className="sal_table_cell">{value}</div> 
            </div>
        );
    }



    var count = 0;

    var total_sanction = 0;

    if(selectedCategory == "ALL"){
        count = 0;
        total_sanction = 0;

        for(let i=0;i<bc_sanc_loan_data.length;i++){
            if((bc_sanc_loan_data[i]["LOAN_TYPE"] == loan_type) && (bc_sanc_loan_data[i]["SANC_STATUS"] == "BILL")){
                billStatus = true;
                bc_sanc_loan_display.push(
                    <div className="bc_table_row">
                        {bc_table_col(++count, "small_col")}
                        {bc_table_col(bc_sanc_loan_data[i]["LOAN_ID"], "large_col")}
                        {bc_table_col(bc_sanc_loan_data[i]["APPLICANT_NAME"], "large_col")}
                        {bc_table_col(bc_sanc_loan_data[i]["DESIGNATION"], "large_col")}
                        {bc_table_col(bc_sanc_loan_data[i]["OFFICE_DEPT"], "small_col")}
                        {bc_table_col(bc_sanc_loan_data[i]["CATEGORY"], "small_col")}
                        {bc_table_col(bc_sanc_loan_data[i]["BIRTH_DATE"], "small_col")}
                        {bc_table_col(bc_sanc_loan_data[i]["JOINING_DATE"], "small_col")}
                        {bc_table_col(nf.format(bc_sanc_loan_data[i]["NET_PAY"]), "small_col")}
                        {bc_table_col(nf.format(bc_sanc_loan_data[i]["APPLY_AMOUNT"]), "small_col")}
                        {bc_table_col(nf.format(bc_sanc_loan_data[i]["ALLOW_AMOUNT"]), "small_col")}
                        {bc_table_col(nf.format(bc_sanc_loan_data[i]["SANCTION_AMOUNT"]), "large_col")}
                        {bc_table_col(nf.format(bc_sanc_loan_data[i]["RECOVERY_AMOUNT"]), "large_col")}
                        {bc_table_col(bc_sanc_loan_data[i]["INSTALL_NO"], "small_col")}
                        {bc_table_col(nf.format(bc_sanc_loan_data[i]["INSTALL_AMOUNT"]), "small_col")}
                        {bc_table_col(" ", "small_col")}
                        {bc_table_col(nf.format(bc_sanc_loan_data[i]["SANCTION_AMOUNT"]), "small_col")}
                        {bc_table_col(10, "small_col")}
                        {bc_table_col(nf.format(bc_sanc_loan_data[i]["SANCTION_AMOUNT"] - 10), "small_col")}
    
                    </div>
                );
                sal_sanc_loan_display.push(
                    <div className="bc_table_row">
                        {sal_table_col(count)}
                        {sal_table_col(bc_sanc_loan_data[i]["BUET_ID"])}
                        {sal_table_col(bc_sanc_loan_data[i]["APPLICANT_NAME"])}
                        {sal_table_col(bc_sanc_loan_data[i]["DESIGNATION"])}
                        {sal_table_col(bc_sanc_loan_data[i]["OFFICE_DEPT"])}
                        {sal_table_col(bc_sanc_loan_data[i]["CATEGORY"])}
                        {sal_table_col(bc_sanc_loan_data[i]["ACCOUNT_NO"])}
                        {sal_table_col(nf.format(bc_sanc_loan_data[i]["SANCTION_AMOUNT"] - 10))}
    
                    </div>
                );
                total_sanction += Number(bc_sanc_loan_data[i]["SANCTION_AMOUNT"]);
            }
        }

        bc_sanc_loan_display.push(
            <div className="bc_table_row">
                {bc_table_col(" ", "small_col")}
                {bc_table_col(" ", "large_col")}
                {bc_table_col(" ", "large_col")}
                {bc_table_col(" ", "small_col")}
                {bc_table_col(" ", "small_col")}
                {bc_table_col(" ", "small_col")}
                {bc_table_col(" ", "large_col")}
                {bc_table_col(" ", "large_col")}
                {bc_table_col(" ", "large_col")}
                {bc_table_col(" ", "large_col")}
                {bc_table_col(" ", "large_col")}
                {bc_table_col(" ", "small_col")}
                {bc_table_col(" ", "large_col")}
                {bc_table_col(" ", "large_col")}
                {bc_table_col(" ", "large_col")}
                {bc_table_col(" ", "large_col")}
                {bc_table_col("TOTAL", "small_col bc_bold")}
                {bc_table_col(nf.format(total_sanction), "large_col sc_bold")}
                {bc_table_col(" ", "small_col")}
                {bc_table_col(nf.format(total_sanction - (count * 10)), "large_col sc_bold")}
            </div>
        );

        sal_sanc_loan_display.push(
            <div className="bc_table_row bc_bold">
                {sal_table_col("")}
                {sal_table_col("")}
                {sal_table_col("")}
                {sal_table_col("")}
                {sal_table_col("")}
                {sal_table_col("")}
                {sal_table_col("TOTAL")}
                {sal_table_col(nf.format(total_sanction - (count * 10)))}
                
            </div>
        );


    }else if(["A", "B", "C", "D"].includes(selectedCategory)){
        count = 0;
        total_sanction = 0;

        for(let i=0;i<bc_sanc_loan_data.length;i++){
            if((bc_sanc_loan_data[i]["LOAN_TYPE"] == loan_type) && (bc_sanc_loan_data[i]["SANC_STATUS"] == "BILL") && (bc_sanc_loan_data[i]["CATEGORY"] == selectedCategory)){
                billStatus = true;
                bc_sanc_loan_display.push(
                    <div className="bc_table_row">
                        {bc_table_col(++count, "small_col")}
                        {bc_table_col(bc_sanc_loan_data[i]["LOAN_ID"], "large_col")}
                        {bc_table_col(bc_sanc_loan_data[i]["APPLICANT_NAME"], "large_col")}
                        {bc_table_col(bc_sanc_loan_data[i]["DESIGNATION"], "large_col")}
                        {bc_table_col(bc_sanc_loan_data[i]["OFFICE_DEPT"], "small_col")}
                        {bc_table_col(bc_sanc_loan_data[i]["BIRTH_DATE"], "small_col")}
                        {bc_table_col(bc_sanc_loan_data[i]["JOINING_DATE"], "small_col")}
                        {bc_table_col(nf.format(bc_sanc_loan_data[i]["NET_PAY"]), "small_col")}
                        {bc_table_col(nf.format(bc_sanc_loan_data[i]["APPLY_AMOUNT"]), "small_col")}
                        {bc_table_col(nf.format(bc_sanc_loan_data[i]["ALLOW_AMOUNT"]), "small_col")}
                        {bc_table_col(nf.format(bc_sanc_loan_data[i]["SANCTION_AMOUNT"]), "large_col")}
                        {bc_table_col(nf.format(bc_sanc_loan_data[i]["RECOVERY_AMOUNT"]), "large_col")}
                        {bc_table_col(bc_sanc_loan_data[i]["INSTALL_NO"], "small_col")}
                        {bc_table_col(nf.format(bc_sanc_loan_data[i]["INSTALL_AMOUNT"]), "small_col")}
                        {bc_table_col(" ", "small_col")}
                        {bc_table_col(nf.format(bc_sanc_loan_data[i]["SANCTION_AMOUNT"]), "small_col")}
                        {bc_table_col(10, "small_col")}
                        {bc_table_col(nf.format(bc_sanc_loan_data[i]["SANCTION_AMOUNT"] - 10), "small_col")}
    
                    </div>
                );

                sal_sanc_loan_display.push(
                    <div className="bc_table_row">
                        {sal_table_col(count)}
                        {sal_table_col(bc_sanc_loan_data[i]["BUET_ID"])}
                        {sal_table_col(bc_sanc_loan_data[i]["APPLICANT_NAME"])}
                        {sal_table_col(bc_sanc_loan_data[i]["DESIGNATION"])}
                        {sal_table_col(bc_sanc_loan_data[i]["OFFICE_DEPT"])}
                        {sal_table_col(bc_sanc_loan_data[i]["ACCOUNT_NO"])}
                        {sal_table_col(nf.format(bc_sanc_loan_data[i]["SANCTION_AMOUNT"] - 10))}
    
                    </div>
                );

                total_sanction += Number(bc_sanc_loan_data[i]["SANCTION_AMOUNT"]);
            }
        }

        bc_sanc_loan_display.push(
            <div className="bc_table_row">
                {bc_table_col(" ", "small_col")}
                {bc_table_col(" ", "large_col")}
                {bc_table_col(" ", "large_col")}
                {bc_table_col(" ", "small_col")}
                {bc_table_col(" ", "small_col")}
                {bc_table_col(" ", "small_col")}
                {bc_table_col(" ", "large_col")}
                {bc_table_col(" ", "large_col")}
                {bc_table_col(" ", "large_col")}
                {bc_table_col(" ", "large_col")}
                {bc_table_col(" ", "large_col")}
                {bc_table_col(" ", "large_col")}
                {bc_table_col(" ", "large_col")}
                {bc_table_col(" ", "large_col")}
                {bc_table_col(" ", "large_col")}
                {bc_table_col("TOTAL", "small_col bc_bold")}
                {bc_table_col(nf.format(total_sanction), "large_col sc_bold")}
                {bc_table_col(" ", "small_col")}
                {bc_table_col(nf.format(total_sanction - (count * 10)), "large_col sc_bold")}
            </div>
        );

        sal_sanc_loan_display.push(
            <div className="bc_table_row">
                {sal_table_col("")}
                {sal_table_col("")}
                {sal_table_col("")}
                {sal_table_col("")}
                {sal_table_col("")}
                {sal_table_col("TOTAL")}
                {sal_table_col(nf.format(total_sanction - (count * 10)))}
                
            </div>
        );


    }

    


    return(
        <>
            <NavBar hide={{nav_mid: true}} />

            <div className="bill_copy">

                <select className="bc_select" onChange={(e) => {setSelectedCategory(e.target.value)}} >
                    <option value="null">Select a Category......</option>
                    <option value="ALL">ALL</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                </select>

                <div className="bc_page_title">Bill Copy</div>

                {
                    selectedCategory == "null" ?

                    <div className="no_billing_loan">
                        Select a Category to display
                    </div>

                    :

                    billStatus ?
                    <>
                        <div className="bc_table">
                            <div className="bc_table_row bc_bold">
                                {bc_table_col("SL NO", "small_col")}
                                {bc_table_col("LOAN ID", "large_col")}
                                {bc_table_col("NAME", "large_col")}
                                {bc_table_col("DESIGNATION", "large_col")}
                                {bc_table_col("OFFICE/ DEPT.", "small_col")}
                                {
                                    selectedCategory == "ALL" ?
                                    bc_table_col("CATEGORY", "small_col")
                                    :
                                    ""
                                }
                                {bc_table_col("BIRTH DATE", "small_col")}
                                {bc_table_col("JOINING DATE", "small_col")}
                                {bc_table_col("NET PAY", "small_col")}
                                {bc_table_col("APPLY AMOUNT", "small_col")}
                                {bc_table_col("ALLOW AMOUNT", "small_col")}
                                {bc_table_col("SANCTION AMOUNT", "large_col")}
                                {bc_table_col("RECOVERY AMOUNT", "large_col")}
                                {bc_table_col("INST NO", "small_col")}
                                {bc_table_col("INSTALL AMOUNT", "small_col")}
                                {bc_table_col(" ", "small_col")}
                                {bc_table_col("BILL AMOUNT", "small_col")}
                                {bc_table_col("REVENUE STAMP", "small_col")}
                                {bc_table_col("NET PAY", "small_col")}
                            </div>
                            {bc_sanc_loan_display}
                        </div>

                        <div className="bc_in_words">
                            In Words :    
                            <div className="bc_text">
                                {inWords(total_sanction - (count * 10))}
                            </div>
                            TK. Only
                        </div>

                        <BillCopyForm category={selectedCategory} loan_type={loan_type}/>

                    </>
                    :
                    <div className="no_billing_loan">
                        No bill copy is available for {selectedCategory} category
                    </div>

                }


                <div className="bc_page_title">Bank Copy</div>

                {
                    selectedCategory == "null" ?

                    <div className="no_billing_loan">
                        Select a Category to display
                    </div>

                    :

                    billStatus ?
                    <>
                        <div className="bc_table">
                            <div className="bc_table_row bc_bold">
                                {sal_table_col("SERIAL NO")}
                                {sal_table_col("BUET ID")}
                                {sal_table_col("EMPLOYEE NAME")}
                                {sal_table_col("DESIGNATION")}
                                {sal_table_col("OFFICE/ DEPT.")}
                                {
                                    selectedCategory == "ALL" ? 
                                    sal_table_col("CATEGORY")
                                    :
                                    ""
                                }
                                {sal_table_col("ACCOUNT NO")}
                                {sal_table_col("NET PAY")}
                            </div>
                            {sal_sanc_loan_display}
                        </div>

                        <div className="bc_in_words">
                            In Words :    
                            <div className="bc_text">
                                {inWords(total_sanction - (count * 10))}
                            </div>
                            TK. Only
                        </div>

                        <BankCopyForm category={selectedCategory} loan_type={loan_type}/>

                        

                    </>
                    :
                    <div className="no_billing_loan">
                        No bank copy is available for {selectedCategory} category
                    </div>

                }

                
                

            </div>

            



            <Footer />
        </>
    );

}