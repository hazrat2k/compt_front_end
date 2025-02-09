const LoanInstallmentNoCheck = (remainingServiceMonth, loanType) => {
    if (loanType == "House Building Loan") {
        if (remainingServiceMonth >= 10 && remainingServiceMonth < 30) {
            return 10;
        } else if (remainingServiceMonth >= 30 && remainingServiceMonth < 50) {
            return 30;
        } else if (remainingServiceMonth >= 50 && remainingServiceMonth < 80) {
            return 50;
        } else if (remainingServiceMonth >= 80 && remainingServiceMonth < 100) {
            return 80;
        } else if (
            remainingServiceMonth >= 100 &&
            remainingServiceMonth < 120
        ) {
            return 100;
        } else if (
            remainingServiceMonth >= 120 &&
            remainingServiceMonth < 150
        ) {
            return 120;
        } else if (
            remainingServiceMonth >= 150 &&
            remainingServiceMonth < 180
        ) {
            return 150;
        } else {
            return 180;
        }
    } else if (loanType == "Consumer Loan") {
        if (remainingServiceMonth >= 10 && remainingServiceMonth < 30) {
            return 10;
        } else if (remainingServiceMonth >= 30 && remainingServiceMonth < 50) {
            return 30;
        } else if (remainingServiceMonth >= 50 && remainingServiceMonth < 80) {
            return 50;
        } else if (remainingServiceMonth >= 80 && remainingServiceMonth < 100) {
            return 80;
        } else {
            return 100;
        }
    } else if (loanType == "Laptop Loan") {
        if (remainingServiceMonth >= 10 && remainingServiceMonth < 30) {
            return 10;
        } else if (remainingServiceMonth >= 30 && remainingServiceMonth < 50) {
            return 30;
        } else if (remainingServiceMonth >= 50 && remainingServiceMonth < 72) {
            return 50;
        } else {
            return 72;
        }
    }
};

export default LoanInstallmentNoCheck;
