import { React, useState } from "react";
import { useNavigate } from "react-router";
import {
    PDFDownloadLink,
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

import axios from "axios";
import moment from "moment";

import InWords from "../functions/inWords";

import logo_image from "../../assets/images/logo.png";
import checkBox_image from "../../assets/images/checkbox_image.png";
import { backend_site_address } from "../../stores/const/siteAddress";

import PT_Serif from "../../assets/fonts/PTSerif-Regular.ttf";
import PT_Serif_Bold from "../../assets/fonts/pt-serif-latin-700-normal.ttf";
import Noto_Serif_Bengali from "../../assets/fonts/Noto_Serif_Bengali.ttf";
import Noto_Serif_Bengali_Bold from "../../assets/fonts/Noto_Serif_Bengali_Bold.ttf";
import AdorshoLipi from "../../assets/fonts/AdorshoLipi.ttf";
import AdorshoLipi_Bold from "../../assets/fonts/AdorshoLipi_Bold.ttf";
import SuttonyMJ from "../../assets/fonts/SuttonyMJ.ttf";
import SuttonyMJ_Bold from "../../assets/fonts/SuttonyMJ_Bold.ttf";
import { secondary } from "../../stores/const/colors";

Font.register({
    family: "English",
    fontWeight: "normal",
    src: "http://fonts.gstatic.com/s/ptserif/v8/EgBlzoNBIHxNPCMwXaAhYPesZW2xOQ-xsNqO47m55DA.ttf",
});

Font.register({
    family: "English Bold",
    fontWeight: "normal",
    src: PT_Serif_Bold,
});

Font.register({
    family: "Bengali",
    fontWeight: "normal",
    src: AdorshoLipi,
});

Font.register({
    family: "Bengali Bold",
    fontWeight: "bold",
    src: AdorshoLipi_Bold,
});

const styles = StyleSheet.create({
    viewer: {
        width: window.innerWidth,
        height: window.innerHeight,
    },

    pageLabel: {
        textAlign: "center",
        fontFamily: "English Bold",
        fontSize: "16pt",
        marginBottom: "2pt",
        marginTop: "2pt",
        color: "black",
    },
});

const style_logo = StyleSheet.create({
    logo: {
        marginTop: "5pt",
        display: "flex",
        flexDirection: "row",
        padding: "5pt",
        alignSelf: "center",
    },

    logo_img: {
        marginRight: "1%",
    },

    l_img: {
        height: "30pt",
        width: "30pt",
    },

    logo_text: {
        color: "crimson",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },

    logo_text_1: {
        fontSize: "13pt",
        fontFamily: "English Bold",
    },

    logo_text_2: {
        fontSize: "11pt",
        fontFamily: "English",
    },
});

const style_field = StyleSheet.create({
    allField: {
        display: "flex",
        flexDirection: "column",
        flexBasis: "90%",
        paddingLeft: "30pt",
        paddingRight: "30pt",
        // justifyContent:"center"
    },

    firstField: {
        display: "flex",
        flexDirection: "row",
        width: "90%",
        justifyContent: "space-between",
        paddingLeft: "20pt",
        paddingRight: "20pt",
        marginBottom: "5pt",
    },

    preBasicFieldwithPic: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
    },

    preBasicField: {
        display: "flex",
        flexDirection: "column",
        flexBasis: "70%",
    },

    preOtherField: {
        padding: "0pt 5pt 0pt 5pt",
        display: "flex",
        flexDirection: "column",
    },

    preSigField: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-evenly",
    },

    preSigFieldBox: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },

    preOtherFieldR: {
        padding: "5pt 5pt 0pt 5pt",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
    },

    preOtherFieldLabel: {
        fontFamily: "English Bold",
        fontSize: "12pt",
        fontWeight: "bold",
        textAlign: "justify",
        marginTop: "8px",
    },

    preOtherFieldText: {
        fontFamily: "English",
        fontSize: "10pt",
        textAlign: "justify",
    },

    preBold: {
        fontFamily: "English Bold",
    },

    preOtherFieldImg: {
        height: "20pt",
        width: "20pt",
        padding: "2pt",
    },
});

const style_pic = StyleSheet.create({
    preProPic: {
        display: "flex",
        flexDirection: "column",
        padding: "5pt",
        height: "100px",
        width: "100px",
        border: "1px solid black",
        justifyContent: "center",
        alignSelf: "center",
    },

    preProPicImg: {
        textAlign: "center",
        fontFamily: "English",
        fontSize: "10px",
        color: "gray",
    },

    preSignPic: {
        padding: "2.5pt",
        alignSelf: "flex-end",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "10pt",
    },

    preSignPicImg: {
        height: "30pt",
        width: "100pt",
        padding: "5pt",
        borderBottom: "1px solid black",
    },

    preSignPicText: {
        fontFamily: "English",
        fontSize: "8pt",
    },
});

const style_data = StyleSheet.create({
    preData: {
        display: "flex",
        flexDirection: "row",
        padding: "2pt 5pt 2pt 5pt",
        alignItems: "center",
    },

    preDataOther: {
        fontSize: "11pt",
        color: "black",
        fontFamily: "English",
    },

    preDataLabel: {
        fontFamily: "English Bold",
        fontSize: "11pt",
        textAlign: "justify",
        width: "35%",
    },

    preDataColon: {
        fontFamily: "English Bold",
        fontSize: "11pt",
        paddingLeft: "15pt",
        paddingRight: "15pt",
        color: "black",
    },

    preDataValue: {
        fontFamily: "English",
        fontSize: "10pt",
        width: "50%",
    },
});

