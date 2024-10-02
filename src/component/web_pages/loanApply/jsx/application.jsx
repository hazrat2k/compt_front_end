import { React,  useState } from 'react';
import { useNavigate } from 'react-router';
import { BlobProvider, Document, Page, View, Text, Image, StyleSheet, Font, PDFViewer } from '@react-pdf/renderer';

import axios from "axios";
import moment from 'moment';

import "./../css/application.css";

import logo_image from "../assets/logo.png";
import checkBox_image from "../assets/checkbox_image.png";

import PT_Serif_Bold from "../assets/fonts/pt-serif-latin-700-normal.ttf";
import Noto_Serif_Bengali from "../assets/fonts/Noto_Serif_Bengali.ttf";
import Noto_Serif_Bengali_Bold from "../assets/fonts/Noto_Serif_Bengali_Bold.ttf";
import AdorshoLipi from "../assets/fonts/AdorshoLipi.ttf";
import AdorshoLipi_Bold from "../assets/fonts/AdorshoLipi_Bold.ttf";
import SuttonyMJ from "../assets/fonts/SuttonyMJ.ttf";
import SuttonyMJ_Bold from "../assets/fonts/SuttonyMJ_Bold.ttf";


Font.register({family: 'English', fontWeight: 'normal', src: "http://fonts.gstatic.com/s/ptserif/v8/EgBlzoNBIHxNPCMwXaAhYPesZW2xOQ-xsNqO47m55DA.ttf"});
Font.register({family: 'English Bold', fontWeight: 'normal', src: PT_Serif_Bold});
Font.register({family: 'Bengali', fontWeight: 'normal', src: Noto_Serif_Bengali});
Font.register({family: 'Bengali Bold', fontWeight: 'bold', src: Noto_Serif_Bengali_Bold});


const styles = StyleSheet.create({
    viewer:{
        width: window.innerWidth,
        height: window.innerHeight,
    },

    pageLabel:{
        textAlign: "center",
        fontFamily: "English Bold",
        fontSize: "16pt",
        marginBottom: "2pt",
        marginTop: "2pt",
        color: "black"
    },

});

const style_logo = StyleSheet.create({
    logo:{
        marginTop: "5pt",
        display: "flex",
        flexDirection: "row",
        padding: "5pt",
        alignSelf:"center",
    },

    logo_img:{
        marginRight: "1%",
    },

    l_img:{
        height: "30pt",
        width: "30pt"
    },


    logo_text:{
        color: "crimson",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },


    logo_text_1:{
        fontSize: "13pt",
        fontFamily: "English Bold",
    },

    logo_text_2:{
        fontSize: "11pt",
        fontFamily: "English"
    },
});


const style_field = StyleSheet.create({
    allField:{
        display: "flex",
        flexDirection: "column",
        flexBasis: "90%",
        paddingLeft: "30pt",
        paddingRight: "30pt",
        // justifyContent:"center"
    },

    preBasicFieldwithPic:{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",

    },

    preBasicField:{
        display: "flex",
        flexDirection: "column",
        flexBasis: "70%",
    },

    preOtherField:{
        padding: "0pt 5pt 0pt 5pt",
        display: "flex",
        flexDirection: "column",
    },

    preSigField:{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-evenly"
    },

    preSigFieldBox:{
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },

    preOtherFieldR:{
        padding: "5pt 5pt 0pt 5pt",
        display: "flex",
        flexDirection: "row",
        alignItems: "center"
    },

    preOtherFieldLabel:{
        fontFamily: "English Bold",
        fontSize: "12pt",
        fontWeight: "bold",
        textAlign: "justify",
    },

    preOtherFieldText:{
        fontFamily: "English",
        fontSize: "10pt",
        textAlign: "justify",
    },

    preBold:{
        fontFamily: "English Bold",
    },

    preOtherFieldImg:{
        height: "20pt",
        width: "20pt",
        padding: "2pt",
    },



});


