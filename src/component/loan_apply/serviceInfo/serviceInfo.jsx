import React, { useState } from "react";
import "./serviceInfo.css";
import moment from "moment";

import PiDataField from "../piDataField/piDataField";

import DataField from "../dataField/dataField";

export default function ServiceInfo(props) {
    var service_data = props.service_data;

    const now = new Date();
    const first_join_date = new Date(service_data["DATE_FIRST_JOIN"]);

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

    var servData = {};
    servData["EMPLOYEE_ID"] = service_data["EMPLOYEE_ID"];
    servData["DATE_FIRST_JOIN"] = service_data["DATE_FIRST_JOIN"];
    servData["SERV_PERIOD"] =
        yearDuration +
        " YEARS, " +
        monthDuration +
        " MONTHS, " +
        dateDuration +
        " DAYS";
    servData["DATE_OF_RETIREMENT"] = service_data["DATE_OF_RETIREMENT"];
    servData["APPOINTMENT_TYPE"] =
        service_data["APPOINTMENT_TYPE"].toUpperCase();

    props.setServData(servData);

    return (
        <div className="serviceInfo">
            <div className="serviceInfoLabel">
                ৮. আবেদনকারীর চাকুরী সংক্রান্ত তথ্যাবলী :
            </div>

            <div className="serviceField">
                <DataField
                    type="data"
                    label="ক) বুয়েট আই.ডি. নং "
                    value={servData["EMPLOYEE_ID"]}
                />

                <DataField
                    type="data"
                    label="খ) বিশ্ববিদ্যালয়ের চাকুরী "
                    value={servData["APPOINTMENT_TYPE"]}
                />

                <DataField
                    type="data"
                    label="গ) বিশ্ববিদ্যালয়ে যোগদানের তারিখ "
                    value={moment(new Date(servData["DATE_FIRST_JOIN"])).format(
                        "DD MMM YYYY"
                    )}
                />

                <DataField
                    type="data"
                    label="ঘ) এই বিশ্ববিদ্যালয়ে মোট চাকুরীকাল "
                    value={servData["SERV_PERIOD"]}
                />

                <DataField
                    type="data"
                    label="ঙ) চাকুরীর বয়স পূর্তির তারিখ (শিক্ষকের বয়স ৬৫ বছর, কর্মকর্তা/কর্মচারীর বয়স ৬০ বছর) "
                    value={moment(
                        new Date(servData["DATE_OF_RETIREMENT"])
                    ).format("DD MMM YYYY")}
                />
            </div>
        </div>
    );
}
