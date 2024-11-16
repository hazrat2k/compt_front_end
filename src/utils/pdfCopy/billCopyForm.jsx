import React, { useEffect, useState } from "react";
import axios from "axios";
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
import { secondary } from "../../stores/const/colors";

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
        textAlign: "center",
        fontFamily: "English",
        fontSize: "12pt",
        fontWeight: "bold",
        marginBottom: "2pt",
        color: "black",
        marginTop: "2pt",
    },
});

const style_logo = StyleSheet.create({
    logo: {
        marginTop: "5pt",
        display: "flex",
        flexDirection: "row",
        padding: "10pt 10pt 0pt 10pt",
        alignSelf: "center",
        alignItems: "start",
    },

    logo_img: {
        float: "center",
    },

    l_img: {
        height: "35pt",
        width: "35pt",
    },

    logo_text: {
        color: "crimson",
        marginLeft: "1%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },

    logo_text_1: {
        fontSize: "10pt",
        fontWeight: "bold",
        fontFamily: "English Bold",
    },

    logo_text_2: {
        fontSize: "10pt",
        fontFamily: "English",
        textAlign: "center",
    },
});

const style_bc = StyleSheet.create({
    bc_table: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        fontFamily: "English",
    },

    bc_table_row: {
        display: "flex",
        flexDirection: "row",
        padding: "2.5pt 5pt",
        gap: "2.5pt",
        borderTop: "1px solid black",
    },

    bc_bold: {
        fontFamily: "English Bold",
    },

    bc_table_col: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "1pt",
    },

    large_col: {
        width: "6%",
    },

    small_col: {
        width: "5%",
    },

    s_large_col: {
        width: "9%",
    },

    s_small_col: {
        width: "5.5%",
    },

    sl_col: {
        width: "3%",
    },

    loan_id_col: {
        width: "8%",
    },

    bc_table_cell: {
        fontSize: "8pt",
        textAlign: "center",
    },

    s_table_cell: {
        fontSize: "9pt",
        textAlign: "center",
    },

    bc_in_words: {
        display: "flex",
        flexDirection: "row",
        padding: "3pt 20pt",
        fontFamily: "English",
    },

    bc_jus: {
        justifyContent: "space-evenly",
    },

    bc_in_words_c: {
        display: "flex",
        flexDirection: "column",
        padding: "3pt 20pt",
        fontFamily: "English",
    },

    bc_text: {
        fontFamily: "English",
        textTransform: "uppercase",
        fontSize: "9pt",
        marginLeft: "2pt",
        marginRight: "2pt",
        color: "black",
    },

    bc_text_2: {
        fontFamily: "English",
        fontSize: "9pt",
        marginLeft: "2pt",
        marginRight: "2pt",
    },

    no_billing_loan: {
        textAlign: "center",
        color: "gray",
        fontSize: "15pt",
        marginBottom: "2%",
        fontFamily: "English",
    },
});

const style_sig = StyleSheet.create({
    all_sig: {
        display: "flex",
        flexDirection: "column",
        fontFamily: "English",
    },

    sig_label: {
        fontSize: "10pt",
        fontFamily: "English Bold",
        textAlign: "center",
        textDecoration: "underline",
        marginBottom: "5pt",
    },

    sig_area: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        padding: "5pt 10pt",
        marginTop: "25pt",
    },

    sig_box: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "2.5pt 5pt",
        fontFamily: "English",
    },

    sig_lc_field: {
        fontSize: "6pt",
        textAlign: "center",
    },

    sig_field: {
        fontSize: "9pt",
        textAlign: "center",
    },
});