const style_table = StyleSheet.create({
    table: {
        display: "flex",
        flexDirection: "column",
        marginTop: "2pt",
        marginBottom: "2pt",
    },

    row: {
        display: "flex",
        flexDirection: "row",
        textAlign: "center",
    },

    row_border: {
        borderTop: "1px solid black",
        borderLeft: "1px solid black",
        borderRight: "1px solid black",
    },

    row_bot_border: {
        borderBottom: "1px solid black",
    },

    double_column: {
        display: "flex",
        flexDirection: "row",
        flexBasis: "50%",
        alignItems: "center",
    },

    border_column: {
        borderRight: "1px solid black",
    },

    index_column: {
        width: "5%",
        fontFamily: "English Bold",
        fontSize: "10pt",
        padding: "2pt",
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
    },

    loan_index_column: {
        width: "10%",
        fontFamily: "English Bold",
        fontSize: "10pt",
        fontWeight: "bold",
        padding: "2pt",
        justifyContent: "center",
    },

    label_column: {
        width: "25%",
        fontFamily: "English Bold",
        fontSize: "10pt",
        fontWeight: "bold",
        textAlign: "left",
        padding: "2pt",
        paddingBottom: "2pt",
        justifyContent: "center",
    },

    last_column: {
        width: "45%",
        fontFamily: "English Bold",
        fontSize: "10pt",
        fontWeight: "bold",
        textAlign: "center",
        padding: "2pt",
        justifyContent: "center",
    },

    personal_label_column: {
        width: "40%",
        fontFamily: "English Bold",
        fontSize: "10pt",
        fontWeight: "bold",
        textAlign: "left",
        justifyContent: "center",
    },

    salary_label_column: {
        width: "20%",
        fontFamily: "English Bold",
        fontSize: "10pt",
        fontWeight: "bold",
        textAlign: "left",
        justifyContent: "center",
    },

    value_column: {
        width: "70%",
        fontFamily: "English",
        fontSize: "9pt",
        textAlign: "left",
        justifyContent: "center",
    },

    sal_value_column: {
        width: "23%",
        fontFamily: "English",
        fontSize: "9pt",
        textAlign: "center",
        padding: "2pt",
        justifyContent: "center",
    },

    loan_value_column: {
        width: "13%",
        fontFamily: "English",
        fontSize: "9pt",
        padding: "2pt",
        justifyContent: "center",
    },

    double_index_column: {
        width: "10%",
        fontFamily: "English Bold",
        fontSize: "10pt",
        padding: "2pt",
        justifyContent: "center",
    },

    single_index_column: {
        width: "5%",
    },

    double_label_column: {
        width: "30%",
        fontFamily: "English Bold",
        fontSize: "10pt",
        fontWeight: "bold",
        padding: "2pt",
        textAlign: "left",
    },

    pers_single_label_column: {
        width: "20%",
    },

    double_colon_column: {
        width: "5%",
        fontFamily: "English Bold",
        fontSize: "10pt",
        fontWeight: "bold",
        padding: "2pt",
        justifyContent: "center",
    },

    single_colon_column: {
        width: "3%",
    },

    double_value_column: {
        width: "55%",
        fontFamily: "English",
        fontSize: "10pt",
        padding: "2pt",
        textAlign: "left",
    },

    single_value_column: {
        width: "75%",
    },
});

const PreviewData = (props) => {
    return (
        <View style={style_data.preData}>
            <Text style={style_data.preDataLabel}>{props.label}</Text>
            <Text style={style_data.preDataColon}>:</Text>
            <Text style={style_data.preDataValue}>{props.name}</Text>
        </View>
    );
};

