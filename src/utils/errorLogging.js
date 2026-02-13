const CLIENT_ERROR_BUFFER_KEY = "__fishfryClientErrors";
const CLIENT_ERROR_BUFFER_MAX = 100;

function getEnv(override) {
  if (override) {
    return override;
  }

  if (typeof import.meta !== "undefined" && import.meta.env) {
    return import.meta.env;
  }

  return {};
}

function getWindow(override) {
  if (override) {
    return override;
  }

  if (typeof window !== "undefined") {
    return window;
  }

  return null;
}

function normalizeSampleRate(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return 1;
  }
  if (parsed < 0) {
    return 0;
  }
  if (parsed > 1) {
    return 1;
  }
  return parsed;
}

function errorToMessage(error) {
  if (error?.message) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  try {
    return JSON.stringify(error);
  } catch (_unused) {
    return String(error);
  }
}

function errorToStack(error) {
  return error?.stack || null;
}

function addToLocalBuffer(windowObj, payload) {
  if (!windowObj) {
    return;
  }

  if (!Array.isArray(windowObj[CLIENT_ERROR_BUFFER_KEY])) {
    windowObj[CLIENT_ERROR_BUFFER_KEY] = [];
  }

  windowObj[CLIENT_ERROR_BUFFER_KEY].push(payload);
  if (windowObj[CLIENT_ERROR_BUFFER_KEY].length > CLIENT_ERROR_BUFFER_MAX) {
    windowObj[CLIENT_ERROR_BUFFER_KEY].splice(
      0,
      windowObj[CLIENT_ERROR_BUFFER_KEY].length - CLIENT_ERROR_BUFFER_MAX
    );
  }
}

export function buildClientErrorPayload(scope, error, context = {}, windowObj = getWindow()) {
  return {
    scope,
    message: errorToMessage(error),
    stack: errorToStack(error),
    context,
    url: windowObj?.location?.href || null,
    userAgent: windowObj?.navigator?.userAgent || null,
    timestamp: new Date().toISOString()
  };
}

export async function sendClientError(payload, options = {}) {
  const env = getEnv(options.env);
  const endpoint =
    options.endpoint ||
    env.VITE_CLIENT_ERROR_DSN ||
    env.VITE_CLIENT_ERROR_ENDPOINT ||
    "";

  if (!endpoint) {
    return { sent: false, reason: "missing_endpoint" };
  }

  const sampleRate = normalizeSampleRate(
    options.sampleRate ?? env.VITE_CLIENT_ERROR_SAMPLE_RATE ?? 1
  );
  if (sampleRate < 1 && Math.random() > sampleRate) {
    return { sent: false, reason: "sampled_out" };
  }

  const windowObj = getWindow(options.windowObj);
  const fetchFn = options.fetchFn || (typeof fetch === "function" ? fetch : null);
  const body = JSON.stringify(payload);

  if (windowObj?.navigator?.sendBeacon) {
    try {
      const beaconBody =
        typeof Blob !== "undefined" ? new Blob([body], { type: "application/json" }) : body;
      const accepted = windowObj.navigator.sendBeacon(endpoint, beaconBody);
      if (accepted) {
        return { sent: true, transport: "beacon" };
      }
    } catch (_unused) {
      // Fall through to fetch transport.
    }
  }

  if (!fetchFn) {
    return { sent: false, reason: "missing_fetch" };
  }

  try {
    await fetchFn(endpoint, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body,
      keepalive: true
    });
    return { sent: true, transport: "fetch" };
  } catch (_unused) {
    return { sent: false, reason: "network_error" };
  }
}

export function logClientError(scope, error, context = {}, options = {}) {
  const windowObj = getWindow(options.windowObj);
  const payload = buildClientErrorPayload(scope, error, context, windowObj);

  addToLocalBuffer(windowObj, payload);

  const logger = options.consoleObj || console;
  if (logger?.error) {
    logger.error(`[fishfry] ${scope}`, payload);
  }

  // Fire and forget; this should never block UI behavior.
  void sendClientError(payload, options);

  return payload;
}
