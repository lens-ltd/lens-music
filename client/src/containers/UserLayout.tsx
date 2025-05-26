import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { RootState } from '@/state/store';
import { useSelector } from 'react-redux';

interface UserLayoutProps {
  children: React.ReactNode;
}

const UserLayout: React.FC<UserLayoutProps> = ({ children }) => {
  const { isOpen: sidebarOpen } = useSelector((state: RootState) => state.sidebar);

  return (
    <article className="relative w-full flex">
      <Sidebar />
      <article className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-[18vw]' : 'ml-[12vw]'} w-0`}>
        <Navbar />
        <main className="flex-1 overflow-y-auto bg-background p-6 top-[10vh] relative">
          <section className='bg-white p-6 rounded-md h-fit'>
            {children}
          </section>
        </main>
      </article>
    </article>
  );
};

export default UserLayout;
