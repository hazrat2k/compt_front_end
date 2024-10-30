import React from "react";
import "./doubleButton.css";

export default function DoubleButton(props) {
    return (
        <div className="doubleButton">
            <button
                className="normalButton"
                onClick={(e) => {
                    e.preventDefault();
                    props.clickedButton("first");
                }}
            >
                {props.firstButtonName}
            </button>
            <button
                className="normalButton"
                onClick={(e) => {
                    e.preventDefault();
                    props.clickedButton("second");
                }}
            >
                {props.secondButtonName}
            </button>
        </div>
    );
}
