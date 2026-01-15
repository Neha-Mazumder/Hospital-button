import HeroSection from '../components/home/HeroSection';
import ServiceCardSection from '../components/home/ServiceCardSection';
import ServiceGrid from '../components/home/ServiceGrid';
import TestimonialSection from '../components/home/TestimonialSection';
import ContactSection from '../components/home/ContactSection';
import AboutSection from '../components/home/AboutSection'

const HomePage = () => {
  return (
    <div>
      <HeroSection />
      <ServiceCardSection />
      <AboutSection/>
      <ServiceGrid />
      

    </div>
  );
};

export default HomePage; 