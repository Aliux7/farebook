import React, { useRef, useState } from "react";
import MiniHeader from "../components/layout/miniHeader";
import Sidebar from "../components/layout/sidebar"; // Import your Sidebar component
import '../styles/Story.css'

const StoryCreate = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [editStoryUI, setEditStoryUI] = useState(false); 
  const [previewImageStoryUI, setPreviewImageStoryUI] = useState(false); 

  const [textStory, setTextStory] = useState("");
  const [backgroundStory, setBackgroundStory] = useState("red");
  const [fontStory, setFontStory] = useState("san-serif");

  const handleCreatePhoto = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleCreateText = () => {
    setEditStoryUI(true);
    console.log(editStoryUI);
  };

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageStory, setImageStory] = useState(false);
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    await setSelectedFile(file);
    setImageStory(true);
    setPreviewImageStoryUI(true);
  };

  return (
    <div style={{ display: 'flex', width: '90%', height:'80vh' }}>
      <Sidebar openEditStoryUI={editStoryUI} editTextStory={setTextStory} editBackgroundStory={setBackgroundStory} editFontStory={setFontStory} imageStory={imageStory} selectedFile={selectedFile} previewImageStoryUI={previewImageStoryUI} editSelectedID/>

      <div style={{ flex: 1, marginLeft: '23.5%' }}>
        <MiniHeader />
        {!editStoryUI && !previewImageStoryUI && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '100px' }}>
            <div className="cardStory" style={{ position: 'relative', width: '18vw', height: '56vh' }} onClick={handleCreatePhoto}>
              <img src="/asset/blue.png" style={{ width: '18vw', height: '56vh' }} />
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'var(--body_background)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '-5px -5px 15px rgba(255, 255, 255, 0.1), 5px 5px 15px rgba(0, 0, 0, 0.35), inset -5px -5px 15px rgba(255, 255, 255, 0.1), inset 5px 5px 15px rgba(0, 0, 0, 0.35)' }}>
                <i className='fas fa-images' style={{ fontSize: '24px', backgroundColor: 'transparent' }}></i>
              </div>
              <h4 style={{ color: '--body_color', position: 'absolute', top: '60%', left: '22%', fontSize:'1.1vw' }}>Create a photo story</h4>
              <input ref={fileInputRef} type="file" style={{ display: 'none' }} onChange={handleFileUpload} />
            </div>
            <div style={{ width: '30px' }}></div>
            <div className="cardStory" style={{ position: 'relative', width: '18vw', height: '56vh' }} onClick={handleCreateText}>
              <img src="/asset/purple.png" style={{ width: '18vw', height: '56vh' }} />
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'var(--body_background)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '-5px -5px 15px rgba(255, 255, 255, 0.1), 5px 5px 15px rgba(0, 0, 0, 0.35), inset -5px -5px 15px rgba(255, 255, 255, 0.1), inset 5px 5px 15px rgba(0, 0, 0, 0.35)' }}>
                <i className='fas fa-font' style={{ fontSize: '24px', backgroundColor: 'transparent' }}></i>
              </div>
              <h4 style={{ color: '--body_color', position: 'absolute', top: '60%', left: '24%', fontSize:'1.1vw' }}>Create a text story</h4>
            </div>
          </div>
        )}
        {editStoryUI && (
          <div style={{border: '20px solid var(--header_background)', padding:'30px 300px', marginTop:'80px', marginRight:'100px', borderRadius:'20px', borderTopWidth: '50px',}}>
            <h2 style={{color:'var(--body_color)', position:'absolute', top:'107px', left:'500px'}}>Preview</h2>
            <div style={{ backgroundColor: backgroundStory, width: '300px', height:'450px', display:'flex', justifyContent:'center', alignItems:'center', borderRadius:'20px' }}>
              <div style={{fontFamily:fontStory, fontSize:'30px'}}>
                {textStory}
              </div>
            </div>
          </div>
        )}
        {previewImageStoryUI && (
          <div style={{border: '20px solid var(--header_background)', padding:'30px 300px', marginTop:'80px', marginRight:'100px', borderRadius:'20px', borderTopWidth: '50px',}}>
            <h2 style={{color:'var(--body_color)', position:'absolute', top:'107px', left:'500px'}}>Preview</h2>
            {selectedFile && (
              <img
                style={{
                  width: '300px',
                  height: '450px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: '20px'
                }}
                src={URL.createObjectURL(selectedFile)}
                alt="Selected Image"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StoryCreate;
