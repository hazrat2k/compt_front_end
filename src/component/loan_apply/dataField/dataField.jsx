import React, { useState } from "react";

import TextField from "@mui/material/TextField";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";

import "./dataField.css";

const filter = createFilterOptions();

export default function DataField(props) {
    return (
        <div className="dataField" ref={props.refer}>
            <div className="dataLabel" style={{ fontSize: props.fontSize }}>
                {props.label}
            </div>
            <div
                className="dataLabel dataColon"
                style={{ fontSize: props.fontSize }}
            >
                :
            </div>
            {props.type == "data" ? (
                <div className="dataInput" style={{ fontSize: props.fontSize }}>
                    {props.value}
                </div>
            ) : (
                ""
            )}

            {props.type == "input" ? (
                <TextField
                    style={{ width: "68%" }}
                    id="standard-basic"
                    variant="standard"
                    error={props.helperText != ""}
                    helperText={props.helperText}
                    type={props.dataType}
                    value={props.value}
                    placeholder={props.placeholder}
                    onChange={(e) => {
                        props.setValue(e.target.value.toUpperCase());
                    }}
                />
            ) : (
                ""
            )}

            {props.type == "suggestedInput" ? (
                <Autocomplete
                    value={props.value}
                    onChange={(event, newValue) => {
                        if (typeof newValue === "string") {
                            props.setValue({
                                title: newValue,
                            });
                        } else if (newValue && newValue.inputValue) {
                            // Create a new value from the user input
                            props.setValue({
                                title: newValue.inputValue,
                            });
                        } else {
                            props.setValue(newValue);
                        }
                    }}
                    filterOptions={(options, params) => {
                        const filtered = filter(options, params);

                        const { inputValue } = params;
                        // Suggest the creation of a new value
                        const isExisting = options.some(
                            (option) => inputValue === option.title
                        );
                        if (inputValue !== "" && !isExisting) {
                            filtered.push({
                                inputValue,
                                title: `Add "${inputValue}"`,
                            });
                        }

                        return filtered;
                    }}
                    selectOnFocus
                    clearOnBlur
                    handleHomeEndKeys
                    id="free-solo-with-text-demo"
                    options={props.options}
                    getOptionLabel={(option) => {
                        // Value selected with enter, right from the input
                        if (typeof option === "string") {
                            return option;
                        }
                        // Add "xxx" option created dynamically
                        if (option.inputValue) {
                            return option.inputValue;
                        }
                        // Regular option
                        return option.title;
                    }}
                    renderOption={(props, option) => {
                        const { key, ...optionProps } = props;
                        return (
                            <li key={key} {...optionProps}>
                                {option.title}
                            </li>
                        );
                    }}
                    sx={{ width: "68%" }}
                    freeSolo
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            placeholder={props.placeholder}
                            error={props.helperText != ""}
                            helperText={props.helperText}
                        />
                    )}
                />
            ) : (
                ""
            )}
        </div>
    );
}
