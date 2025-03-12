import React, { useEffect, useRef, useState } from "react";
import "./sections.css";
import axios from "axios";

import NavBar from "../../component/page_compo/navBar/navBar";
import Footer from "../../component/page_compo/footer/footer";
import { backend_site_address } from "../../stores/const/siteAddress";
import demo_img from "../../assets/employee_img/system_analyst.jpg";
import compt from "../../assets/images/prankanai.jpg";
import ToTitleCase from "../../utils/functions/toTitleCase";

// const employees = [
//     {
//         id: 1,
//         name: "John Doe",
//         designation: "Software Engineer",
//         section: "IT Department",
//         email: "john.doe@example.com",
//         mobile: "+1234567890",
//         pabx: "1234",
//         image: "path/to/john_doe.jpg", // Replace with actual image path
//     },
//     {
//         id: 2,
//         name: "Jane Smith",
//         designation: "Project Manager",
//         section: "Operations",
//         email: "jane.smith@example.com",
//         mobile: "+0987654321",
//         pabx: "5678",
//         image: "path/to/jane_smith.jpg", // Replace with actual image path
//     },
//     {
//         id: 3,
//         name: "Mark Johnson",
//         designation: "HR Specialist",
//         section: "Human Resources",
//         email: "mark.johnson@example.com",
//         mobile: "+1122334455",
//         pabx: "9101",
//         image: "path/to/mark_johnson.jpg", // Replace with actual image path
//     },
// ];

const EmployeeCard = ({ employee }) => {
    return (
        <div className="employee-card">
            {employee.DESIGNATION === "COMPTROLLER" ? (
                <img
                    src={employee.PHOTO_LINK}
                    alt={employee.EMPLOYEE_NAME}
                    className="employee-image"
                    style={{ textAlign: "center" }}
                />
            ) : employee.PHOTO_LINK ? (
                <img
                    src="https://www.buet.ac.bd/web/Content/AdminsImg/noImage.png"
                    alt={employee.EMPLOYEE_NAME}
                    className="employee-image"
                    style={{ textAlign: "center" }}
                />
            ) : (
                <img
                    src="https://www.buet.ac.bd/web/Content/AdminsImg/noImage.png"
                    alt={employee.EMPLOYEE_NAME}
                    className="employee-image"
                    style={{ textAlign: "center" }}
                />
            )}

            <div
                style={{
                    textAlign: "left",
                    fontSize: "large",
                    fontWeight: "bold",
                }}
            >
                {employee.EMPLOYEE_NAME}
            </div>
            <p style={{ textAlign: "left" }}>
                <strong>Designation:</strong> {employee.DESIGNATION}
            </p>
            {/* <p style={{ textAlign: "left" }}>
                <strong>Section:</strong> {employee.SECTION_NAME}
            </p> */}
            <p style={{ textAlign: "left" }}>
                <strong>Email:</strong> {employee.MAIL_ACC}
            </p>
            <p style={{ textAlign: "left" }}>
                <strong>Mobile No:</strong> {employee.MOBILE_NO}
            </p>
            <p style={{ textAlign: "left" }}>
                <strong>PABX No:</strong> {employee.CONTACT_NO}
            </p>
        </div>
    );
};

const LayoutSection = ({ section }) => {
    return <div className="layout-section-text">{ToTitleCase(section)}</div>;
};

const comptroller = {
    EMPLOYEEID: "11516",
    EMPLOYEE_NAME: "DR. PRAN KANAI SHAHA",
    DESIGNATION: "COMPTROLLER",
    SECTION_NAME: "",
    CONTACT_NO: "7146",
    MOBILE_NO: "",
    MAIL_ACC: "sahapk@eee.buet.ac.bd",
    PHOTO_LINK: compt,
    ORDER_IN: "",
};

export default function Sections() {
    const [compt_employee_info, setCompt_employee_info] = useState([]);
    const [disticntSections, setDistinctSections] = useState([]);
    const sectionRef = useRef([]);

    const loadComptEmployeeInfo = async () => {
        try {
            const empInfoRes = await axios.get(
                "http://" + backend_site_address + "/get_employee_compt_info"
            );
            setCompt_employee_info(empInfoRes.data);
            const sectionArray = [
                ...new Set(empInfoRes.data.map((emp) => emp.SECTION_NAME)),
            ];

            setDistinctSections(sectionArray);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        loadComptEmployeeInfo();
    }, []);

    return (
        <>
            <NavBar hide={{ nav_mid: true }} />

            <div className="employee-information-page">
                <div className="section-layout">
                    {disticntSections.map((section) => (
                        <LayoutSection section={section} />
                    ))}
                </div>

                <div className="section-information">
                    <div className="page_heading">Employee Information</div>

                    <div className="employee-cards-container">
                        <EmployeeCard
                            key={comptroller.EMPLOYEEID}
                            employee={comptroller}
                        />
                    </div>

                    {disticntSections.map((section) => (
                        <>
                            <div className="section-head">
                                {ToTitleCase(section)}
                            </div>
                            <div className="employee-cards-container">
                                {compt_employee_info
                                    .filter(
                                        (employee) =>
                                            employee.SECTION_NAME === section
                                    )
                                    .map((employee) => (
                                        <EmployeeCard
                                            key={employee.EMPLOYEEID}
                                            employee={employee}
                                        />
                                    ))}
                            </div>
                        </>
                    ))}
                </div>
            </div>

            <Footer />
        </>
    );
}
