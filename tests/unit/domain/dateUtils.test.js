import moment from "moment";
import { describe, expect, it } from "vitest";

import {
  computeAshWednesday,
  computeGoodFriday,
  deriveLiturgicalOpenFlags,
  parseDateTimes
} from "../../../src/domain/dateUtils";

describe("dateUtils", () => {
  it("computes known Good Friday dates", () => {
    expect(computeGoodFriday(2024).format("YYYY-MM-DD")).toBe("2024-03-29");
    expect(computeGoodFriday(2025).format("YYYY-MM-DD")).toBe("2025-04-18");
    expect(computeGoodFriday(2026).format("YYYY-MM-DD")).toBe("2026-04-03");
  });

  it("computes known Ash Wednesday dates", () => {
    expect(computeAshWednesday(2024).format("YYYY-MM-DD")).toBe("2024-02-14");
    expect(computeAshWednesday(2025).format("YYYY-MM-DD")).toBe("2025-03-05");
    expect(computeAshWednesday(2026).format("YYYY-MM-DD")).toBe("2026-02-18");
  });

  it("derives liturgical open flags from events", () => {
    const events = [
      {
        dt_start: "2024-02-14T16:00:00",
        dt_end: "2024-02-14T19:00:00"
      },
      {
        dt_start: "2026-04-03T16:00:00",
        dt_end: "2026-04-03T19:00:00"
      }
    ];

    expect(deriveLiturgicalOpenFlags(events)).toEqual({
      GoodFriday: true,
      AshWednesday: true
    });
    expect(deriveLiturgicalOpenFlags([])).toEqual({
      GoodFriday: false,
      AshWednesday: false
    });
    expect(deriveLiturgicalOpenFlags(null)).toEqual({
      GoodFriday: false,
      AshWednesday: false
    });
  });

  it("parses event windows into today/future labels", () => {
    const now = moment("2026-03-20T10:00:00");
    const events = [
      {
        dt_start: "2026-03-20T12:00:00",
        dt_end: "2026-03-20T14:00:00"
      },
      {
        dt_start: "2026-04-03T16:00:00",
        dt_end: "2026-04-03T19:00:00"
      }
    ];

    const parsed = parseDateTimes(events, now);

    expect(parsed.today).toEqual(["12:00 pm to 2:00 pm"]);
    expect(parsed.GoodFriday).toBe(true);
    expect(parsed.future.length).toBe(2);
    expect(parsed.future[0]).toContain("Friday, March");
    expect(parsed.future[1]).toContain("Open Good Friday, April");
  });

  it("adds closed-on-good-friday label when applicable", () => {
    const now = moment("2026-03-01T10:00:00");
    const events = [
      {
        dt_start: "2026-03-27T16:00:00",
        dt_end: "2026-03-27T18:00:00"
      }
    ];

    const parsed = parseDateTimes(events, now);
    expect(parsed.GoodFriday).toBe(false);
    expect(parsed.future.at(-1)).toBe("Closed on Good Friday");
  });

  it("handles malformed events payloads without throwing", () => {
    const now = moment("2026-03-01T10:00:00");

    const parsedFromString = parseDateTimes("invalid", now);
    const parsedFromObject = parseDateTimes({ dt_start: "2026-03-01T12:00:00" }, now);

    expect(parsedFromString).toEqual({
      today: [],
      future: [],
      GoodFriday: false
    });
    expect(parsedFromObject).toEqual({
      today: [],
      future: [],
      GoodFriday: false
    });
  });
});
