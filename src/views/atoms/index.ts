export const createElement = (
  tag: string,
  className?: string
): HTMLElement => {
  const el = document.createElement(tag);

  if (className) {
    el.className = className;
  }

  return el;
};

export const createImage = (
  src: string,
  alt: string,
  className?: string
): HTMLImageElement => {
  const img = document.createElement("img");
  img.src = src;
  img.alt = alt;

  if (className) {
    img.className = className;
  }

  return img;
};