import {
  faAnglesLeft,
  faBars,
  faChevronDown,
} from '@fortawesome/free-solid-svg-icons';
import { AnimatePresence, motion, useAnimation } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { AppDispatch, RootState } from '@/state/store';
import { setSidebarOpen } from '@/state/features/sidebarSlice';
import { sidebarNavigation } from '@/constants/sidebar.constants';

const Sidebar = () => {
  const { pathname } = useLocation();
  const dispatch: AppDispatch = useDispatch();
  const { isOpen: sidebarOpen } = useSelector(
    (state: RootState) => state.sidebar,
  );
  const [openCategories, setOpenCategories] = useState<string[]>([]);
  const textControls = useAnimation();

  const showMore = useCallback(() => {
    textControls.start({
      opacity: 1,
      display: 'block',
      transition: { delay: 0.1, duration: 0.2 },
    });
  }, [textControls]);

  const showLess = useCallback(() => {
    textControls.start({
      opacity: 0,
      display: 'none',
      transition: { duration: 0.1 },
    });
  }, [textControls]);

  useEffect(() => {
    if (sidebarOpen) {
      showMore();
      return;
    }

    showLess();
    setOpenCategories([]);
  }, [sidebarOpen, showLess, showMore]);

  const toggleCategory = useCallback((title: string) => {
    setOpenCategories((prev) =>
      prev.includes(title)
        ? prev.filter((category) => category !== title)
        : [...prev, title],
    );
  }, []);

  return (
    <motion.aside
      className={`fixed left-0 top-[8vh] z-40 h-[calc(100vh-8vh)] flex flex-col bg-primary text-white transition-all duration-300 ease-in-out
        ${
          sidebarOpen
            ? 'w-[18vw] min-w-[220px] max-w-[260px] shadow-[4px_0_24px_-4px_rgba(0,40,80,0.18)]'
            : 'w-[12vw] min-w-[60px] max-w-[80px] shadow-[2px_0_12px_-2px_rgba(0,40,80,0.1)]'
        }
        border-r border-white/10
      `}
    >
      <header
        className={`flex w-full px-4 pt-5 pb-4 ${
          sidebarOpen
            ? 'items-end justify-end'
            : 'flex-col items-center justify-center gap-3'
        }`}
      >
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            dispatch(setSidebarOpen(!sidebarOpen));
          }}
          className="flex h-8 w-8 items-center cursor-pointer justify-center rounded-lg bg-white/10 text-white/80 transition-all duration-200 hover:bg-white/20 hover:text-white"
          aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          <FontAwesomeIcon
            icon={sidebarOpen ? faAnglesLeft : faBars}
            className="text-[13px] cursor-pointer"
          />
        </button>
      </header>

      <div className="mx-4 mb-3">
        <div className="h-px bg-white/10" />
      </div>

      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3">
        <ul className="flex flex-col gap-2">
          {sidebarNavigation.map((nav) => {
            const selected = pathname === nav.path;
            const hasSubcategories =
              !!nav.subCategories && nav.subCategories.length > 0;
            const isSubcategoriesOpen = openCategories.includes(nav.title);
            const isSubcategoryActive = nav.subCategories?.some((subCategory) =>
              pathname.startsWith(subCategory.path),
            );
            const isActive = selected || isSubcategoryActive;

            return (
              <li key={nav.title} className="flex flex-col">
                <Link
                  to={nav.path}
                  className={`group relative flex items-center gap-3 overflow-hidden rounded-lg text-[13px] font-normal transition-all duration-200
                    ${sidebarOpen ? 'px-3 py-3' : 'justify-center p-3'}
                    ${
                      isActive
                        ? 'bg-white/[0.14] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]'
                        : 'text-white/95 hover:bg-white/[0.07] hover:text-white'
                    }
                  `}
                  onClick={(e) => {
                    if (hasSubcategories) {
                      e.preventDefault();
                      if (!sidebarOpen) {
                        dispatch(setSidebarOpen(true));
                        return;
                      }
                      toggleCategory(nav.title);
                      return;
                    }

                    if (!sidebarOpen) {
                      dispatch(setSidebarOpen(true));
                    }
                  }}
                  title={nav.title}
                >
                  <FontAwesomeIcon
                    icon={nav.icon}
                    className={`text-[15px] flex-shrink-0 transition-colors duration-200 ${
                      isActive
                        ? 'text-white'
                        : 'text-white/75 group-hover:text-white/90'
                    }`}
                  />

                  {sidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={textControls}
                      className="whitespace-nowrap text-[13px] font-normal"
                    >
                      {nav.title}
                    </motion.span>
                  )}

                  {hasSubcategories && sidebarOpen && (
                    <FontAwesomeIcon
                      icon={faChevronDown}
                      className={`ml-auto text-[10px] text-white/40 transition-transform duration-300 ${
                        isSubcategoriesOpen ? 'rotate-180' : ''
                      }`}
                    />
                  )}
                </Link>

                <AnimatePresence>
                  {hasSubcategories && isSubcategoriesOpen && sidebarOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2, ease: 'easeInOut' }}
                      className="my-1 overflow-hidden"
                    >
                      <ul className="ml-[14px] flex flex-col gap-1.5 border-l border-white/10 py-1.5 pl-2 pr-1">
                        {nav.subCategories?.map((subCategory) => {
                          const isSubActive = pathname.startsWith(
                            subCategory.path,
                          );

                          return (
                            <li key={subCategory.title}>
                              <Link
                                to={subCategory.path}
                                className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-[12px] font-medium transition-all duration-200 ${
                                  isSubActive
                                    ? 'bg-white/[0.12] text-white'
                                    : 'text-white/85 hover:bg-white/[0.06] hover:text-white/90'
                                }`}
                              >
                                <FontAwesomeIcon
                                  icon={subCategory.icon}
                                  className={`text-[12px] flex-shrink-0 ${
                                    isSubActive ? 'text-white' : 'text-white/50'
                                  }`}
                                />
                                <motion.span
                                  animate={textControls}
                                  className="whitespace-nowrap text-[13px] font-normal"
                                >
                                  {subCategory.title}
                                </motion.span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </nav>

      <footer className="mt-auto px-4 py-6">
        <div className="mb-3 h-px bg-white/10" />
        {sidebarOpen ? (
          <motion.p
            animate={textControls}
            className="text-center text-[10px] font-light uppercase tracking-wide text-white/25"
          >
            Lens Music
          </motion.p>
        ) : (
          <figure className="flex justify-center">
            <hr className="h-2 w-2 rounded-full bg-white/15" />
          </figure>
        )}
      </footer>
    </motion.aside>
  );
};

export default Sidebar;