const style_pic = StyleSheet.create({
    preProPic:{
        padding: "5pt",
    },

    preProPicImg:{
        height: "100pt",
        width: "100pt",
        textAlign: "center",
        padding: "5pt",
        position: "relative",
        cursor: "pointer",
    },

    preSignPic:{
        padding: "2.5pt",
        alignSelf: "flex-end",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },

    preSignPicImg:{
        height: "30pt",
        width: "100pt",
        padding: "5pt",
        borderBottom: "1px solid black",
    },

    preSignPicText:{
        fontFamily: "English",
        fontSize: "8pt"
    },



});


const style_data = StyleSheet.create({
    preData:{
        display: "flex",
        flexDirection: "row",
        padding: "2pt 5pt 2pt 5pt",
        alignItems: "center",
    },

    preDataLabel:{
        fontFamily: "English Bold",
        fontSize: "11pt",
        textAlign: "justify",
        width: "50%",
    },

    preDataColon:{
        fontFamily: "English Bold",
        fontSize: "11pt",
        paddingLeft: "15pt",
        paddingRight: "15pt",
    },

    preDataValue:{
        fontFamily: "English",
        fontSize: "10pt",
        width: "50%",
    }

});


const style_table = StyleSheet.create({
    table:{
        display: "flex",
        flexDirection: "column",
        marginTop: "2pt",
        marginBottom: "2pt",
    },

    row:{
        display: "flex",
        flexDirection: "row",
        textAlign: "center",
    },


    double_column:{
        display: "flex",
        flexDirection: "row",
        flexBasis: "50%",
    },

    border_column:{
        border: "1px solid black"
    },

    index_column:{
        width: "5%",
        fontFamily: "English Bold",
        fontSize: "10pt",
        padding: "1pt 5pt 1pt 5pt",
        border: "0px",
        margin: "2pt",
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
    },

    loan_index_column:{
        width: "10%",
        fontFamily: "English Bold",
        fontSize: "10pt",
        fontWeight: "bold",
        padding: "1pt 5pt 1pt 5pt",
        border: "0px",
        margin: "2pt",
        justifyContent:"center",
    },

    label_column:{
        width: "25%",
        fontFamily: "English Bold",
        fontSize: "10pt",
        fontWeight: "bold",
        textAlign: "center",
        padding: "1pt 5pt 1pt 5pt",
        border: "0px",
        margin: "2pt",
        justifyContent:"center",
    },

    last_column:{
        width: "45%",
        fontFamily: "English Bold",
        fontSize: "10pt",
        fontWeight: "bold",
        textAlign: "center",
        padding: "1pt 5pt 1pt 5pt",
        border: "0px",
        margin: "2pt",
        justifyContent:"center",
    },

    personal_label_column:{
        width: "40%",
        fontFamily: "English Bold",
        fontSize: "10pt",
        fontWeight: "bold",
        textAlign: "left",
        padding: "1pt 5pt 1pt 5pt",
        border: "0px",
        margin: "2pt",
        justifyContent:"center",

    },

    salary_label_column:{
        width: "25%",
        fontFamily: "English Bold",
        fontSize: "10pt",
        fontWeight: "bold",
        textAlign: "left",
        padding: "1pt 5pt 1pt 5pt",
        border: "0px",
        margin: "2pt",
        justifyContent:"center",

    },

    value_column:{
        width: "70%",
        fontFamily: "English",
        fontSize: "9pt",
        textAlign: "left",
        paddingLeft: "10pt",
        padding: "1pt 5pt 1pt 5pt",
        border: "0px",
        margin: "2pt",
        justifyContent:"center",
    },

    sal_value_column:{
        width: "23%",
        fontFamily: "English",
        fontSize: "9pt",
        textAlign: "center",
        paddingLeft: "10pt",
        padding: "1pt 5pt 1pt 5pt",
        border: "0px",
        margin: "2pt",
        justifyContent:"center",

    },

    loan_value_column:{
        width: "13%",
        fontFamily: "English",
        fontSize: "9pt",
        paddingLeft: "10pt",
        padding: "1pt 5pt 1pt 5pt",
        border: "0px",
        margin: "2pt",
        justifyContent: "center",
    },


});


