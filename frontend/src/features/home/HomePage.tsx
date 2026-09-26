import React from 'react';
import { Box } from '@mui/material';
import HeroSection from './components/HeroSection';
import DoorwayCards from './components/DoorwayCards';
import RecentlyAdded from './components/RecentlyAdded';
import SEOContentSection from './components/SEOContentSection';
import BrainBoost from './components/BrainBoost';
import ContributeCTA from './components/ContributeCTA';
import ContactSection from './components/ContactSection';
import ScrollReveal from '@/components/ScrollReveal/ScrollReveal';

const HomePage: React.FC = React.memo(() => {
    return (
        <Box component="main" aria-label="Home page content">
            <HeroSection />
            <ScrollReveal>
                <DoorwayCards />
            </ScrollReveal>
            <ScrollReveal delay={75}>
                <RecentlyAdded />
            </ScrollReveal>
            <ScrollReveal delay={150}>
                <SEOContentSection />
            </ScrollReveal>
            <ScrollReveal delay={225}>
                <BrainBoost />
            </ScrollReveal>
            <ScrollReveal delay={300}>
                <ContributeCTA />
            </ScrollReveal>
            <ScrollReveal delay={375}>
                <ContactSection />
            </ScrollReveal>
        </Box>
    );
});


HomePage.displayName = 'HomePage';

export default HomePage;
