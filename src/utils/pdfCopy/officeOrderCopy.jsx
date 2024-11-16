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

import InWords from "../functions/inWords";

import logo_image from "../../assets/images/buetLogo.png";
import Suttony_MJ_Bold from "../../assets/fonts/SuttonyMJ_Bold.ttf";
import Suttony_MJ from "../../assets/fonts/SuttonyMJ.ttf";
import AdorshoLipi_Bold from "../../assets/fonts/AdorshoLipi_Bold.ttf";
import AdorshoLipi from "../../assets/fonts/AdorshoLipi.ttf";
import { secondary } from "../../stores/const/colors";

Font.register({
    family: "Bangla Bold",
    fontWeight: "normal",
    src: Suttony_MJ_Bold,
});
Font.register({ family: "Bangla", fontWeight: "normal", src: Suttony_MJ });
Font.register({
    family: "Bangla Bold 2",
    fontWeight: "normal",
    src: AdorshoLipi_Bold,
});
Font.register({ family: "Bangla 2", fontWeight: "normal", src: AdorshoLipi });

const styles = StyleSheet.create({
    viewer: {
        width: window.innerWidth,
        height: window.innerHeight,
    },

    pageLabel: {
        textAlign: "center",
        fontFamily: "Bangla Bold",
        fontSize: "18pt",
        fontWeight: "bold",
        marginTop: "15pt",
        marginBottom: "5pt",
        color: "black",
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
        height: "30pt",
        width: "30pt",
    },

    logo_text: {
        color: "crimson",
        marginLeft: "1%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },

    logo_text_1: {
        fontSize: "20pt",
        fontFamily: "Bangla",
    },
});

const style_orc = StyleSheet.create({
    off_ord: {
        display: "flex",
        flexDirection: "column",
        fontFamily: "Bangla",
        padding: "5pt 30pt 5pt 30pt",
    },

    ser_date: {
        display: "flex",
        flexDirection: "row",
        padding: "5pt 100pt 5pt 10pt",
        justifyContent: "space-between",
    },

    or_text_box: {
        display: "flex",
        flexDirection: "column",
        padding: "0pt 10pt",
    },

    or_text_box_2: {
        alignSelf: "flex-end",
        alignItems: "center",
    },

    or_text: {
        textAlign: "left",
        fontSize: "14pt",
        fontFamily: "Bangla",
    },

    or_text_2: {
        textAlign: "left",
        fontSize: "10pt",
        fontFamily: "Bangla 2",
        marginTop: "3pt",
        marginBottom: "3pt",
    },

    or_text_2_c: {
        textAlign: "right",
        fontSize: "10pt",
        fontFamily: "Bangla 2",
        marginTop: "3pt",
        marginBottom: "3pt",
    },

    or_text_label: {
        textDecoration: "underline",
        fontFamily: "Bangla Bold 2",
        fontSize: "10pt",
        textAlign: "left",
        marginTop: "5pt",
        marginBottom: "5pt",
    },
});

export default function OfficeOrderCopy(props) {
    const value = props.data;

    const [orcUrl, setOrcUrl] = useState("");

    const [orc_hover, setOrc_hover] = useState(false);

    const style_butt = StyleSheet.create({
        download_butt: {
            width: "auto",
            height: "auto",
            fontFamily: "PT Serif",
            fontWeight: "bold",
            padding: "5pt 15pt 5pt 15pt",
            textAlign: "center",
            border: "2px solid "+ orc_hover ? "white" : secondary,
            borderRadius: "20pt",
            backgroundColor: orc_hover ? secondary : "white",
            color: orc_hover ? "white" : secondary,
            fontSize: orc_hover ? "20pt" : "15pt",
            cursor: orc_hover ? "pointer" : "default",
            transition: "all ease 0.3s",
        },
    });

    let nf = new Intl.NumberFormat("bn-BN");

    const MyOfficeOrder = (
        <Document>
            <Page size="A4" orientation="portrait">
                <View style={{ marginTop: "40pt" }}></View>

                <View style={style_logo.logo}>
                    <View style={style_logo.logo_img}>
                        <Image style={style_logo.l_img} src={logo_image} />
                    </View>

                    <View style={style_logo.logo_text}>
                        <Text style={style_logo.logo_text_1}>
                            evsjv‡`k cÖ‡KŠkj wek¦we`¨vjq
                        </Text>

                        <Text style={styles.pageLabel}>Awdm Av‡`k</Text>
                    </View>
                </View>

                <View style={style_orc.off_ord}>
                    <View style={style_orc.ser_date}>
                        <Text style={style_orc.or_text}>
                            bs K¤ú-dvÛ/GBP.we.Gj-{value["loan_id"]}/wm-
                        </Text>
                        <Text style={style_orc.or_text}>ZvwiLt</Text>
                    </View>
                    <View style={style_orc.or_text_box}>
                        <Text style={style_orc.or_text_2}>
                            গৃহনির্মাণ ঋণ দানের নিয়মানুযায়ী ১ নং ক্রমিকে বর্ণিত
                            আপনার নামে উল্লিখিত অর্থ ঋণ হিসাবে নিম্নে বর্ণিত
                            শর্তে এতদ্বারা মঞ্জুর করা হইল।
                        </Text>
                    </View>

                    <View style={style_orc.or_text_box}>
                        <Text style={style_orc.or_text_label}>
                            সাধারণ শর্তাবলীঃ
                        </Text>

                        <Text style={style_orc.or_text_2}>
                            ১ । বিশ্ববিদ্যালয়ের শিক্ষক, কর্মকর্তা/কর্মচারীদের
                            গৃহনির্মাণ সামগ্রী ক্রয়ের জন্য।
                        </Text>
                        <Text style={style_orc.or_text_2}>
                            ২ । ঋণগ্রহীতার পেনশন, প্রভিডেন্ট ফান্ড, গ্রুপ
                            ইন্সুরেন্স ও অন্যান্য পাওনা টাকা হইতে আদায়যোগ্য
                            হইবে। ।
                        </Text>
                        <Text style={style_orc.or_text_2}>
                            ৩ । বার্ষিক ৪.৭৫% সরল সুদ আরোপ ও আদায়যোগ্য। ।
                        </Text>
                        <Text style={style_orc.or_text_2}>
                            ৪ । ঋণগ্রহীতার মাসিক বেতন হতে বিরতিহীনভাবে ঋণের টাকা
                            আদায় করা হইবে।
                        </Text>
                        <Text style={style_orc.or_text_2}>
                            ৫ । ঋণের টাকা সুদসহ সর্বোচ্চ ১০০ কিস্তিতে আদায় করা
                            হইবে।।
                        </Text>
                        <Text style={style_orc.or_text_2}>
                            ৬ । ঋণের টাকার মাসিক কর্তন কোন অবস্থাতেই বন্ধ করা
                            যাবে না ও ঋণ আদায় বন্ধ করার জন্য কোন দরখাস্ত বিবেচনা
                            করা হবে না। ।
                        </Text>
                        <Text style={style_orc.or_text_2}>
                            ৭ । ঋণ পরিশোধের পূর্বে ঋণ গ্রহীতা যদি মৃত্যুবরণ বা
                            চাকুরী হতে অবসর গ্রহণ করেন তবে ঋণের অবশিষ্ট টাকা
                            সুদসহ তাঁর পেনশন, প্রভিডেন্ট ফান্ড, গ্রুপ ইন্সুরেন্স
                            ও অন্যান্য পাওনা টাকা হইতে আদায় করা হবে।।
                        </Text>
                        <Text style={style_orc.or_text_2}>
                            ৮ । ৩০০/- (তিনশত) টাকার নন জুডিশিয়াল স্ট্যাম্পে
                            চুক্তি পত্র সম্পাদন করিতে হইবে।
                        </Text>
                        <Text style={style_orc.or_text_2}>
                            ৯ । অর্থ প্রাপ্তি সাপেক্ষে এই ঋণ প্রদান করা হইবে।
                        </Text>
                    </View>

                    <View style={{ marginTop: "30pt" }}></View>

                    <View
                        style={[style_orc.or_text_box, style_orc.or_text_box_2]}
                    >
                        <Text style={style_orc.or_text_2_c}>কম্পট্রোলার।</Text>
                        <Text style={style_orc.or_text_2_c}>
                            বাংলাদেশ প্রকৌশল বিশ্ববিদ্যালয়।
                        </Text>
                    </View>

                    <View style={{ marginTop: "10pt" }}></View>

                    <View style={style_orc.ser_date}>
                        <Text style={style_orc.or_text}>
                            bs K¤ú-dvÛ/GBP.we.Gj-{value["loan_id"]}/wm-
                        </Text>
                        <Text style={style_orc.or_text}>ZvwiLt</Text>
                    </View>

                    <View style={style_orc.or_text_box}>
                        <Text style={style_orc.or_text_2}>
                            অবগতি ও প্রয়োজনীয় ব্যবস্থা গ্রহণের জন্য অনুলিপি
                            প্রেরিত হইলঃ।
                        </Text>
                    </View>

                    <View style={style_orc.or_text_box}>
                        <Text style={style_orc.or_text_2}>
                            ১ । ডঃ/জনাব/বেগম {value["name"]} পদবী{" "}
                            {value["desig"]} অফিস/বিভাগ {value["off_dept"]} কে
                            উপরোক্ত শর্ত মতে গৃহনির্মাণ ঋণ বাবদ টাকা{" "}
                            {nf.format(value["amnt"]) +
                                "/- (" +
                                InWords(value["amnt"]).toUpperCase() +
                                ") "}
                            মাত্র মঞ্জুর করা হইয়াছে।
                        </Text>

                        <Text style={style_orc.or_text_2}>
                            ২ । প্রতি কিস্তি টাকা{" "}
                            {nf.format(value["ins_amnt"]) +
                                "/- (" +
                                InWords(value["ins_amnt"]).toUpperCase() +
                                ") "}
                            হারে মাসিক বেতন বিল হইতে{" "}
                            {nf.format(value["tot_ins"])} কিস্তিতে সুদসহ সর্বমোট
                            টাকা
                            {" " +
                                nf.format(
                                    value["tot_ins"] * value["ins_amnt"]
                                ) +
                                "/-"}{" "}
                            মাত্র আদায় করা হইবে।
                        </Text>
                    </View>

                    <View style={{ marginTop: "50pt" }}></View>

                    <View
                        style={[style_orc.or_text_box, style_orc.or_text_box_2]}
                    >
                        <Text style={style_orc.or_text_2_c}>
                            সিনিঃ সহকারী পরিচালক
                        </Text>
                        <Text style={style_orc.or_text_2_c}>
                            কম্পট্রোলার অফিস।
                        </Text>
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

    const onORCClick = (e) => {
        e.preventDefault();

        if (!orcUrl) {
            return;
        }
        downloadURI(orcUrl, "office_order_copy.pdf");
    };

    return (
        // <PDFViewer style={styles.viewer}>
        //     <MyOfficeOrder />
        // </PDFViewer>
        <>
            <BlobProvider document={MyOfficeOrder}>
                {({ blob, url, loading, error }) => {
                    setOrcUrl(url);
                }}
            </BlobProvider>

            <div
                style={style_butt.download_butt}
                onClick={onORCClick}
                onMouseEnter={() => setOrc_hover(true)}
                onMouseLeave={() => setOrc_hover(false)}
            >
                Office Order Copy
            </div>
        </>
    );
}
