import { useAppSelector } from '@/state/hooks';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

interface UserLayoutProps {
  children: React.ReactNode;
  variant?: 'card' | 'canvas';
}

const UserLayout = ({ children, variant = 'card' }: UserLayoutProps) => {
  const { isOpen } = useAppSelector((state) => state.sidebar);

  return (
    <section className="min-h-screen w-full overflow-x-hidden bg-[color:var(--color-background)]">
      <Navbar />
      <Sidebar />
      <main
        className={`mt-20 min-h-[calc(100vh-64px)] overflow-x-hidden transition-all duration-300 ease-in-out ${
          isOpen
            ? 'ml-[60px] sm:ml-[220px] lg:ml-[260px]'
            : 'ml-[60px] lg:ml-[80px]'
        }`}
      >
        <article
          className={`mx-auto w-full max-w-[1200px] px-4 py-5 sm:px-6 sm:py-6 lg:px-8 ${
            variant === 'card'
              ? 'rounded-md bg-white shadow-sm'
              : 'bg-transparent'
          }`}
        >
          {children}
        </article>
      </main>
    </section>
  );
};

export default UserLayout;
