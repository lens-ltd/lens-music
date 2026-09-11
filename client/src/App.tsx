import { Toaster } from "sonner";
import Router from "./Router";

const App = () => {
  return (
    <>
      <Toaster
        duration={1000}
        toastOptions={{
          classNames: {
            toast: "type-body-sm",
            title: "type-body-sm",
            description: "type-meta leading-snug",
          },
        }}
      />
      <Router />
    </>
  );
};

export default App;
