import React from "react";
import "../css_component/previewText.css";


function PreviewText(props){
    return(
        <div>
            <div className="previewData">
                <div className="previewDataLabel">
                    {props.label}
                </div>
                <div className="previewColon">
                    :
                </div>
                <div className="previewDataValue">
                    {props.value}
                </div>
            </div>
        </div>
    );
}


export default PreviewText;