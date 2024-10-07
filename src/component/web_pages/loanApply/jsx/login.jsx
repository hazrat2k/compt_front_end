import React, { useEffect, useState } from 'react';
import {useNavigate} from 'react-router-dom';
import axios from "axios";
import moment from "moment";

import "../css/login.css";

import Logo from '../jsx_component/logo';


function Login(){


    const [err_text_color, setErr_text_color] = useState(true);

    var emp_data = [];
    var real_dob = "";

    var pay_data = []

    const loginNavigate = useNavigate();

    const [buetId, setBuetId] = useState("");
    const [dob, setDob] = useState("");
    const [error_display,setError_Display] = useState([]);

    const handleInputChange = (event) => {
        const name = event.target.name;
        if (name === "buetId"){
            setBuetId(event.target.value);
        }
        if (name === "dob"){
            setDob(event.target.value);
        }
    }

    const duration_calculation = (date) =>{
        const now = new Date();
        const first_join_date = new Date(date);

        var currentYear = now.getFullYear();
        var currentMonth = now.getMonth();
        var currentDate = now.getDate();

        var first_join_dateYear = first_join_date.getFullYear();
        var first_join_dateMonth = first_join_date.getMonth();
        var first_join_dateDate = first_join_date.getDate();

        var yearDuration = currentYear - first_join_dateYear;
        var monthDuration = 0;
        var dateDuration = 0;

        if(currentMonth >= first_join_dateMonth)
            monthDuration = currentMonth - first_join_dateMonth;
        else{
            yearDuration--;
            monthDuration = 12 + currentMonth - first_join_dateMonth;
        }

        if(currentDate >= first_join_dateDate)
            dateDuration = currentDate - first_join_dateDate;
        else{
            monthDuration--;
            dateDuration = 31 + currentDate - first_join_dateDate;
            if(monthDuration < 0){
                monthDuration = 11;
                yearDuration--;
            }
        }

        return {year: yearDuration, month: monthDuration, day: dateDuration};

    }

    const error_message = (str) => {
        setErr_text_color(!err_text_color);
        var e_t_c = "red";
        if(err_text_color) e_t_c = "black";

        const temp = [];
        temp.push(
            <div className="login_text_area">
                <div className='login_error_Text' style={{ color: e_t_c }}>
                    {str}
                </div>
            </div>
        );
        setError_Display(temp);
    }

    const checkValidation = () => {

        const duration = duration_calculation(real_dob);

        if(duration["year"] < 10){
            error_message("Service period needs to be more than 10 years. Yours is "+duration["year"]+" years, "+duration["month"]+" months, "+duration["day"]+" days");
            return false;
        }

        const retirementDate = new Date(emp_data[0]["DATE_OF_RETIREMENT"]);
        const currentDate = new Date();

        if(retirementDate < currentDate){
            error_message("You are already retired.");
            return false;
        }

        return true;

    }

    const authenticate = async (e) => {
        e.preventDefault();

        var data_found = false;

        const uploadData = {
            "BUETID": buetId
        }

        try{
            const res = await axios.post("http://localhost:8800/application_login", uploadData);
            emp_data = res.data;

            const uploadPay = {
                "EMPLOYEEID": emp_data[0]["EMPLOYEEID"]
            }

            const pay_res = await axios.post("http://localhost:8800/pay_valid", uploadPay);
            pay_data = pay_res.data;

            
        }catch(err){
            console.log(err);
        }


        real_dob = moment(new Date(emp_data[0]["DATE_OF_BIRTH"])).format("YYYY-MM-DD");

        if(pay_data.length == 0){
            error_message("You are currently not an employee of BUET");
            return;
        }

        if(dob === real_dob){
            data_found = true;
            if(checkValidation()){
                loginNavigate('/application/1', { state: {info: emp_data[0], used: "no"} });
            }
        }

        
        

        if(!data_found){
            error_message("Invalid BUET ID and/or password \n Try Again!!!");
        }

    }

    
    return (
        <div className='login_body'>
            <div className="login_logo">
                <Logo />
            </div>
            <div>
                <div className="login">
                    <div className='login_label' >
                        Application Login
                    </div>

                    <div className='login_form'>
                        <form >
                            <div className='login_form_items' >
                                <div className="login_text_area">
                                    <input
                                        type="text"
                                        id="buetId"
                                        name="buetId"
                                        placeholder="BUET ID"
                                        className="login_text_input"
                                        onChange={handleInputChange} 

                                    />
                                </div>
                                <div className="login_text_area">
                                
                                    <input
                                        type="text"
                                        id="dob"
                                        name="dob"
                                        placeholder="DOB"
                                        onFocus={(e) => (e.target.type = "date")}
                                        className="login_text_input"
                                        min="1900-01-01" max="2025-01-01"
                                        onChange={handleInputChange} 
                                        
                                    />
                                </div>

                                <div className="login_text_area">
                                    <button className="login_btn" onClick={authenticate}>
                                        LOGIN
                                    </button>
                                </div>

                                {error_display}

                                
                            </div>
                            
                        </form>
                    </div>
                    
                </div>
            </div>
            

        </div>
        
    );
}

export default Login;