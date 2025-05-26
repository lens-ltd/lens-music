import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/inputs/Button';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../state/store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCirclePlus,
  faUser,
  faCog,
  faSignOutAlt,
} from '@fortawesome/free-solid-svg-icons';
import { setUser } from '@/state/features/userSlice';
import { setToken } from '@/state/features/authSlice';
import { setCreateReleaseModal } from '@/state/features/releaseSlice';

const Navbar = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.user);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = (e: React.MouseEvent) => {
    e.preventDefault();
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <header className="flex h-[10vh] items-center gap-3 justify-between p-6 w-full px-8 mx-auto bg-background">
      <h1>
        <Link
          to={'/dashboard'}
          className="text-xl font-bold transition-all ease-in-out hover:scale-102 text-primary"
        >
          Lens Music
        </Link>
      </h1>
      <nav className="flex items-center gap-6"></nav>

      <section className="flex items-center gap-6">
        <Button className="!py-1" primary onClick={(e) => {
          e.preventDefault();
          dispatch(setCreateReleaseModal(true));
        }}>
          <span className="flex items-center gap-3">
            <FontAwesomeIcon icon={faCirclePlus} />
            New release
          </span>
        </Button>
        <nav className="relative">
          <button
            onClick={toggleDropdown}
            className="overflow-hidden inline-block w-8 h-8 relative rounded-full"
            aria-haspopup="true"
            aria-expanded={dropdownOpen}
          >
            {user?.avatar ? (
              <img
                src={user?.avatar}
                className="object-cover w-full h-full"
                alt="User avatar"
              />
            ) : (
              <span className="text-white text-lg font-bold text-center w-full h-full flex items-center justify-center bg-primary">
                {user?.name?.charAt(0)}
              </span>
            )}
          </button>
          <DropdownMenu isOpen={dropdownOpen} />
        </nav>
      </section>
    </header>
  );
};

export default Navbar;

export const DropdownMenu = ({ isOpen }: { isOpen: boolean }) => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();

  // NAVIGATION
  const navigate = useNavigate();

  return (
    <ul
      className={`${
        isOpen ? 'translate-y-0' : 'translate-y-[-400px]'
      } absolute right-0 mt-2 transition-all ease-in-out duration-300 w-[250px] bg-white rounded-md shadow-lg py-1 z-10`}
    >
      <Link
        to="/profile"
        className="block px-4 py-3 text-sm text-gray-700 hover:bg-background"
      >
        <FontAwesomeIcon icon={faUser} className="mr-2" />
        Profile
      </Link>
      <Link
        to="/settings"
        className="block px-4 py-3 text-sm text-gray-700 hover:bg-background"
      >
        <FontAwesomeIcon icon={faCog} className="mr-2" />
        Settings
      </Link>
      <Link
        to="/logout"
        className="block px-4 py-3 text-sm text-gray-700 hover:bg-background"
        onClick={(e) => {
          e.preventDefault();
          dispatch(setUser(undefined));
          dispatch(setToken(undefined));
          navigate('/auth/login');
        }}
      >
        <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
        Logout
      </Link>
    </ul>
  );
};
