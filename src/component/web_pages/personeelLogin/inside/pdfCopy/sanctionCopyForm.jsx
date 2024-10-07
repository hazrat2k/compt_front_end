import React, { useEffect, useState } from "react";
import axios from "axios";
import { BlobProvider, Document, Page, View, Text, Image, StyleSheet, Font, PDFViewer } from '@react-pdf/renderer';
import logo_image from "../../../../../assets/images/buetLogo.png";
import PT_Serif_Bold from "../../../../../assets/fonts/pt-serif-latin-700-normal.ttf";


Font.register({family: 'English Bold', fontWeight: 'normal', src: PT_Serif_Bold});
Font.register({family: 'English', fontWeight: 'normal', src: "http://fonts.gstatic.com/s/ptserif/v8/EgBlzoNBIHxNPCMwXaAhYPesZW2xOQ-xsNqO47m55DA.ttf"});


const styles = StyleSheet.create({
    viewer:{
        width: window.innerWidth,
        height: window.innerHeight,
    },

    pageLabel:{
        textAlign: "center",
        fontFamily: "English",
        fontSize: "12pt",
        fontWeight: "bold",
        marginBottom: "5pt",
        color: "black",
        marginTop: "3pt"
    },

});


const style_logo = StyleSheet.create({
    logo:{
        marginTop: "5pt",
        display: "flex",
        flexDirection: "row",
        padding: "10pt",
        alignSelf:"center",
        alignItems:"start"
    },

    logo_img:{
        float: "center",
    },

    l_img:{
        height: "35pt",
        width: "35pt"
    },


    logo_text:{
        color: "crimson",
        marginLeft: "1%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },


    logo_text_1:{
        fontSize: "10pt",
        fontWeight: "bold",
        fontFamily: "English Bold",
    },

    logo_text_2:{
        fontSize: "10pt",
        fontFamily: "English",
        textAlign: "center"
    },
});

const style_sc = StyleSheet.create({
    sc_table:{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        fontFamily: "English",
    },

    sc_table_row:{
        display: "flex",
        flexDirection: "row",
        padding: "2.5pt 5pt",
        gap: "2.5pt",
        borderTop: "1px solid black",
    },

    sc_bold:{
        fontFamily: "English Bold",
    },

    sc_table_col:{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "1pt",

    },

    large_col:{
        width: "6%",
    },
    
    small_col:{
        width: "5%",
    },

    sl_col:{
        width: "3%",
    },

    loan_id_col:{
        width: "8%",
    },

    sc_table_cell:{
        fontSize: "8pt",
        textAlign: "center"
    },

    sc_in_words:{
        display: "flex",
        flexDirection: "row",
        padding: "10pt 20pt"
    },
    
    sc_text:{
        fontFamily: "English Bold",
        textTransform: "uppercase",
        fontSize: "8pt"
    }


});

const style_sig = StyleSheet.create({

    all_sig:{
        display: "flex",
        flexDirection: "column",
        fontFamily: "English",
    },

    sig_label:{
        fontSize: "10pt",
        fontFamily: "English Bold",
        textAlign: "center",
        textDecoration: "underline"
    },

    sig_area:{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        padding: "5pt 10pt",
        marginTop: "20pt",
    },

    sig_box:{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "2.5pt 5pt",
        fontFamily: "English",
    },

    sig_lc_field:{
        fontSize: "6pt",
        textAlign: "center"
    },

    sig_field:{
        fontSize: "8pt",
        textAlign: "center"
    },

});



export default function SanctionCopyForm(props){

    const [sc_sanc_loan_data, setSc_sanc_loan_data] = useState([]);
    const sc_sanc_loan_display = useState([]);

    const sc_loan_type = props.loan_type;

    const scf_selected_loan = props.sanctionedLoan;

    const [scUrl, setScUrl] = useState("");

    const [laf_hover, setLaf_hover] = useState(false);

    const style_butt = StyleSheet.create({
        download_butt:{
            width: laf_hover ? "150pt" : "120pt",
            height: "auto",
            fontFamily: "PT Serif",
            fontWeight: "bold",
            padding: "5pt 15pt 5pt 15pt",
            alignSelf: "center",
            textAlign: "center",
            border: laf_hover ? "2px solid white" : "2px solid #3f8ba8",
            borderRadius: "20pt",
            backgroundColor: laf_hover ? "#3f8ba8" : "white",
            color: laf_hover ? "white" : "#3f8ba8",
            fontSize: laf_hover ? "20pt" : "15pt",
            cursor: laf_hover ? "pointer" : "default",
            transition: "all ease 0.3s"
        },

        alert_message:{
            textAlign: "center",
            color: "gray",
            fontSize: "20pt",
        },
    });

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


    const sc_table_col = (value, cn) => {
        
        return(
            <View style={[style_sc.sc_table_col, cn == "small_col" ? style_sc.small_col : style_sc.large_col]}> 
                <Text style={style_sc.sc_table_cell}>{value}</Text>
            </View>
        );
    }

    const sc_lc_sig = (name, designation) => {
        return(
            <View style={style_sig.sig_box}>
                <Text style={style_sig.sig_lc_field}>
                    ------------------------------
                </Text>
                <Text style={style_sig.sig_lc_field}>
                    {name}
                </Text>
                <Text style={style_sig.sig_lc_field}>
                    {designation}
                </Text>
                <Text style={style_sig.sig_lc_field}>
                    Consumer Loan Approval Committe
                </Text>
            </View>
        );
    }

    const sc_sig = (designation) =>{
        return(
            <View style={style_sig.sig_box}>
                <Text style={style_sig.sig_field}>
                    --------------------------------------
                </Text>
                
                <Text style={style_sig.sig_field}>
                    {designation}
                </Text>
            </View>
        );
    }

    let nf = new Intl.NumberFormat('en-US');

    var count = 0;
    var sanction_total = 0;

    for(let i=0;i<sc_sanc_loan_data.length;i++){
        if((sc_sanc_loan_data[i]["SANC_STATUS"] == "IN PROCESS") && scf_selected_loan[sc_sanc_loan_data[i]["LOAN_ID"]]){
            sc_sanc_loan_display.push(
                <View style={style_sc.sc_table_row}>
                    <View style={[style_sc.sc_table_col, style_sc.sl_col]}> 
                        <Text style={style_sc.sc_table_cell}>{++count}</Text>
                    </View>
                    <View style={[style_sc.sc_table_col, style_sc.loan_id_col]}> 
                        <Text style={style_sc.sc_table_cell}>{sc_sanc_loan_data[i]["LOAN_ID"]}</Text>
                    </View>
                    {sc_table_col(sc_sanc_loan_data[i]["EMPLOYEE_NAME"], "large_col")}
                    {sc_table_col(sc_sanc_loan_data[i]["DESIGNATION"], "large_col")}
                    {sc_table_col(sc_sanc_loan_data[i]["OFFICE"], "small_col")}
                    {sc_table_col(sc_sanc_loan_data[i]["CATEGORY"], "small_col")}
                    {sc_table_col(sc_sanc_loan_data[i]["DATE_OF_BIRTH"], "small_col")}
                    {sc_table_col(sc_sanc_loan_data[i]["DATE_FIRST_JOIN"], "small_col")}
                    {sc_table_col(nf.format(sc_sanc_loan_data[i]["NET_PAY"]), "small_col")}
                    {sc_table_col(nf.format(sc_sanc_loan_data[i]["APPLY_AMOUNT"]),"small_col")}
                    {sc_table_col(nf.format(sc_sanc_loan_data[i]["ALLOW_AMOUNT"]),"small_col")}
                    <View style={[style_sc.sc_table_col, style_sc.large_col, style_sc.sc_bold]}> 
                        <Text style={style_sc.sc_table_cell}>{nf.format(sc_sanc_loan_data[i]["SANCTION_AMOUNT"])}</Text>
                    </View>
                    {sc_table_col(nf.format(sc_sanc_loan_data[i]["RECOVERY_AMOUNT"]), "large_col")}
                    {sc_table_col(nf.format(sc_sanc_loan_data[i]["INSTALL_AMOUNT"]), "small_col")}
                    {sc_table_col(nf.format(sc_sanc_loan_data[i]["TOTAL_INTEREST"]), "small_col")}
                    {sc_table_col(sc_sanc_loan_data[i]["INSTALL_NO"], "small_col")}
                    {sc_table_col(sc_sanc_loan_data[i]["BANK_ACCOUNT_NO"], "small_col")}
                    {sc_table_col(" ", "small_col")}
                    {sc_table_col(" ", "small_col")}
                </View>
            );

            sanction_total += Number(sc_sanc_loan_data[i]["SANCTION_AMOUNT"]);


        }
    }


    sc_sanc_loan_display.push(
        <View style={style_sc.sc_table_row}>
            {sc_table_col(" ", "large_col")}
            {sc_table_col(" ", "large_col")}
            {sc_table_col(" ", "large_col")}
            {sc_table_col(" ", "large_col")}
            {sc_table_col(" ", "large_col")}
            {sc_table_col(" ", "small_col")}
            {sc_table_col(" ", "small_col")}
            {sc_table_col(" ", "small_col")}
            {sc_table_col(" ", "small_col")}
            {sc_table_col("TOTAL","small_col")}
            <View style={[style_sc.sc_table_col, style_sc.large_col, style_sc.sc_bold]}> 
                <Text style={style_sc.sc_table_cell}>{nf.format(sanction_total)}</Text>
            </View>
            
        </View>
    );


    const MySanctionForm = (

        <Document>

            <Page size="A4" orientation="landscape" style={{paddingLeft: "5pt", paddingRight: "5pt"}}>
                <View style={{marginTop:"10pt"}}></View>

                <View style={style_logo.logo}>
                    <View style={style_logo.logo_img}>
                        <Image style={style_logo.l_img} src={logo_image}/>
                    </View>

                    <View style={style_logo.logo_text}>
                        <Text style={style_logo.logo_text_1}>
                            Bangladesh University of Engineering and Technology (BUET)
                        </Text>
                        <Text style={style_logo.logo_text_2}>
                            COMPTROLLER OFFICE
                        </Text>
                        <Text style={styles.pageLabel}>
                            LOAN FOR SANCTION
                        </Text>
                    </View>

                </View>

                <View style={style_sc.sc_table}>
                    <View style={[style_sc.sc_table_row, style_sc.sc_bold]}>

                        <View style={[style_sc.sc_table_col, style_sc.sl_col]}> 
                            <Text style={style_sc.sc_table_cell}>SL NO</Text>
                        </View>
                        <View style={[style_sc.sc_table_col, style_sc.loan_id_col]}> 
                            <Text style={style_sc.sc_table_cell}>LOAN ID</Text>
                        </View>
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
                    </View>

                    {sc_sanc_loan_display}
                     
                </View>

                <View style={style_sc.sc_in_words}>
                    <Text style={style_sc.sc_text}>
                        In Words : {inWords(sanction_total)} TK. Only
                    </Text>
                </View>


                <View style={style_sig.all_sig}>
                    <Text style={style_sig.sig_label}>
                        Loan Committe
                    </Text>
                    <View style={style_sig.sig_area}>
                        {sc_lc_sig("Prof. Dr. Muhammad Masroor Ali", "President")}
                        {sc_lc_sig("Dr. Tanvir Ahmed", "Member")}
                        {sc_lc_sig("Dr. Kazi Arafat Rahman", "Member")}
                        {sc_lc_sig("Md. Sozibur Rahman", "Member")}
                        {sc_lc_sig("Md. Nazrul Islam", "Member")}
                        {sc_lc_sig("Md. Tarike Ashraf", "Member")}
                        {sc_lc_sig("Mohammad Moniruzzaman", "Member-Secretary")}
                    </View>
                </View>

                <View style={{marginTop:"5pt",marginBottom: "5pt", borderTop: "1px solid black", width: "80%", alignSelf: "center"}}></View>

                <View style={style_sig.all_sig}>
                    <Text style={style_sig.sig_label}>
                        Fund Section
                    </Text>
                    <View style={style_sig.sig_area}>
                        {sc_sig("ASS. ACCT./ACCT")}
                        {sc_sig("SR A.D.")}
                        {sc_sig("D.C.")}
                        {sc_sig("COMPTROLLER")}
                    </View>
                </View>

                <View style={{marginTop:"5pt",marginBottom: "5pt", borderTop: "1px solid black", width: "80%", alignSelf: "center"}}></View>

                <View style={style_sig.all_sig}>
                    <Text style={style_sig.sig_label}>
                        AUDIT
                    </Text>
                    <View style={style_sig.sig_area}>
                        {sc_sig("ASS. ACCT./ACCT")}
                        {sc_sig("A.O.")}
                        {sc_sig("A.D./D.D.")}
                        {sc_sig("D.C.")}
                    </View>
                </View>

                <View style={{marginTop:"20pt"}}></View>

                {sc_sig("HONORABLE PRO-VC")}

            </Page>

        </Document>

    );


    const downloadURI = (uri, name) => {
        const link = document.createElement("a");
        link.href = uri;
        link.download = name;
        link.click();
    }

    const onSCDownload = (e) => {
        e.preventDefault();

        if (!scUrl) {
            return;
        }
        downloadURI(scUrl, 'sanction_copy.pdf');
    }

    return(

        // <PDFViewer style={styles.viewer}>
        //     <MySanctionForm />
        // </PDFViewer>
        <>

            <BlobProvider document={MySanctionForm}>
                {({ blob, url, loading, error }) => {
                    setScUrl(url);
                }}
            </BlobProvider>

            {
                 (count == 0) ?
                  <div style={style_butt.alert_message}>
                       Select at least one loan to download
                  </div>
                  :
                  <div style={style_butt.download_butt} onClick={onSCDownload} onMouseEnter={() => setLaf_hover(true)} onMouseLeave={() => setLaf_hover(false)}>
                        Download
                  </div>
            }
            

        </>


            

    );
}

