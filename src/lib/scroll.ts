const SCROLL_TARGET_KEY = 'scroll-target';

const getHeaderOffset = () => {
  const header = document.querySelector('header');
  const headerHeight = header ? header.getBoundingClientRect().height : 0;
  return Math.max(0, Math.ceil(headerHeight) + 12);
};

const scrollToElement = (element: HTMLElement) => {
  const offset = getHeaderOffset();
  const top = Math.max(0, element.getBoundingClientRect().top + window.scrollY - offset);
  window.scrollTo({ top, behavior: 'smooth' });

  // Lazy sections can shift layout shortly after scroll starts; correct once.
  window.setTimeout(() => {
    const correctedTop = Math.max(0, element.getBoundingClientRect().top + window.scrollY - offset);
    if (Math.abs(window.scrollY - correctedTop) > 10) {
      window.scrollTo({ top: correctedTop, behavior: 'smooth' });
    }
  }, 260);
};

export const requestScrollTo = (targetId: string) => {
  if (typeof window === 'undefined') {
    return false;
  }
  const element = document.getElementById(targetId) as HTMLElement | null;
  if (element) {
    scrollToElement(element);
    return true;
  }
  window.sessionStorage.setItem(SCROLL_TARGET_KEY, targetId);
  return false;
};

export const consumeScrollTarget = () => {
  if (typeof window === 'undefined') {
    return null;
  }
  const target = window.sessionStorage.getItem(SCROLL_TARGET_KEY);
  if (target) {
    window.sessionStorage.removeItem(SCROLL_TARGET_KEY);
  }
  return target;
};

export const scrollToId = (targetId: string) => {
  if (typeof window === 'undefined') {
    return false;
  }
  const element = document.getElementById(targetId) as HTMLElement | null;
  if (!element) {
    return false;
  }
  scrollToElement(element);
  return true;
};
