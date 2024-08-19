import React from "react"
import { Routes, Route } from 'react-router';

import Welcome from "./component/jsx/welcome";
import PersonnelLogin from "./component/jsx/personnelLogin";
import AboutUs from "./component/jsx/aboutUs";
import Administration from "./component/jsx/administration";
import Services from "./component/jsx/services";
import Sections from "./component/jsx/sections";
import Downloads from "./component/jsx/downloads";
import Notices from "./component/jsx/notices";
import Contact from "./component/jsx/contact";


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
)
}

