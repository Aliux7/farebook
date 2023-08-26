import React from "react";
import MiniHeader from "../components/layout/miniHeader";
import { NavLink, useNavigate } from "react-router-dom";
import ReelsCarousel from "../components/reelsCarousel";

const Reels = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="headerSidebar">
        <button className="closeButton" style={{fontSize:'24px'}} onClick={() => navigate('/')}>X</button>
        <img src="/asset/miniFacebookIcon.png" alt="Facebook Icon" className="closeButton" style={{ width:"35px", margin:"0px", padding:"0px", marginLeft:'50px'}}/>
        <div className="closeButton" style={{marginLeft:'100px'}}>Reels</div>
        <MiniHeader/>
        <div style={{position:'absolute', right:'30px', top:'70px', backgroundColor:'var(--hover_background)', padding:'10px', borderRadius:'30px', cursor:'pointer'}} onClick={() => navigate('/reels/create')}>Create Reels</div>
      </div>
      <ReelsCarousel/>
    </div>
  );
};

export default Reels;
