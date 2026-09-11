import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown,
  faCog,
  faSignOutAlt,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { clearSession } from '@/state/features/authSlice';
import { useAppDispatch, useAppSelector } from '@/state/hooks';
import LensLogo from '/logo.png';

export interface NavbarProps {
  className?: string;
  public?: boolean;
}

const Navbar = ({ className, public: isPublic }: NavbarProps) => {
  const { user } = useAppSelector((state) => state.auth);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!dropdownRef.current?.contains(target)) {
        setDropdownOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  const toggleDropdown = (e: React.MouseEvent) => {
    e.preventDefault();
    setDropdownOpen((prev) => !prev);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full border-b border-(--line) bg-(--paper)`}
      style={{ height: '64px' }}
    >
      <nav
        className={`flex h-full items-center justify-between ${
          isPublic ? 'mx-auto max-w-6xl px-6' : 'w-full px-4 sm:px-6 lg:px-8'
        } ${className ?? ''}`}
        aria-label="Main navigation"
      >
        <Link to="/dashboard" className="rounded-(--radius-control)">
          <img src={LensLogo} alt="Lens Logo" className="h-10 w-10 rounded-(--radius-control) object-contain" />
        </Link>

        <section className="flex items-center gap-3 sm:gap-4">
          <div ref={dropdownRef} className="relative">
            <button
              type="button"
              onClick={toggleDropdown}
              className="inline-flex cursor-pointer items-center gap-2 rounded-(--radius-control) bg-(--paper) px-2 py-1.5 transition-colors hover:bg-(--surface)"
              aria-haspopup="menu"
              aria-expanded={dropdownOpen}
              aria-controls="user-menu"
            >
              <span className="relative inline-block h-8 w-8 overflow-hidden rounded-full">
                {user?.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    className="h-full w-full object-cover"
                    alt=""
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center bg-(--lens-blue-soft) type-label text-(--lens-blue)">
                    {user?.name?.charAt(0) || 'U'}
                  </span>
                )}
              </span>

              <span className="hidden md:flex flex-col items-start justify-center pr-1">
                <span className="max-w-[140px] truncate type-label text-(--ink)">
                  {user?.name || 'User'}
                </span>
                <span className="type-meta">
                  {user?.email || ''}
                </span>
              </span>

              <FontAwesomeIcon
                icon={faChevronDown}
                className={`mr-1 hidden text-[10px] text-(--slate) transition-transform duration-200 md:inline ${dropdownOpen ? 'rotate-180' : ''
                  }`}
              />
            </button>
            <DropdownMenu isOpen={dropdownOpen} />
          </div>
        </section>
      </nav>
    </header>
  );
};

export default Navbar;

export const DropdownMenu = ({ isOpen }: { isOpen: boolean }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return (
    <ul
      id="user-menu"
      role="menu"
      className={`absolute right-0 mt-2 w-[250px] rounded-(--radius-control) border border-(--menu-border) bg-(--paper) p-1 shadow-[var(--shadow-menu)] transition-[opacity,transform] duration-100 z-10 ${isOpen
        ? 'translate-y-0 opacity-100 pointer-events-auto'
        : 'translate-y-[-4px] opacity-0 pointer-events-none'
        }`}
    >
      <li role="none">
        <Link
          to="/profile"
          role="menuitem"
          className="block rounded px-3 py-2 type-body-sm text-(--ink) transition-colors hover:bg-(--surface)"
        >
          <FontAwesomeIcon icon={faUser} className="mr-2" />
          Profile
        </Link>
      </li>
      <li role="none">
        <Link
          to="/settings"
          role="menuitem"
          className="block rounded px-3 py-2 type-body-sm text-(--ink) transition-colors hover:bg-(--surface)"
        >
          <FontAwesomeIcon icon={faCog} className="mr-2" />
          Settings
        </Link>
      </li>
      <li role="none">
        <button
          type="button"
          role="menuitem"
          className="block w-full text-left rounded px-3 py-2 type-body-sm text-(--ink) transition-colors hover:bg-(--surface)"
          onClick={() => {
            dispatch(clearSession());
            navigate('/');
          }}
        >
          <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
          Logout
        </button>
      </li>
    </ul>
  );
};
