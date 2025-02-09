import React, { useEffect, useState } from "react";
import "./serviceInfo.css";
import moment from "moment";

import DataField from "../dataField/dataField";
import useLoanInfoStore from "../../../stores/loanInfoStore";
import { timeDuration } from "../../../utils/functions/timeDuration";

export default function ServiceInfo(props) {
    var service_data = props.service_data;

    const servAddLoanField = useLoanInfoStore((state) => state.addLoanField);
    const servDataField = useLoanInfoStore((state) => state.loanInfo);

    const now = new Date();
    const first_join_date = new Date(service_data["DATE_FIRST_JOIN"]);
    const servPeriod = timeDuration(now, first_join_date);

    useEffect(() => {
        servAddLoanField("EMPLOYEE_ID", service_data["EMPLOYEE_ID"]);
        servAddLoanField("DATE_FIRST_JOIN", service_data["DATE_FIRST_JOIN"]);
        servAddLoanField(
            "SERV_PERIOD",
            servPeriod[0] +
                " YEARS " +
                servPeriod[1] +
                " MONTHS " +
                servPeriod[2] +
                " DAYS"
        );

        let temp_date = new Date(service_data["DATE_OF_BIRTH"]);

        let teacherOrNot = service_data["EMPLOYEE_ID"][0] == "T";

        let retYear = teacherOrNot ? 65 : 60;

        temp_date.setFullYear(temp_date.getFullYear() + retYear);

        servAddLoanField("DATE_OF_RETIREMENT", temp_date);
        servAddLoanField(
            "APPOINTMENT_TYPE",
            service_data["APPOINTMENT_TYPE"].toUpperCase()
        );
    }, []);

    return (
        <div className="serviceInfo">
            <div className="serviceInfoLabel">
                ৮. আবেদনকারীর চাকুরী সংক্রান্ত তথ্যাবলী :
            </div>

            <div className="serviceField">
                <DataField
                    type="data"
                    label="ক) বুয়েট আই.ডি. নং "
                    value={servDataField["EMPLOYEE_ID"]}
                />

                <DataField
                    type="data"
                    label="খ) চাকুরীর ধরণ "
                    value={servDataField["APPOINTMENT_TYPE"]}
                />

                <DataField
                    type="data"
                    label="গ) যোগদানের তারিখ "
                    value={moment(
                        new Date(servDataField["DATE_FIRST_JOIN"])
                    ).format("DD MMM YYYY")}
                />

                <DataField
                    type="data"
                    label="ঘ) মোট চাকুরীকাল "
                    value={servDataField["SERV_PERIOD"]}
                />

                <DataField
                    type="data"
                    label="ঙ) অবসরের তারিখ "
                    value={moment(
                        new Date(servDataField["DATE_OF_RETIREMENT"])
                    ).format("DD MMM YYYY")}
                />
            </div>
        </div>
    );
}
