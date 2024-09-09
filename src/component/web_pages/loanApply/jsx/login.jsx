import React, { useEffect, useState } from 'react';
import {useNavigate} from 'react-router-dom';
import "../css/login.css";
import axios from "axios";
import Logo from '../jsx_component/logo';


function Login(){


    const [err_text_color, setErr_text_color] = useState(true);

    const [emp_data, setEmp_data] = useState([]);

    const loginNavigate = useNavigate();

    useEffect( () => {
        const fetch_empl_data = async () =>{
            try{
                const res = await axios.get("http://localhost:8800/employee");
                setEmp_data(res.data);

            }catch(err){
                console.log(err);
            }
        }
        fetch_empl_data();
    }, []);


    const [buetId, setBuetId] = useState("");
    const [dob, setDob] = useState("");
    const [error_display,setError_Display] = useState([]);

    function handleInputChange(event){
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

    function authenticate(e){
        e.preventDefault();

        const emp_data_length = emp_data.length;

        var data_found = false;

        for(let i=0;i<emp_data_length;i++){
            if (buetId === emp_data[i]["IDNO"] && dob === emp_data[i]["DATE_OF_BIRTH"]) {
                data_found = true;
                const duration = duration_calculation(emp_data[i]["DATE_FIRST_JOIN"]);
                if(duration["year"] >= 10){
                    loginNavigate('/application/1', { state: {info: emp_data[i], used: "no"} });
                }else{
                    error_message("Service period needs to be more than 10 years. Yours is "+duration["year"]+" years, "+duration["month"]+" months, "+duration["day"]+" days");
                }
                break;
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