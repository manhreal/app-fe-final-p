import React, { useState, useRef } from 'react';
import FloatingNavigation from './FloatingNavigation';
import HeroSection from './HeroSection';
import CoursesSection from './CoursesSection';
import ContactSection from './ContactSection';
import AboutSection from './AboutSection';
import CandlestickChart from './CandlestickChart';

const Home = () => {
    const [navOpen, setNavOpen] = useState(false);

    const chart = useRef(null);
    const heroRef = useRef(null);
    const aboutRef = useRef(null);
    const coursesRef = useRef(null);
    const contactRef = useRef(null);

    const sections = {
        hero: heroRef,
        about: aboutRef,
        courses: coursesRef,
        contact: contactRef
    };

    const scrollToSection = (sectionId) => {
        const section = sections[sectionId];
        if (section && section.current) {
            section.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

    return (
        <div className="relative">
            <FloatingNavigation
                isOpen={navOpen}
                setIsOpen={setNavOpen}
                scrollToSection={scrollToSection}
            />
            <div ref={chart} className='p-10'>
                <CandlestickChart />
            </div>
            
            <div ref={heroRef}>
                <HeroSection />
            </div>

            <div ref={aboutRef}>
                <AboutSection />
            </div>

            <div ref={coursesRef}>
                <CoursesSection />
            </div>

            <div ref={contactRef}>
                <ContactSection />
            </div>
        </div>
    );
};

export default Home;
