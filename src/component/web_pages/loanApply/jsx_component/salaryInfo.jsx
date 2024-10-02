import React, { useEffect, useMemo, useState }  from 'react';
import "../css_component/salaryInfo.css";
import axios from "axios";

export default function SalaryInfo(props){

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

    let nf = new Intl.NumberFormat('en-US');
    

    for(let i=0;i<salary_file.length;i++){

        prevMonthSal.push([salary_file[i]["EMPLOYEE_BASIC"], 
                            salary_file[i]["GROSS_SALARY"], 
                            salary_file[i]["TOTAL_DEDUCTION"], 
                            salary_file[i]["NET_SALARY"]]);
        
    }


    if(prevMonthSal.length != 0){
        prevMonthSal = prevMonthSal.map(row=>row).reverse();
        for(let i=0;i<4;i++){
            salData.push(
                <tbody>
                    <tr>
                        <td className='tableText'>{salText[i]}</td>
                        <td><div className='tableDataInput' > {nf.format(prevMonthSal[0][i])} </div> </td>
                        <td><div className='tableDataInput' > {nf.format(prevMonthSal[1][i])} </div> </td>
                        <td><div className='tableDataInput' > {nf.format(prevMonthSal[2][i])} </div> </td>
                    </tr>
                </tbody>
            );
        }
        var prevMonSal = [];

        var j = 0;

        for(let i=2;i>=0;i--){
            prevMonthName.push(month[salary_file[i]["MONTH"]-1] + ' ' + salary_file[i]["YEAR"]);
            prevMonSal.push([prevMonthName[j]]);
            prevMonSal[j] = [...prevMonSal[j],...prevMonthSal[j]];
            j++;
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
