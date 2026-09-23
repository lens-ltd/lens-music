import { Toaster } from "sonner";
import Router from "./Router";
import RouteEffects from "./components/layout/RouteEffects";

const App = () => {
  return (
    <>
      <Toaster
        duration={4000}
        toastOptions={{
          classNames: {
            toast: 'rounded-(--radius-control) bg-(--paper) px-4 py-3 shadow-(--shadow-menu) type-body-sm text-(--ink)',
            title: 'type-body-sm text-(--ink)',
            description: 'type-meta leading-snug',
            error: 'text-(--danger)',
          },
        }}
      />
      <RouteEffects />
      <Router />
    </>
  );
};

export default App;
