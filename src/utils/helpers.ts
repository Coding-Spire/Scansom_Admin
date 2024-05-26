export const sleep = (time: number) =>
  new Promise((res) => setTimeout(res, time));

export const calculateWindowSize = (windowWidth: number) => {
  if (windowWidth >= 1200) {
    return 'lg';
  }
  if (windowWidth >= 992) {
    return 'md';
  }
  if (windowWidth >= 768) {
    return 'sm';
  }
  return 'xs';
};

export const setWindowClass = (classList: string) => {
  const window: HTMLElement | null =
    document && document.getElementById('root');
  if (window) {
    // @ts-ignore
    window.classList = classList;
  }
};
export const addWindowClass = (classList: string) => {
  const window: HTMLElement | null =
    document && document.getElementById('root');
  if (window) {
    // @ts-ignore
    window.classList.add(classList);
  }
};

export function generateGUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    function (c) {
      var r = (Math.random() * 16) | 0,
        v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    }
  );
}



export const removeWindowClass = (classList: string) => {
  const window: HTMLElement | null =
    document && document.getElementById('root');
  if (window) {
    // @ts-ignore
    window.classList.remove(classList);
  }
};
