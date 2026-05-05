import { createElement } from "../views/atoms";

// Sørg for at 'export' står foran 'const'
export const createScoreBoard = (): HTMLElement => {
    const container = createElement('div', 'fixed top-4 right-8 text-white text-right font-sans z-50');
    
    container.innerHTML = `
        <div class="text-xl font-bold">Klik: <span id="click-count" class="text-yellow-400">0</span></div>
        <div class="text-xl font-bold">Tid: <span id="game-timer" class="text-yellow-400">00:00:00</span></div>
    `;
    
    return container;
};