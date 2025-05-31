import React from "react";

const Singleuserdata = ({ singleData }) => {
    const { name, email, phone, website } = singleData;
    console.log(singleData);

    return (
        <div>
            <h1>{name}</h1>
            <h2>{email}</h2>
            <h3>{phone}</h3>
            <h4>{website}</h4>
        </div>
    );
};

export default Singleuserdata;
