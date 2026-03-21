import { Toaster } from 'sonner';
import Router from './Router';

const App = () => {
  return (
    <>
      <Toaster
        duration={1500}
        toastOptions={{
          classNames: {
            toast: 'text-[12px] font-light',
            title: 'text-[12px] font-light',
            description: 'text-[12px] font-light leading-snug',
          },
        }}
      />
      <Router />
    </>
  );
};

export default App;
