import React from 'react';
import { useLocation } from 'react-router-dom';

const Footer = () => {
  const location = useLocation();

  const isLoginOrRegisterPath = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div>
      {isLoginOrRegisterPath && (
        <div className="footer-container">
            <div>
              <a href="https://id-id.facebook.com/places/" target="_blank" rel="noopener noreferrer" className='footer-content'>Place</a>
              <a href="https://pay.facebook.com/" target="_blank" rel="noopener noreferrer" className='footer-content'>Meta Pay</a>  
              <a href="https://www.meta.com/" target="_blank" rel="noopener noreferrer" className='footer-content'>Meta Store</a>
              <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className='footer-content'>Instagram</a>
              <br/>
              <a href="https://id-id.facebook.com/privacy/policies/cookies/?entry_point=cookie_policy_redirect&entry=0" target="_blank" rel="noopener noreferrer" className='footer-content'>Cookies</a>  
              <a href="https://www.facebook.com/help/568137493302217" target="_blank" rel="noopener noreferrer" className='footer-content'>Help</a>
              <a href="https://id-id.facebook.com/policies_center/" target="_blank" rel="noopener noreferrer" className='footer-content'>Pilihan Iklan</a>
            </div>
        </div>
      )}
    </div>
  );
};

export default Footer;
