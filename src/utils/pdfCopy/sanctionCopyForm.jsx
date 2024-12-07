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

import InWords from "../functions/inWords";
import { dateFormation } from "../functions/dateFormation";

import logo_image from "../../assets/images/buetLogo.png";
import PT_Serif_Bold from "../../assets/fonts/pt-serif-latin-700-normal.ttf";
import { secondary } from "../../stores/const/colors";
import { backend_site_address } from "../../stores/const/siteAddress";

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

const style_sc = StyleSheet.create({
    sc_table: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        fontFamily: "English",
    },

    sc_table_row: {
        display: "flex",
        flexDirection: "row",
        padding: "2.5pt 5pt",
        gap: "2.5pt",
        borderTop: "1px solid black",
    },

    sc_bold: {
        fontFamily: "English Bold",
    },

    sc_table_col: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "1pt",
    },

    large_col: {
        width: "6.5%",
    },

    small_col: {
        width: "5.5%",
    },

    sl_col: {
        width: "3%",
    },

    loan_id_col: {
        width: "8%",
    },

    sc_table_cell: {
        fontSize: "8pt",
        textAlign: "center",
    },

    sc_in_words: {
        display: "flex",
        flexDirection: "row",
        padding: "10pt 20pt",
    },

    sc_text: {
        fontFamily: "English Bold",
        textTransform: "uppercase",
        fontSize: "8pt",
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
    },

    sig_area: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        padding: "5pt 10pt",
        marginTop: "20pt",
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
        fontSize: "8pt",
        textAlign: "center",
    },
});

