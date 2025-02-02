import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Router } from "./Router";

const queryClient = new QueryClient();

function App() {
  return (
    <div className="flex h-screen flex-col max-h-screen">
      <QueryClientProvider client={queryClient}>
        <Router />
      </QueryClientProvider>
    </div>
  );
}

export default App;
