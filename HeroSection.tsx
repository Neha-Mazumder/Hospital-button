import { Play } from 'lucide-react';
import { Link } from 'react-router-dom';

const dotIds = Array.from({ length: 25 }, (_, i) => `dot-${i + 1}-${Math.random().toString(36).substring(2, 8)}`);

const HeroSection = () => {
  return (
    <section className="bg-primary pb-16 pt-12 text-white md:pb-24 md:pt-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-8">
         
          <div className="w-full lg:w-1/2">
            <span className="mb-4 inline-block text-sm font-medium uppercase tracking-wider text-secondary">
              WE TACK CARE OF YOUR HEALTH
            </span>
            <h1 className="mb-6 text-4xl font-bold leading-tight text-secondary md:text-5xl lg:text-6xl">
              We Are Providing Best & Hassle-Free Affordable Health Care.
            </h1>
            <p className="mb-8 text-gray-300">
            Our mission is to provide accessible, high-quality healthcare for everyone — combining excellence in medical care with the convenience of digital service, without ever compromising on quality 
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/appointment"
                className="flex items-center rounded-full border border-secondary px-6 py-3 font-medium text-secondary transition-colors hover:bg-secondary hover:text-primary"
              >
                Read More <span className="ml-2">→</span>
              </Link>
              <button
                className="flex items-center gap-2 text-white transition-colors hover:text-secondary"
                type="button"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary">
                  <Play size={16} fill="currentColor" />
                </span>
                <span>Watch Video</span>
              </button>
            </div>
          </div>

          
          <div className="relative w-full lg:w-1/2">
            <div className="relative mx-auto">
             
              <div className="absolute right-0 top-10 h-full w-4/5 z-0">
                <div className="grid grid-cols-12 grid-rows-12 gap-2">
                  {Array.from({ length: 144 }).map((_, index) => (
                    <div
                      key={`dot-${index}`}
                      className="h-1.5 w-1.5 rounded-full bg-white opacity-20"
                    />
                  ))}
                </div>
              </div>

              
              <div className="relative z-10 flex justify-center items-center w-full">
                
                <div className="relative z-10 overflow-hidden rounded-md shadow-lg">
                  <img
                    src="../../../img/hero-img-2.jpg"
                    alt="Doctors discussing"
                    className="h-80 w-80 object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
