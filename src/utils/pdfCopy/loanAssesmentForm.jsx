import React, { useState } from "react";
import {
    BlobProvider,
    Document,
    Page,
    View,
    Text,
    Image,
    StyleSheet,
    Font,
    PDFViewer,
} from "@react-pdf/renderer";

import logo_image from "../../assets/images/buetLogo.png";
import PT_Serif_Bold from "../../assets/fonts/pt-serif-latin-700-normal.ttf";

Font.register({
    family: "English Bold",
    fontWeight: "normal",
    src: PT_Serif_Bold,
});
Font.register({
    family: "English",
    fontWeight: "normal",
    src: "http://fonts.gstatic.com/s/ptserif/v8/EgBlzoNBIHxNPCMwXaAhYPesZW2xOQ-xsNqO47m55DA.ttf",
});

const styles = StyleSheet.create({
    viewer: {
        width: window.innerWidth,
        height: window.innerHeight,
    },

    pageLabel: {
        textTransform: "capitalize",
        textAlign: "center",
        fontFamily: "English",
        fontSize: "18pt",
        fontWeight: "bold",
        marginBottom: "5pt",
        color: "black",
        marginTop: "3pt",
    },
});

const style_logo = StyleSheet.create({
    logo: {
        marginTop: "5pt",
        display: "flex",
        flexDirection: "row",
        padding: "10pt",
        alignSelf: "center",
        alignItems: "start",
    },

    logo_img: {
        float: "center",
    },

    l_img: {
        height: "45pt",
        width: "45pt",
    },

    logo_text: {
        color: "crimson",
        marginLeft: "1%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },

    logo_text_1: {
        fontSize: "15pt",
        fontWeight: "bold",
        fontFamily: "English Bold",
    },

    logo_text_2: {
        fontSize: "15pt",
        fontFamily: "English",
        textAlign: "center",
    },
});

const style_laf = StyleSheet.create({
    loan_assessment: {
        display: "flex",
        flexDirection: "column",
        fontFamily: "English",
        marginTop: "2%",
        marginLeft: "10%",
    },

    assessment_section: {
        display: "flex",
        flexDirection: "column",
        padding: "5pt 10pt 5pt 10pt",
        fontFamily: "English",
    },

    section_label: {
        textAlign: "left",
        fontSize: "15pt",
        fontFamily: "English Bold",
        marginBottom: "1%",
    },

    subsection_label: {
        textAlign: "center",
        fontSize: "15pt",
        textDecoration: "underline",
    },

    section_items: {
        display: "flex",
        flexDirection: "row",
        width: "100%",
    },

    section_personal_items: {
        display: "flex",
        flexDirection: "row",
        width: "100%",
    },

    section_items_div: {
        display: "flex",
        flexDirection: "column",
        width: "50%",
    },

    pro_photo: {
        height: "200px",
        width: "200px",
    },

    section_item: {
        display: "flex",
        flexDirection: "row",
        padding: "5pt",
        alignItems: "center",
    },

    sec_item_def: {
        fontSize: "10pt",
        fontFamily: "English Bold",
    },

    section_item_label: {
        width: "40%",
        marginRight: "5pt",
    },

    section_item_colon: {
        marginRight: "10pt",
    },

    section_item_value: {
        fontSize: "10pt",
        fontFamily: "English",
        width: "60%",
    },

    write_signature: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-evenly",
        marginTop: "40pt",
        marginBottom: "15pt",
    },

    signature_box: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },

    signature_text: {
        fontSize: "10pt",
        textAlign: "center",
    },
});

