import { Toaster } from 'sonner';
import Router from './Router';

const App = () => {
  return (
    <>
      <Toaster
        duration={1500}
      />
      <Router />
    </>
  );
};

export default App;
