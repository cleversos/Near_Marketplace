import React, { useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import AppNavbar from './components/AppNavbar/AppNavbar';
import SideBar from './components/SideBar/SideBar';
import AllCollectionsPage from './pages/AllCollectionsPage/AllCollectionsPage';
import CollectionPage from './pages/CollectionPage/CollectionPage';
import HomePage from './pages/HomePage/HomePage';
import ItemPage from './pages/ItemPage/ItemPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import StatsPage from './pages/StatsPage/StatsPage';
import "./sass/global.scss";

function App() {
  const {pathname} = useLocation();
  const [openSidebar, setOpenSidebar] = useState(false)
  return (
    <div className="App">
      <AppNavbar
        setOpenSidebar={setOpenSidebar}
        showVolBar={ (pathname === "/") }
        dailyVolume={413021}
        totalVolume={3676394}
      />
      <div className="page-container">
        <div className="sidebar-container">
          <SideBar openMobileSidebar={openSidebar} setOpenMobileSidebar={setOpenSidebar} />
        </div>
        <div className="main-page-content">
          <Routes>
            <Route path="/stats" element={ <StatsPage /> } />
            <Route path="/collection/:collectionId" element={ <CollectionPage /> } />
            <Route path="/item/:itemId" element={ <ItemPage /> } />
            <Route path="/" element={ <HomePage /> } />
            <Route path="/collections" element={ <AllCollectionsPage /> } />
            <Route path="/me" element={ <ProfilePage /> } />
          </Routes>
        </div>
      </div>
      </div>
  );
}

export default App;