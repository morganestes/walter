/// <reference types="astro/client" />

interface Window {
  gtag: (command: string, ...args: unknown[]) => void;
  dataLayer: unknown[];
}
