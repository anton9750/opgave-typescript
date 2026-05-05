export const createElement = (tag: string, className?: string): HTMLElement => {
    const el = document.createElement(tag);
    if (className) el.className = className;
    return el;
};

export const createImage = (src: string, alt: string, className?: string): HTMLImageElement => {
    const img = document.createElement('img') as HTMLImageElement;
    img.src = src;
    img.alt = alt;
    if (className) img.className = className;
    return img;
};

export const render = (containerId: string, element: HTMLElement, clear: boolean = false) => {
    const container = document.getElementById(containerId);
    if (container) {
        if (clear) container.innerHTML = '';
        container.appendChild(element);
    }
};