import React from "react";
import loanPersonnel from "../../stores/const/loanPersonnel";


const AppStatus = (value) => {
    var ret_val = "";

    if (value <= 5) {
        ret_val = "Loan Assesment (" + loanPersonnel[value] + ")";
    } else if (value > 5 && value <= 11) {
        ret_val = "Sanction (" + loanPersonnel[value] + ")";
    } else if (value > 11 && value <= 14) {
        ret_val = "Office Order (" + loanPersonnel[value] + ")";
    } else if (value > 14) {
        ret_val = "Bill (" + loanPersonnel[value] + ")";
    }

    return ret_val;
};

export default AppStatus