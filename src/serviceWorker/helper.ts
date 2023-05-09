export async function getServiceWorkerRegistration(fileName?: string) {
  // Check that service worker file exists
  if (!fileName)
    throw new Error('Cannot start SDK, no service worker file was specified');

  const SERVICE_WORKER_URL = `/${fileName}.js?pusherBeamsWebSDKVersion=1.1.0`;
  const { status: swStatusCode } = await fetch(SERVICE_WORKER_URL);
  if (swStatusCode !== 200) {
    throw new Error(
      `Cannot start SDK, service worker missing: No file found at /${fileName}.js`
    );
  }

  window.navigator.serviceWorker.register(SERVICE_WORKER_URL, {
    // explicitly opting out of `importScripts` caching just in case our
    // customers decides to host and serve the imported scripts and
    // accidentally set `Cache-Control` to something other than `max-age=0`
    updateViaCache: 'none',
  });
  return window.navigator.serviceWorker.ready;
}
