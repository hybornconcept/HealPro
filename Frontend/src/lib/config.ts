// Client-side: use VITE_ prefixed var (available in browser bundle)
export const BACKEND_URL =
    (import.meta.env.VITE_BACKEND_URL as string) || 'https://healpro.healpro.workers.dev';
