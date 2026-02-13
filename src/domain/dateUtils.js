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

export function isOpenOnGoodFriday(events, goodFridayDate) {
  if (!Array.isArray(events)) {
    return false;
  }

  return events.some((event) => moment(event?.dt_start).isSame(goodFridayDate, "day"));
}

export function parseDateTimes(events, nowMoment, goodFridayDate) {
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

    if (moment(start).isSame(goodFridayDate, "day")) {
      openGoodFriday = true;
    }

    if (moment(start).isSame(end, "day") && moment(start).isSame(now, "day")) {
      eventListToday.push(`${start.format("h:mm a")} to ${end.format("h:mm a")}`);
      datecounter += 1;
    }

    let label;
    if (openGoodFriday) {
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
