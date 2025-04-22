import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <header className="w-full bg-white shadow-md px-6 py-4 flex justify-between items-center relative">
      {/* Logo – sada linkuje na /dashboard */}
      <Link to="/dashboard" className="flex items-center space-x-3">
        <img
          src="/ev-logo.png"
          alt="Logo"
          className="h-10 w-auto"  // Postavlja visinu slike
        />
      </Link>

      {/* Hamburger meni za mobilne uređaje */}
      <div className="md:hidden">
        <button onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? (
            <XMarkIcon className="h-6 w-6 text-blue-700" />
          ) : (
            <Bars3Icon className="h-6 w-6 text-blue-700" />
          )}
        </button>
      </div>

      {/* Desktop navigacija */}
      <nav className="hidden md:flex items-center space-x-6">
        {!user ? (
          <>
            <Link to="/login" className="text-blue-600 hover:underline">Prijava</Link>
            <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
              Registracija
            </Link>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Odjavi se
          </button>
        )}
      </nav>

      {/* Mobilni meni */}
      {menuOpen && (
        <div className="absolute top-full right-6 bg-white shadow-md rounded-md p-4 flex flex-col space-y-3 md:hidden z-50">
          {!user ? (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="text-blue-600 hover:underline">Prijava</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                Registracija
              </Link>
            </>
          ) : (
            <button
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
              Odjavi se
            </button>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
