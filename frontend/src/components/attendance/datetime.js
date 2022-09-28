import { NowIndicatorRoot } from "@fullcalendar/react";
import { DateTime } from "luxon";

export const zone = "Asia/Seoul";

export function now() {
  return DateTime.now().setZone(zone);
}

export function nowDate() {
  let month = now().c.month < 10 ? '0' + now().c.month : now().c.month;    
  let day = now().c.day < 10 ? '0' + now().c.day : now().c.day;
  return `${now().c.year}-${ month }-${day}`;
}

export function parseDateJs(date) {
  return DateTime.fromJSDate(date).setZone(zone);
}
