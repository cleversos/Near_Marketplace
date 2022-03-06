import React from 'react';
import NewPopularSection from '../../components/NewPopularSection/NewPopularSection';
import AllCollectionsSection from './components/AllCollections/AllCollectionsSection';
import Footer from './components/Footer/Footer';
import HeroSection from './components/HeroSection/HeroSection';
import NewSection from './components/NewSection/NewSection';
import PopularSection from './components/PopularSection/PopularSection';
import SubscribeSection from './components/SubscribeSection/SubscribeSection';
import UpcomingSection from './components/UpcomingSections/UpcomingSection';
import './HomePage.scss';

const HomePage = () => {
    return (
        <div className="home-page">
            <HeroSection />
            <UpcomingSection />
            <NewPopularSection />
            <PopularSection />
            <NewSection />
            <AllCollectionsSection />
            <SubscribeSection />
            <Footer />
        </div>
    )
}

export default HomePage;