import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
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

const style_sal = StyleSheet.create({
    sal_table: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        fontFamily: "English",
    },

    sal_table_row: {
        display: "flex",
        flexDirection: "row",
        padding: "2.5pt 5pt",
        gap: "2.5pt",
        borderTop: "1px solid black",
    },

    sal_bold: {
        fontFamily: "English Bold",
    },

    sal_table_col: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "1pt",
        width: "14.28%",
    },

    sal_table_cell: {
        fontSize: "9pt",
        textAlign: "center",
    },

    sal_in_words: {
        display: "flex",
        flexDirection: "row",
        padding: "3pt 20pt",
        fontFamily: "English",
    },

    sal_in_words_row: {
        display: "flex",
        flexDirection: "row",
        fontFamily: "English",
        marginBottom: "5pt",
    },

    sal_in_words_col: {
        display: "flex",
        flexDirection: "column",
        padding: "3pt 20pt",
        fontFamily: "English",
    },

    sal_in_words_c: {
        display: "flex",
        flexDirection: "column",
        padding: "20pt 40pt",
        fontFamily: "English",
        alignSelf: "flex-end",
        alignItems: "center",
    },

    sal_text: {
        fontFamily: "English",
        textTransform: "uppercase",
        fontSize: "9pt",
        marginLeft: "2pt",
        marginRight: "2pt",
        color: "black",
    },

    sal_text_2: {
        fontFamily: "English",
        fontSize: "9pt",
        marginLeft: "2pt",
        marginRight: "2pt",
    },

    no_billing_loan: {
        textAlign: "center",
        color: "red",
        fontSize: "15pt",
        marginBottom: "2%",
        fontFamily: "English",
    },
});

