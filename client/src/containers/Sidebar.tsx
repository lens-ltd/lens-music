import {
  faBars,
  faChevronDown,
  faChevronUp,
} from '@fortawesome/free-solid-svg-icons';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/state/store';
import { setSidebarOpen } from '@/state/features/sidebarSlice';
import { sidebarNavigation } from '@/constants/sidebar.constants';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';

const Sidebar = () => {
  const { pathname } = useLocation();
  const dispatch: AppDispatch = useDispatch();
  const { isOpen: sidebarOpen } = useSelector(
    (state: RootState) => state.sidebar
  );
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <aside
      className={`fixed left-0 top-[10vh] z-40 h-[calc(100vh-10vh)] bg-background text-white flex flex-col transition-all duration-300
        ${
          sidebarOpen
            ? 'w-[18vw] min-w-[220px] max-w-xs'
            : 'w-[12vw] min-w-[60px] max-w-[80px]'
        }
        border-r border-border shadow-lg
      `}
      style={{ minHeight: 'calc(100vh - 10vh)' }}
    >
      <figure className="flex items-center justify-end px-4 py-4 h-[10vh] border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-10">
        <FontAwesomeIcon
          onClick={(e) => {
            e.preventDefault();
            dispatch(setSidebarOpen(!sidebarOpen));
          }}
          icon={faBars}
          className="bg-primary text-white rounded-full p-2 px-[8.5px] cursor-pointer"
        />
      </figure>
      <nav className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/30 scrollbar-track-transparent px-2 py-6">
        <ul className="flex flex-col gap-4">
          {sidebarNavigation.map((nav, idx) => {
            const selected = pathname === nav.path;
            if (nav?.subCategories && nav?.subCategories?.length > 0) {
              const isOpen = openDropdown === nav.title;
              return (
                <li key={idx} className="relative">
                  <Popover
                    open={isOpen}
                    onOpenChange={(open) =>
                      setOpenDropdown(open ? nav.title : null)
                    }
                  >
                    <PopoverTrigger asChild>
                      <button
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-[15px] transition-colors
                          ${
                            selected
                              ? 'bg-white text-primary shadow'
                              : 'hover:bg-white/20 text-secondary'
                          }
                          ${sidebarOpen ? 'justify-start' : 'justify-center'}
                        `}
                        onClick={() =>
                          setOpenDropdown(isOpen ? null : nav.title)
                        }
                      >
                        <FontAwesomeIcon
                          icon={nav.icon}
                          className={`text-[20px] ${
                            selected ? 'text-primary' : 'text-secondary'
                          }`}
                        />
                        {sidebarOpen && <span>{nav.title}</span>}
                        {sidebarOpen && (
                          <FontAwesomeIcon
                            icon={isOpen ? faChevronUp : faChevronDown}
                            className="ml-auto"
                          />
                        )}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent
                      align="start"
                      className="p-0 w-full min-w-[180px] bg-background border-none shadow-none"
                    >
                      <ul className="flex flex-col gap-1">
                        {nav.subCategories.map((sub) => (
                          <li key={sub.title}>
                            <Link
                              to={sub.path}
                              className={`flex items-center gap-3 px-6 py-2 rounded-md text-[14px] font-medium transition-colors
                                ${
                                  pathname === sub.path
                                    ? 'bg-primary text-white'
                                    : 'hover:bg-primary/10 text-secondary'
                                }
                              `}
                            >
                              <FontAwesomeIcon
                                icon={sub.icon}
                                className="text-[16px]"
                              />
                              {sidebarOpen && <span>{sub.title}</span>}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </PopoverContent>
                  </Popover>
                </li>
              );
            }
            return (
              <li key={idx}>
                <Link
                  to={nav.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-[15px] transition-colors
                    ${
                      selected
                        ? 'bg-white text-primary shadow'
                        : 'hover:bg-white/20 text-secondary'
                    }
                    ${sidebarOpen ? 'justify-start' : 'justify-center'}
                  `}
                >
                  <FontAwesomeIcon
                    icon={nav.icon}
                    className={`text-[20px] ${
                      selected ? 'text-primary' : 'text-secondary'
                    }`}
                  />
                  {sidebarOpen && <span>{nav.title}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