export default function LoanAssesmentForm(props) {
    const laf_data = props.lafData;

    const [laf_hover, setLaf_hover] = useState(false);

    const style_butt = StyleSheet.create({
        download_butt: {
            width: "auto",
            height: "auto",
            fontFamily: "PT Serif",
            fontWeight: "bold",
            padding: "5pt 15pt 5pt 15pt",
            textAlign: "center",
            border: laf_hover ? "2px solid white" : "2px solid #3f8ba8",
            borderRadius: "20pt",
            backgroundColor: laf_hover ? "#3f8ba8" : "white",
            color: laf_hover ? "white" : "#3f8ba8",
            fontSize: laf_hover ? "20pt" : "15pt",
            cursor: laf_hover ? "pointer" : "default",
            transition: "all ease 0.3s",
        },
    });

    const [lafUrl, setLafUrl] = useState("");

    const laf_loan_id = laf_data["loan_id"];
    const laf_app_date = laf_data["loan_app_date"];
    const laf_loan_type = laf_data["loan_type"];
    const laf_buet_id = laf_data["buet_id"];
    const laf_applicant_name = laf_data["applicant_name"];
    const laf_designation = laf_data["designation"];
    const laf_office_dept = laf_data["office_dept"];

    const pdf_laf_loan_type = laf_loan_type.toLowerCase();

    var laf_dob = laf_data["dob"];

    var laf_joining_date = laf_data["joining_date"];
    var laf_mos = laf_data["mos"];
    var laf_serv_len_y = laf_data["serv_len_y"];
    var laf_rem_serv_m = laf_data["rem_serv_m"];

    var laf_basic_salary = laf_data["basic_salary"];
    var laf_gross_salary = laf_data["gross_salary"];
    var laf_deduct = laf_data["deduct"];
    var laf_net_salary = laf_data["net_salary"];

    var laf_pens_gra = laf_data["pens_gra"];
    var laf_leav_sal = laf_data["leav_sal"];
    var laf_25_mon_gran = laf_data["25_mon_gran"];
    var laf_tot_rec = laf_data["tot_rec"];

    var laf_hb_loan = laf_data["hb_loan"];
    var laf_consu_loan = laf_data["consu_loan"];
    var laf_lap_loan = laf_data["lap_loan"];
    var laf_sblws_loan = laf_data["sblws_loan"];
    var laf_tot_pay = laf_data["tot_pay"];
    var laf_net_rec = laf_data["net_rec"];

    var laf_hb_loan_ins_amnt = laf_data["hb_loan_ins_amnt"];
    var laf_consu_loan_ins_amnt = laf_data["consu_loan_ins_amnt"];
    var laf_lap_loan_ins_amnt = laf_data["lap_loan_ins_amnt"];
    var laf_sblws_loan_ins_amnt = laf_data["sblws_loan_ins_amnt"];
    var laf_tot_loan_ins_amnt = laf_data["tot_loan_ins_amnt"];

    var laf_75_pens = laf_data["75_pens"];
    var laf_app_amnt = laf_data["app_amnt"];
    var laf_prop_amnt = laf_data["prop_amnt"];
    var laf_inst_amnt = laf_data["inst_amnt"];
    var laf_tot_no_ins = laf_data["tot_no_ins"];
    var laf_tot_ins_amnt = laf_data["tot_ins_amnt"];
    var laf_60_basic_sal = laf_data["60_basic_sal"];

    const sectionItem = (index, label, value) => {
        return (
            <View style={style_laf.section_item}>
                <Text style={style_laf.sec_item_def}>{index}</Text>
                <Text
                    style={[
                        style_laf.section_item_colon,
                        style_laf.sec_item_def,
                    ]}
                >
                    .
                </Text>
                <Text
                    style={[
                        style_laf.section_item_label,
                        style_laf.sec_item_def,
                    ]}
                >
                    {label}
                </Text>
                <Text
                    style={[
                        style_laf.section_item_colon,
                        style_laf.sec_item_def,
                    ]}
                >
                    :
                </Text>
                <Text style={style_laf.section_item_value}>{value}</Text>
            </View>
        );
    };

    const signatureBox = (title) => {
        return (
            <View style={style_laf.signature_box}>
                <Text style={style_laf.signature_text}>
                    ________________________
                </Text>
                <Text style={style_laf.signature_text}>{title}</Text>
            </View>
        );
    };

    let nf = new Intl.NumberFormat("en-US");

    const MyForm = (
        <Document>
            <Page size="A4" orientation="portrait">
                <View style={{ marginTop: "20pt" }}></View>

                <View style={style_logo.logo}>
                    <View style={style_logo.logo_img}>
                        <Image style={style_logo.l_img} src={logo_image} />
                    </View>

                    <View style={style_logo.logo_text}>
                        <Text style={style_logo.logo_text_1}>
                            Bangladesh University of Engineering and Technology
                            (BUET)
                        </Text>
                        <Text style={style_logo.logo_text_2}>
                            COMPTROLLER OFFICE
                        </Text>
                        <Text style={styles.pageLabel}>
                            {pdf_laf_loan_type} Assesment Form
                        </Text>
                    </View>
                </View>

                <View style={style_laf.loan_assessment}>
                    <View style={style_laf.assessment_section}>
                        <Text style={style_laf.section_label}>
                            A) Personal Information :
                        </Text>

                        <View style={style_laf.section_personal_items}>
                            <View style={style_laf.section_items_div}>
                                {sectionItem("1", "Loan ID", laf_loan_id)}
                                {sectionItem("3", "Loan Type", laf_loan_type)}
                                {sectionItem(
                                    "5",
                                    "Applicant Name",
                                    laf_applicant_name
                                )}
                                {sectionItem(
                                    "7",
                                    "Office/Dept.",
                                    laf_office_dept
                                )}
                            </View>

                            <View style={style_laf.section_items_div}>
                                {sectionItem(
                                    "2",
                                    "Application Date",
                                    laf_app_date
                                )}

                                {sectionItem("4", "BUET ID", laf_buet_id)}

                                {sectionItem(
                                    "6",
                                    "Designation",
                                    laf_designation
                                )}

                                {sectionItem("8", "Date of Birth", laf_dob)}
                            </View>
                        </View>
                    </View>

                    <View style={style_laf.assessment_section}>
                        <Text style={style_laf.section_label}>
                            B) Employment Information :
                        </Text>

                        <View style={style_laf.section_items}>
                            <View style={style_laf.section_items_div}>
                                {sectionItem(
                                    "1",
                                    "Joining Date",
                                    laf_joining_date
                                )}
                                {sectionItem(
                                    "3",
                                    "Maturity of Service (including PRL)",
                                    laf_mos
                                )}
                            </View>

                            <View style={style_laf.section_items_div}>
                                {sectionItem(
                                    "2",
                                    "Service Length (Year)",
                                    laf_serv_len_y
                                )}
                                {sectionItem(
                                    "4",
                                    "Remaining Service (No of Month)",
                                    laf_rem_serv_m
                                )}
                            </View>
                        </View>
                    </View>

                    <View style={style_laf.assessment_section}>
                        <Text style={style_laf.section_label}>
                            C) Salary Information :
                        </Text>

                        <View style={style_laf.section_items}>
                            <View style={style_laf.section_items_div}>
                                {sectionItem(
                                    "1",
                                    "Basic Salary",
                                    nf.format(laf_basic_salary)
                                )}
                                {sectionItem(
                                    "3",
                                    "Deduction",
                                    nf.format(laf_deduct)
                                )}
                            </View>

                            <View style={style_laf.section_items_div}>
                                {sectionItem(
                                    "2",
                                    "Gross Salary",
                                    nf.format(laf_gross_salary)
                                )}
                                {sectionItem(
                                    "4",
                                    "Net Salary",
                                    nf.format(laf_net_salary)
                                )}
                            </View>
                        </View>
                    </View>

                    <View style={style_laf.assessment_section}>
                        <Text style={style_laf.section_label}>
                            D) Financial Position :
                        </Text>

                        <Text style={style_laf.subsection_label}>
                            Receivables
                        </Text>

                        <View style={style_laf.section_items}>
                            <View style={style_laf.section_items_div}>
                                {sectionItem(
                                    "1",
                                    "Pension/Gratuity",
                                    nf.format(laf_pens_gra)
                                )}
                            </View>

                            <View style={style_laf.section_items_div}>
                                {sectionItem(
                                    "2",
                                    "Leave Salary",
                                    nf.format(laf_leav_sal)
                                )}
                            </View>
                        </View>

                        {sectionItem(
                            "3",
                            "25 Months Grant (Trust Fund) (Service Length × Basic Salary)",
                            nf.format(laf_25_mon_gran)
                        )}
                        {sectionItem(
                            "4",
                            "Total Receivable (TR) (1.+2.+3.)",
                            nf.format(laf_tot_rec)
                        )}

                        <Text style={style_laf.subsection_label}>Payables</Text>

                        <View style={style_laf.section_items}>
                            <View style={style_laf.section_items_div}>
                                {sectionItem(
                                    "5",
                                    "House Building Loan",
                                    nf.format(laf_hb_loan)
                                )}
                                {sectionItem(
                                    "7",
                                    "Laptop Loan",
                                    nf.format(laf_lap_loan)
                                )}
                            </View>

                            <View style={style_laf.section_items_div}>
                                {sectionItem(
                                    "6",
                                    "Consumer Loan",
                                    nf.format(laf_consu_loan)
                                )}
                                {sectionItem(
                                    "8",
                                    "SBL Whole Sale Loan",
                                    nf.format(laf_sblws_loan)
                                )}
                            </View>
                        </View>
                        {sectionItem(
                            "9",
                            "Total Payable (TP) (5.+6.+7.+8.)",
                            nf.format(laf_tot_pay)
                        )}
                        {sectionItem(
                            "10",
                            "Net Receivable (TR-TP) (4.-9.)",
                            nf.format(laf_net_rec)
                        )}
                    </View>
                </View>
            </Page>

            <Page size="A4" orientation="portrait">
                <View style={{ marginTop: "20pt" }}></View>

                <View style={style_laf.loan_assessment}>
                    <View style={style_laf.assessment_section}>
                        <Text style={style_laf.subsection_label}>
                            Installment Amount of Loan
                        </Text>

                        <View style={style_laf.section_items}>
                            <View style={style_laf.section_items_div}>
                                {sectionItem(
                                    "11",
                                    "House Building Loan",
                                    nf.format(laf_hb_loan_ins_amnt)
                                )}
                                {sectionItem(
                                    "13",
                                    "Laptop Loan",
                                    nf.format(laf_lap_loan_ins_amnt)
                                )}
                            </View>

                            <View style={style_laf.section_items_div}>
                                {sectionItem(
                                    "12",
                                    "Consumer Loan",
                                    nf.format(laf_consu_loan_ins_amnt)
                                )}
                                {sectionItem(
                                    "14",
                                    "SBL Whole Sale Loan",
                                    nf.format(laf_sblws_loan_ins_amnt)
                                )}
                            </View>
                        </View>
                        {sectionItem(
                            "15",
                            "Total Installment Amount of Loan (11.+12.+13.+14.)",
                            nf.format(laf_tot_loan_ins_amnt)
                        )}
                    </View>

                    <View style={style_laf.assessment_section}>
                        <Text style={style_laf.section_label}>
                            E) Loan Assessment :
                        </Text>

                        <View style={style_laf.section_items}>
                            <View style={style_laf.section_items_div}>
                                {sectionItem(
                                    "1",
                                    "75% of Pension",
                                    nf.format(laf_75_pens)
                                )}
                                {sectionItem(
                                    "3",
                                    "Proposed Amount",
                                    nf.format(laf_prop_amnt)
                                )}
                                {sectionItem(
                                    "5",
                                    "Total Number of Installment",
                                    laf_tot_no_ins
                                )}
                                {sectionItem(
                                    "7",
                                    "60% of Basic Salary",
                                    nf.format(laf_60_basic_sal)
                                )}
                            </View>

                            <View style={style_laf.section_items_div}>
                                {sectionItem(
                                    "2",
                                    "Applied Amount",
                                    nf.format(laf_app_amnt)
                                )}
                                {sectionItem(
                                    "4",
                                    "Installment Amount",
                                    nf.format(laf_inst_amnt)
                                )}
                                {sectionItem(
                                    "6",
                                    "Total Installment Amount (D15.+E4.)",
                                    nf.format(laf_tot_ins_amnt)
                                )}
                            </View>
                        </View>
                    </View>
                </View>

                <View style={style_laf.assessment_section}>
                    <View style={style_laf.write_signature}>
                        {signatureBox("Accountant")}
                        {signatureBox("Accounts Officer")}
                        {signatureBox("Sr. Assistant Director")}
                        {signatureBox("Deputy Comptroller")}
                        {signatureBox("Comptroller")}
                    </View>
                </View>

                <View style={style_laf.assessment_section}>
                    <Text
                        style={[
                            style_laf.subsection_label,
                            { fontFamily: "English Bold" },
                        ]}
                    >
                        AUDIT OFFICE
                    </Text>
                    <View style={style_laf.write_signature}>
                        {signatureBox("Auditor")}
                        {signatureBox("Accounts Officer")}
                        {signatureBox("Deputy Director")}
                        {signatureBox("Deputy Comptroller")}
                    </View>
                </View>
            </Page>
        </Document>
    );

    const downloadURI = (uri, name) => {
        const link = document.createElement("a");
        link.href = uri;
        link.download = name;
        link.click();
    };

    const onLAFClick = (e) => {
        e.preventDefault();

        if (!lafUrl) {
            return;
        }
        downloadURI(lafUrl, "loan_assesment_form.pdf");
    };

    return (
        // <PDFViewer style={styles.viewer}>
        //     <MyForm />
        // </PDFViewer>

        <>

            <BlobProvider document={MyForm}>
                {({ blob, url, loading, error }) => {
                    setLafUrl(url);
                }}
            </BlobProvider>

            <div style={style_butt.download_butt} onClick={onLAFClick} onMouseEnter={() => setLaf_hover(true)} onMouseLeave={() => setLaf_hover(false)}>
                Download Assesment Form
            </div>

        </>
    );
}
