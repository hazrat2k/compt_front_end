import React, {useState, useEffect} from 'react';
import { useNavigate, useLocation } from 'react-router';
import "../css/salServInfo.css";
import Logo from "../jsx_component/logo";
import axios from 'axios';

import ServiceInfo from '../jsx_component/serviceInfo';
import SalaryInfo from '../jsx_component/salaryInfo';
import DoubleButton from '../jsx_component/doubleButton';

function SalServInfo(){

    const salServNavigate = useNavigate();
    const { state } = useLocation();
    const salary_file = state["file"]["salary"];

    var salServData = state["info"];

    var state_used = "no";
    
    if(state["used"] === "yes"){
        state_used = "yes";
    }

    const [loan_file, setLoan_file] = useState([]);


    useEffect( () => {
        const fetch_loan_data = async () =>{
            try{
                const res = await axios.get("http://localhost:8800/loan");
                setLoan_file(res.data);

            }catch(err){
                console.log(err);
            }
        }
        fetch_loan_data();
    }, []);


    const setSalServData = (data) => {

        salServData = {...salServData, ...data};

    };


    function onSalServAuthenticate(button){

        if(button == "first")
            salServNavigate('/application/2', {state: {info: salServData, used: "yes"}});

        if(button == "second"){
            const file = {salary: salary_file, loan: loan_file}
            salServNavigate('/application/4', {state: {info: salServData, file: file, used: state_used}});
        }

    }


    return(
        <div>
            <div className="salServ_logo">
                <Logo />
            </div>

            <div className='salServ_info'>

                <ServiceInfo service_data={state["info"]} setServData={(data) => {setSalServData(data)}} />

                <SalaryInfo salary_data={state["info"]} salary_file={salary_file}  setSalData={(data) => {setSalServData(data)}} />

                <DoubleButton 
                    firstButtonName="পূর্ববর্তী"
                    secondButtonName="পরবর্তী"
                    clickedButton={(clicked) => {onSalServAuthenticate(clicked)}}
                />

            </div>
        </div>
            
    );


}

export default SalServInfo;