export default function Application(props) {
    const applicationNavigate = useNavigate();

    const new_date = new Date();

    const loan_id = new_date.valueOf();

    const [url, setURL] = useState("");

    var app_data = props.applicationData;

    app_data["LOAN_ID"] = loan_id;

    app_data["LOAN_APP_DATE"] = new_date;

    let nf = new Intl.NumberFormat("en-US");

    const [down_hover, setDown_hover] = useState(false);

    const [back_hover, setBack_hover] = useState(false);

    const style_butt = StyleSheet.create({
        app_button: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "center",
            marginBottom: "50pt",
        },

        backward_butt: {
            width: back_hover ? "150pt" : "120pt",
            height: "auto",
            fontFamily: "PT Serif",
            fontWeight: "bold",
            padding: "5pt 15pt 5pt 15pt",
            alignSelf: "center",
            textAlign: "center",
            border: "2px solid",
            borderColor: back_hover ? "white" : secondary,
            borderRadius: back_hover ? "50pt" : "20pt",
            backgroundColor: back_hover ? secondary : "white",
            color: back_hover ? "white" : secondary,
            fontSize: back_hover ? "20pt" : "15pt",
            cursor: back_hover ? "pointer" : "default",
            transition: "all ease 0.3s",
        },

        download_butt: {
            width: down_hover ? "150pt" : "120pt",
            height: "auto",
            fontFamily: "PT Serif",
            fontWeight: "bold",
            padding: "5pt 15pt 5pt 15pt",
            alignSelf: "center",
            textAlign: "center",
            border: "2px solid",
            borderColor: down_hover ? "white" : secondary,
            borderRadius: down_hover ? "50pt" : "20pt",
            backgroundColor: down_hover ? secondary : "white",
            color: down_hover ? "white" : secondary,
            fontSize: down_hover ? "20pt" : "15pt",
            cursor: down_hover ? "pointer" : "default",
            transition: "all ease 0.3s",
        },

        alert_message: {
            textAlign: "center",
            color: "gray",
            fontSize: "20pt",
        },
    });

    const pdfPersoInfo = [
        ["a)", "b)", "c)", "d)", "e)", "f)", "g)", "h)"],
        [
            "Father's / Husband's Name",
            "Mother's Name",
            "Nominee's Name",
            "Relationship with Nominee",
            "Present Address",
            "Permanant Address",
            "Date of Birth",
            "Nominee's NID",
        ],
        [
            app_data["FATHERS_NAME"],
            app_data["MOTHERS_NAME"],
            app_data["NOMINEES_NAME"],
            app_data["NOMINEES_RELSHIP"],
            app_data["ADDRESS"],
            app_data["ADDRESS"],
            moment(new Date(app_data["DATE_OF_BIRTH"])).format("DD MMM YYYY"),
            app_data["NOMINEES_NID"],
        ],
    ];

    const pdf_pers_table = [];

    for (let i = 0; i < 3; i += 2) {
        pdf_pers_table.push(
            <View style={style_table.row}>
                <View style={style_table.double_column}>
                    <View style={style_table.double_index_column}>
                        {" "}
                        <Text>{pdfPersoInfo[0][i]}</Text>
                    </View>
                    <View style={style_table.double_label_column}>
                        <Text>{pdfPersoInfo[1][i]}</Text>
                    </View>
                    <View style={style_table.double_colon_column}>
                        <Text>:</Text>
                    </View>
                    <View style={style_table.double_value_column}>
                        <Text>{pdfPersoInfo[2][i]}</Text>
                    </View>
                </View>
                <View style={style_table.double_column}>
                    <View style={style_table.double_index_column}>
                        {" "}
                        <Text>{pdfPersoInfo[0][i + 1]}</Text>
                    </View>
                    <View style={style_table.double_label_column}>
                        <Text>{pdfPersoInfo[1][i + 1]}</Text>
                    </View>
                    <View style={style_table.double_colon_column}>
                        <Text>:</Text>
                    </View>
                    <View style={style_table.double_value_column}>
                        <Text>{pdfPersoInfo[2][i + 1]}</Text>
                    </View>
                </View>
            </View>
        );
    }

    for (let i = 4; i < 6; i++) {
        pdf_pers_table.push(
            <View style={style_table.row}>
                <View
                    style={[
                        style_table.double_index_column,
                        style_table.single_index_column,
                    ]}
                >
                    {" "}
                    <Text>{pdfPersoInfo[0][i]}</Text>
                </View>
                <View
                    style={[
                        style_table.double_label_column,
                        style_table.pers_single_label_column,
                    ]}
                >
                    <Text>{pdfPersoInfo[1][i]}</Text>
                </View>
                <View
                    style={[
                        style_table.double_colon_column,
                        style_table.single_colon_column,
                    ]}
                >
                    <Text>:</Text>
                </View>
                <View
                    style={[
                        style_table.double_value_column,
                        style_table.single_value_column,
                    ]}
                >
                    <Text>{pdfPersoInfo[2][i]}</Text>
                </View>
            </View>
        );
    }

    for (let i = 6; i < 7; i++) {
        pdf_pers_table.push(
            <View style={style_table.row}>
                <View style={style_table.double_column}>
                    <View style={style_table.double_index_column}>
                        {" "}
                        <Text>{pdfPersoInfo[0][i]}</Text>
                    </View>
                    <View style={style_table.double_label_column}>
                        <Text>{pdfPersoInfo[1][i]}</Text>
                    </View>
                    <View style={style_table.double_colon_column}>
                        <Text>:</Text>
                    </View>
                    <View style={style_table.double_value_column}>
                        <Text>{pdfPersoInfo[2][i]}</Text>
                    </View>
                </View>
                <View style={style_table.double_column}>
                    <View style={style_table.double_index_column}>
                        {" "}
                        <Text>{pdfPersoInfo[0][i + 1]}</Text>
                    </View>
                    <View style={style_table.double_label_column}>
                        <Text>{pdfPersoInfo[1][i + 1]}</Text>
                    </View>
                    <View style={style_table.double_colon_column}>
                        <Text>:</Text>
                    </View>
                    <View style={style_table.double_value_column}>
                        <Text>{pdfPersoInfo[2][i + 1]}</Text>
                    </View>
                </View>
            </View>
        );
    }

    const pdfServInfo = [
        ["a)", "b)", "c)", "d)", "e)"],
        [
            "BUET ID No.",
            "Service Type",
            "Joining Date",
            "Total Service Period",
            "Retirement Date (Approx.)",
        ],
        [
            app_data["EMPLOYEE_ID"],
            app_data["APPOINTMENT_TYPE"],
            moment(new Date(app_data["DATE_FIRST_JOIN"])).format("DD MMM YYYY"),
            app_data["SERV_PERIOD"],
            moment(new Date(app_data["DATE_OF_RETIREMENT"])).format(
                "DD MMM YYYY"
            ),
        ],
    ];

    const pdf_serv_table = [];

    for (let i = 0; i < 3; i += 2) {
        pdf_serv_table.push(
            <View style={style_table.row}>
                <View style={style_table.double_column}>
                    <View style={style_table.double_index_column}>
                        <Text>{pdfServInfo[0][i]}</Text>
                    </View>
                    <View style={style_table.double_label_column}>
                        <Text>{pdfServInfo[1][i]}</Text>
                    </View>
                    <View style={style_table.double_colon_column}>
                        <Text>:</Text>
                    </View>
                    <View style={style_table.double_value_column}>
                        <Text>{pdfServInfo[2][i]}</Text>
                    </View>
                </View>
                <View style={style_table.double_column}>
                    <View style={style_table.double_index_column}>
                        <Text>{pdfServInfo[0][i + 1]}</Text>
                    </View>
                    <View style={style_table.double_label_column}>
                        <Text>{pdfServInfo[1][i + 1]}</Text>
                    </View>
                    <View style={style_table.double_colon_column}>
                        <Text>:</Text>
                    </View>
                    <View style={style_table.double_value_column}>
                        <Text>{pdfServInfo[2][i + 1]}</Text>
                    </View>
                </View>
            </View>
        );
    }

    for (let i = 4; i < 5; i++) {
        pdf_serv_table.push(
            <View style={style_table.row}>
                <View
                    style={[
                        style_table.double_index_column,
                        style_table.single_index_column,
                    ]}
                >
                    <Text>{pdfServInfo[0][i]}</Text>
                </View>
                <View style={[style_table.double_label_column]}>
                    <Text>{pdfServInfo[1][i]}</Text>
                </View>
                <View
                    style={[
                        style_table.double_colon_column,
                        style_table.single_colon_column,
                    ]}
                >
                    <Text>:</Text>
                </View>
                <View
                    style={[
                        style_table.double_value_column,
                        style_table.single_value_column,
                    ]}
                >
                    <Text>{pdfServInfo[2][i]}</Text>
                </View>
            </View>
        );
    }

    var pdfSalInfo = [
        [" ", "a", "b", "c", "d"],
        [
            "Month",
            "Basic Salary",
            "Total Salary",
            "Total Reduction",
            "Net Salary",
        ],
    ];

    pdfSalInfo = [...pdfSalInfo, ...app_data["PREV_MON_SAL"]];

    const pdf_sal_table = [];

    for (let i = 0; i < 1; i++) {
        pdf_sal_table.push(
            <View style={[style_table.row, style_table.row_border]}>
                <View
                    style={[
                        style_table.index_column,
                        style_table.border_column,
                    ]}
                >
                    <Text>{pdfSalInfo[0][i]}</Text>
                </View>
                <View
                    style={[
                        style_table.label_column,
                        style_table.border_column,
                    ]}
                >
                    <Text>{pdfSalInfo[1][i]}</Text>
                </View>
                <View
                    style={[
                        style_table.sal_value_column,
                        style_field.preBold,
                        style_table.border_column,
                    ]}
                >
                    <Text>{pdfSalInfo[2][i]}</Text>
                </View>
                <View
                    style={[
                        style_table.sal_value_column,
                        style_field.preBold,
                        style_table.border_column,
                    ]}
                >
                    <Text>{pdfSalInfo[3][i]}</Text>
                </View>
                <View
                    style={[style_table.sal_value_column, style_field.preBold]}
                >
                    <Text>{pdfSalInfo[4][i]}</Text>
                </View>
            </View>
        );
    }

    for (let i = 1; i < 4; i++) {
        pdf_sal_table.push(
            <View style={[style_table.row, style_table.row_border]}>
                <View
                    style={[
                        style_table.index_column,
                        style_table.border_column,
                    ]}
                >
                    <Text>{pdfSalInfo[0][i]}</Text>
                </View>
                <View
                    style={[
                        style_table.label_column,
                        style_table.border_column,
                    ]}
                >
                    <Text>{pdfSalInfo[1][i]}</Text>
                </View>
                <View
                    style={[
                        style_table.sal_value_column,
                        style_table.border_column,
                    ]}
                >
                    <Text>{nf.format(pdfSalInfo[2][i])}</Text>
                </View>
                <View
                    style={[
                        style_table.sal_value_column,
                        style_table.border_column,
                    ]}
                >
                    <Text>{nf.format(pdfSalInfo[3][i])}</Text>
                </View>
                <View style={[style_table.sal_value_column]}>
                    <Text>{nf.format(pdfSalInfo[4][i])}</Text>
                </View>
            </View>
        );
    }

    for (let i = 4; i < 5; i++) {
        pdf_sal_table.push(
            <View
                style={[
                    style_table.row,
                    style_table.row_border,
                    style_table.row_bot_border,
                ]}
            >
                <View
                    style={[
                        style_table.index_column,
                        style_table.border_column,
                    ]}
                >
                    <Text>{pdfSalInfo[0][i]}</Text>
                </View>
                <View
                    style={[
                        style_table.label_column,
                        style_table.border_column,
                    ]}
                >
                    <Text>{pdfSalInfo[1][i]}</Text>
                </View>
                <View
                    style={[
                        style_table.sal_value_column,
                        style_table.border_column,
                    ]}
                >
                    <Text>{nf.format(pdfSalInfo[2][i])}</Text>
                </View>
                <View
                    style={[
                        style_table.sal_value_column,
                        style_table.border_column,
                    ]}
                >
                    <Text>{nf.format(pdfSalInfo[3][i])}</Text>
                </View>
                <View style={[style_table.sal_value_column]}>
                    <Text>{nf.format(pdfSalInfo[4][i])}</Text>
                </View>
            </View>
        );
    }

    var pdfLoanInfo = [
        ["Serial No.", "01", "02", "03", "04", "05", "06", "07", "08"],
        [
            "Type of Loan",
            // "Vehicle Buying / House Building / Repairment / Land Buying",
            "House Building Loan",
            "Consumer Loan",
            "Laptop Loan",
            "Personal or Other or Any Purpose Loan under Sonali Bank Whole-Sale Loan",
            // "Vehicle Buying / House Building / Repairment / Land Buying under Sonali Bank Whole-Sale Loan",
            "House Building / Land Buying under Sonali Bank Whole-Sale Loan",
            "House Building Loan Taken under Banking System of Teacher/Officer/Staff of BUET",
            "Others",
            "Total",
        ],
        ["Amount of Loan"],
        ["Amount of Installment"],
        ["Total Number of Installment"],
        ["Paid Number of Installment"],
        ["Unpaid Amount of Loan (with Interest)"],
    ];

    for (let i = 0; i < 5; i++) {
        pdfLoanInfo[i + 2] = [
            ...pdfLoanInfo[i + 2],
            ...app_data["LOAN_DETAILS"][i],
        ];
    }

    const pdf_loan_table = [];
    const pdf_loan_table_2 = [];

    for (let i = 0; i < 1; i++) {
        pdf_loan_table.push(
            <View style={[style_table.row, style_table.row_border]}>
                <View
                    style={[
                        style_table.loan_index_column,
                        style_table.border_column,
                    ]}
                >
                    <Text>{pdfLoanInfo[0][i]}</Text>
                </View>
                <View
                    style={[
                        style_table.label_column,
                        style_table.border_column,
                    ]}
                >
                    <Text>{pdfLoanInfo[1][i]}</Text>
                </View>
                <View
                    style={[
                        style_table.loan_value_column,
                        style_table.border_column,
                        style_field.preBold,
                    ]}
                >
                    <Text>{pdfLoanInfo[2][i]}</Text>
                </View>
                <View
                    style={[
                        style_table.loan_value_column,
                        style_table.border_column,
                        style_field.preBold,
                    ]}
                >
                    <Text>{pdfLoanInfo[3][i]}</Text>
                </View>
                <View
                    style={[
                        style_table.loan_value_column,
                        style_table.border_column,
                        style_field.preBold,
                    ]}
                >
                    <Text>{pdfLoanInfo[4][i]}</Text>
                </View>
                <View
                    style={[
                        style_table.loan_value_column,
                        style_table.border_column,
                        style_field.preBold,
                    ]}
                >
                    <Text>{pdfLoanInfo[5][i]}</Text>
                </View>
                <View
                    style={[style_table.loan_value_column, style_field.preBold]}
                >
                    <Text>{pdfLoanInfo[6][i]}</Text>
                </View>
            </View>
        );
    }

    for (let i = 1; i < 5; i++) {
        pdf_loan_table.push(
            <View style={[style_table.row, style_table.row_border]}>
                <View
                    style={[
                        style_table.loan_index_column,
                        style_table.border_column,
                    ]}
                >
                    <Text>{nf.format(pdfLoanInfo[0][i])}</Text>
                </View>
                <View
                    style={[
                        style_table.label_column,
                        style_table.border_column,
                    ]}
                >
                    <Text>{pdfLoanInfo[1][i]}</Text>
                </View>
                <View
                    style={[
                        style_table.loan_value_column,
                        style_table.border_column,
                    ]}
                >
                    <Text>{nf.format(pdfLoanInfo[2][i])}</Text>
                </View>
                <View
                    style={[
                        style_table.loan_value_column,
                        style_table.border_column,
                    ]}
                >
                    <Text>{nf.format(pdfLoanInfo[3][i])}</Text>
                </View>
                <View
                    style={[
                        style_table.loan_value_column,
                        style_table.border_column,
                    ]}
                >
                    <Text>{nf.format(pdfLoanInfo[4][i])}</Text>
                </View>
                <View
                    style={[
                        style_table.loan_value_column,
                        style_table.border_column,
                    ]}
                >
                    <Text>{nf.format(pdfLoanInfo[5][i])}</Text>
                </View>
                <View style={[style_table.loan_value_column]}>
                    <Text>{nf.format(pdfLoanInfo[6][i])}</Text>
                </View>
            </View>
        );
    }

    for (let i = 5; i < 6; i++) {
        pdf_loan_table.push(
            <View
                style={[
                    style_table.row,
                    style_table.row_border,
                    style_table.row_bot_border,
                ]}
            >
                <View
                    style={[
                        style_table.loan_index_column,
                        style_table.border_column,
                    ]}
                >
                    <Text>{nf.format(pdfLoanInfo[0][i])}</Text>
                </View>
                <View
                    style={[
                        style_table.label_column,
                        style_table.border_column,
                    ]}
                >
                    <Text>{pdfLoanInfo[1][i]}</Text>
                </View>
                <View
                    style={[
                        style_table.loan_value_column,
                        style_table.border_column,
                    ]}
                >
                    <Text>{nf.format(pdfLoanInfo[2][i])}</Text>
                </View>
                <View
                    style={[
                        style_table.loan_value_column,
                        style_table.border_column,
                    ]}
                >
                    <Text>{nf.format(pdfLoanInfo[3][i])}</Text>
                </View>
                <View
                    style={[
                        style_table.loan_value_column,
                        style_table.border_column,
                    ]}
                >
                    <Text>{nf.format(pdfLoanInfo[4][i])}</Text>
                </View>
                <View
                    style={[
                        style_table.loan_value_column,
                        style_table.border_column,
                    ]}
                >
                    <Text>{nf.format(pdfLoanInfo[5][i])}</Text>
                </View>
                <View style={[style_table.loan_value_column]}>
                    <Text>{nf.format(pdfLoanInfo[6][i])}</Text>
                </View>
            </View>
        );
    }

    for (let i = 0; i < 1; i++) {
        pdf_loan_table_2.push(
            <View style={[style_table.row, style_table.row_border]}>
                <View
                    style={[
                        style_table.loan_index_column,
                        style_table.border_column,
                    ]}
                >
                    <Text>{pdfLoanInfo[0][i]}</Text>
                </View>
                <View
                    style={[
                        style_table.label_column,
                        style_table.border_column,
                    ]}
                >
                    <Text>{pdfLoanInfo[1][i]}</Text>
                </View>
                <View
                    style={[
                        style_table.loan_value_column,
                        style_table.border_column,
                        style_field.preBold,
                    ]}
                >
                    <Text>{pdfLoanInfo[2][i]}</Text>
                </View>
                <View
                    style={[
                        style_table.loan_value_column,
                        style_table.border_column,
                        style_field.preBold,
                    ]}
                >
                    <Text>{pdfLoanInfo[3][i]}</Text>
                </View>
                <View
                    style={[
                        style_table.loan_value_column,
                        style_table.border_column,
                        style_field.preBold,
                    ]}
                >
                    <Text>{pdfLoanInfo[4][i]}</Text>
                </View>
                <View
                    style={[
                        style_table.loan_value_column,
                        style_table.border_column,
                        style_field.preBold,
                    ]}
                >
                    <Text>{pdfLoanInfo[5][i]}</Text>
                </View>
                <View
                    style={[style_table.loan_value_column, style_field.preBold]}
                >
                    <Text>{pdfLoanInfo[6][i]}</Text>
                </View>
            </View>
        );
    }

    for (let i = 6; i < 8; i++) {
        pdf_loan_table_2.push(
            <View style={[style_table.row, style_table.row_border]}>
                <View
                    style={[
                        style_table.loan_index_column,
                        style_table.border_column,
                    ]}
                >
                    <Text>{nf.format(pdfLoanInfo[0][i])}</Text>
                </View>
                <View
                    style={[
                        style_table.label_column,
                        style_table.border_column,
                    ]}
                >
                    <Text>{pdfLoanInfo[1][i]}</Text>
                </View>
                <View
                    style={[
                        style_table.loan_value_column,
                        style_table.border_column,
                    ]}
                >
                    <Text>{nf.format(pdfLoanInfo[2][i])}</Text>
                </View>
                <View
                    style={[
                        style_table.loan_value_column,
                        style_table.border_column,
                    ]}
                >
                    <Text>{nf.format(pdfLoanInfo[3][i])}</Text>
                </View>
                <View
                    style={[
                        style_table.loan_value_column,
                        style_table.border_column,
                    ]}
                >
                    <Text>{nf.format(pdfLoanInfo[4][i])}</Text>
                </View>
                <View
                    style={[
                        style_table.loan_value_column,
                        style_table.border_column,
                    ]}
                >
                    <Text>{nf.format(pdfLoanInfo[5][i])}</Text>
                </View>
                <View style={[style_table.loan_value_column]}>
                    <Text>{nf.format(pdfLoanInfo[6][i])}</Text>
                </View>
            </View>
        );
    }

    for (let i = 8; i < 9; i++) {
        pdf_loan_table_2.push(
            <View
                style={[
                    style_table.row,
                    style_table.row_border,
                    style_table.row_bot_border,
                ]}
            >
                <View
                    style={[
                        style_table.loan_index_column,
                        style_table.border_column,
                    ]}
                >
                    <Text>{nf.format(pdfLoanInfo[0][i])}</Text>
                </View>
                <View
                    style={[
                        style_table.label_column,
                        style_table.border_column,
                    ]}
                >
                    <Text>{pdfLoanInfo[1][i]}</Text>
                </View>
                <View
                    style={[
                        style_table.loan_value_column,
                        style_table.border_column,
                    ]}
                >
                    <Text>{nf.format(pdfLoanInfo[2][i])}</Text>
                </View>
                <View
                    style={[
                        style_table.loan_value_column,
                        style_table.border_column,
                    ]}
                >
                    <Text>{nf.format(pdfLoanInfo[3][i])}</Text>
                </View>
                <View
                    style={[
                        style_table.loan_value_column,
                        style_table.border_column,
                    ]}
                >
                    <Text>{nf.format(pdfLoanInfo[4][i])}</Text>
                </View>
                <View
                    style={[
                        style_table.loan_value_column,
                        style_table.border_column,
                    ]}
                >
                    <Text>{nf.format(pdfLoanInfo[5][i])}</Text>
                </View>
                <View style={[style_table.loan_value_column]}>
                    <Text>{nf.format(pdfLoanInfo[6][i])}</Text>
                </View>
            </View>
        );
    }

    const MyDoc = (
        <Document>
            <Page size="A4" style={{ marginTop: "10pt" }}>
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
                            Comptroller Office
                        </Text>

                        <Text style={styles.pageLabel}>
                            Application for {app_data["LOAN_TYPE"]}
                        </Text>
                    </View>
                </View>

                <View style={style_field.firstField}>
                    <View style={style_data.preData}>
                        <Text
                            style={[
                                style_data.preDataOther,
                                style_field.preBold,
                            ]}
                        >
                            Loan Application ID
                        </Text>
                        <Text style={style_data.preDataColon}>:</Text>
                        <Text style={style_data.preDataOther}>
                            {app_data["LOAN_ID"]}
                        </Text>
                    </View>

                    <View style={style_data.preData}>
                        <Text
                            style={[
                                style_data.preDataOther,
                                style_field.preBold,
                            ]}
                        >
                            Date
                        </Text>
                        <Text style={style_data.preDataColon}>:</Text>
                        <Text style={style_data.preDataOther}>
                            {moment(new Date(app_data["LOAN_APP_DATE"])).format(
                                "DD MMM YYYY"
                            )}
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
                                label="4. Account No."
                                name={app_data["BANK_ACCOUNT_NO"]}
                            />

                            <PreviewData
                                label="5. Type of Loan"
                                name={app_data["LOAN_TYPE"]}
                            />

                            <PreviewData
                                label="6. Amount of Loan"
                                name={
                                    nf.format(app_data["LOAN_AMNT"]) +
                                    " ( " +
                                    InWords(app_data["LOAN_AMNT"]) +
                                    ")"
                                }
                            />

                            <PreviewData
                                label="7. Reason for Loan"
                                name={app_data["REASON_FOR_LOAN"]}
                            />
                        </View>
                        <View style={style_pic.preProPic}>
                            <Text style={style_pic.preProPicImg}>
                                Attach Passport Size Image
                            </Text>
                        </View>
                    </View>

                    <View style={style_field.preOtherField}>
                        <Text style={style_field.preOtherFieldLabel}>
                            8. Personal Information :
                        </Text>

                        <View style={style_table.table}>{pdf_pers_table}</View>
                    </View>

                    <View style={style_field.preOtherField}>
                        <Text style={style_field.preOtherFieldLabel}>
                            9. Applicant's Service Realated Information :
                        </Text>

                        <View style={style_table.table}>{pdf_serv_table}</View>
                    </View>

                    <View style={style_field.preOtherField}>
                        <Text style={style_field.preOtherFieldLabel}>
                            10. Salary Releted Information (Last Three Months) :
                        </Text>

                        <View style={style_table.table}>{pdf_sal_table}</View>
                    </View>

                    <View style={style_field.preOtherField}>
                        <Text style={style_field.preOtherFieldLabel}>
                            11. Information about Loan Taken from University and
                            Sonali Bank (Attested by Comptroller Office) :
                        </Text>

                        <View style={style_table.table}>{pdf_loan_table}</View>
                    </View>
                </View>
            </Page>

            <Page size="A4" style={{ marginTop: "30pt" }}>
                <View style={style_field.allField}>
                    <View style={style_field.preOtherField}>
                        <View style={style_table.table}>
                            {pdf_loan_table_2}
                        </View>
                    </View>

                    <View style={style_field.preOtherField}>
                        <Text style={style_field.preOtherFieldLabel}>
                            12. Approximate Receivable from University (To be by
                            Comptroller Office) :
                        </Text>

                        <View style={style_table.table}>
                            <View
                                style={[
                                    style_table.row,
                                    style_table.row_border,
                                ]}
                            >
                                <View
                                    style={[
                                        style_table.loan_index_column,
                                        style_table.border_column,
                                    ]}
                                >
                                    <Text>a</Text>
                                </View>
                                <View
                                    style={[
                                        style_table.last_column,
                                        style_table.border_column,
                                    ]}
                                >
                                    <Text>Net Pension (One-off)</Text>
                                </View>
                                <View style={[style_table.last_column]}>
                                    <Text> </Text>
                                </View>
                            </View>

                            <View
                                style={[
                                    style_table.row,
                                    style_table.row_border,
                                    style_table.row_bot_border,
                                ]}
                            >
                                <View
                                    style={[
                                        style_table.loan_index_column,
                                        style_table.border_column,
                                    ]}
                                >
                                    <Text>b</Text>
                                </View>
                                <View
                                    style={[
                                        style_table.last_column,
                                        style_table.border_column,
                                    ]}
                                >
                                    <Text></Text>
                                </View>
                                <View style={[style_table.last_column]}>
                                    <Text> </Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={style_field.preOtherField}>
                        <Text style={style_field.preOtherFieldText}>
                            I warrant that the above information is completely
                            true and correct and I will be obliged to pay the
                            loan installments accepted as per the rules.
                        </Text>
                        <Text style={style_field.preOtherFieldText}>
                            Otherwise there is no objection to bear the
                            responsibility prescribed by the authority. If any
                            information or documents provided are proved to be
                            incorrect after taking the loan, then I will be
                            bound to accept any decision of the university
                            without any objection.
                        </Text>
                    </View>

                    <View style={style_pic.preSignPic}>
                        <Text style={style_pic.preSignPicText}>
                            ---------------------------------
                        </Text>
                        <Text style={style_pic.preSignPicText}>
                            {" "}
                            Applicant Signature
                        </Text>
                        <Text style={style_pic.preSignPicText}> with Date</Text>
                    </View>

                    <View style={style_field.preOtherField}>
                        <Text style={style_field.preOtherFieldLabel}>
                            Sign after selecting applicable field
                        </Text>

                        <View style={style_field.preOtherFieldR}>
                            <Image
                                style={style_field.preOtherFieldImg}
                                src={checkBox_image}
                            />

                            <Text style={style_field.preOtherFieldText}>
                                It is recommended to give Consumer Loan, Vehicle
                                Buying/House Building/Repair/Land Buying and
                                Personal or other or any purpose loan under
                                Sonali Bank Wholesale loan and House Building
                                Loan, House Buying, Building, Repair, Land
                                Buying loan on availability.
                            </Text>
                        </View>

                        <View style={style_field.preOtherFieldR}>
                            <Image
                                style={style_field.preOtherFieldImg}
                                src={checkBox_image}
                            />

                            <Text style={style_field.preOtherFieldText}>
                                It is certified that applicant can directly use
                                laptop in educational activities and is
                                recommended to give on availability.
                            </Text>
                        </View>
                    </View>

                    <View style={style_pic.preSignPic}>
                        <View style={{ marginTop: "20pt" }}></View>
                        <Text style={style_pic.preSignPicText}>
                            ------------------------------
                        </Text>
                        <Text style={style_pic.preSignPicText}>
                            Head of Office / Dept.
                        </Text>
                        <Text style={style_pic.preSignPicText}>
                            (Seal and Signature)
                        </Text>
                    </View>

                    <View style={style_pic.preSignPic}>
                        <Text
                            style={[
                                style_field.preOtherFieldText,
                                style_field.preBold,
                            ]}
                        >
                            It is certified that documents provided by applicant
                            is correct.
                        </Text>
                    </View>

                    <View style={style_pic.preSignPic}>
                        <View style={{ marginTop: "20pt" }}></View>
                        <Text style={style_pic.preSignPicText}>
                            ------------------------------
                        </Text>
                        <Text style={style_pic.preSignPicText}>
                            Deputy Director
                        </Text>
                        <Text style={style_pic.preSignPicText}>
                            (Salary Section)
                        </Text>
                    </View>

                    <View style={{ marginTop: "20pt" }}></View>
                    <View style={style_field.preSigField}>
                        <View style={style_field.preSigFieldBox}>
                            <Text style={style_pic.preSignPicText}>
                                ------------------------------
                            </Text>
                            <Text style={style_pic.preSignPicText}>
                                Accountant
                            </Text>
                            <Text style={style_pic.preSignPicText}>
                                (Fund Section)
                            </Text>
                        </View>

                        <View style={style_field.preSigFieldBox}>
                            <Text style={style_pic.preSignPicText}>
                                ------------------------------
                            </Text>
                            <Text style={style_pic.preSignPicText}>
                                Accounts Officer
                            </Text>
                            <Text style={style_pic.preSignPicText}>
                                (Fund Section)
                            </Text>
                        </View>

                        <View style={style_field.preSigFieldBox}>
                            <Text style={style_pic.preSignPicText}>
                                ------------------------------
                            </Text>
                            <Text style={style_pic.preSignPicText}>
                                Deputy Director
                            </Text>

                            <Text style={style_pic.preSignPicText}>
                                (Fund Section)
                            </Text>
                        </View>

                        <View style={style_field.preSigFieldBox}>
                            <Text style={style_pic.preSignPicText}>
                                ------------------------------
                            </Text>
                            <Text style={style_pic.preSignPicText}>
                                Deputy Comptroller
                            </Text>
                        </View>

                        <View style={style_field.preSigFieldBox}>
                            <Text style={style_pic.preSignPicText}>
                                ------------------------------
                            </Text>
                            <Text style={style_pic.preSignPicText}>
                                Comptroller
                            </Text>
                        </View>
                    </View>
                </View>
            </Page>
        </Document>
    );

    const onClickEdit = async (e) => {
        e.preventDefault();
        applicationNavigate("/application/1", {
            state: { info: app_data, used: "yes" },
        });
    };

    const downloadURI = (url, name) => {
        const link = document.createElement("a");
        link.href = url;
        link.download = name;
        link.click();
    };

    const onClickSubmit = async () => {
        if (!url) {
            return;
        }

        downloadURI(url, "application.pdf");

        try {
            await axios.post(
                "http://" + backend_site_address + "/loan_register",
                app_data
            );
            // applicationNavigate("/");
            applicationNavigate("/employeedash", {
                state: {
                    info: app_data,
                },
            });
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <>
            {/* <PDFViewer style={styles.viewer}>
                <MyDoc />
            </PDFViewer> */}

            <BlobProvider document={MyDoc}>
                {({ blob, url, loading, error }) => {
                    setURL(url);
                }}
            </BlobProvider>

            <div style={style_butt.app_button}>
                <div
                    style={style_butt.backward_butt}
                    onClick={onClickEdit}
                    onMouseEnter={() => setBack_hover(true)}
                    onMouseLeave={() => setBack_hover(false)}
                >
                    Edit
                </div>

                <div
                    style={style_butt.download_butt}
                    onClick={onClickSubmit}
                    onMouseEnter={() => setDown_hover(true)}
                    onMouseLeave={() => setDown_hover(false)}
                >
                    Submit
                </div>
            </div>
        </>
    );
}
