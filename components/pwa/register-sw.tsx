'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';

const UPDATE_INTERVAL = 60 * 60 * 1000;
const UPDATE_TOAST_ID = 'pwa-update';

export function RegisterSW() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return;
    if (!('serviceWorker' in navigator)) return;

    const listeners = new AbortController();
    const options = { signal: listeners.signal };
    let registration: ServiceWorkerRegistration | undefined;
    let hadController = !!navigator.serviceWorker.controller;
    let updateRequested = false;
    let refreshing = false;
    let checking = false;
    let controllerChanged = false;

    const reload = () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    };

    const showUpdate = () => {
      if (!registration?.waiting && !controllerChanged) return;
      toast('A new version is available', {
        id: UPDATE_TOAST_ID,
        description: 'Save your changes before updating.',
        duration: Number.POSITIVE_INFINITY,
        action: {
          label: 'Update now',
          onClick: () => {
            const worker = registration?.waiting;
            if (worker) {
              updateRequested = true;
              worker.postMessage({ type: 'SKIP_WAITING' });
            } else {
              reload();
            }
          }
        },
        cancel: { label: 'Later', onClick: () => {} }
      });
    };

    const watchInstalling = () => {
      const worker = registration?.installing;
      if (!worker) return;
      worker.addEventListener(
        'statechange',
        () => {
          if (worker.state === 'installed') showUpdate();
        },
        options
      );
    };

    const checkForUpdate = async () => {
      if (!registration || document.visibilityState !== 'visible') return;
      showUpdate();
      if (!navigator.onLine || checking) return;
      checking = true;
      try {
        await registration.update();
      } catch (error) {
        console.error('Failed to check for app updates:', error);
      } finally {
        checking = false;
      }
    };

    const register = async () => {
      try {
        const result = await navigator.serviceWorker.register('/sw.js', {
          updateViaCache: 'none'
        });
        if (listeners.signal.aborted) return;
        registration = result;
        registration.addEventListener('updatefound', watchInstalling, options);
        watchInstalling();
        await checkForUpdate();
      } catch (error) {
        console.error('Failed to register service worker:', error);
      }
    };

    navigator.serviceWorker.addEventListener(
      'controllerchange',
      () => {
        // First installation should never interrupt the current page.
        if (!hadController) {
          hadController = true;
          return;
        }
        controllerChanged = true;
        if (updateRequested) reload();
        else showUpdate();
      },
      options
    );
    document.addEventListener('visibilitychange', checkForUpdate, options);
    window.addEventListener('online', checkForUpdate, options);
    const interval = window.setInterval(checkForUpdate, UPDATE_INTERVAL);

    if (document.readyState === 'complete') void register();
    else window.addEventListener('load', register, { ...options, once: true });

    return () => {
      listeners.abort();
      window.clearInterval(interval);
      toast.dismiss(UPDATE_TOAST_ID);
    };
  }, []);

  return null;
}
