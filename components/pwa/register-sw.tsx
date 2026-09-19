'use client';
import { useEffect } from 'react';

export function RegisterSW() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return;
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    const hadController = !!navigator.serviceWorker.controller;
    let refreshing = false;

    const register = () => {
      navigator.serviceWorker.register('/sw.js').catch(console.error);
    };

    const onControllerChange = () => {
      if (!hadController || refreshing) return;
      refreshing = true;
      window.location.reload();
    };

    window.addEventListener('load', register);
    navigator.serviceWorker.addEventListener(
      'controllerchange',
      onControllerChange
    );

    return () => {
      window.removeEventListener('load', register);
      navigator.serviceWorker.removeEventListener(
        'controllerchange',
        onControllerChange
      );
    };
  }, []);

  return null;
}
