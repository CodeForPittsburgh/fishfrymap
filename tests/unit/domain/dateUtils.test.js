import moment from "moment";
import { describe, expect, it } from "vitest";

import { computeGoodFriday, isOpenOnGoodFriday, parseDateTimes } from "../../../src/react/domain/dateUtils";

describe("dateUtils", () => {
  it("computes known Good Friday dates", () => {
    expect(computeGoodFriday(2024).format("YYYY-MM-DD")).toBe("2024-03-29");
    expect(computeGoodFriday(2025).format("YYYY-MM-DD")).toBe("2025-04-18");
    expect(computeGoodFriday(2026).format("YYYY-MM-DD")).toBe("2026-04-03");
  });

  it("detects good friday opening from events", () => {
    const goodFriday = computeGoodFriday(2026);
    const events = [
      {
        dt_start: "2026-04-03T16:00:00",
        dt_end: "2026-04-03T19:00:00"
      }
    ];

    expect(isOpenOnGoodFriday(events, goodFriday)).toBe(true);
    expect(isOpenOnGoodFriday([], goodFriday)).toBe(false);
    expect(isOpenOnGoodFriday(null, goodFriday)).toBe(false);
  });

  it("parses event windows into today/future labels", () => {
    const goodFriday = computeGoodFriday(2026);
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

    const parsed = parseDateTimes(events, now, goodFriday);

    expect(parsed.today).toEqual(["12:00 pm to 2:00 pm"]);
    expect(parsed.GoodFriday).toBe(true);
    expect(parsed.future.length).toBe(2);
    expect(parsed.future[0]).toContain("Friday, March");
    expect(parsed.future[1]).toContain("Open Good Friday, April");
  });

  it("adds closed-on-good-friday label when applicable", () => {
    const goodFriday = computeGoodFriday(2026);
    const now = moment("2026-03-01T10:00:00");
    const events = [
      {
        dt_start: "2026-03-27T16:00:00",
        dt_end: "2026-03-27T18:00:00"
      }
    ];

    const parsed = parseDateTimes(events, now, goodFriday);
    expect(parsed.GoodFriday).toBe(false);
    expect(parsed.future.at(-1)).toBe("Closed on Good Friday");
  });
});
