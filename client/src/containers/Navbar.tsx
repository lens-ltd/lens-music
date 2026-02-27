import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown,
  faCog,
  faSignOutAlt,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { setUser } from '@/state/features/userSlice';
import { setToken } from '@/state/features/authSlice';
import { useAppDispatch, useAppSelector } from '@/state/hooks';
import LensLogo from '/logo.png';

const Navbar = () => {
  const { user } = useAppSelector((state) => state.user);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!dropdownRef.current?.contains(target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, []);

  const toggleDropdown = (e: React.MouseEvent) => {
    e.preventDefault();
    setDropdownOpen((prev) => !prev);
  };

  console.log(user);

  return (
    <header
      className="fixed top-0 left-0 z-50 w-full border-b border-[color:var(--lens-sand)] bg-white/95 backdrop-blur-sm"
      style={{ height: '8vh', minHeight: '60px' }}
    >
      <section className="mx-auto flex h-full w-full items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          to="/dashboard"
          style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
        >
          <img src={LensLogo} alt="Lens Logo" className="w-10 h-10 rounded-md bg-slate-600" />
        </Link>

        <section className="flex items-center gap-3 sm:gap-4">
          <nav ref={dropdownRef} className="relative">
            <button
              onClick={toggleDropdown}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[color:var(--lens-sand)] bg-white px-1.5 py-1 transition-colors hover:bg-[color:var(--lens-sand)]/30"
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
            >
              <span className="relative inline-block h-8 w-8 overflow-hidden rounded-full">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    className="h-full w-full object-cover"
                    alt="User avatar"
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center bg-primary text-sm text-white">
                    {user?.name?.charAt(0) || 'U'}
                  </span>
                )}
              </span>

              <Link to={``} className="hidden md:flex cursor-pointer flex-col items-start pr-1">
                <span
                  className="max-w-[140px] truncate text-[11px] leading-none text-[color:var(--lens-ink)]"
                  style={{ fontFamily: 'var(--font-sans)', fontWeight: 400 }}
                >
                  {user?.name || 'User'}
                </span>
                <span className="text-[10px] uppercase tracking-[0.14em] text-[color:var(--lens-blue)]/80">
                  Account
                </span>
              </Link>

              <FontAwesomeIcon
                icon={faChevronDown}
                className={`mr-1 hidden text-[10px] text-[color:var(--lens-ink)]/60 transition-transform duration-200 md:inline ${dropdownOpen ? 'rotate-180' : ''
                  }`}
              />
            </button>
            <DropdownMenu isOpen={dropdownOpen} />
          </nav>
        </section>
      </section>
    </header>
  );
};

export default Navbar;

export const DropdownMenu = ({ isOpen }: { isOpen: boolean }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return (
    <ul
      className={`absolute right-0 mt-2 w-[250px] rounded-xl border border-[color:var(--lens-sand)] bg-white p-1.5 shadow-[0_18px_40px_-24px_rgba(16,14,9,0.45)] transition-all duration-200 z-10 ${isOpen
          ? 'translate-y-0 opacity-100 pointer-events-auto'
          : 'translate-y-[-8px] opacity-0 pointer-events-none'
        }`}
    >
      <Link
        to="/profile"
        className="block rounded-lg px-3 py-2.5 text-[12px] text-[color:var(--lens-ink)]/85 transition-colors hover:bg-[color:var(--lens-sand)]/35"
      >
        <FontAwesomeIcon icon={faUser} className="mr-2" />
        Profile
      </Link>
      <Link
        to="/settings"
        className="block rounded-lg px-3 py-2.5 text-[12px] text-[color:var(--lens-ink)]/85 transition-colors hover:bg-[color:var(--lens-sand)]/35"
      >
        <FontAwesomeIcon icon={faCog} className="mr-2" />
        Settings
      </Link>
      <Link
        to="/logout"
        className="block rounded-lg px-3 py-2.5 text-[12px] text-[color:var(--lens-ink)]/85 transition-colors hover:bg-[color:var(--lens-sand)]/35"
        onClick={(e) => {
          e.preventDefault();
          dispatch(setUser(undefined));
          dispatch(setToken(undefined));
          navigate('/');
        }}
      >
        <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
        Logout
      </Link>
    </ul>
  );
};
