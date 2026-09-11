import { Toaster } from "sonner";
import Router from "./Router";

const App = () => {
  return (
    <>
      <Toaster
        duration={4000}
        toastOptions={{
          classNames: {
            toast: 'rounded-md border border-(--menu-border) bg-(--paper) px-3.5 py-3 shadow-[var(--shadow-menu)] type-body-sm text-(--ink)',
            title: 'type-body-sm text-(--ink)',
            description: 'type-meta leading-snug',
            error: 'border-(--danger-line)',
          },
        }}
      />
      <Router />
    </>
  );
};

export default App;
