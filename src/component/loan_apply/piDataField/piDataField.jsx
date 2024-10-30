import React, { useState } from "react";
import "./piDataField.css";

export default function PiDataField(props) {
    var dataLabel = "";
    var label_color = "black";

    if (props.validData === "") {
        dataLabel = props.label;
    } else {
        dataLabel = props.validData;
        label_color = "red";
    }

    return (
        <div className="piDataField" ref={props.refer}>
            <div className="piDataLabel" style={{ color: label_color }}>
                {dataLabel}
            </div>

            <div className="piDataInputField">
                <input
                    onFocus={(e) => (e.target.type = props.dataType)}
                    className="piDataInput"
                    name={props.id}
                    placeholder={props.placeholder}
                    value={props.value}
                    onChange={(e) => {
                        props.setValue(e.target.value.toUpperCase());
                    }}
                />

                <button
                    className="piDataClearBtn"
                    onClick={(e) => {
                        e.preventDefault();
                        props.setValue("");
                    }}
                >
                    ×
                </button>
            </div>
        </div>
    );
}
