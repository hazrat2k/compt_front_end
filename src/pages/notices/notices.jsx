import React, { useEffect, useState } from "react";
import "./notices.css";

import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Download, Eye } from "lucide-react";

import axios from "axios";
import { backend_site_address } from "../../stores/const/siteAddress";

import NavBar from "../../component/page_compo/navBar/navBar";
import Footer from "../../component/page_compo/footer/footer";

export default function Notices() {
    const [noticeList, setNoticeList] = useState([]);

    const getDirectDownloadLink = (driveLink) => {
        const match = driveLink.match(/\/d\/(.*)\/view/);
        return match
            ? `https://drive.google.com/uc?export=download&id=${match[1]}`
            : driveLink;
    };

    const getPreviewLink = (driveLink) => {
        const match = driveLink.match(/\/d\/(.*)\/view/);
        return match
            ? `https://drive.google.com/file/d/${match[1]}/preview`
            : driveLink;
    };

    const loadNotice = async () => {
        try {
            const noticeRes = await axios.get(
                "http://" + backend_site_address + "/get_notices"
            );
            setNoticeList(noticeRes.data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        loadNotice();
    }, []);

    return (
        <>
            <NavBar hide={{ nav_mid: true }} />
            <div className="download_page">
                <div className="download_page_heading">Notices</div>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Notice No</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Description</TableCell>
                            {/* <TableCell>Description</TableCell> */}
                            <TableCell>Link</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {noticeList.map((notice) => (
                            <TableRow key={notice.NOTICE_NO}>
                                <TableCell>{notice.NOTICE_NO}</TableCell>
                                <TableCell>{notice.NOTICE_DATE}</TableCell>
                                <TableCell>{notice.NOTICE_TITLE}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="outlined"
                                        startIcon={<Eye size={16} />}
                                        onClick={() =>
                                            window.open(
                                                getPreviewLink(
                                                    notice.LINK_ADDRESS
                                                ),
                                                "_blank"
                                            )
                                        }
                                    >
                                        Preview
                                    </Button>
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
