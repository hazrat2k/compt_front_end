const TEACHER_HIGHEST_HBL_CL_AMOUNT = 3000000;
const OFFICER_HIGHEST_HBL_CL_AMOUNT = 2500000;
const STAFF_1_HIGHEST_HBL_CL_AMOUNT = 2000000;
const STAFF_2_HIGHEST_HBL_CL_AMOUNT = 1500000;

const TEACHER_HIGHEST_LL_AMOUNT = 100000;
const OFFICER_HIGHEST_LL_AMOUNT = 80000;
const STAFF_HIGHEST_LL_AMOUNT = 60000;

const LoanAmountCheck = (category, loanType, appliedAmount) => {
    if (category == "A") {
        if (loanType == "Laptop Loan") {
            return appliedAmount > TEACHER_HIGHEST_LL_AMOUNT
                ? TEACHER_HIGHEST_LL_AMOUNT
                : appliedAmount;
        } else if (
            loanType == "House Building Loan" ||
            loanType == "Consumer Loan"
        ) {
            return appliedAmount > TEACHER_HIGHEST_HBL_CL_AMOUNT
                ? TEACHER_HIGHEST_HBL_CL_AMOUNT
                : appliedAmount;
        }
    } else if (category == "B") {
        if (loanType == "Laptop Loan") {
            return appliedAmount > OFFICER_HIGHEST_LL_AMOUNT
                ? OFFICER_HIGHEST_LL_AMOUNT
                : appliedAmount;
        } else if (
            loanType == "House Building Loan" ||
            loanType == "Consumer Loan"
        ) {
            return appliedAmount > OFFICER_HIGHEST_HBL_CL_AMOUNT
                ? OFFICER_HIGHEST_HBL_CL_AMOUNT
                : appliedAmount;
        }
    } else if (category == "C") {
        if (loanType == "Laptop Loan") {
            return appliedAmount > STAFF_HIGHEST_LL_AMOUNT
                ? STAFF_HIGHEST_LL_AMOUNT
                : appliedAmount;
        } else if (
            loanType == "House Building Loan" ||
            loanType == "Consumer Loan"
        ) {
            return appliedAmount > STAFF_1_HIGHEST_HBL_CL_AMOUNT
                ? STAFF_1_HIGHEST_HBL_CL_AMOUNT
                : appliedAmount;
        }
    } else if (category == "D") {
        if (loanType == "Laptop Loan") {
            return appliedAmount > STAFF_HIGHEST_LL_AMOUNT
                ? STAFF_HIGHEST_LL_AMOUNT
                : appliedAmount;
        } else if (
            loanType == "House Building Loan" ||
            loanType == "Consumer Loan"
        ) {
            return appliedAmount > STAFF_2_HIGHEST_HBL_CL_AMOUNT
                ? STAFF_2_HIGHEST_HBL_CL_AMOUNT
                : appliedAmount;
        }
    }
};

export default LoanAmountCheck;
