import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Header from './components/layout/header.tsx';
import ShowHeader from './components/layout/showHeader.tsx';
import Login from './pages/auth/login.tsx';
import Register from './pages/auth/register.tsx'; 
import Home from './pages/home.tsx';
import ForgottenAccount from './pages/auth/forgottenAccount.tsx';
import Verify from './pages/verify.tsx';
import ResetPassword from './pages/resetPassword.tsx';
import Group from './pages/group.tsx';
import Friend from './pages/friend.tsx';
import Market from './pages/market.tsx';
import Story from './pages/story.tsx';
import Reels from './pages/Reels.tsx';
import Forum from './pages/forum.tsx';
import { EncryptStorage } from 'encrypt-storage';
import Footer from './components/layout/footer.tsx';
import StoryCreate from './pages/storyCreate.tsx';
import Search from './pages/search.tsx';
import Notification from './pages/notification.tsx';
import ReelsCreate from './pages/reelsCreate.tsx';
import Profile from './pages/profile.tsx';
import RequestProfile from './pages/requestProfile.tsx';
import Messenger from './pages/messenger .tsx';
import GroupCreate from './pages/groupCreate.tsx';
import LoadingIndicator from './components/loadingIndicator.tsx';
import GroupProfile from './pages/groupProfile.tsx';
import UserProfile from './pages/userProfile.tsx';

export const encryptStorage = new EncryptStorage('tpawebsitefacebook', {
  encAlgorithm: 'Rabbit',
});

function App() {

  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const jwtToken = encryptStorage.getItem("jwtToken");
    setIsUserLoggedIn(!(jwtToken == null));
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div><LoadingIndicator loading={isLoading}/></div>;
  }

  return (
    <Router>
      <div className="App">
        <ShowHeader>
          <Header />
        </ShowHeader>
        <Routes>
          <Route path="/" element={isUserLoggedIn ? <Home /> : <Navigate to="/login" replace />}/>
          <Route path="/login" element={!isUserLoggedIn ? <Login /> : <Navigate to="/" replace />}/>
          <Route path="/register" element={!isUserLoggedIn ? <Register /> : <Navigate to="/" replace />}/>
          <Route path="/forgottenAccount" element={!isUserLoggedIn ? <ForgottenAccount /> : <Navigate to="/" replace />}/>
          <Route path="/verifyEmail/:id" element={<Verify/>}/>
          <Route path="/resetPassword/:id" element={<ResetPassword/>}/>
          <Route path="/friend" element={isUserLoggedIn ? <Friend /> : <Navigate to="/login" replace />}/>
          <Route path="/group" element={isUserLoggedIn ? <Group /> : <Navigate to="/login" replace />}/>
          <Route path="/group/create" element={isUserLoggedIn ? <GroupCreate /> : <Navigate to="/login" replace />}/>
          <Route path="/group/profile" element={isUserLoggedIn ? <GroupProfile /> : <Navigate to="/login" replace />}/>
          <Route path="/story" element={isUserLoggedIn ? <Story /> : <Navigate to="/login" replace />}/>
          <Route path="/story/create" element={isUserLoggedIn ? <StoryCreate /> : <Navigate to="/login" replace />}/>
          <Route path="/reels" element={isUserLoggedIn ? <Reels /> : <Navigate to="/login" replace />}/>
          <Route path="/reels/create" element={isUserLoggedIn ? <ReelsCreate /> : <Navigate to="/login" replace />}/>
          <Route path="/forum" element={<Forum/>}/>
          <Route path="/search" element={isUserLoggedIn ? <Search /> : <Navigate to="/login" replace />}/>
          <Route path="/notification" element={isUserLoggedIn ? <Notification /> : <Navigate to="/login" replace />}/>
          <Route path="/profile" element={isUserLoggedIn ? <UserProfile /> : <Navigate to="/login" replace />}/>
          <Route path="/messenger" element={isUserLoggedIn ? <Messenger /> : <Navigate to="/login" replace />}/>
        </Routes>
        <Footer/>
      </div>
    </Router>
  );
}

export default App;
