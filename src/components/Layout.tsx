import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export const Layout: React.FC = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#2C2724] font-tajawal selection:bg-[#C5A880]/30 selection:text-[#2C2724]">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      {!isHomePage && <Footer />}
    </div>
  );
};
