import { AnimatePresence, motion, useAnimation } from 'framer-motion';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { AppDispatch, RootState } from '@/state/store';
import { setSidebarOpen } from '@/state/features/sidebarSlice';
import { getSidebarNavigationForUser } from '@/constants/sidebar.constants';
import { cn } from '@/lib/utils';

import { LuChevronDown, LuChevronsLeft, LuMenu } from 'react-icons/lu';
import { Icon } from '@/components/ui/icon';

const matchesPath = (pathname: string, targetPath: string) =>
  pathname === targetPath || pathname.startsWith(`${targetPath}/`);

/** Nav rows sit on the solid brand-blue sidebar: white text, translucent white fills. */
const navStateClass = (isActive: boolean) =>
  isActive
    ? 'bg-white/15 font-medium text-white'
    : 'text-white/85 hover:bg-white/10 hover:text-white';

const Sidebar = () => {
  const { pathname } = useLocation();
  const dispatch: AppDispatch = useDispatch();
  const { isOpen: sidebarOpen } = useSelector(
    (state: RootState) => state.sidebar,
  );
  const { user } = useSelector((state: RootState) => state.auth);
  const permissions = user?.permissions;
  const sidebarNavItems = useMemo(
    () => getSidebarNavigationForUser(permissions),
    [permissions],
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

  useEffect(() => {
    const mobileViewport = window.matchMedia('(max-width: 639px)');

    const collapseOnMobile = (event: MediaQueryListEvent | MediaQueryList) => {
      if (event.matches) {
        dispatch(setSidebarOpen(false));
      }
    };

    collapseOnMobile(mobileViewport);
    mobileViewport.addEventListener('change', collapseOnMobile);
    return () => mobileViewport.removeEventListener('change', collapseOnMobile);
  }, [dispatch]);

  useEffect(() => {
    if (!sidebarOpen) return;

    const activeCategories = sidebarNavItems
      .filter((nav) =>
        nav.subCategories?.some((subCategory) =>
          matchesPath(pathname, subCategory.path),
        ),
      )
      .map((nav) => nav.title);

    if (activeCategories.length) {
      setOpenCategories((prev) => Array.from(new Set([...prev, ...activeCategories])));
    }
  }, [pathname, sidebarOpen, sidebarNavItems]);

  const toggleCategory = useCallback((title: string) => {
    setOpenCategories((prev) =>
      prev.includes(title)
        ? prev.filter((category) => category !== title)
        : [...prev, title],
    );
  }, []);

  const itemClass = (isActive: boolean, extra?: string) =>
    cn(
      'group relative flex h-10 items-center gap-3 overflow-hidden rounded-(--radius-control) text-sm transition-colors duration-(--dur-state) focus-visible:outline-white',
      sidebarOpen ? 'px-3' : 'justify-center px-2',
      navStateClass(isActive),
      extra,
    );

  return (
    <motion.aside
      className={cn(
        'fixed left-0 top-16 z-40 h-[calc(100vh-64px)] flex flex-col bg-(--signal) text-white transition-[width] duration-200 ease-[cubic-bezier(0,0,1,1)]',
        sidebarOpen ? 'w-(--nav-open)' : 'w-(--nav-collapsed)',
      )}
      aria-expanded={sidebarOpen}
      aria-label="Application"
    >
      <header
        className={cn(
          'flex w-full px-3 pt-4 pb-3',
          sidebarOpen
            ? 'items-end justify-end'
            : 'flex-col items-center justify-center gap-3',
        )}
      >
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            dispatch(setSidebarOpen(!sidebarOpen));
          }}
          className="flex size-(--control-sm) cursor-pointer items-center justify-center rounded-(--radius-control) text-white transition-colors duration-(--dur-state) hover:bg-white/10 focus-visible:outline-white"
          aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          aria-expanded={sidebarOpen}
        >
          <Icon
            icon={sidebarOpen ? LuChevronsLeft : LuMenu}
            className="size-4"
          />
        </button>
      </header>

      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2 pb-4 [scrollbar-color:rgba(255,255,255,0.3)_transparent] [scrollbar-width:thin]">
        <ul className="flex flex-col gap-1">
          {sidebarNavItems.map((nav) => {
            const selected = pathname === nav.path;
            const hasSubcategories =
              !!nav.subCategories && nav.subCategories.length > 0;
            const isSubcategoriesOpen = openCategories.includes(nav.title);
            const activeSubcategoryPath = nav.subCategories
              ?.filter((subCategory) => matchesPath(pathname, subCategory.path))
              .sort((left, right) => right.path.length - left.path.length)[0]?.path;
            const isSubcategoryActive = Boolean(activeSubcategoryPath);
            const isActive = selected || isSubcategoryActive;

            return (
              <li key={nav.title} className="flex flex-col">
                {hasSubcategories ? (
                  <button
                    type="button"
                    className={itemClass(isActive, 'w-full text-left')}
                    onClick={() => {
                      if (!sidebarOpen) {
                        dispatch(setSidebarOpen(true));
                        return;
                      }
                      toggleCategory(nav.title);
                    }}
                    aria-expanded={sidebarOpen ? isSubcategoriesOpen : false}
                    title={nav.title}
                  >
                    <Icon
                      icon={nav.icon}
                      className="size-[18px] shrink-0"
                    />
                    {sidebarOpen && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={textControls}
                        className="whitespace-nowrap"
                      >
                        {nav.title}
                      </motion.span>
                    )}
                    {sidebarOpen && (
                      <LuChevronDown
                        aria-hidden="true"
                        className={cn(
                          'ml-auto size-4 text-white/70 transition-transform duration-(--dur-state)',
                          isSubcategoriesOpen && 'rotate-180',
                        )} />
                    )}
                  </button>
                ) : (
                  <Link
                    to={nav.path}
                    className={itemClass(isActive)}
                    title={nav.title}
                    aria-current={selected ? 'page' : undefined}
                    onClick={() => {
                      if (!sidebarOpen) {
                        dispatch(setSidebarOpen(true));
                      }
                    }}
                  >
                    <Icon
                      icon={nav.icon}
                      className="size-[18px] shrink-0"
                    />
                    {sidebarOpen && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={textControls}
                        className="whitespace-nowrap"
                      >
                        {nav.title}
                      </motion.span>
                    )}
                  </Link>
                )}

                <AnimatePresence>
                  {hasSubcategories && isSubcategoriesOpen && sidebarOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2, ease: 'easeInOut' }}
                      className="my-1 overflow-hidden"
                    >
                      <ul className="ml-[14px] flex flex-col gap-0.5 border-l border-white/15 py-1 pl-2 pr-1">
                        {nav.subCategories?.map((subCategory) => {
                          const isSubActive =
                            activeSubcategoryPath === subCategory.path;

                          return (
                            <li key={subCategory.title}>
                              <Link
                                to={subCategory.path}
                                className={cn(
                                  'relative flex h-9 items-center gap-2.5 rounded-(--radius-control) px-3 text-sm transition-colors duration-(--dur-state) focus-visible:outline-white',
                                  navStateClass(isSubActive),
                                )}
                                aria-current={isSubActive ? 'page' : undefined}
                              >
                                <Icon
                                  icon={subCategory.icon}
                                  className="size-4 shrink-0"
                                />
                                <motion.span
                                  animate={textControls}
                                  className="whitespace-nowrap"
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
    </motion.aside>
  );
};

export default Sidebar;
