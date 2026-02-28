export function trackEvent(name: string, params?: Record<string, string | number | boolean>) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', name, params);
  }

  if (import.meta.env.DEV) {
    console.log('[analytics]', name, params);
  }
}

export function trackButtonClick(buttonName: string, source?: string) {
  trackEvent(`${buttonName}_click`, {
    ...(source && { source })
  });
}
