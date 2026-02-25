import moment from "moment";

function padout(number) {
  return number < 10 ? `0${number}` : `${number}`;
}

function easter(year) {
  const c = Math.floor(year / 100);
  const n = year - 19 * Math.floor(year / 19);
  const k = Math.floor((c - 17) / 25);
  let i = c - Math.floor(c / 4) - Math.floor((c - k) / 3) + 19 * n + 15;
  i -= 30 * Math.floor(i / 30);
  i -=
    Math.floor(i / 28) *
    (1 - Math.floor(i / 28) * Math.floor(29 / (i + 1)) * Math.floor((21 - n) / 11));
  let j = year + Math.floor(year / 4) + i + 2 - c + Math.floor(c / 4);
  j -= 7 * Math.floor(j / 7);
  const l = i - j;
  const m = 3 + Math.floor((l + 40) / 44);
  const d = l + 28 - 31 * Math.floor(m / 4);

  return `${year}-${padout(m)}-${padout(d)}`;
}

export function computeGoodFriday(year) {
  return moment(easter(year)).subtract(2, "d");
}

export function computeAshWednesday(year) {
  return moment(easter(year)).subtract(46, "d");
}

export function deriveLiturgicalOpenFlags(events) {
  if (!Array.isArray(events)) {
    return {
      GoodFriday: false,
      AshWednesday: false
    };
  }

  let openGoodFriday = false;
  let openAshWednesday = false;

  events.forEach((event) => {
    const start = moment(event?.dt_start);
    if (!start.isValid()) {
      return;
    }

    const eventYear = start.year();
    const goodFridayDate = computeGoodFriday(eventYear);
    const ashWednesdayDate = computeAshWednesday(eventYear);

    if (start.isSame(goodFridayDate, "day")) {
      openGoodFriday = true;
    }

    if (start.isSame(ashWednesdayDate, "day")) {
      openAshWednesday = true;
    }
  });

  return {
    GoodFriday: openGoodFriday,
    AshWednesday: openAshWednesday
  };
}

export function parseDateTimes(events, nowMoment) {
  const now = nowMoment || moment();
  const sortList = [];
  const eventList = Array.isArray(events) ? events : [];

  eventList.forEach((event) => {
    const begin = moment(event?.dt_start);
    const end = moment(event?.dt_end);

    if (!begin.isValid() || !end.isValid()) {
      return;
    }

    if (end.isAfter(now)) {
      sortList.push([begin, end]);
    }
  });

  sortList.sort((a, b) => {
    if (a[0].isBefore(b[0])) {
      return -1;
    }
    if (a[0].isAfter(b[0])) {
      return 1;
    }
    return 0;
  });

  const eventListFuture = [];
  const eventListFutureGroups = [];
  const eventListToday = [];
  const groupsByDate = new Map();
  let openGoodFriday = false;
  let hasFutureEvents = false;

  sortList.forEach((pair) => {
    const start = pair[0];
    const end = pair[1];
    const goodFridayDate = computeGoodFriday(start.year());
    const isGoodFridayEvent = start.isSame(goodFridayDate, "day");
    const dateKey = start.format("YYYY-MM-DD");
    const formattedTime = `${start.format("h:mm A")} to ${end.format("h:mm A")}`;

    if (isGoodFridayEvent) {
      openGoodFriday = true;
    }

    hasFutureEvents = true;

    if (moment(start).isSame(end, "day") && moment(start).isSame(now, "day")) {
      eventListToday.push(formattedTime);
    }

    if (!groupsByDate.has(dateKey)) {
      const nextGroup = {
        dateKey,
        // dateLabel: start.format("dddd, MMMM D"),
        dateLabel: start.format("MMMM D"),
        times: [],
        isGoodFriday: false
      };
      groupsByDate.set(dateKey, nextGroup);
      eventListFutureGroups.push(nextGroup);
    }

    const dateGroup = groupsByDate.get(dateKey);
    dateGroup.times.push(formattedTime);
    if (isGoodFridayEvent) {
      dateGroup.isGoodFriday = true;
    }

    let label;
    if (isGoodFridayEvent) {
      label = `Open Good ${start.format("dddd, MMMM Do")}, ${start.format("h:mm a")} to ${end.format(
        "h:mm a"
      )}`;
    } else {
      label = `${start.format("dddd, MMMM Do")}, ${start.format("h:mm a")} to ${end.format("h:mm a")}`;
    }

    eventListFuture.push(label);
  });

  const closedOnGoodFriday = !openGoodFriday && hasFutureEvents;
  if (closedOnGoodFriday) {
    eventListFuture.push("Closed on Good Friday");
  }

  return {
    today: eventListToday,
    future: eventListFuture,
    futureGroups: eventListFutureGroups,
    closedOnGoodFriday,
    GoodFriday: openGoodFriday
  };
}

// Helper to parse a time range string like "11:00 AM to 2:00 PM" into start and end moments on a given date
export function parseEventRange(dateKey, timeLabel) {
  if (!dateKey || !timeLabel) {
    return null;
  }

  const rangeParts = timeLabel.includes(" to ")
    ? timeLabel.split(" to ")
    : timeLabel.includes(" - ")
      ? timeLabel.split(" - ")
      : null;

  if (!rangeParts || rangeParts.length !== 2) {
    return null;
  }

  const [startStr, endStr] = rangeParts.map((part) => part.trim());
  if (!startStr || !endStr) {
    return null;
  }

  const start = moment(`${dateKey} ${startStr}`, ["YYYY-MM-DD h:mm A", "YYYY-MM-DD h A"], true);
  const end = moment(`${dateKey} ${endStr}`, ["YYYY-MM-DD h:mm A", "YYYY-MM-DD h A"], true);

  if (!start.isValid() || !end.isValid() || !end.isAfter(start)) {
    return null;
  }

  return { start, end };
}

// Helper to generate and download an ICS file for a single event
export function downloadICS({ title, location, description, startDateTime, endDateTime }) {
  // Format date as YYYYMMDDTHHmmssZ (UTC)
  const formatICSDate = (date) => {
    return moment(date).utc().format('YYYYMMDDTHHmmss') + 'Z';
  };

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Fish Fry Map//EN',
    'BEGIN:VEVENT',
    `UID:${Date.now()}@fishfrymap`,
    `DTSTAMP:${formatICSDate(new Date())}`,
    `DTSTART:${formatICSDate(startDateTime)}`,
    `DTEND:${formatICSDate(endDateTime)}`,
    `SUMMARY:${title}`,
    location ? `LOCATION:${location}` : '',
    description ? `DESCRIPTION:${description}` : '',
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean).join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${title.replace(/\s+/g, '_')}.ics`;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}

