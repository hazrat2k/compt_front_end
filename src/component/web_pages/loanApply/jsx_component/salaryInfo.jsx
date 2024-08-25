import React, { useEffect, useMemo, useState }  from 'react';
import "../css_component/salaryInfo.css";
import axios from "axios";

function SalaryInfo(props){

    const salary_data = props.salary_data;
    const salary_file = props.salary_file;

    var mydate = new Date();
    var month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var prevMonthName = [];
    var currYear = mydate.getFullYear();
    var currMonth = mydate.getMonth();
    var prevMonthSal = [];
    const salText = ["ক) মূল বেতন : ","খ) মোট বেতন : ", "গ) মোট কর্তন : ", "ঘ) নীট বেতন : "];

    const salData = [];
    
    

    for(let i=0;i<salary_file.length;i++){
        for(let j=2;j>=0;j--){
            if((Number(salary_data["EMPLOYEEID"]) === salary_file[i]["SAL_ID"]) && 
            (salary_file[i]["YEAR"] === currYear) &&
            (salary_file[i]["MONTH"] === (currMonth-j))){
                
                prevMonthSal.push([salary_file[i]["BASIC_SALARY"], 
                                    salary_file[i]["GROSS_SALARY"], 
                                    salary_file[i]["TOTAL_DEDUCTION"], 
                                    salary_file[i]["NET_SALARY"]]);


            }
        }
        
    }


    if(prevMonthSal.length != 0){
        prevMonthSal = prevMonthSal.map(row=>row).reverse();
        for(let i=0;i<4;i++){
            salData.push(
                <tbody>
                    <tr>
                        <td className='tableText'>{salText[i]}</td>
                        <td><div className='tableDataInput' > {prevMonthSal[0][i]} </div> </td>
                        <td><div className='tableDataInput' > {prevMonthSal[1][i]} </div> </td>
                        <td><div className='tableDataInput' > {prevMonthSal[2][i]} </div> </td>
                    </tr>
                </tbody>
            );
        }
        var prevMonSal = [];

        for(let i=0;i<3;i++){
            prevMonthName.push(month[currMonth-i-1] + ' ' + currYear);
            prevMonSal.push([prevMonthName[i]]);
            prevMonSal[i] = [...prevMonSal[i],...prevMonthSal[i]];
        }
    }



    

    var prevSal = {"PREV_MON_SAL": prevMonSal};

    props.setSalData(prevSal);
    

    return(
        <div className="salaryInfo">
            <div className="salaryInfoLabel">
                ১০. বেতন সংক্রান্ত তথ্যাবলী (বিগত তিন মাসের) : 
            </div>
            <div className='fullTable'>
                <table>
                    <thead>
                        <tr className='tableHead'>
                            <th className='tableText'>মাস</th>
                            
                            <th><div className='tableDataInput' > {prevMonthName[0]} </div></th>
                            <th><div className='tableDataInput' > {prevMonthName[1]} </div></th>
                            <th><div className='tableDataInput' > {prevMonthName[2]} </div></th>
                        </tr>
                    </thead>

                    {salData}

                </table>
            </div>

        </div>
    )
}


export default SalaryInfo