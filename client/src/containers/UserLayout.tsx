import { useAppSelector } from '@/state/hooks';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

interface UserLayoutProps {
  children: React.ReactNode;
}

const UserLayout = ({ children }: UserLayoutProps) => {
  const { isOpen } = useAppSelector((state) => state.sidebar);

  return (
    <section className="h-screen w-full overflow-x-hidden bg-gray-50">
      <Navbar />
      <Sidebar />
      <main
        className={`mt-20 min-h-[calc(100vh-64px)] overflow-x-hidden transition-all duration-300 ease-in-out ${
          isOpen
            ? 'ml-[220px] lg:ml-[260px]'
            : 'ml-[60px] lg:ml-[80px]'
        }`}
      >
        <article className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          {children}
        </article>
      </main>
    </section>
  );
};

export default UserLayout;
