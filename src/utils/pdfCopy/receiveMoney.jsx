import React from "react";
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Font,
    PDFViewer,
} from "@react-pdf/renderer";

// Create styles
const styles = StyleSheet.create({
    viewer: {
        width: window.innerWidth,
        height: window.innerHeight,
    },
    page: {
        flexDirection: "row",
        padding: 30,
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1,
    },
    header: {
        fontSize: 18,
        textAlign: "center",
        color: "green",
        marginBottom: 10,
    },
    table: {
        display: "table",
        width: "auto",
        margin: "auto",
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#000",
    },
    tableRow: {
        flexDirection: "row",
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#000",
    },
    tableCol: {
        width: "50%",
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#000",
        padding: 5,
    },
    tableHeader: {
        fontSize: 12,
        fontWeight: "bold",
        backgroundColor: "#f2f2f2",
        textAlign: "center",
    },
    tableCell: {
        fontSize: 12,
        textAlign: "center",
    },
});

// Create Document Component

const MyDocument = (
    <Document>
        <Page style={styles.page}>
            <View style={styles.section}>
                <Text style={styles.header}>Income</Text>
                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <Text style={[styles.tableCol, styles.tableHeader]}>
                            Main Head
                        </Text>
                        <Text style={[styles.tableCol, styles.tableHeader]}>
                            Taka
                        </Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCol}>
                            FDR Encash (Principal)
                        </Text>
                        <Text style={styles.tableCol}>10000</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCol}>
                            Monthly Subscription Fee
                        </Text>
                        <Text style={styles.tableCol}>142016</Text>
                    </View>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.header}>Expense</Text>
                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <Text style={[styles.tableCol, styles.tableHeader]}>
                            Main Head
                        </Text>
                        <Text style={[styles.tableCol, styles.tableHeader]}>
                            Taka
                        </Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCol}>Bank Charge</Text>
                        <Text style={styles.tableCol}>3045</Text>
                    </View>
                </View>
            </View>
        </Page>
    </Document>
);

export default function ReceiveMoney() {
    

    return (
        <>
            <PDFViewer style={styles.viewer}>
                <MyDocument />
            </PDFViewer>
        </>
    );
}
