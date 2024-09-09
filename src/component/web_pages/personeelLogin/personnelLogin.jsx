import React, {useState, useEffect} from "react";
import {useNavigate} from 'react-router-dom';
import "./personnelLogin.css";
import axios from "axios";


import NavBar from "../../page_compo/navBar/navBar";
import Footer from "../../page_compo/footer/footer";


export default function PersonnelLogin(){

    const perLoginNavigate = useNavigate();

    const [personeelData, setPersoneelData] = useState([]);

    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [userError, setUserError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [matchError, setMatchError] = useState('');

    useEffect( () => {
        const fetch_personeel_data = async () =>{
            try{
                const res = await axios.get("http://localhost:8800/personeel_login");
                setPersoneelData(res.data);

            }catch(err){
                console.log(err);
            }
        }
        fetch_personeel_data();
    }, []);

    const onButtonClick = (e) => {
        e.preventDefault();

        if ('' === user) {
            setUserError('***Please enter your username');
            return;
        }else{
            setUserError('');
        }
    
    
        if ('' === password) {
            setPasswordError('***Please enter a password');
            return;
        }else{
            setPasswordError('');
        }

        var data_found = false;

        for(let i=0;i<personeelData.length;i++){
            if (user === personeelData[i]["username"] && password === personeelData[i]["password"]) {
                data_found = true;
                perLoginNavigate("/personnel_dashboard", {state : {data : personeelData[i]}})
                break;
            }
        }

        if(!data_found){
            setMatchError("***Invalid username and/or password. Try Again!!!");
            return;
        }else{
            setMatchError("");
        }

    
        

    }



    return(
        <>
            <NavBar hide={{nav_mid: true}} />

            <div className="personnel_login">
                <div className='mainContainer'>
                    <div className='titleContainer'>
                        <div>Personnel Login</div>
                    </div>
                    <br />
                    <div className='inputContainer'>
                        <input
                            value={user}
                            placeholder="Enter your username here"
                            onChange={(ev) => setUser(ev.target.value)}
                            className='inputBox'
                        />
                        <label className="errorLabel">{userError}</label>
                    </div>
                    <br />
                    <div className='inputContainer'>
                        <input
                            type="password"
                            value={password}
                            placeholder="Enter your password here"
                            onChange={(ev) => setPassword(ev.target.value)}
                            className='inputBox'
                        />
                        <label className="errorLabel">{passwordError}</label>
                    </div>
                    <br />
                    <div className='inputContainer'>
                        <input className='inputButton' type="button" onClick={onButtonClick} value={'Log in'} />
                    </div>

                    <label className="errorLabel">{matchError}</label>
                </div>
            </div>

            <Footer />

        </>
    );
}