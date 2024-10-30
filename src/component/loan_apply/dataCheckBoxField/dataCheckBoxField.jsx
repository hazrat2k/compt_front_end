import React, { useState } from "react";
import "./dataCheckBoxField.css";

export default function DataCheckBoxField(props) {
    const default_checkOPT = [false, false, false, false, false];
    const [checkOPT, setCheckOPT] = useState(default_checkOPT);

    const items = props.items;
    var value_index = -1;

    if (props.value != "") {
        for (let i = 0; i < items[1].length; i++) {
            if (props.value === items[1][i]) {
                value_index = i;
            }
        }
    }

    const chechBoxHandle = (e) => {
        const { name } = e.target;
        var tempBox = [...checkOPT];
        var temp = tempBox[name];

        if (!temp) {
            tempBox = [...default_checkOPT];
            tempBox[name] = !tempBox[name];
            props.setValue(e.target.value);
        } else {
            tempBox[name] = !tempBox[name];
            props.setValue("");
        }
        setCheckOPT(tempBox);
    };

    const data = [];

    for (let i = 0; i < items[1].length; i++) {
        var index = i;
        var checkedValue = checkOPT[i];

        if (value_index == i) {
            checkedValue = true;
        }

        data.push(
            <div className="dataCheckBox" key={index}>
                <input
                    className="dataCheckBoxInput"
                    type="checkbox"
                    checked={checkedValue}
                    name={index}
                    value={items[1][i]}
                    onChange={chechBoxHandle}
                />
                <div className="dataCheckBoxValue">{items[0][i]}</div>
            </div>
        );
    }

    return (
        <div className="dataCheckBoxField" ref={props.refer}>
            <div className="dataCheckBoxLabelValid">
                <div className="dataCheckBoxLabel">{props.label}</div>
                <div className="dataCheckBoxValid">{props.validData}</div>
            </div>

            {data}
        </div>
    );
}