export default function BillCopyForm(props) {
    const sel_cat = props.category;

    const bcf_loan_type = props.loan_type;

    const bcf_selected_loan = props.billedLoan;

    const bcf_sentFrom = props.sentFrom;

    const bcf_sanc_status = bcf_sentFrom == "acct_fund" ? "BILL" : "BILLED";

    const [bc_sanc_loan_data, setBc_sanc_loan_data] = useState([]);
    const bc_sanc_loan_display = useState([]);
    const s_sanc_loan_display = useState([]);

    const [bcUrl, setBcUrl] = useState("");
    const [sbcUrl, setSbcUrl] = useState("");

    const [laf_hover, setLaf_hover] = useState(false);

    const style_butt = StyleSheet.create({
        download_butt: {
            width: laf_hover ? "250pt" : "220pt",
            height: "auto",
            fontFamily: "PT Serif",
            fontWeight: "bold",
            padding: "5pt 15pt 5pt 15pt",
            alignSelf: "center",
            textAlign: "center",
            border: "2px solid " + laf_hover ? "white" : secondary,
            borderRadius: "20pt",
            backgroundColor: laf_hover ? secondary : "white",
            color: laf_hover ? "white" : secondary,
            fontSize: laf_hover ? "20pt" : "15pt",
            cursor: laf_hover ? "pointer" : "default",
            marginBottom: "10pt",
            transition: "all ease 0.3s",
        },
        alert_message: {
            textAlign: "center",
            color: "gray",
            fontSize: "20pt",
        },
    });

    var a = [
        "",
        "one ",
        "two ",
        "three ",
        "four ",
        "five ",
        "six ",
        "seven ",
        "eight ",
        "nine ",
        "ten ",
        "eleven ",
        "twelve ",
        "thirteen ",
        "fourteen ",
        "fifteen ",
        "sixteen ",
        "seventeen ",
        "eighteen ",
        "nineteen ",
    ];
    var b = [
        "",
        "",
        "twenty",
        "thirty",
        "forty",
        "fifty",
        "sixty",
        "seventy",
        "eighty",
        "ninety",
    ];

    const inWords = (num) => {
        if ((num = num.toString()).length > 9) return "overflow";
        var n = ("000000000" + num)
            .substr(-9)
            .match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
        if (!n) return;
        var str = "";
        str +=
            n[1] != 0
                ? (a[Number(n[1])] || b[n[1][0]] + " " + a[n[1][1]]) + "crore "
                : "";
        str +=
            n[2] != 0
                ? (a[Number(n[2])] || b[n[2][0]] + " " + a[n[2][1]]) + "lakh "
                : "";
        str +=
            n[3] != 0
                ? (a[Number(n[3])] || b[n[3][0]] + " " + a[n[3][1]]) +
                  "thousand "
                : "";
        str +=
            n[4] != 0
                ? (a[Number(n[4])] || b[n[4][0]] + " " + a[n[4][1]]) +
                  "hundred "
                : "";
        str +=
            n[5] != 0
                ? (str != "" ? "and " : "") +
                  (a[Number(n[5])] || b[n[5][0]] + " " + a[n[5][1]])
                : "";
        return str;
    };

    useEffect(() => {
        const fetch_sanction_loan_data = async () => {
            const uploadLoanType = {
                LOAN_TYPE: bcf_loan_type,
                SANC_STATUS: bcf_sanc_status,
            };

            try {
                const sanc_res = await axios.post(
                    "http://localhost:8800/sanction_loan",
                    uploadLoanType
                );
                setBc_sanc_loan_data(sanc_res.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetch_sanction_loan_data();
    }, []);

    const bc_table_col = (value, cn, bold) => {
        return (
            <View
                style={[
                    style_bc.bc_table_col,
                    cn == "small_col" ? style_bc.small_col : style_bc.large_col,
                ]}
            >
                <Text
                    style={[
                        style_bc.bc_table_cell,
                        bold == "bcf_bold" ? style_bc.bc_bold : "",
                    ]}
                >
                    {value}
                </Text>
            </View>
        );
    };

    const s_table_col = (value, cn, bold) => {
        return (
            <View
                style={[
                    style_bc.bc_table_col,
                    cn == "small_col"
                        ? style_bc.s_small_col
                        : style_bc.s_large_col,
                ]}
            >
                <Text
                    style={[
                        style_bc.s_table_cell,
                        bold == "bcf_bold" ? style_bc.bc_bold : "",
                    ]}
                >
                    {value}
                </Text>
            </View>
        );
    };

    const bc_sig = (designation) => {
        return (
            <View style={style_sig.sig_box}>
                <Text style={style_sig.sig_field}>
                    --------------------------------------
                </Text>

                <Text style={style_sig.sig_field}>{designation}</Text>
            </View>
        );
    };

    let nf = new Intl.NumberFormat("en-US");

    var count = 0;
    var sanction_total = 0;

    for (let i = 0; i < bc_sanc_loan_data.length; i++) {
        if (
            bcf_selected_loan[bc_sanc_loan_data[i]["LOAN_ID"]] &&
            bc_sanc_loan_data[i]["SANC_STATUS"] == "BILL" &&
            bc_sanc_loan_data[i]["CATEGORY"] == sel_cat
        ) {
            bc_sanc_loan_display.push(
                <View style={style_bc.bc_table_row}>
                    <View style={[style_bc.bc_table_col, style_bc.sl_col]}>
                        <Text style={style_bc.bc_table_cell}>{++count}</Text>
                    </View>
                    <View style={[style_bc.bc_table_col, style_bc.loan_id_col]}>
                        <Text style={style_bc.bc_table_cell}>
                            {bc_sanc_loan_data[i]["LOAN_ID"]}
                        </Text>
                    </View>
                    {bc_table_col(
                        bc_sanc_loan_data[i]["EMPLOYEE_NAME"],
                        "large_col"
                    )}
                    {bc_table_col(
                        bc_sanc_loan_data[i]["DESIGNATION"],
                        "large_col"
                    )}
                    {bc_table_col(bc_sanc_loan_data[i]["OFFICE"], "small_col")}
                    {bc_table_col(
                        bc_sanc_loan_data[i]["DATE_OF_BIRTH"],
                        "small_col"
                    )}
                    {bc_table_col(
                        bc_sanc_loan_data[i]["DATE_FIRST_JOIN"],
                        "small_col"
                    )}
                    {bc_table_col(
                        nf.format(bc_sanc_loan_data[i]["NET_PAY"]),
                        "small_col"
                    )}
                    {bc_table_col(
                        nf.format(bc_sanc_loan_data[i]["APPLY_AMOUNT"]),
                        "small_col"
                    )}
                    {bc_table_col(
                        nf.format(bc_sanc_loan_data[i]["ALLOW_AMOUNT"]),
                        "small_col"
                    )}
                    <View style={[style_bc.bc_table_col, style_bc.large_col]}>
                        <Text style={style_bc.bc_table_cell}>
                            {nf.format(bc_sanc_loan_data[i]["SANCTION_AMOUNT"])}
                        </Text>
                    </View>
                    {bc_table_col(
                        nf.format(bc_sanc_loan_data[i]["RECOVERY_AMOUNT"]),
                        "large_col"
                    )}
                    {bc_table_col(
                        bc_sanc_loan_data[i]["INSTALL_NO"],
                        "small_col"
                    )}
                    {bc_table_col(
                        nf.format(bc_sanc_loan_data[i]["INSTALL_AMOUNT"]),
                        "small_col"
                    )}
                    {bc_table_col(" ", "small_col")}
                    {bc_table_col(
                        nf.format(bc_sanc_loan_data[i]["SANCTION_AMOUNT"]),
                        "small_col",
                        "bcf_bold"
                    )}
                    {bc_table_col(10, "small_col")}
                    {bc_table_col(
                        nf.format(bc_sanc_loan_data[i]["SANCTION_AMOUNT"] - 10),
                        "small_col",
                        "bcf_bold"
                    )}
                </View>
            );

            s_sanc_loan_display.push(
                <View style={style_bc.bc_table_row}>
                    {s_table_col(count, "small_col")}
                    {s_table_col(
                        bc_sanc_loan_data[i]["EMPLOYEEID"],
                        "small_col"
                    )}
                    {s_table_col(
                        bc_sanc_loan_data[i]["EMPLOYEE_ID"],
                        "large_col"
                    )}
                    {s_table_col(bc_sanc_loan_data[i]["LOAN_ID"], "large_col")}
                    {s_table_col(
                        bc_sanc_loan_data[i]["EMPLOYEE_NAME"],
                        "large_col"
                    )}
                    {s_table_col(
                        bc_sanc_loan_data[i]["DESIGNATION"],
                        "large_col"
                    )}
                    {s_table_col(bc_sanc_loan_data[i]["OFFICE"], "small_col")}
                    {s_table_col(
                        bc_sanc_loan_data[i]["DATE_OF_BIRTH"],
                        "large_col"
                    )}
                    {s_table_col(
                        bc_sanc_loan_data[i]["DATE_FIRST_JOIN"],
                        "large_col"
                    )}
                    {s_table_col(
                        nf.format(bc_sanc_loan_data[i]["SANCTION_AMOUNT"]),
                        "large_col",
                        "bcf_bold"
                    )}
                    {s_table_col(
                        bc_sanc_loan_data[i]["INSTALL_NO"],
                        "small_col"
                    )}
                    {s_table_col(
                        nf.format(bc_sanc_loan_data[i]["INSTALL_AMOUNT"]),
                        "small_col"
                    )}
                    {s_table_col(
                        nf.format(bc_sanc_loan_data[i]["RECOVERY_AMOUNT"]),
                        "large_col"
                    )}
                </View>
            );

            sanction_total += Number(bc_sanc_loan_data[i]["SANCTION_AMOUNT"]);
        }
    }

    bc_sanc_loan_display.push(
        <View style={style_bc.bc_table_row}>
            {bc_table_col(" ", "small_col")}
            {bc_table_col(" ", "large_col")}
            {bc_table_col(" ", "large_col")}
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
            {bc_table_col("TOTAL", "small_col", "bcf_bold")}
            <View
                style={[
                    style_bc.bc_table_col,
                    style_bc.large_col,
                    style_bc.bc_bold,
                ]}
            >
                <Text style={style_bc.bc_table_cell}>
                    {nf.format(sanction_total)}
                </Text>
            </View>
            {bc_table_col(" ", "small_col")}
            <View
                style={[
                    style_bc.bc_table_col,
                    style_bc.large_col,
                    style_bc.bc_bold,
                ]}
            >
                <Text style={style_bc.bc_table_cell}>
                    {nf.format(sanction_total - count * 10)}
                </Text>
            </View>
        </View>
    );

    s_sanc_loan_display.push(
        <View style={[style_bc.bc_table_row, style_bc.bc_bold]}>
            {s_table_col("", "large_col")}
            {s_table_col("", "large_col")}
            {s_table_col("", "large_col")}
            {s_table_col("", "large_col")}
            {s_table_col("", "large_col")}
            {s_table_col("", "large_col")}
            {s_table_col("", "large_col")}
            {s_table_col("TOTAL", "small_col")}
            {s_table_col(nf.format(sanction_total), "large_col")}
        </View>
    );

    const MyBillForm = (
        <Document>
            <Page
                size="A4"
                orientation="landscape"
                style={{ paddingLeft: "5pt", paddingRight: "5pt" }}
            >
                <View style={{ marginTop: "10pt" }}></View>

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
                        <Text style={[styles.pageLabel, style_bc.bc_bold]}>
                            {bcf_loan_type} BILL COPY
                        </Text>

                        <Text style={style_bc.bc_text}>
                            CATEGORY : {sel_cat}
                        </Text>

                        <Text style={style_bc.bc_text}>
                            SANCTIONED BY PRO-VICE CHANCELLOR
                        </Text>
                    </View>
                </View>

                <View style={[style_bc.bc_in_words, style_bc.bc_jus]}>
                    <Text style={[style_bc.bc_text, style_bc.bc_bold]}>
                        Bill No. : _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
                    </Text>

                    <Text style={[style_bc.bc_text, style_bc.bc_bold]}>
                        Contract No. : _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
                    </Text>

                    <Text style={[style_bc.bc_text, style_bc.bc_bold]}>
                        Date : _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
                    </Text>
                </View>

                {sel_cat == "null" ? (
                    <Text style={style_bc.no_billing_loan}>
                        Select a Category to bill
                    </Text>
                ) : (
                    <View>
                        <View style={style_bc.bc_table}>
                            <View
                                style={[
                                    style_bc.bc_table_row,
                                    style_bc.bc_bold,
                                ]}
                            >
                                <View
                                    style={[
                                        style_bc.bc_table_col,
                                        style_bc.sl_col,
                                    ]}
                                >
                                    <Text style={style_bc.bc_table_cell}>
                                        SL NO
                                    </Text>
                                </View>
                                <View
                                    style={[
                                        style_bc.bc_table_col,
                                        style_bc.loan_id_col,
                                    ]}
                                >
                                    <Text style={style_bc.bc_table_cell}>
                                        LOAN ID
                                    </Text>
                                </View>
                                {bc_table_col("NAME", "large_col")}
                                {bc_table_col("DESIGNATION", "large_col")}
                                {bc_table_col("OFFICE/ DEPT.", "small_col")}
                                {sel_cat == "ALL"
                                    ? bc_table_col("CATEGORY", "small_col")
                                    : ""}
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
                            </View>

                            {bc_sanc_loan_display}
                        </View>

                        <View style={style_bc.bc_in_words}>
                            <Text style={style_bc.bc_text_2}>In Words :</Text>
                            <Text style={[style_bc.bc_text, style_bc.bc_bold]}>
                                {inWords(sanction_total - count * 10)}
                            </Text>

                            <Text style={style_bc.bc_text_2}>TK. Only</Text>
                        </View>

                        <View style={style_bc.bc_in_words}>
                            <Text style={style_bc.bc_text_2}>
                                Pay Amount of Tk.
                            </Text>
                            <Text
                                style={[style_bc.bc_text_2, style_bc.bc_bold]}
                            >
                                {nf.format(sanction_total - count * 10)}
                            </Text>

                            <Text style={style_bc.bc_text_2}>
                                only as House Building Loan to the above
                                mentioned person(s).
                            </Text>
                        </View>
                    </View>
                )}

                <View style={style_sig.all_sig}>
                    <View style={style_sig.sig_area}>
                        {bc_sig("ASS. ACCT./ACC./S.O.")}
                        {bc_sig("A.D.")}
                        {bc_sig("SR A.D.")}
                        {bc_sig("D.C.")}
                        {bc_sig("COMPTROLLER")}
                    </View>
                </View>

                <View style={style_bc.bc_in_words_c}>
                    <Text style={[style_bc.bc_text, style_bc.bc_bold]}>
                        1. BILL COPY
                    </Text>
                    <Text style={[style_bc.bc_text, style_bc.bc_bold]}>
                        2. OFFICE COPY
                    </Text>
                    <Text style={[style_bc.bc_text, style_bc.bc_bold]}>
                        3. ACCOUNTS (FUND)
                    </Text>
                </View>

                <View
                    style={{
                        marginTop: "5pt",
                        marginBottom: "5pt",
                        borderTop: "1px solid black",
                        width: "80%",
                        alignSelf: "center",
                    }}
                ></View>

                <View style={style_sig.all_sig}>
                    <Text style={style_sig.sig_label}>USE FOR AUDIT</Text>

                    <View style={[style_bc.bc_in_words, style_bc.bc_jus]}>
                        <Text style={style_bc.bc_text_2}>
                            Audit No. : _ _ _ _ _ _ _ _ _ _ _ _
                        </Text>

                        <Text style={style_bc.bc_text_2}>
                            Date : _ _ _ _ _ _ _ _ _ _ _ _
                        </Text>
                    </View>

                    <View style={[style_bc.bc_in_words, style_bc.bc_jus]}>
                        <Text style={style_bc.bc_text_2}>
                            Total Amount(in figure) : _ _ _ _ _ _ _ _ _ _ _ _ _
                            _ _ _ _
                        </Text>

                        <Text style={style_bc.bc_text_2}>
                            In Words : (_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
                            _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
                            _ _ _ _ _ _ _) only has been verified.
                        </Text>
                    </View>

                    <View style={style_sig.sig_area}>
                        {bc_sig("Auditor/SO")}
                        {bc_sig("A/O(Audit)")}
                        {bc_sig("AD(Audit)")}
                        {bc_sig("Dy. Comptroller(Audit)")}
                    </View>
                </View>

                <View
                    style={{
                        marginTop: "5pt",
                        marginBottom: "5pt",
                        borderTop: "1px solid black",
                        width: "80%",
                        alignSelf: "center",
                    }}
                ></View>

                <View style={style_sig.all_sig}>
                    <Text style={style_sig.sig_label}>FOR CASH SECTION</Text>

                    <View style={[style_bc.bc_in_words, style_bc.bc_jus]}>
                        <Text style={style_bc.bc_text_2}>
                            Cheque No. : _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
                            _ _
                        </Text>

                        <Text style={style_bc.bc_text_2}>
                            Date : _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
                        </Text>

                        <View style={style_bc.bc_in_words}>
                            <Text style={style_bc.bc_text_2}>Amount :</Text>

                            <Text
                                style={[style_bc.bc_text_2, style_bc.bc_bold]}
                            >
                                {nf.format(sanction_total - count * 10)}
                            </Text>

                            <Text style={style_bc.bc_text_2}>only</Text>
                        </View>
                    </View>
                </View>
            </Page>
        </Document>
    );

    const MySalaryBillForm = (
        <Document>
            <Page
                size="A4"
                orientation="landscape"
                style={{ paddingLeft: "5pt", paddingRight: "5pt" }}
            >
                <View style={{ marginTop: "10pt" }}></View>

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
                        <Text style={[styles.pageLabel, style_bc.bc_bold]}>
                            {bcf_loan_type} SALARY BILL COPY
                        </Text>

                        <Text style={style_bc.bc_text}>
                            CATEGORY : {sel_cat}
                        </Text>
                    </View>
                </View>

                <View style={[style_bc.bc_in_words, style_bc.bc_jus]}>
                    <Text style={[style_bc.bc_text, style_bc.bc_bold]}>
                        Bill No. : _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
                    </Text>

                    <Text style={[style_bc.bc_text, style_bc.bc_bold]}>
                        Date : _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
                    </Text>
                </View>

                <View style={[style_bc.bc_in_words, style_bc.bc_jus]}>
                    <Text style={[style_bc.bc_text, style_bc.bc_bold]}>
                        Docket No. : _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
                    </Text>

                    <Text style={[style_bc.bc_text, style_bc.bc_bold]}>
                        Date : _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
                    </Text>

                    <Text style={[style_bc.bc_text, style_bc.bc_bold]}>
                        Signature : _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
                    </Text>
                </View>

                {sel_cat == "null" ? (
                    <Text style={style_bc.no_billing_loan}>
                        Select a Category to bill
                    </Text>
                ) : (
                    <View>
                        <View style={style_bc.bc_table}>
                            <View
                                style={[
                                    style_bc.bc_table_row,
                                    style_bc.bc_bold,
                                ]}
                            >
                                {s_table_col("SERIAL NO", "small_col")}
                                {s_table_col("SALARY ID", "small_col")}
                                {s_table_col("EMPLOYEE ID", "large_col")}
                                {s_table_col("LOAN ID", "large_col")}
                                {s_table_col("EMPLOYEE NAME", "large_col")}
                                {s_table_col("DESIGNATION", "large_col")}
                                {s_table_col("OFFICE/ DEPT.", "small_col")}
                                {sel_cat == "ALL"
                                    ? s_table_col("CATEGORY", "small_col")
                                    : ""}

                                {sel_cat == "ALL"
                                    ? s_table_col("BIRTH DATE", "small_col")
                                    : s_table_col("BIRTH DATE", "large_col")}
                                {sel_cat == "ALL"
                                    ? s_table_col("JOINING DATE", "small_col")
                                    : s_table_col("JOINING DATE", "large_col")}

                                {s_table_col("BILL AMOUNT", "large_col")}
                                {s_table_col("INST NO", "small_col")}
                                {s_table_col("INSTALL AMOUNT", "small_col")}
                                {s_table_col("RECOVERY AMOUNT", "large_col")}
                            </View>

                            {s_sanc_loan_display}
                        </View>

                        <View style={style_bc.bc_in_words}>
                            <Text style={style_bc.bc_text_2}>In Words :</Text>
                            <Text style={[style_bc.bc_text, style_bc.bc_bold]}>
                                {inWords(sanction_total)}
                            </Text>

                            <Text style={style_bc.bc_text_2}>TK. Only</Text>
                        </View>

                        <View style={style_bc.bc_in_words}>
                            <Text style={style_bc.bc_text_2}>
                                Pay Amount of Tk.
                            </Text>
                            <Text
                                style={[style_bc.bc_text_2, style_bc.bc_bold]}
                            >
                                {nf.format(sanction_total)}
                            </Text>

                            <Text style={style_bc.bc_text_2}>
                                only as House Building Loan to the above
                                mentioned person(s).
                            </Text>
                        </View>
                    </View>
                )}

                <View style={style_sig.all_sig}>
                    <View style={style_sig.sig_area}>
                        {bc_sig("ASS. ACCT./ACC./S.O.")}
                        {bc_sig("A.O.")}
                        {bc_sig("SR A.D.")}
                        {bc_sig("D.C.")}
                        {bc_sig("COMPTROLLER")}
                    </View>
                </View>

                <View style={style_bc.bc_in_words_c}>
                    <Text style={[style_bc.bc_text, style_bc.bc_bold]}>
                        1. COPY TO SALARY : The installment amount to be
                        deducted from next month salary
                    </Text>
                    <Text style={[style_bc.bc_text, style_bc.bc_bold]}>
                        2. OFFICE COPY
                    </Text>
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

    const onBCDownload = (e) => {
        e.preventDefault();

        if (!bcUrl) {
            return;
        }

        if (!sbcUrl) {
            return;
        }

        downloadURI(bcUrl, "bill_copy.pdf");

        downloadURI(sbcUrl, "salary_bill_copy.pdf");
    };

    return (
        // <>
        //     <PDFViewer style={styles.viewer}>
        //         <MyBillForm />
        //     </PDFViewer>

        //     <PDFViewer style={styles.viewer}>
        //         <MySalaryBillForm />
        //     </PDFViewer>
        // </>

        <>
            <BlobProvider document={MyBillForm}>
                {({ blob, url, loading, error }) => {
                    setBcUrl(url);
                }}
            </BlobProvider>

            <BlobProvider document={MySalaryBillForm}>
                {({ blob, url, loading, error }) => {
                    setSbcUrl(url);
                }}
            </BlobProvider>

            {count == 0 ? (
                <div style={style_butt.alert_message}>
                    Select at least one loan to forward or download
                </div>
            ) : (
                <div
                    style={style_butt.download_butt}
                    onClick={onBCDownload}
                    onMouseEnter={() => setLaf_hover(true)}
                    onMouseLeave={() => setLaf_hover(false)}
                >
                    Download Bill Copy
                </div>
            )}
        </>
    );
}
