import { describe, expect, it, vi } from "vitest";

import {
  buildClientErrorPayload,
  logClientError,
  sendClientError
} from "../../../src/utils/errorLogging";

describe("errorLogging", () => {
  it("builds payload and buffers client errors locally", () => {
    const windowObj = {
      location: { href: "https://fishfry.test/" },
      navigator: { userAgent: "vitest" }
    };
    const consoleObj = { error: vi.fn() };

    const payload = logClientError("map.init", new Error("map failed"), { map: true }, {
      windowObj,
      consoleObj
    });

    expect(payload.scope).toBe("map.init");
    expect(payload.message).toBe("map failed");
    expect(payload.url).toBe("https://fishfry.test/");
    expect(windowObj.__fishfryClientErrors).toHaveLength(1);
    expect(windowObj.__fishfryClientErrors[0].scope).toBe("map.init");
    expect(consoleObj.error).toHaveBeenCalledTimes(1);
  });

  it("sends payload with fetch transport when endpoint is configured", async () => {
    const fetchFn = vi.fn().mockResolvedValue({ ok: true });
    const result = await sendClientError(
      {
        scope: "window.error",
        message: "boom"
      },
      {
        endpoint: "https://errors.example.com/ingest",
        fetchFn,
        windowObj: { navigator: {} },
        sampleRate: 1
      }
    );

    expect(result).toEqual({ sent: true, transport: "fetch" });
    expect(fetchFn).toHaveBeenCalledTimes(1);
    const [url, options] = fetchFn.mock.calls[0];
    expect(url).toBe("https://errors.example.com/ingest");
    expect(options.method).toBe("POST");
    expect(options.keepalive).toBe(true);
  });

  it("prefers beacon transport when available", async () => {
    const sendBeacon = vi.fn().mockReturnValue(true);
    const fetchFn = vi.fn();
    const result = await sendClientError(
      {
        scope: "window.unhandledrejection",
        message: "rejected"
      },
      {
        endpoint: "https://errors.example.com/ingest",
        fetchFn,
        windowObj: { navigator: { sendBeacon } },
        sampleRate: 1
      }
    );

    expect(result).toEqual({ sent: true, transport: "beacon" });
    expect(sendBeacon).toHaveBeenCalledTimes(1);
    expect(fetchFn).not.toHaveBeenCalled();
  });

  it("buildClientErrorPayload captures non-Error values safely", () => {
    const payload = buildClientErrorPayload("test.scope", { anything: "value" }, {}, null);
    expect(payload.scope).toBe("test.scope");
    expect(typeof payload.message).toBe("string");
    expect(payload.stack).toBeNull();
  });
});

