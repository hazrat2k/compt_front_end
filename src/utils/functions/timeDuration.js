export const timeDuration = (date1, date2) => {
    const now = new Date(date1);
    const first_join_date = new Date(date2);

    var currentYear = now.getFullYear();
    var currentMonth = now.getMonth();
    var currentDate = now.getDate();

    var first_join_dateYear = first_join_date.getFullYear();
    var first_join_dateMonth = first_join_date.getMonth();
    var first_join_dateDate = first_join_date.getDate();

    var yearDuration = currentYear - first_join_dateYear;
    var monthDuration = 0;
    var dateDuration = 0;

    if (currentMonth >= first_join_dateMonth)
        monthDuration = currentMonth - first_join_dateMonth;
    else {
        yearDuration--;
        monthDuration = 12 + currentMonth - first_join_dateMonth;
    }

    if (currentDate >= first_join_dateDate)
        dateDuration = currentDate - first_join_dateDate;
    else {
        monthDuration--;
        dateDuration = 31 + currentDate - first_join_dateDate;
        if (monthDuration < 0) {
            monthDuration = 11;
            yearDuration--;
        }
    }

    return [yearDuration, monthDuration, dateDuration];
};
