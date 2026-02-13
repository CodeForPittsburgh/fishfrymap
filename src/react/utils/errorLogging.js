export function logClientError(scope, error, context = {}) {
  const payload = {
    scope,
    message: error?.message || String(error),
    stack: error?.stack || null,
    context,
    timestamp: new Date().toISOString()
  };

  if (typeof window !== "undefined") {
    if (!Array.isArray(window.__fishfryClientErrors)) {
      window.__fishfryClientErrors = [];
    }
    window.__fishfryClientErrors.push(payload);
  }

  // eslint-disable-next-line no-console
  console.error(`[fishfry] ${scope}`, payload);
}

