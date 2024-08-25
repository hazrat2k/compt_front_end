import React from "react";
import "../css_component/doubleButton.css"


function DoubleButton(props){

    return(
        <div className='doubleButton'>
            <button className='normalButton' onClick={(e) => {e.preventDefault(); props.clickedButton("first");}} >
                {props.firstButtonName}
            </button>
            <button className='normalButton' onClick={(e) => {e.preventDefault(); props.clickedButton("second");}} >
                {props.secondButtonName}
            </button>
        </div>
    );
}

export default DoubleButton;