const PreviewData = (props) => {
    return(
        <View style={style_data.preData}>
            <Text style={style_data.preDataLabel}>
                {props.label}
            </Text>
            <Text style={style_data.preDataColon}>
                :
            </Text>
            <Text style={style_data.preDataValue}>
                {props.name}
            </Text>

        </View>
    );
    
}


export default function Application(props){

    const applicationNavigate = useNavigate();

    const [url, setURL] = useState("");

    const app_data = props.applicationData;

    let nf = new Intl.NumberFormat('en-US');

    const pdfPersoInfo = [["a", "b", "c", "d", "e", "f", "g", "h", "i"],
                            ["Father's / Husband's Name", "Mother's Name", "Nominee's Name", "Relationship with Nominee",
                            "Present Address", "Permanant Address", "Date of Birth", "Applicant's NID", "Nominee's NID"],
                            [app_data["FATHERS_NAME"], app_data["MOTHERS_NAME"], app_data["NOMINEES_NAME"], app_data["NOMINEES_RELSHIP"], app_data["ADDRESS"], app_data["ADDRESS"], 
                            moment(new Date(app_data["DATE_OF_BIRTH"])).format("DD MMM YYYY"), app_data["NID_NO"], app_data["NOMINEES_NID"]]
                            ];

    const pdf_pers_table = [];


    for(let i=0;i<3;i+=2){
        pdf_pers_table.push(
            <View style={style_table.row}>
                <View style={style_table.double_column}>
                    <View style={style_table.loan_index_column}> <Text>{pdfPersoInfo[0][i]}</Text></View>
                    <View style={style_table.personal_label_column}><Text>{pdfPersoInfo[1][i]}</Text></View>
                    <View style={style_table.value_column}><Text>{pdfPersoInfo[2][i]}</Text></View>
                </View>
                <View style={style_table.double_column}>
                    <View style={style_table.loan_index_column}> <Text>{pdfPersoInfo[0][i+1]}</Text></View>
                    <View style={style_table.personal_label_column}><Text>{pdfPersoInfo[1][i+1]}</Text></View>
                    <View style={style_table.value_column}><Text>{pdfPersoInfo[2][i+1]}</Text></View>
                </View>
            </View>

        );
    }


    for(let i=4;i<7;i++){
        pdf_pers_table.push(
            <View style={style_table.row}>
                <View style={style_table.index_column}> <Text>{pdfPersoInfo[0][i]}</Text></View>
                <View style={style_table.salary_label_column}><Text>{pdfPersoInfo[1][i]}</Text></View>
                <View style={style_table.value_column}><Text>{pdfPersoInfo[2][i]}</Text></View>
            </View>

        );
    }

    for(let i=7;i<8;i++){
        pdf_pers_table.push(
            <View style={style_table.row}>
                <View style={style_table.double_column}>
                    <View style={style_table.loan_index_column}> <Text>{pdfPersoInfo[0][i]}</Text></View>
                    <View style={style_table.personal_label_column}><Text>{pdfPersoInfo[1][i]}</Text></View>
                    <View style={style_table.value_column}><Text>{pdfPersoInfo[2][i]}</Text></View>
                </View>
                <View style={style_table.double_column}>
                    <View style={style_table.loan_index_column}> <Text>{pdfPersoInfo[0][i+1]}</Text></View>
                    <View style={style_table.personal_label_column}><Text>{pdfPersoInfo[1][i+1]}</Text></View>
                    <View style={style_table.value_column}><Text>{pdfPersoInfo[2][i+1]}</Text></View>
                </View>
            </View>

        );
    }


    const pdfServInfo = [["a", "b", "c", "d", "e"],
                            ["BUET ID No.", "Service of University", "Joining Date to University", "Total Service Period in this University", "Service Completion Date (Teacher's Age 65 Years, Officer's / Staff's Age 60 years)"],
                            [app_data["EMPLOYEE_ID"], app_data["APPOINTMENT_TYPE"], 
                            moment(new Date(app_data["DATE_FIRST_JOIN"])).format("DD MMM YYYY"), 
                            app_data["SERV_PERIOD"], 
                            moment(new Date(app_data["DATE_OF_RETIREMENT"])).format("DD MMM YYYY")]
                            ];

    const pdf_serv_table = [];


    for(let i=0;i<3;i+=2){
        pdf_serv_table.push(
            <View style={style_table.row}>
                <View style={style_table.double_column}>
                    <View style={style_table.loan_index_column}><Text>{pdfServInfo[0][i]}</Text></View>
                    <View style={style_table.personal_label_column}><Text>{pdfServInfo[1][i]}</Text></View>
                    <View style={style_table.value_column}><Text>{pdfServInfo[2][i]}</Text></View>
                </View> 
                <View style={style_table.double_column}>
                    <View style={style_table.loan_index_column}><Text>{pdfServInfo[0][i+1]}</Text></View>
                    <View style={style_table.personal_label_column}><Text>{pdfServInfo[1][i+1]}</Text></View>
                    <View style={style_table.value_column}><Text>{pdfServInfo[2][i+1]}</Text></View>
                </View> 
            </View>

        );
    }


    for(let i=4;i<5;i++){
        pdf_serv_table.push(
            <View style={style_table.row}>
                <View style={style_table.index_column}><Text>{pdfServInfo[0][i]}</Text></View>
                <View style={style_table.personal_label_column}><Text>{pdfServInfo[1][i]}</Text></View>
                <View style={style_table.value_column}><Text>{pdfServInfo[2][i]}</Text></View>
            </View>
        );
    }



    var pdfSalInfo = [[" ","a", "b", "c", "d"],
                        ["Month", "Basic Salary","Total Salary", "Total Reduction", "Net Salary"]];
    
    pdfSalInfo = [...pdfSalInfo, ...app_data["PREV_MON_SAL"]];

    const pdf_sal_table = [];

    for(let i=0;i<1;i++){
        pdf_sal_table.push(
            <View style={style_table.row}>
                <View style={[style_table.index_column, style_table.border_column]}><Text>{pdfSalInfo[0][i]}</Text></View>
                <View style={[style_table.label_column, style_table.border_column]}><Text>{pdfSalInfo[1][i]}</Text></View>
                <View style={[style_table.sal_value_column, style_table.border_column, style_field.preBold]}><Text>{pdfSalInfo[2][i]}</Text></View>
                <View style={[style_table.sal_value_column, style_table.border_column, style_field.preBold]}><Text>{pdfSalInfo[3][i]}</Text></View>
                <View style={[style_table.sal_value_column, style_table.border_column, style_field.preBold]}><Text>{pdfSalInfo[4][i]}</Text></View>
            </View>
        );
    }

    for(let i=1;i<5;i++){
        pdf_sal_table.push(
            <View style={style_table.row}>
                <View style={[style_table.index_column, style_table.border_column]}><Text>{pdfSalInfo[0][i]}</Text></View>
                <View style={[style_table.label_column, style_table.border_column]}><Text>{pdfSalInfo[1][i]}</Text></View>
                <View style={[style_table.sal_value_column, style_table.border_column]}><Text>{nf.format(pdfSalInfo[2][i])}</Text></View>
                <View style={[style_table.sal_value_column, style_table.border_column]}><Text>{nf.format(pdfSalInfo[3][i])}</Text></View>
                <View style={[style_table.sal_value_column, style_table.border_column]}><Text>{nf.format(pdfSalInfo[4][i])}</Text></View>
            </View>
        );
    }


    var pdfLoanInfo = [["Serial No.", "01", "02", "03", "04", "05", "06", "07", "08"],
                        ["Type of Loan", "Vehicle Buying / House Building / Repairment / Land Buying", "Consumer Loan", "Laptop Loan", 
                            "Personal or Other or Any Purpose Loan under Sonali Bank Whole-Sale Loan", 
                            "Vehicle Buying / House Building / Repairment / Land Buying under Sonali Bank Whole-Sale Loan",
                            "House Building Loan Taken under Banking System of Teacher/Officer/Staff of BUET", "Others", "Total"],
                        ["Amount of Loan"],
                        ["Amount of Installment"],
                        ["Total Number of Installment"],
                        ["Paid Number of Installment"],
                        ["Unpaid Amount of Loan (with Interest)"]];

    for(let i=0;i<5;i++){
        pdfLoanInfo[i+2] = [...pdfLoanInfo[i+2], ...app_data["LOAN_DETAILS"][i]]
    }

    const pdf_loan_table = [];
    const pdf_loan_table_2 = [];

    for(let i=0;i<1;i++){
        pdf_loan_table.push(
            <View style={style_table.row}>
                <View style={[style_table.loan_index_column, style_table.border_column]}><Text>{pdfLoanInfo[0][i]}</Text></View>
                <View style={[style_table.label_column, style_table.border_column]}><Text>{pdfLoanInfo[1][i]}</Text></View>
                <View style={[style_table.loan_value_column, style_table.border_column, style_field.preBold]}><Text>{pdfLoanInfo[2][i]}</Text></View>
                <View style={[style_table.loan_value_column, style_table.border_column, style_field.preBold]}><Text>{pdfLoanInfo[3][i]}</Text></View>
                <View style={[style_table.loan_value_column, style_table.border_column, style_field.preBold]}><Text>{pdfLoanInfo[4][i]}</Text></View>
                <View style={[style_table.loan_value_column, style_table.border_column, style_field.preBold]}><Text>{pdfLoanInfo[5][i]}</Text></View>
                <View style={[style_table.loan_value_column, style_table.border_column, style_field.preBold]}><Text>{pdfLoanInfo[6][i]}</Text></View>
            </View>
        );
    }

    for(let i=1;i<3;i++){
        pdf_loan_table.push(
            <View style={style_table.row}>
                <View style={[style_table.loan_index_column, style_table.border_column]}><Text>{nf.format(pdfLoanInfo[0][i])}</Text></View>
                <View style={[style_table.label_column, style_table.border_column]}><Text>{pdfLoanInfo[1][i]}</Text></View>
                <View style={[style_table.loan_value_column, style_table.border_column]}><Text>{nf.format(pdfLoanInfo[2][i])}</Text></View>
                <View style={[style_table.loan_value_column, style_table.border_column]}><Text>{nf.format(pdfLoanInfo[3][i])}</Text></View>
                <View style={[style_table.loan_value_column, style_table.border_column]}><Text>{nf.format(pdfLoanInfo[4][i])}</Text></View>
                <View style={[style_table.loan_value_column, style_table.border_column]}><Text>{nf.format(pdfLoanInfo[5][i])}</Text></View>
                <View style={[style_table.loan_value_column, style_table.border_column]}><Text>{nf.format(pdfLoanInfo[6][i])}</Text></View>
            </View>
        );
    }

    for(let i=0;i<1;i++){
        pdf_loan_table_2.push(
            <View style={style_table.row}>
                <View style={[style_table.loan_index_column, style_table.border_column]}><Text>{pdfLoanInfo[0][i]}</Text></View>
                <View style={[style_table.label_column, style_table.border_column]}><Text>{pdfLoanInfo[1][i]}</Text></View>
                <View style={[style_table.loan_value_column, style_table.border_column, style_field.preBold]}><Text>{pdfLoanInfo[2][i]}</Text></View>
                <View style={[style_table.loan_value_column, style_table.border_column, style_field.preBold]}><Text>{pdfLoanInfo[3][i]}</Text></View>
                <View style={[style_table.loan_value_column, style_table.border_column, style_field.preBold]}><Text>{pdfLoanInfo[4][i]}</Text></View>
                <View style={[style_table.loan_value_column, style_table.border_column, style_field.preBold]}><Text>{pdfLoanInfo[5][i]}</Text></View>
                <View style={[style_table.loan_value_column, style_table.border_column, style_field.preBold]}><Text>{pdfLoanInfo[6][i]}</Text></View>
            </View>
        );
    }

    for(let i=3;i<9;i++){
        pdf_loan_table_2.push(
            <View style={style_table.row}>
                <View style={[style_table.loan_index_column, style_table.border_column]}><Text>{nf.format(pdfLoanInfo[0][i])}</Text></View>
                <View style={[style_table.label_column, style_table.border_column]}><Text>{pdfLoanInfo[1][i]}</Text></View>
                <View style={[style_table.loan_value_column, style_table.border_column]}><Text>{nf.format(pdfLoanInfo[2][i])}</Text></View>
                <View style={[style_table.loan_value_column, style_table.border_column]}><Text>{nf.format(pdfLoanInfo[3][i])}</Text></View>
                <View style={[style_table.loan_value_column, style_table.border_column]}><Text>{nf.format(pdfLoanInfo[4][i])}</Text></View>
                <View style={[style_table.loan_value_column, style_table.border_column]}><Text>{nf.format(pdfLoanInfo[5][i])}</Text></View>
                <View style={[style_table.loan_value_column, style_table.border_column]}><Text>{nf.format(pdfLoanInfo[6][i])}</Text></View>
            </View>
        );
    }



    const MyDoc = (
        <Document>
            <Page size="A4" style={{marginTop:"10pt"}} >

                <View style={style_logo.logo}>
                    <View style={style_logo.logo_img}>
                        <Image style={style_logo.l_img} src={logo_image}/>
                    </View>

                    <View style={style_logo.logo_text}>
                        <Text style={style_logo.logo_text_1}>
                            Bangladesh University of Engineering and Technology (BUET)
                        </Text>
                        <Text style={style_logo.logo_text_2}>
                            Comptroller Office
                        </Text>

                        <Text style={styles.pageLabel}>
                            Application for Loan
                        </Text>
                    </View>

                </View>


                <View style={style_field.allField}>

                    <View style={style_field.preBasicFieldwithPic}>
                        <View style={style_field.preBasicField}>
                            <PreviewData
                                label="1. Applicant Name"
                                name={app_data["EMPLOYEE_NAME"]}
                            />

                            <PreviewData
                                label="2. Designation"
                                name={app_data["DESIGNATION"]}
                            />

                            <PreviewData
                                label="3. Office/Department"
                                name={app_data["OFFICE"]}
                            />

                            <PreviewData
                                label="4. Account No. of Sonali Bank, BUET Branch"
                                name={"44040"+app_data["BANK_ACCOUNT_NO"]}
                            />

                            <PreviewData
                                label="5. Type of Loan"
                                name={app_data["LOAN_TYPE"]}
                            />

                            <PreviewData
                                label="6. Amount of Loan"
                                name={nf.format(app_data["LOAN_AMNT"])}
                            />

                            <PreviewData
                                label="7. Reason for Loan"
                                name={app_data["REASON_FOR_LOAN"]}
                            />





                            
                        </View>

                        <View style={style_pic.preProPic}>
                            <Image style={style_pic.preProPicImg} src={app_data["PROFILE_PIC"]} />
                        </View>

                    </View>

                    <View style={style_field.preOtherField}>
                        <Text style={style_field.preOtherFieldLabel}>
                            8. Personal Information :
                        </Text>

                        <View style={style_table.table}>
                            {pdf_pers_table}

                        </View>
                        

                    </View>

                    <View style={style_field.preOtherField}>
                        <Text style={style_field.preOtherFieldLabel}>
                            9. Applicant's Service Realated Information :
                        </Text>

                        <View style={style_table.table}>
                            {pdf_serv_table}

                        </View>
                        

                    </View>

                    <View style={style_field.preOtherField}>
                        <Text style={style_field.preOtherFieldLabel}>
                            10. Salary Releted Information (Last Three Months) :
                        </Text>

                        <View style={style_table.table}>
                            {pdf_sal_table}

                        </View>
                        

                    </View>

                    <View style={style_field.preOtherField}>
                        <Text style={style_field.preOtherFieldLabel}>
                            11. Information about Loan Taken from University and Sonali Bank (Attested by Comptroller Office) :
                        </Text>

                        <View style={style_table.table}>
                            {pdf_loan_table}

                        </View>
                        

                    </View>

                </View>

                
            </Page>

            <Page size="A4" style={{marginTop:"30pt"}}>
                <View style={style_field.allField}>

                    <View style={style_field.preOtherField}>

                        <View style={style_table.table}>
                            {pdf_loan_table_2}

                        </View>
                        

                    </View>

                    <View style={style_field.preOtherField}>
                        <Text style={style_field.preOtherFieldLabel}>
                            12. Approximate Receivable from University (To be by Comptroller Office) :
                        </Text>

                        <View style={style_table.table}>
                            <View style={style_table.row}>
                                <View style={[style_table.loan_index_column, style_table.border_column]}><Text>a</Text></View>
                                <View style={[style_table.last_column, style_table.border_column]}><Text>Net Pension (One-off)</Text></View>
                                <View style={[style_table.last_column, style_table.border_column]}><Text> </Text></View>
                            </View>

                            <View style={style_table.row}>
                                <View style={[style_table.loan_index_column, style_table.border_column]}><Text>b</Text></View>
                                <View style={[style_table.last_column, style_table.border_column]}><Text></Text></View>
                                <View style={[style_table.last_column, style_table.border_column]}><Text> </Text></View>
                            </View>

                        </View>
                        

                    </View>

                    <View style={style_field.preOtherField}>
                        <Text style={style_field.preOtherFieldText}>
                            I warrant that the above information is completely true and correct and I will be obliged to pay the loan installments accepted as per the rules. 
                        </Text>
                        <Text style={style_field.preOtherFieldText}>
                            Otherwise there is no objection to bear the responsibility prescribed by the authority. If any information or documents provided are proved to be incorrect after taking the loan, then I will be bound to accept any decision of the university without any objection.
                        </Text>
                    </View>

                    <View style={style_pic.preSignPic}>
                        <Image style={style_pic.preSignPicImg} src={app_data["SIGN_PIC"]} />
                        <Text style={style_pic.preSignPicText}> Applicant Signature</Text>
                        <Text style={style_pic.preSignPicText}> with Date</Text>
                    </View>

                    <View style={style_field.preOtherField}>
                        <Text style={style_field.preOtherFieldLabel}>
                            Sign after selecting applicable field
                        </Text>

                        <View style={style_field.preOtherFieldR}>
                            <Image style={style_field.preOtherFieldImg} src={checkBox_image} />

                            <Text style={style_field.preOtherFieldText}>
                                It is recommended to give Consumer Loan, Vehicle Buying/House Building/Repair/Land Buying and Personal or other or any purpose loan under Sonali Bank Wholesale loan and House Building Loan, House Buying, Building, Repair, Land Buying loan on availability.
                            </Text>
                        </View>

                        <View style={style_field.preOtherFieldR}>
                            <Image style={style_field.preOtherFieldImg} src={checkBox_image} />

                            <Text style={style_field.preOtherFieldText}>
                                It is attested that applicant can directly use laptop in educational activities and is recommended to give on availability.
                            </Text>
                        </View>

                        
                    </View>

                    <View style={style_pic.preSignPic}>
                        <View style={{marginTop:"20pt"}}></View>
                        <Text style={style_pic.preSignPicText}>------------------------------</Text>
                        <Text style={style_pic.preSignPicText}>Head of Office / Dept.</Text>
                        <Text style={style_pic.preSignPicText}>(Seal and Signature)</Text>
                    </View>

                    <View style={style_pic.preSignPic}>
                        <Text style={[style_field.preOtherFieldText, style_field.preBold]}>It is attested that, documents provided by applicant is correct.</Text>
                    </View>

                    <View style={style_pic.preSignPic}>
                        <View style={{marginTop:"20pt"}}></View>
                        <Text style={style_pic.preSignPicText}>------------------------------</Text>
                        <Text style={style_pic.preSignPicText}>Deputy Director</Text>
                        <Text style={style_pic.preSignPicText}>(Salary Section)</Text>
                        <Text style={style_pic.preSignPicText}>(Signature with Name and Seal)</Text>
                    </View>

                    <View style={{marginTop:"20pt"}}></View>
                    <View style={style_field.preSigField}>
                        <View style={style_field.preSigFieldBox}>
                            <Text style={style_pic.preSignPicText}>------------------------------</Text>
                            <Text style={style_pic.preSignPicText}>Accountant</Text>
                            <Text style={style_pic.preSignPicText}>(Signature with Name and Seal)</Text>
                        </View>

                        <View style={style_field.preSigFieldBox}>
                            <Text style={style_pic.preSignPicText}>------------------------------</Text>
                            <Text style={style_pic.preSignPicText}>SR. ASST. Director</Text>
                            <Text style={style_pic.preSignPicText}>(Fund Section)</Text>
                            <Text style={style_pic.preSignPicText}>(Signature with Name and Seal)</Text>
                        </View>

                        <View style={style_field.preSigFieldBox}>
                            <Text style={style_pic.preSignPicText}>------------------------------</Text>
                            <Text style={style_pic.preSignPicText}>Deputy Comptroller</Text>
                            <Text style={style_pic.preSignPicText}>(Signature with Name and Seal)</Text>
                        </View>

                        <View style={style_field.preSigFieldBox}>
                            <Text style={style_pic.preSignPicText}>------------------------------</Text>
                            <Text style={style_pic.preSignPicText}>Comptroller</Text>
                            <Text style={style_pic.preSignPicText}>(Signature with Name and Seal)</Text>
                        </View>
                    </View>

                </View>

            </Page>
        </Document>
    );


    const onClickEdit = async e => {
        e.preventDefault();
        applicationNavigate('/application/1', { state: {info: app_data, used: "yes"} });
    };

    const downloadURI = (uri, name) => {
        const link = document.createElement("a");
        link.href = uri;
        link.download = name;
        link.click();
    }

    const onClickSubmit = async e => {
        e.preventDefault();
        if (!url) {
            return;
        }


        try{
            await axios.post("http://localhost:8800/loan_register", app_data);
            downloadURI(url, 'application.pdf');
            applicationNavigate("/");

        }catch(err){
            console.log(err);
        }

    }


    return(
        <div>


            {/* <PDFViewer style={styles.viewer}>
                <MyDoc />
            </PDFViewer> */}




            <BlobProvider document={MyDoc}>
                {({ blob, url, loading, error }) => {
                    setURL(url);
                }}
            </BlobProvider>

            <div className='preAppButton'>
                <button className='preAppNormalButton' onClick={onClickEdit} >
                    সম্পাদন
                </button>

                <button className='preAppNormalButton' onClick={onClickSubmit} >
                    জমা দিন
                </button> 
                
                
            </div>


        </div>
    );
}

