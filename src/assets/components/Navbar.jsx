import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const [activeSection, setActiveSection] = useState(location.pathname);

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/bracciali', label: 'Bracciali' },
    { path: '/anelli', label: 'Anelli' },
    { path: '/orecchini', label: 'Orecchini' },
    { path: '/collane', label: 'Collane' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setActiveSection(location.pathname);
  }, [location]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  return (
    <nav
      className={`fixed w-full top-0 z-50 transition-all duration-500 ${
        isOpen
          ? 'bg-[#030014] opacity-100'
          : scrolled
          ? 'bg-[#030014]/50 backdrop-blur-xl'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-[10%]">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              to="/"
              className="text-xl font-bold bg-gradient-to-r from-[#8f00ff] to-[#6366f1] bg-clip-text text-transparent flex items-center cursor-pointer"
            >
              Konny
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-8 flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className="group relative px-1 py-2 text-sm font-medium"
                >
                  <span
                    className={`relative z-10 transition-colors duration-300 ${
                      activeSection === item.path
                        ? 'bg-gradient-to-r from-[#8f00ff] to-[#a855f7] bg-clip-text text-transparent font-semibold'
                        : 'text-[#e2d3fd] group-hover:text-white'
                    }`}
                  >
                    {item.label}
                  </span>
                  <span
                    className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#8f00ff] to-[#a855f7] transform origin-left transition-transform duration-300 ${
                      activeSection === item.path
                        ? 'scale-x-100'
                        : 'scale-x-0 group-hover:scale-x-100'
                    }`}
                  />
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`relative p-2 text-[#e2d3fd] hover:text-white transition-transform duration-300 ease-in-out transform ${
                isOpen ? 'rotate-90 scale-125' : 'rotate-0 scale-100'
              }`}
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`md:hidden h-2/5 fixed inset-0 bg-[#030014] transition-all duration-300 ease-in-out ${
          isOpen
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-[-100%] pointer-events-none'
        }`}
        style={{ top: '64px' }}
      >
        <div className="flex flex-col h-full">
          <div className="px-4 py-6 space-y-4 flex-1 ">
            {navItems.map((item, index) => (
              <Link
                key={item.label}
                to={item.path}
                className={`block px-4 py-3 text-lg font-medium transition-all duration-300 ease ${
                  activeSection === item.path
                    ? 'bg-gradient-to-r from-[#8f00ff] to-[#a855f7] bg-clip-text text-transparent font-semibold'
                    : 'text-[#e2d3fd] hover:text-white'
                }`}
                onClick={() => setIsOpen(false)}
                style={{
                  transitionDelay: `${index * 100}ms`,
                  transform: isOpen ? 'translateX(0)' : 'translateX(50px)',
                  opacity: isOpen ? 1 : 0,
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
