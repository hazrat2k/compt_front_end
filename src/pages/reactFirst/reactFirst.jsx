import { useState, useEffect } from "react";
import React from "react";
import "./reactFirst.css";
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";

import NavBar from "../../component/page_compo/navBar/navBar";
import Footer from "../../component/page_compo/footer/footer";
import axios, { all } from "axios";
import { backend_site_address } from "../../stores/const/siteAddress";
import { BottomNavigation, useForkRef } from "@mui/material";
import { use } from "react";

export default function ReactFirst() {
    // Define the click handler outside JSX
    const [downloadList, setDownloadList] = useState([]);

    const handleClick = async () => {
        try {
            const downloadLink = await axios.get(
                "http://" + backend_site_address + "/get_download_link"
            );
            setDownloadList(downloadLink.data);
        } catch (err) {
            console.err("Error:", err);
        }
    };

    useEffect(() => {
        handleClick();
    }, []);
    console.log(downloadList);

    /*     const reactFirstAccessData = async () => {
        try {
            const response = await axios.get(
                "http://" + backend_site_address + "/reactFirst_access_data", buetId "
            );
            console.log(response.data);
        } catch (err) {
            console.log(err);
        }
    }; */

    return (
        <>
            <NavBar hide={{ nav_mid: true }} />
            <div>
                <h1>Data of Place Holder:</h1>
            </div>

            <div className="table-bordered">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>SerialNo</TableCell>
                            <TableCell>Description</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {downloadList.map((dList) => (
                            <TableRow key={dList.SERIAL_NO}>
                                <TableCell>{dList.SERIAL_NO}</TableCell>
                                <TableCell>
                                    <a href="www.buet.ac.bd" target="_blank">
                                        {dList.DESCRIPTION}
                                    </a>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            {/* <div>
                <label className="input-form-label">First Input Form</label>
                <form className="input-form-label" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        id="buetId"
                        value={buetId}
                        onChange={(e) => setBuetId(e.target.value)}
                    />
                    <br />
                    <button type="submit">Submit</button>
                </form>
                <button type="submit">Submit</button>
            </div> */}

            <Footer />
        </>
    );
}
