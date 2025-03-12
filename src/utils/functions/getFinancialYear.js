const GetFinancialYear = () => {
    let finYear = "";
    const now = new Date();
    if (now.getMonth() + 1 < 7) {
        finYear = now.getFullYear() - 1 + "-" + now.getFullYear();
    } else {
        finYear = now.getFullYear() + "-" + (now.getFullYear() + 1);
    }

    return finYear;
};

export default GetFinancialYear;
