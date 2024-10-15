import { Suspense, useState } from "react";
import "./App.css";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";

const queryClient = new QueryClient({ defaultOptions: {} });

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Page />
    </QueryClientProvider>
  );
}

function Page() {
  return (
    <div className="flex flex-col">
      <Suspense fallback={<div>waiting 100...</div>}>
        <Component wait={100} />
      </Suspense>
      <Suspense fallback={<div>waiting 500...</div>}>
        <Component wait={500} />
      </Suspense>{" "}
      <Suspense fallback={<div>waiting 1000...</div>}>
        <Component wait={1000} />
      </Suspense>
    </div>
  );
}

function Component({ wait }: { wait: number }) {
  const query = useQuery({
    queryKey: ["fetching", wait],
    queryFn: () => fetching({ wait, error: false }),
    suspense: true,
  });
  return <div>{query.data}</div>;
}

export default App;

async function fetching({ error, wait }: { error: boolean; wait: number }) {
  await new Promise((resolve, reject) => {
    if (error) reject();
    setTimeout(resolve, wait);
  });
  return `await ${wait}ms`;
}
