import React from "react"
import { Routes, Route } from 'react-router';

import Welcome from "./component/web_pages/welcome/welcome";
import PersonnelLogin from "./component/web_pages/personeelLogin/personnelLogin";

import Login from './component/web_pages/loanApply/jsx/login';
import BasicInfo from './component/web_pages/loanApply/jsx/basicInfo';
import PersonalInfo from './component/web_pages/loanApply/jsx/personalInfo';
import SalServInfo from './component/web_pages/loanApply/jsx/salServInfo';
import LoanInfo from './component/web_pages/loanApply/jsx/loanInfo';
import LastPageInfo from './component/web_pages/loanApply/jsx/lastPageInfo';
import PreviewApplication from './component/web_pages/loanApply/jsx/previewApplication';

import AboutUs from "./component/web_pages/aboutUs/aboutUs";
import Administration from "./component/web_pages/administration/administration";
import Services from "./component/web_pages/services/services";
import Sections from "./component/web_pages/sections/sections";
import Downloads from "./component/web_pages/downloads/downloads";
import Notices from "./component/web_pages/notices/notices";
import Contact from "./component/web_pages/contact/contact";




export default function App() {

return (
    <>

        <Routes>

            <Route 
                path="/" 
                element={ <Welcome /> }
            />

            <Route 
                path="/login" 
                element={ <PersonnelLogin /> }
            />


            <Route 
                path="/loanApplication" 
                element={ <Login /> }
            />

            <Route 
                path="/application/1" 
                element={ <BasicInfo /> }
                
            />

            <Route 
                path="/application/2" 
                element={ <PersonalInfo /> }

            />

            <Route 
                path="/application/3" 
                element={ <SalServInfo /> }

            />

            <Route 
                path="/application/4" 
                element={ <LoanInfo /> }

            />


            <Route 
                path="/application/5" 
                element={ <LastPageInfo /> }

            />

            <Route 
                path="/application/preview" 
                element={ <PreviewApplication /> }

            />



            <Route 
                path="/aboutus" 
                element={ <AboutUs /> }
            />

            <Route 
                path="/administration" 
                element={ <Administration /> }
            />

            <Route 
                path="/services" 
                element={ <Services /> }
            />

            <Route 
                path="/sections" 
                element={ <Sections /> }
            />

            <Route 
                path="/downloads" 
                element={ <Downloads /> }
            />

            <Route 
                path="/notices" 
                element={ <Notices /> }
            />

            <Route 
                path="/contact" 
                element={ <Contact /> }
            />
 


        </Routes>
        
    

    </>
);

}

