import { useAppSelector } from '@/state/hooks';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

interface UserLayoutProps {
  children: React.ReactNode;
  variant?: 'card' | 'canvas';
}

const UserLayout = ({ children, variant = 'canvas' }: UserLayoutProps) => {
  const { isOpen } = useAppSelector((state) => state.sidebar);

  return (
    <section className="min-h-screen w-full overflow-x-hidden bg-(--canvas) text-(--ink)">
      <Navbar />
      <Sidebar />
      <main
        className={`mt-16 min-h-[calc(100vh-64px)] overflow-x-hidden transition-[margin] duration-200 ease-[cubic-bezier(0,0,1,1)] ${
          isOpen ? 'ml-(--nav-collapsed) sm:ml-(--nav-open)' : 'ml-(--nav-collapsed)'
        }`}
      >
        {/* Pages sit on the gray canvas; their SectionCards supply the white frames. */}
        <article
          className={`mx-auto max-w-[1280px] p-4 sm:p-6 ${
            variant === 'card' ? 'm-4 rounded-(--radius-card) bg-(--paper)' : ''
          }`}
        >
          {children}
        </article>
      </main>
    </section>
  );
};

export default UserLayout;
