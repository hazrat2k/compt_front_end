const INTEREST_RATE = 7.5;

const CalculateInterest = (amount, installment_no) => {
    return (amount * INTEREST_RATE * installment_no) / (12 * 100);
};

export default CalculateInterest;