export default function SanctionCopyForm(props) {
    const scf_navigate = useNavigate();

    const [sc_sanc_loan_data, setSc_sanc_loan_data] = useState([]);
    const sc_sanc_loan_display = useState([]);

    const [scf_remarks, setScf_remarks] = useState("");
    const [scf_remarks_error_text, setScf_remarks_error_text] = useState("");
    const [scf_remarks_error, setScf_remarks_error] = useState(false);

    const [scf_pers_data, setScf_pers_data] = useState([]);

    const scf_loan_type = props.loan_type;

    const scf_selected_loan = props.sanctionedLoan;

    const scf_sent_from = props.sentFrom;

    const scf_sanc_status =
        scf_sent_from == "acct_fund" ? "IN PROCESS" : "SANCTIONED";

    var scf_app_pos = props.app_pos;

    const [scUrl, setScUrl] = useState("");

    const [for_hover, setFor_hover] = useState(false);

    const [laf_hover, setLaf_hover] = useState(false);

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
            fontSize: "15pt",
            transform: for_hover ? "scale(1.25)" : "scale(1)",
            cursor: for_hover ? "pointer" : "default",
            transition: "all ease 0.3s",
        },

        download_butt: {
            width: laf_hover ? "150pt" : "120pt",
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
            fontSize: "15pt",
            transform: laf_hover ? "scale(1.25)" : "scale(1)",
            cursor: laf_hover ? "pointer" : "default",
            transition: "all ease 0.3s",
        },

        alert_message: {
            textAlign: "center",
            color: "gray",
            fontSize: "20pt",
        },
    });

    useEffect(() => {
        const fetch_sanction_loan_data = async () => {
            const uploadLoanType = {
                LOAN_TYPE: scf_loan_type,
                SANC_STATUS: scf_sanc_status,
            };

            try {
                const sanc_res = await axios.post(
                    "http://" + backend_site_address + "/sanction_loan",
                    uploadLoanType
                );
                setSc_sanc_loan_data(sanc_res.data);

                var uploadData = {
                    USERNAME: scf_sent_from,
                };

                const scf_data_res = await axios.post(
                    "http://" + backend_site_address + "/personeel_login",
                    uploadData
                );
                setScf_pers_data(scf_data_res.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetch_sanction_loan_data();
    }, []);

    const sc_table_col = (value, cn) => {
        return (
            <View
                style={[
                    style_sc.sc_table_col,
                    cn == "small_col" ? style_sc.small_col : style_sc.large_col,
                ]}
            >
                <Text style={style_sc.sc_table_cell}>{value}</Text>
            </View>
        );
    };

    const sc_lc_sig = (name, designation) => {
        return (
            <View style={style_sig.sig_box}>
                <Text style={style_sig.sig_lc_field}>
                    ------------------------------
                </Text>
                <Text style={style_sig.sig_lc_field}>{name}</Text>
                <Text style={style_sig.sig_lc_field}>{designation}</Text>
                <Text style={style_sig.sig_lc_field}>
                    Consumer Loan Approval Committe
                </Text>
            </View>
        );
    };

    const sc_sig = (designation) => {
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
    var sanctioned_loan_ids = "";

    for (let i = 0; i < sc_sanc_loan_data.length; i++) {
        if (scf_selected_loan[sc_sanc_loan_data[i]["LOAN_ID"]]) {
            sanctioned_loan_ids += sc_sanc_loan_data[i]["LOAN_ID"] + ", ";

            sc_sanc_loan_display.push(
                <View style={style_sc.sc_table_row}>
                    <View style={[style_sc.sc_table_col, style_sc.sl_col]}>
                        <Text style={style_sc.sc_table_cell}>{++count}</Text>
                    </View>
                    <View style={[style_sc.sc_table_col, style_sc.loan_id_col]}>
                        <Text style={style_sc.sc_table_cell}>
                            {sc_sanc_loan_data[i]["LOAN_ID"]}
                        </Text>
                    </View>
                    {sc_table_col(
                        sc_sanc_loan_data[i]["EMPLOYEE_NAME"],
                        "large_col"
                    )}
                    {sc_table_col(
                        sc_sanc_loan_data[i]["DESIGNATION"],
                        "large_col"
                    )}
                    {sc_table_col(sc_sanc_loan_data[i]["OFFICE"], "small_col")}
                    {sc_table_col(
                        sc_sanc_loan_data[i]["CATEGORY"],
                        "small_col"
                    )}
                    {sc_table_col(
                        dateFormation(sc_sanc_loan_data[i]["DATE_OF_BIRTH"]),
                        "small_col"
                    )}
                    {sc_table_col(
                        dateFormation(sc_sanc_loan_data[i]["DATE_FIRST_JOIN"]),
                        "small_col"
                    )}
                    {sc_table_col(
                        nf.format(sc_sanc_loan_data[i]["NET_SALARY"]),
                        "small_col"
                    )}
                    {sc_table_col(
                        nf.format(sc_sanc_loan_data[i]["APPLY_AMOUNT"]),
                        "small_col"
                    )}
                    {sc_table_col(
                        nf.format(sc_sanc_loan_data[i]["ALLOW_AMOUNT"]),
                        "small_col"
                    )}
                    <View
                        style={[
                            style_sc.sc_table_col,
                            style_sc.large_col,
                            style_sc.sc_bold,
                        ]}
                    >
                        <Text style={style_sc.sc_table_cell}>
                            {nf.format(sc_sanc_loan_data[i]["SANCTION_AMOUNT"])}
                        </Text>
                    </View>
                    {sc_table_col(
                        nf.format(sc_sanc_loan_data[i]["RECOVERY_AMOUNT"]),
                        "large_col"
                    )}
                    {sc_table_col(
                        nf.format(sc_sanc_loan_data[i]["INSTALL_AMOUNT"]),
                        "small_col"
                    )}
                    {sc_table_col(
                        nf.format(sc_sanc_loan_data[i]["TOTAL_INTEREST"]),
                        "small_col"
                    )}
                    {sc_table_col(
                        sc_sanc_loan_data[i]["INSTALL_NO"],
                        "small_col"
                    )}
                    {sc_table_col(
                        sc_sanc_loan_data[i]["BANK_ACCOUNT_NO"],
                        "small_col"
                    )}
                    {/* {sc_table_col(" ", "small_col")}
                    {sc_table_col(" ", "small_col")} */}
                </View>
            );

            sanction_total += Number(sc_sanc_loan_data[i]["SANCTION_AMOUNT"]);
        }
    }

    sanctioned_loan_ids = sanctioned_loan_ids.slice(
        0,
        sanctioned_loan_ids.length - 2
    );

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
            <View
                style={[
                    style_sc.sc_table_col,
                    style_sc.large_col,
                    style_sc.sc_bold,
                ]}
            >
                <Text style={style_sc.sc_table_cell}>TOTAL</Text>
            </View>
            <View
                style={[
                    style_sc.sc_table_col,
                    style_sc.large_col,
                    style_sc.sc_bold,
                ]}
            >
                <Text style={style_sc.sc_table_cell}>
                    {nf.format(sanction_total)}
                </Text>
            </View>
        </View>
    );

    var scf_personnel_data = [];
    if (scf_pers_data.length != 0) {
        scf_personnel_data = scf_pers_data[0];
    }

    const MySanctionForm = (
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
                        <Text style={styles.pageLabel}>
                            {scf_loan_type} FOR SANCTION
                        </Text>
                    </View>
                </View>

                <View style={style_sc.sc_table}>
                    <View style={[style_sc.sc_table_row, style_sc.sc_bold]}>
                        <View style={[style_sc.sc_table_col, style_sc.sl_col]}>
                            <Text style={style_sc.sc_table_cell}>SL NO</Text>
                        </View>
                        <View
                            style={[
                                style_sc.sc_table_col,
                                style_sc.loan_id_col,
                            ]}
                        >
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
                        {/* {sc_table_col("LAST AP N", "small_col")}
                        {sc_table_col("LAST LOAN D", "small_col")} */}
                    </View>

                    {sc_sanc_loan_display}
                </View>

                <View style={style_sc.sc_in_words}>
                    <Text style={style_sc.sc_text}>
                        In Words : {InWords(sanction_total)} TK. Only
                    </Text>
                </View>

                <View style={style_sig.all_sig}>
                    <Text style={style_sig.sig_label}>Loan Committe</Text>
                    <View style={style_sig.sig_area}>
                        {sc_lc_sig(
                            "Prof. Dr. Muhammad Masroor Ali",
                            "President"
                        )}
                        {sc_lc_sig("Dr. Tanvir Ahmed", "Member")}
                        {sc_lc_sig("Dr. Kazi Arafat Rahman", "Member")}
                        {sc_lc_sig("Md. Sozibur Rahman", "Member")}
                        {sc_lc_sig("Md. Nazrul Islam", "Member")}
                        {sc_lc_sig("Md. Tarike Ashraf", "Member")}
                        {sc_lc_sig("Mohammad Moniruzzaman", "Member-Secretary")}
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
                    <Text style={style_sig.sig_label}>Fund Section</Text>
                    <View style={style_sig.sig_area}>
                        {sc_sig("ASS. ACCT./ACCT")}
                        {sc_sig("SR A.D.")}
                        {sc_sig("D.C.")}
                        {sc_sig("COMPTROLLER")}
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
                    <Text style={style_sig.sig_label}>AUDIT</Text>
                    <View style={style_sig.sig_area}>
                        {sc_sig("ASS. ACCT./ACCT")}
                        {sc_sig("A.O.")}
                        {sc_sig("A.D./D.D.")}
                        {sc_sig("D.C.")}
                    </View>
                </View>

                <View style={{ marginTop: "20pt" }}></View>

                {sc_sig("HONORABLE PRO-VC")}
            </Page>
        </Document>
    );

    const downloadURI = (uri, name) => {
        const link = document.createElement("a");
        link.href = uri;
        link.download = name;
        link.click();
    };

    const onSCDownload = (e) => {
        e.preventDefault();

        if (!scUrl) {
            return;
        }
        downloadURI(scUrl, "sanction_copy.pdf");
    };

    const onScForwardClick = async () => {
        if (count == 0) {
            setScf_remarks_error(true);
            setScf_remarks_error_text("***Select at least one loan to forward");
            return;
        } else {
            setScf_remarks_error(false);
        }

        if (scf_remarks == "") {
            setScf_remarks_error(true);
            setScf_remarks_error_text("***Remarks must be written to forward");
            return;
        } else {
            setScf_remarks_error(false);
        }

        const new_date = new Date();

        if (scf_sent_from == "acct_fund") {
            scf_app_pos = 6;

            const upload_sanctioned_loan = {
                LOAN_ID: sanctioned_loan_ids,
                LOAN_TYPE: scf_loan_type,
                TOTAL_AMOUNT: sanction_total,
                APP_POS: 7,
                SANC_DATE: new Date(new_date).toLocaleDateString("en-US"),
                SANCTION_STATUS: "SANCTIONED",
            };

            try {
                await axios.post(
                    "http://" + backend_site_address + "/sanctioning_loan",
                    upload_sanctioned_loan
                );
            } catch (err) {
                console.log(err);
            }

            try {
                await axios.put(
                    "http://" + backend_site_address + "/sanction",
                    {
                        loan_id: sanctioned_loan_ids,
                        status: "SANCTIONED",
                    }
                );
            } catch (err) {
                console.log(err);
            }
        } else if (scf_sent_from == "dc_audit") {
            try {
                await axios.put(
                    "http://" + backend_site_address + "/sanction",
                    {
                        loan_id: sanctioned_loan_ids,
                        status: "OFF_ORD",
                    }
                );
            } catch (err) {
                console.log(err);
            }

            const updateSancedData = {
                LOAN_ID: sanctioned_loan_ids,
                APP_POS: scf_app_pos,
                SANCTION_STATUS: "OFF_ORD",
            };

            try {
                await axios.put(
                    "http://" + backend_site_address + "/sanctioned",
                    updateSancedData
                );
            } catch (err) {
                console.log(err);
            }
        } else {
            const updateSancedData = {
                LOAN_ID: sanctioned_loan_ids,
                APP_POS: scf_app_pos,
                SANCTION_STATUS: "SANCTIONED",
            };

            try {
                await axios.put(
                    "http://" + backend_site_address + "/sanctioned",
                    updateSancedData
                );
            } catch (err) {
                console.log(err);
            }
        }

        const updateRemarksData = {
            LOAN_ID: sanctioned_loan_ids,
            REMARKER: scf_app_pos,
            REMARKS: scf_remarks,
        };

        try {
            await axios.put(
                "http://" +
                    backend_site_address +
                    "/processing_loan_remarks_update",
                updateRemarksData
            );

            scf_navigate("/personnel_dashboard", {
                state: { data: scf_personnel_data, loan_type: scf_loan_type },
            });
        } catch (err) {
            console.log(err);
        }
    };

    return (
        // <PDFViewer style={styles.viewer}>
        //     <MySanctionForm />
        // </PDFViewer>
        <>
            {scf_sent_from == "acct_fund" ? (
                <BlobProvider document={MySanctionForm}>
                    {({ blob, url, loading, error }) => {
                        setScUrl(url);
                    }}
                </BlobProvider>
            ) : (
                ""
            )}

            {scf_sent_from == "acct_fund" ? (
                count == 0 ? (
                    <div style={style_butt.alert_message}>
                        Select at least one loan to download
                    </div>
                ) : (
                    <div
                        style={style_butt.download_butt}
                        onClick={onSCDownload}
                        onMouseEnter={() => setLaf_hover(true)}
                        onMouseLeave={() => setLaf_hover(false)}
                    >
                        Download
                    </div>
                )
            ) : (
                ""
            )}

            <div className="assessment_section remarks">
                <div className="section_label">Remarks :</div>

                {scf_remarks_error ? (
                    <div className="remarks_input" style={{ color: "red" }}>
                        {scf_remarks_error_text}
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
                            value={scf_remarks}
                            onChange={(e) => {
                                setScf_remarks(e.target.value);
                            }}
                        />
                    </div>
                </div>
            </div>

            <div style={style_butt.sc_button}>
                <div
                    style={style_butt.forward_butt}
                    onClick={onScForwardClick}
                    onMouseEnter={() => setFor_hover(true)}
                    onMouseLeave={() => setFor_hover(false)}
                >
                    Forward
                </div>
            </div>
        </>
    );
}
