import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ShowHeader = ({children}) => {
    
    const location = useLocation();

    if(location.pathname == '/login' || location.pathname == '/register' || location.pathname.startsWith("/verifyEmail/") || location.pathname == '/forgottenAccount'
     || location.pathname == '/story' || location.pathname == '/story/create' || location.pathname == '/reels' || location.pathname == '/reels/create'){
        return
    }

    return <div>{children}</div>;

};

export default ShowHeader;
