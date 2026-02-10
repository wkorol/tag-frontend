let lockCount = 0;
let savedScrollY = 0;

type BodySnapshot = {
  overflow: string;
  position: string;
  top: string;
  width: string;
  paddingRight: string;
};

type HtmlSnapshot = {
  overflow: string;
};

type Snapshot = {
  body: BodySnapshot;
  html: HtmlSnapshot;
};

let snapshot: Snapshot | null = null;

let preventScrollHandler: ((e: Event) => void) | null = null;

const isElement = (value: unknown): value is Element =>
  typeof Element !== 'undefined' && value instanceof Element;

const isInsideModalScroll = (target: EventTarget | null) => {
  if (!isElement(target)) return false;
  return Boolean(target.closest('.modal-scroll'));
};

export const lockBodyScroll = () => {
  if (typeof window === 'undefined') return;
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
      paddingRight: body.style.paddingRight,
    },
    html: {
      overflow: html.style.overflow,
    },
  };

  // Prevent layout shift when hiding scrollbar (desktop browsers).
  const scrollbarWidth = Math.max(0, window.innerWidth - html.clientWidth);
  if (scrollbarWidth > 0) {
    body.style.paddingRight = `${scrollbarWidth}px`;
  }

  // iOS Safari: overflow hidden isn't sufficient; body must be fixed.
  html.style.overflow = 'hidden';
  body.style.overflow = 'hidden';
  body.style.position = 'fixed';
  body.style.top = `-${savedScrollY}px`;
  body.style.width = '100%';

  // Extra safety: prevent wheel/touch scrolling from reaching the page behind.
  // Allow it only inside elements marked as `.modal-scroll`.
  if (!preventScrollHandler) {
    preventScrollHandler = (e: Event) => {
      if (isInsideModalScroll(e.target)) return;
      e.preventDefault();
    };
    window.addEventListener('wheel', preventScrollHandler, { passive: false, capture: true });
    window.addEventListener('touchmove', preventScrollHandler, { passive: false, capture: true });
  }
};

export const unlockBodyScroll = () => {
  if (typeof window === 'undefined') return;
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
    html.style.overflow = '';
    body.style.overflow = '';
    body.style.position = '';
    body.style.top = '';
    body.style.width = '';
    body.style.paddingRight = '';
  }

  if (preventScrollHandler) {
    window.removeEventListener('wheel', preventScrollHandler, { capture: true } as any);
    window.removeEventListener('touchmove', preventScrollHandler, { capture: true } as any);
    preventScrollHandler = null;
  }

  window.scrollTo(0, savedScrollY);
};
