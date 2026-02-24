const POLISH_FIXED_HOLIDAYS = [
  [1, 1],
  [1, 6],
  [5, 1],
  [5, 3],
  [8, 15],
  [11, 1],
  [11, 11],
  [12, 25],
  [12, 26]
];
const formatDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
const getEasterSunday = (year) => {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = (h + l - 7 * m + 114) % 31 + 1;
  return new Date(year, month - 1, day);
};
const addDays = (date, days) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};
const getPolishHolidayKeys = (year) => {
  const keys = /* @__PURE__ */ new Set();
  POLISH_FIXED_HOLIDAYS.forEach(([month, day]) => {
    keys.add(formatDateKey(new Date(year, month - 1, day)));
  });
  const easterSunday = getEasterSunday(year);
  keys.add(formatDateKey(easterSunday));
  keys.add(formatDateKey(addDays(easterSunday, 1)));
  keys.add(formatDateKey(addDays(easterSunday, 49)));
  keys.add(formatDateKey(addDays(easterSunday, 60)));
  return keys;
};
const isPolishPublicHoliday = (date, apiHolidayKeys) => {
  if (date.getDay() === 0) {
    return true;
  }
  const dateKey = formatDateKey(date);
  if (apiHolidayKeys == null ? void 0 : apiHolidayKeys.has(dateKey)) {
    return true;
  }
  const fallbackKeys = getPolishHolidayKeys(date.getFullYear());
  return fallbackKeys.has(dateKey);
};
let lockCount = 0;
let savedScrollY = 0;
let snapshot = null;
let preventScrollHandler = null;
const isElement = (value) => typeof Element !== "undefined" && value instanceof Element;
const isInsideModalScroll = (target) => {
  if (!isElement(target)) return false;
  return Boolean(target.closest(".modal-scroll"));
};
const lockBodyScroll = () => {
  if (typeof window === "undefined") return;
  if (lockCount > 0) {
    lockCount += 1;
    return;
  }
  lockCount = 1;
  savedScrollY = window.scrollY || 0;
  const body = document.body;
  const html = document.documentElement;
  snapshot = {
    body: {
      overflow: body.style.overflow,
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      paddingRight: body.style.paddingRight
    },
    html: {
      overflow: html.style.overflow
    }
  };
  const scrollbarWidth = Math.max(0, window.innerWidth - html.clientWidth);
  if (scrollbarWidth > 0) {
    body.style.paddingRight = `${scrollbarWidth}px`;
  }
  html.style.overflow = "hidden";
  body.style.overflow = "hidden";
  body.style.position = "fixed";
  body.style.top = `-${savedScrollY}px`;
  body.style.width = "100%";
  if (!preventScrollHandler) {
    preventScrollHandler = (e) => {
      if (isInsideModalScroll(e.target)) return;
      e.preventDefault();
    };
    window.addEventListener("wheel", preventScrollHandler, { passive: false, capture: true });
    window.addEventListener("touchmove", preventScrollHandler, { passive: false, capture: true });
  }
};
const unlockBodyScroll = () => {
  if (typeof window === "undefined") return;
  if (lockCount === 0) return;
  lockCount -= 1;
  if (lockCount > 0) return;
  const body = document.body;
  const html = document.documentElement;
  const restore = snapshot;
  snapshot = null;
  if (restore) {
    html.style.overflow = restore.html.overflow;
    body.style.overflow = restore.body.overflow;
    body.style.position = restore.body.position;
    body.style.top = restore.body.top;
    body.style.width = restore.body.width;
    body.style.paddingRight = restore.body.paddingRight;
  } else {
    html.style.overflow = "";
    body.style.overflow = "";
    body.style.position = "";
    body.style.top = "";
    body.style.width = "";
    body.style.paddingRight = "";
  }
  if (preventScrollHandler) {
    window.removeEventListener("wheel", preventScrollHandler, { capture: true });
    window.removeEventListener("touchmove", preventScrollHandler, { capture: true });
    preventScrollHandler = null;
  }
  window.scrollTo(0, savedScrollY);
};
export {
  isPolishPublicHoliday as i,
  lockBodyScroll as l,
  unlockBodyScroll as u
};
