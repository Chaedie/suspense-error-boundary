import { Suspense, useState } from "react";
import "./App.css";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import {
  ErrorBoundary,
  ErrorBoundaryFallbackProps,
  ErrorBoundaryProps,
} from "@suspensive/react";

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
      <ErrorBoundary fallback={ErrorSection}>
        <Suspense fallback={<div>waiting 100...</div>}>
          <Component wait={100} error />
        </Suspense>
      </ErrorBoundary>
      <ErrorBoundary fallback={ErrorSection}>
        <Suspense fallback={<div>waiting 500...</div>}>
          <Component wait={500} />
        </Suspense>
      </ErrorBoundary>
      <ErrorBoundary fallback={ErrorSection}>
        <Suspense fallback={<div>waiting 1000...</div>}>
          <Component wait={1000} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

function ErrorSection(props: ErrorBoundaryFallbackProps) {
  return (
    <div>
      error...2
      <button onClick={props.reset}>리셋</button>
    </div>
  );
}

function Component({ wait, error }: { wait: number; error?: boolean }) {
  const query = useQuery({
    queryKey: ["fetching", wait],
    queryFn: () => fetching({ wait, error }),
    suspense: true,
    useErrorBoundary: true,
  });
  return <div>{query.data}</div>;
}

export default App;

async function fetching({ error, wait }: { error?: boolean; wait: number }) {
  await new Promise((resolve, reject) => {
    if (error) reject();
    setTimeout(resolve, wait);
  });
  return `await ${wait}ms`;
}
