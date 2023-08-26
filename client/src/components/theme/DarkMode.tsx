import React from 'react';
import './DarkMode.css';    

const DarkMode: React.FC = () => {
  const setDarkMode = () => {
    document.querySelector("body")?.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  }
  const setLightMode = () => {
    document.querySelector("body")?.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
  }

  const selectedTheme = localStorage.getItem('theme');
  if(selectedTheme === 'dark') setDarkMode();

  console.log(selectedTheme);
  const toggleTheme = (e) => {
    if (e.target.checked) setDarkMode();
    else setLightMode();
  }


  return (
    <div className='dark_mode'>
      <input
        className='dark_mode_input'
        type='checkbox'
        id='darkmode-toggle'
        onChange={toggleTheme}
        defaultChecked={selectedTheme === "dark"}
      />
      <label className='dark_mode_label' htmlFor='darkmode-toggle'>
        <i className="fas fa-sun" style={{color:'white'}}></i>
        <i className="fas fa-moon" style={{color:'white'}}></i>
      </label>
    </div>
  );
};

export default DarkMode;
