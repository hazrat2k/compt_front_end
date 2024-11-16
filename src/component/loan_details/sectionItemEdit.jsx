import React from "react";

import "./sectionEditItem.css";

import { TextField } from "@mui/material";

export default function SectionEditItem(props) {
    return (
        <div className="section_item">
            <div className="sec_item_def">{props.index}</div>
            <div className="section_item_colon sec_item_def">.</div>
            <div className="section_item_label sec_item_def">{props.label}</div>
            <div className="section_item_colon sec_item_def">:</div>
            <TextField
                id="standard-basic"
                variant="standard"
                // error={props.helperText != ""}
                // helperText={props.helperText}
                type="number"
                value={props.value}
                placeholder="i.e. 22000"
                onChange={(e) => {
                    props.setValue(e.target.value);
                }}
            />
        </div>
    );
}
