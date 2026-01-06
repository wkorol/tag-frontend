const SCROLL_TARGET_KEY = 'scroll-target';

export const requestScrollTo = (targetId: string) => {
  if (typeof window === 'undefined') {
    return false;
  }
  const element = document.getElementById(targetId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
  const element = document.getElementById(targetId);
  if (!element) {
    return false;
  }
  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  return true;
};
