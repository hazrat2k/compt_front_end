import React from "react";
import "./previewText.css";

export default function PreviewText(props) {
    return (
        <div>
            <div className="previewData">
                <div className="previewDataLabel">{props.label}</div>
                <div className="previewColon">:</div>
                <div className="previewDataValue">{props.value}</div>
            </div>
        </div>
    );
}
