import { QueryClient, QueryFunction } from "@tanstack/react-query";

// Function to determine API base URL based on environment
function getApiBaseUrl() {
  // In production (Netlify), we need to use the Netlify Functions path
  if (import.meta.env.PROD) {
    return '/.netlify/functions/api';
  }
  return '';
}

// Function to format API paths for both development and production
function formatApiPath(url: string): string {
  if (url.startsWith('/api') && import.meta.env.PROD) {
    return url.replace('/api', getApiBaseUrl());
  }
  return url;
}

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  // Format the URL for the appropriate environment
  const formattedUrl = formatApiPath(url);
  
  const res = await fetch(formattedUrl, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // Format the URL for the appropriate environment
    const url = formatApiPath(queryKey[0] as string);
    
    const res = await fetch(url, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
