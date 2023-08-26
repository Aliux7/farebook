import React, { useState } from "react";
import MiniHeader from "../components/layout/miniHeader";
import { NavLink, useNavigate } from "react-router-dom";
import SidebarReels from "../components/layout/sidebarReels";

const ReelsCreate = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);


  return (
    <div style={{ width:'100vw', height:'100vh', margin:'0px', display:'flex', justifyContent:'flex-end'}}>
      <div className="headerSidebar">
        <SidebarReels selectedFile={selectedFile} setSelectedFile={setSelectedFile}/>
        <MiniHeader/>
      </div>
      {selectedFile && (
        <div style={{width:'75vw', display:'flex', justifyContent:'center', alignItems:'center'}}>
          <div style={{border: '20px solid var(--header_background)', borderRadius:'20px', borderTopWidth: '50px', padding:'1vw 7vw'}}>
          {selectedFile && (
            <video
              src={URL.createObjectURL(selectedFile)}
              style={{maxWidth:'300px', maxHeight: '600px', width:'30vw'}}
              autoPlay
            />
          )}
        </div>
        </div>
      )}
    </div>
  );
};

export default ReelsCreate;