export default function BankCopyForm(props) {
    const bac_navigate = useNavigate();

    const sel_cat = props.category;
    const bac_loan_type = props.loan_type;
    var bac_app_pos = props.app_pos;
    const bac_billedLoan = props.billedLoan;
    const bac_sentFrom = props.sentFrom;

    const bac_sanc_status = bac_sentFrom == "acct_fund" ? "BILL" : "BILLED";

    var bac_loan_ids = "";

    const [bac_cheque_no, setBac_cheque_no] = useState("");

    const [bac_remarks, setBac_remarks] = useState("");

    const [bac_error, setBac_error] = useState(false);
    const [bac_error_text, setBac_error_text] = useState("");

    const [bac_pers_data, setBac_pers_data] = useState([]);

    const [sal_sanc_loan_data, setSal_sanc_loan_data] = useState([]);
    const sal_sanc_loan_display = useState([]);

    const [salUrl, setSalUrl] = useState("");

    const [laf_hover, setLaf_hover] = useState(false);

    const [for_hover, setFor_hover] = useState(false);

    const style_butt = StyleSheet.create({
        sc_button: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "center",
        },

        forward_butt: {
            width: for_hover ? "150pt" : "120pt",
            height: "auto",
            fontFamily: "PT Serif",
            fontWeight: "bold",
            padding: "5pt 15pt 5pt 15pt",
            alignSelf: "center",
            textAlign: "center",
            border: "2px solid",
            borderColor: for_hover ? "white" : secondary,
            borderRadius: "20pt",
            backgroundColor: for_hover ? secondary : "white",
            color: for_hover ? "white" : secondary,
            fontSize: for_hover ? "20pt" : "15pt",
            cursor: for_hover ? "pointer" : "default",
            transition: "all ease 0.3s",
        },

        download_butt: {
            width: laf_hover ? "250pt" : "200pt",
            height: "auto",
            fontFamily: "PT Serif",
            fontWeight: "bold",
            padding: "5pt 15pt 5pt 15pt",
            alignSelf: "center",
            textAlign: "center",
            border: "2px solid",
            borderColor: laf_hover ? "white" : secondary,
            borderRadius: "20pt",
            backgroundColor: laf_hover ? secondary : "white",
            color: laf_hover ? "white" : secondary,
            fontSize: laf_hover ? "20pt" : "15pt",
            cursor: laf_hover ? "pointer" : "default",
            transition: "all ease 0.3s",
        },

        alert_message: {
            textAlign: "center",
            color: "gray",
            fontSize: "20pt",
        },
    });

    const style_form = StyleSheet.create({
        cheque_box: {
            display: "flex",
            flexDirection: "row",
            gap: "10pt",
            justifyContent: "center",
            alignItems: "center",
        },

        cheque_label: {
            fontFamily: "PT Serif",
            fontWeight: "bold",
            fontSize: "15pt",
        },

        cheque_input: {
            fontFamily: "PT Serif",
            lineHeight: "20pt",
            width: "30%",
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
                LOAN_TYPE: bac_loan_type,
                SANC_STATUS: bac_sanc_status,
            };

            try {
                const sanc_res = await axios.post(
                    "http://localhost:8800/sanction_loan",
                    uploadLoanType
                );
                setSal_sanc_loan_data(sanc_res.data);

                var uploadData = {
                    USERNAME: bac_sentFrom,
                };

                const bac_data_res = await axios.post(
                    "http://localhost:8800/personeel_login",
                    uploadData
                );
                setBac_pers_data(bac_data_res.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetch_sanction_loan_data();
    }, []);

    const sal_table_col = (value, cn) => {
        return (
            <View style={[style_sal.sal_table_col]}>
                <Text
                    style={[
                        style_sal.sal_table_cell,
                        cn == "bcf_bold" ? style_sal.sal_bold : "",
                    ]}
                >
                    {value}
                </Text>
            </View>
        );
    };

    let nf = new Intl.NumberFormat("en-US");

    var count = 0;
    var sanction_total = 0;

    if (bac_sentFrom == "acct_fund") {
        for (let i = 0; i < sal_sanc_loan_data.length; i++) {
            if (
                bac_billedLoan[sal_sanc_loan_data[i]["LOAN_ID"]] &&
                sal_sanc_loan_data[i]["CATEGORY"] == sel_cat
            ) {
                bac_loan_ids += sal_sanc_loan_data[i]["LOAN_ID"] + ",";
                sal_sanc_loan_display.push(
                    <View style={style_sal.sal_table_row}>
                        {sal_table_col(++count)}
                        {sal_table_col(sal_sanc_loan_data[i]["EMPLOYEE_ID"])}
                        {sal_table_col(sal_sanc_loan_data[i]["EMPLOYEE_NAME"])}
                        {sal_table_col(sal_sanc_loan_data[i]["DESIGNATION"])}
                        {sal_table_col(sal_sanc_loan_data[i]["OFFICE"])}
                        {sal_table_col(
                            sal_sanc_loan_data[i]["BANK_ACCOUNT_NO"]
                        )}
                        {sal_table_col(
                            nf.format(
                                sal_sanc_loan_data[i]["SANCTION_AMOUNT"] - 10
                            ),
                            "bcf_bold"
                        )}
                    </View>
                );
                sanction_total += Number(
                    sal_sanc_loan_data[i]["SANCTION_AMOUNT"]
                );
            }
        }

        sal_sanc_loan_display.push(
            <View style={[style_sal.sal_table_row, style_sal.sal_bold]}>
                {sal_table_col("")}
                {sal_table_col("")}
                {sal_table_col("")}
                {sal_table_col("")}
                {sal_table_col("")}
                {sal_table_col("TOTAL")}
                {sal_table_col(nf.format(sanction_total - count * 10))}
            </View>
        );
    } else {
        for (let i = 0; i < sal_sanc_loan_data.length; i++) {
            if (bac_billedLoan[sal_sanc_loan_data[i]["LOAN_ID"]]) {
                bac_loan_ids += sal_sanc_loan_data[i]["LOAN_ID"] + ",";

                sal_sanc_loan_display.push(
                    <View style={style_sal.sal_table_row}>
                        {sal_table_col(++count)}
                        {sal_table_col(sal_sanc_loan_data[i]["EMPLOYEE_ID"])}
                        {sal_table_col(sal_sanc_loan_data[i]["EMPLOYEE_NAME"])}
                        {sal_table_col(sal_sanc_loan_data[i]["DESIGNATION"])}
                        {sal_table_col(sal_sanc_loan_data[i]["OFFICE"])}
                        {sal_table_col(
                            sal_sanc_loan_data[i]["BANK_ACCOUNT_NO"]
                        )}
                        {sal_table_col(
                            nf.format(
                                sal_sanc_loan_data[i]["SANCTION_AMOUNT"] - 10
                            )
                        )}
                    </View>
                );
                sanction_total += Number(
                    sal_sanc_loan_data[i]["SANCTION_AMOUNT"]
                );
            }
        }

        sal_sanc_loan_display.push(
            <View style={[style_sal.sal_table_row, style_sal.sal_bold]}>
                {sal_table_col("")}
                {sal_table_col("")}
                {sal_table_col("")}
                {sal_table_col("")}
                {sal_table_col("")}
                {sal_table_col("TOTAL")}
                {sal_table_col(nf.format(sanction_total - count * 10))}
            </View>
        );
    }

    bac_loan_ids = bac_loan_ids.slice(0, bac_loan_ids.length - 1);

    const MyBankForm = (
        <Document>
            <Page
                size="A4"
                orientation="potrait"
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
                        <Text style={[styles.pageLabel, style_sal.sal_bold]}>
                            {bac_loan_type} BANK COPY
                        </Text>

                        <Text style={style_sal.sal_text}>
                            CATEGORY : {sel_cat}
                        </Text>
                    </View>
                </View>

                {sel_cat == "null" ? (
                    <Text style={style_sal.no_billing_loan}>
                        Select a Category to bill
                    </Text>
                ) : (
                    <View>
                        <View style={style_sal.sal_table}>
                            <View
                                style={[
                                    style_sal.sal_table_row,
                                    style_sal.sal_bold,
                                ]}
                            >
                                {sal_table_col("SERIAL NO")}
                                {sal_table_col("BUET ID")}
                                {sal_table_col("EMPLOYEE NAME")}
                                {sal_table_col("DESIGNATION")}
                                {sal_table_col("OFFICE/ DEPT.")}
                                {sal_table_col("ACCOUNT NO")}
                                {sal_table_col("NET PAY")}
                            </View>

                            {sal_sanc_loan_display}
                        </View>

                        <View style={style_sal.sal_in_words}>
                            <Text style={style_sal.sal_text_2}>In Words :</Text>
                            <Text
                                style={[style_sal.sal_text, style_sal.sal_bold]}
                            >
                                {inWords(sanction_total - count * 10)}
                            </Text>

                            <Text style={style_sal.sal_text_2}>TK. Only</Text>
                        </View>

                        <View style={style_sal.sal_in_words_c}>
                            <Text style={style_sal.sal_text}>
                                -------------------------------
                            </Text>
                            <Text style={style_sal.sal_text}>Comptroller</Text>

                            <Text style={style_sal.sal_text}>BUET</Text>
                        </View>
                    </View>
                )}

                <View style={style_sal.sal_in_words_col}>
                    <View style={style_sal.sal_in_words_row}>
                        <Text style={[style_sal.sal_text, style_sal.sal_bold]}>
                            1. BANK COPY :
                        </Text>
                        <Text style={style_sal.sal_text_2}>
                            Attention - AGM, Sonali Bank LTD., BUET Branch.
                        </Text>
                    </View>

                    <Text style={style_sal.sal_text}>
                        Please transfer the above mentioned amount to the
                        respective bank account of concerned person(s). See the
                        enclosed
                    </Text>

                    <Text style={style_sal.sal_text}>
                        Cheque No. : _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
                        _ _ _ _ _ _ Dated : _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
                    </Text>

                    <View style={style_sal.sal_in_words_row}>
                        <Text style={style_sal.sal_text}>Amount</Text>

                        <Text style={[style_sal.sal_text, style_sal.sal_bold]}>
                            {sanction_total - count * 10}
                        </Text>

                        <Text style={style_sal.sal_text}>only</Text>
                    </View>

                    <Text style={[style_sal.sal_text, style_sal.sal_bold]}>
                        2. Office Copy
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

    const onSALDownload = (e) => {
        e.preventDefault();

        if (!salUrl) {
            return;
        }

        downloadURI(salUrl, "bank_copy.pdf");
    };

    var bac_personnel_data = [];
    if (bac_pers_data.length != 0) {
        bac_personnel_data = bac_pers_data[0];
    }

    const onBacForwardClick = async () => {
        if (bac_sentFrom == "acct_fund") {
            if (count == 0) {
                setBac_error(true);
                setBac_error_text("***Select at least one loan to forward");
                return;
            } else {
                setBac_error(false);
            }
        }

        if (bac_sentFrom == "acct_cash") {
            if (bac_cheque_no == "") {
                setBac_error(true);
                setBac_error_text("***Enter cheque no to forward");
                return;
            } else {
                setBac_error(false);
            }
        }

        if (bac_remarks == "") {
            setBac_error(true);
            setBac_error_text("***Remarks must be written to forward");
            return;
        } else {
            setBac_error(false);
        }

        const new_date = new Date();

        if (bac_sentFrom == "acct_fund") {
            bac_app_pos = 15;

            const upload_billed_loan = {
                LOAN_ID: bac_loan_ids,
                LOAN_TYPE: bac_loan_type,
                APP_POS: 16,
                BILL_DATE: new_date,
                BILL_STATUS: "BILLED",
            };

            try {
                await axios.post(
                    "http://localhost:8800/bill_register",
                    upload_billed_loan
                );
            } catch (err) {
                console.log(err);
            }

            try {
                await axios.put("http://localhost:8800/sanction", {
                    loan_id: bac_loan_ids,
                    status: "BILLED",
                });
            } catch (err) {
                console.log(err);
            }
        } else if (bac_sentFrom == "acct_cash") {
            try {
                await axios.put("http://localhost:8800/sanction", {
                    loan_id: bac_loan_ids,
                    status: "CASHED",
                    cheque_no: bac_cheque_no,
                });
            } catch (err) {
                console.log(err);
            }

            const updateBilledData = {
                LOAN_ID: bac_loan_ids,
                APP_POS: bac_app_pos,
                BILL_STATUS: "CASHED",
            };

            try {
                await axios.put(
                    "http://localhost:8800/billed",
                    updateBilledData
                );
            } catch (err) {
                console.log(err);
            }
        } else {
            const updateBilledData = {
                LOAN_ID: bac_loan_ids,
                APP_POS: bac_app_pos,
                BILL_STATUS: "BILLED",
            };

            try {
                await axios.put(
                    "http://localhost:8800/billed",
                    updateBilledData
                );
            } catch (err) {
                console.log(err);
            }
        }

        const updateRemarksData = {
            LOAN_ID: bac_loan_ids,
            REMARKER: bac_app_pos,
            REMARKS: bac_remarks,
        };

        try {
            await axios.put(
                "http://localhost:8800/processing_loan_remarks_update",
                updateRemarksData
            );

            bac_navigate("/personnel_dashboard", {
                state: { data: bac_personnel_data, loan_type: bac_loan_type },
            });
        } catch (err) {
            console.log(err);
        }
    };

    return (
        // <PDFViewer style={styles.viewer}>
        //     <MyBankForm />
        // </PDFViewer>

        <>
            <BlobProvider document={MyBankForm}>
                {({ blob, url, loading, error }) => {
                    setSalUrl(url);
                }}
            </BlobProvider>

            {bac_sentFrom == "acct_fund" ? (
                count == 0 ? (
                    <div style={style_butt.alert_message}>
                        Select at least one loan to forward or download
                    </div>
                ) : (
                    <div
                        style={style_butt.download_butt}
                        onClick={onSALDownload}
                        onMouseEnter={() => setLaf_hover(true)}
                        onMouseLeave={() => setLaf_hover(false)}
                    >
                        Download Bank Copy
                    </div>
                )
            ) : (
                ""
            )}

            {bac_sentFrom == "acct_cash" ? (
                <div style={style_form.cheque_box}>
                    <div style={style_form.cheque_label}>Cheque No. : </div>

                    <input
                        style={style_form.cheque_input}
                        value={bac_cheque_no}
                        onChange={(e) => setBac_cheque_no(e.target.value)}
                    />
                </div>
            ) : (
                ""
            )}

            <div className="assessment_section remarks">
                <div className="section_label">Remarks :</div>

                {bac_error ? (
                    <div className="remarks_input" style={{ color: "red" }}>
                        {bac_error_text}
                    </div>
                ) : (
                    ""
                )}

                <div className="remarks_items">
                    <div className="remarks_input_item">
                        <textarea
                            className="remarks_input"
                            placeholder="write your remarks about the loan"
                            type="text"
                            value={bac_remarks}
                            onChange={(e) => {
                                setBac_remarks(e.target.value);
                            }}
                        />
                    </div>
                </div>
            </div>

            <div style={style_butt.sc_button}>
                <div
                    style={style_butt.forward_butt}
                    onClick={onBacForwardClick}
                    onMouseEnter={() => setFor_hover(true)}
                    onMouseLeave={() => setFor_hover(false)}
                >
                    Forward
                </div>
            </div>
        </>
    );
}
