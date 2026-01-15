import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 bg-primary text-white">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
       
        <Link to="/" className="flex items-center gap-2">
          <div className="relative h-8 w-8">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="8" fill="#09352e"/>
              <path d="M16 8V24" stroke="#f8a485" stroke-width="3" stroke-linecap="round"/>
              <path d="M8 16H24" stroke="#f8a485" stroke-width="3" stroke-linecap="round"/>
            </svg>
          </div>
          <span className="text-xl font-bold">Hospital Button</span>
        </Link>

      
        <nav className="hidden lg:block">
          <ul className="flex items-center space-x-8">
            <li>
              <Link to="/" className="font-medium hover:text-secondary">Home</Link>
            </li>
            <li>
              <Link to="/about" className="font-medium hover:text-secondary">About Us</Link>
            </li>
            <li>
              <Link to="/services" className="font-medium hover:text-secondary">Services</Link>
            </li>
            
            <li>
              <Link to="/contact" className="font-medium hover:text-secondary">Contact Us</Link>
            </li>
          </ul>
        </nav>

       
        <div className="hidden lg:block">
          <Link
            to="/appointment"
            className="rounded-full border-2 border-secondary bg-transparent px-6 py-2 font-medium text-secondary transition-colors hover:bg-secondary hover:text-primary"
          >
            Book Appointment
          </Link>
        </div>
        <div className="hidden lg:block">
          <Link
            to="/login"
            className="rounded-full border-2 border-secondary bg-transparent px-6 py-2 font-medium text-secondary transition-colors hover:bg-secondary hover:text-primary"
          >
            Login
          </Link>
        </div>

       
        <button
          onClick={toggleMenu}
          className="lg:hidden"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      
      {isMenuOpen && (
        <div className="container mx-auto px-4 py-4 lg:hidden">
          <ul className="flex flex-col space-y-4">
            <li>
              <Link to="/" className="block font-medium hover:text-secondary" onClick={toggleMenu}>Home</Link>
            </li>
            <li>
              <Link to="/about" className="block font-medium hover:text-secondary" onClick={toggleMenu}>About Us</Link>
            </li>
            <li>
              <Link to="/services" className="block font-medium hover:text-secondary" onClick={toggleMenu}>Services</Link>
            </li>
            <li>
              <Link to="/pages" className="block font-medium hover:text-secondary" onClick={toggleMenu}>Pages</Link>
            </li>
            <li>
              <Link to="/contact" className="block font-medium hover:text-secondary" onClick={toggleMenu}>Contact Us</Link>
            </li>
            <li>
              <Link
                to="/appointment"
                className="inline-block rounded-full border-2 border-secondary bg-transparent px-6 py-2 font-medium text-secondary transition-colors hover:bg-secondary hover:text-primary"
                onClick={toggleMenu}
              >
                Book Appointment
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
