import { FC, ReactNode } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { RootState } from '@/state/store';
import { useSelector } from 'react-redux';

interface UserLayoutProps {
  children: ReactNode;
}

const UserLayout: FC<UserLayoutProps> = ({ children }) => {
  // STATE VARIABLES
  const { isOpen: sidebarOpen } = useSelector(
    (state: RootState) => state.sidebar
  );

  return (
    <main className="relative">
      <Sidebar />
      <section className="w-[100vw] max-w-[100vw]">
        <Navbar />
        <section
          className={`${
            sidebarOpen ? 'w-[78vw] left-[22vw]' : 'w-[94vw] left-[6vw]'
          } top-[10vh] absolute mx-auto flex items-center justify-center p-6`}
        >
          <section className="h-full w-[95%] mx-auto">
            {children}
          </section>
        </section>
      </section>
    </main>
  );
};

export default UserLayout;
