import { useAppDispatch, useAppSelector } from '@/state/hooks';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { setSidebarOpen } from '@/state/features/sidebarSlice';

interface UserLayoutProps {
  children: React.ReactNode;
}

const UserLayout = ({ children }: UserLayoutProps) => {
  const { isOpen: isSidebarOpen } = useAppSelector((state) => state.sidebar);
  const dispatch = useAppDispatch();

  return (
    <main className="relative min-h-screen bg-background">
      <Navbar />
      <Sidebar />

      {/* Mobile overlay — closes sidebar on backdrop tap */}
      {isSidebarOpen && (
        <aside
          className="fixed inset-0 z-[39] bg-black/50 md:hidden"
          onClick={() => dispatch(setSidebarOpen(false))}
          aria-hidden="true"
        />
      )}

      {/* Page content — shifts right with sidebar, capped at 1440px */}
      <section
        className={[
          'transition-all duration-300 ease-in-out',
          'pt-[calc(8vh+16px)] h-fit max-h-[calc(100vh-9.25vh)]',
          'flex justify-center',
          isSidebarOpen
            ? 'pl-[max(18vw,220px)] pr-4'
            : 'pl-[max(8vw,80px)] pr-4',
        ].join(' ')}
      >
        <article className="w-full max-w-[1440px] p-6 rounded-md bg-white">
          {children}
        </article>
      </section>
    </main>
  );
};

export default UserLayout;
