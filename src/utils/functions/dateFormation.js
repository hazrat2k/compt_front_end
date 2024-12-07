import moment from "moment";

export const dateFormation = (date) => {
    var temp_date = new Date(date);
    return moment(temp_date).format("DD MMM YYYY");
};
