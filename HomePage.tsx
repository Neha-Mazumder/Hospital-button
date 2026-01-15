import HeroSection from '../components/home/HeroSection';
import ServiceCardSection from '../components/home/ServiceCardSection';
import AboutSection from '../components/home/AboutSection';
import ServiceGrid from '../components/home/ServiceGrid';

const HomePage = () => {
  return (
    <div>
      <HeroSection />
      <ServiceCardSection />
      <AboutSection />
      <ServiceGrid />
    </div>
  );
};

export default HomePage;
