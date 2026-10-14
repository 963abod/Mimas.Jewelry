import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export const Layout: React.FC = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-[#070605] text-[#F3EBDD] font-tajawal selection:bg-[#C5A880]/30 selection:text-[#F3EBDD]">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      {!isHomePage && <Footer />}
    </div>
  );
};
