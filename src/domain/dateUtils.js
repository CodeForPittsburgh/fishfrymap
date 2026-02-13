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
  const eventListToday = [];
  let openGoodFriday = false;
  let datecounter = 0;

  sortList.forEach((pair) => {
    const start = pair[0];
    const end = pair[1];
    const goodFridayDate = computeGoodFriday(start.year());
    const isGoodFridayEvent = start.isSame(goodFridayDate, "day");

    if (isGoodFridayEvent) {
      openGoodFriday = true;
    }

    if (moment(start).isSame(end, "day") && moment(start).isSame(now, "day")) {
      eventListToday.push(`${start.format("h:mm a")} to ${end.format("h:mm a")}`);
      datecounter += 1;
    }

    let label;
    if (isGoodFridayEvent) {
      label = `Open Good ${start.format("dddd, MMMM Do")}, ${start.format("h:mm a")} to ${end.format(
        "h:mm a"
      )}`;
    } else {
      label = `${start.format("dddd, MMMM Do")}, ${start.format("h:mm a")} to ${end.format("h:mm a")}`;
    }

    datecounter += 1;
    eventListFuture.push(label);
  });

  if (!openGoodFriday && datecounter > 0) {
    eventListFuture.push("Closed on Good Friday");
  }

  return {
    today: eventListToday,
    future: eventListFuture,
    GoodFriday: openGoodFriday
  };
}
