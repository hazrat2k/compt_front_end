import React, { useState } from "react";
import "./dataField.css";

export default function DataField(props) {
    return (
        <div className="dataField" ref={props.refer}>
            <div className="dataLabelValid">
                <span className="dataLabel">{props.label}</span>
                <div className="dataValid">{props.validData}</div>
            </div>

            <div className="dataInputField">
                <input
                    type={props.dataType}
                    className="dataInput"
                    name={props.id}
                    placeholder={props.placeholder}
                    value={props.value}
                    onChange={(e) => {
                        props.setValue(e.target.value.toUpperCase());
                    }}
                />

                <button
                    className="dataClearBtn"
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
