import React from "react";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Download } from "lucide-react";
import "./downloads.css";

import NavBar from "../../component/page_compo/navBar/navBar";
import Footer from "../../component/page_compo/footer/footer";

const files = [
    { name: "Sample.pdf", size: "1.2 MB", url: "/files/sample.pdf" },
    { name: "Sample2.pdf", size: "850 KB", url: "/files/sample2.pdf" },
    {
        name: "Sample3.pdf",
        size: "2.4 MB",
        url: "/files/sample3.pdf",
    },
];

export default function Downloads() {
    return (
        <>
            <NavBar hide={{ nav_mid: true }} />
            <div className="download_page">
                <div className="download_page_heading">Download Files</div>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>File Name</TableCell>
                            <TableCell>Size</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {files.map((file, index) => (
                            <TableRow key={index}>
                                <TableCell>{file.name}</TableCell>
                                <TableCell>{file.size}</TableCell>
                                <TableCell>
                                    <a
                                        href={file.url}
                                        download
                                        style={{ textDecoration: "none" }}
                                    >
                                        <Button
                                            variant="outlined"
                                            startIcon={<Download size={16} />}
                                        >
                                            Download
                                        </Button>
                                    </a>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <Footer />
        </>
    );
}
