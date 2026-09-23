import { useAppSelector } from '@/state/hooks';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

interface UserLayoutProps {
  children: React.ReactNode;
  variant?: 'card' | 'canvas';
}

const UserLayout = ({ children }: UserLayoutProps) => {
  const { isOpen } = useAppSelector((state) => state.sidebar);

  return (
    <section className="min-h-screen w-full overflow-x-hidden bg-(--canvas) text-(--ink)">
      <Navbar />
      <Sidebar />
      <main
        className={`mt-16 min-h-[calc(100vh-64px)] overflow-x-hidden transition-[margin] duration-200 ease-[cubic-bezier(0,0,1,1)] ${
          isOpen ? 'ml-18 sm:ml-60' : 'ml-18'
        }`}
      >
        <article className="mx-auto max-w-[1280px] p-6 bg-white m-4 w-[95%] rounded-md">
          {children}
        </article>
      </main>
    </section>
  );
};

export default UserLayout;
