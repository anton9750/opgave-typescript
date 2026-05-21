import { createElement } from "../views/atoms";
import { toggleCardFlipSound } from "../views/atoms/cardElement";   // ← Important import

export const createScoreBoard = (): HTMLElement => {
    const container = createElement('div', 'fixed top-4 right-8 text-white text-right font-sans z-50 flex flex-col items-end gap-2');

    container.innerHTML = `
        <div class="text-xl font-bold">Klik: <span id="click-count" class="text-yellow-400">0</span></div>
        <div class="text-xl font-bold">Tid: <span id="game-timer" class="text-yellow-400">00:00:00</span></div>
    `;

    // Mute Button
    const muteBtn = document.createElement('button');
    muteBtn.textContent = '🔊';
    muteBtn.className = 'text-3xl mt-2 hover:scale-110 active:scale-90 transition-all';
    muteBtn.title = 'Toggle card flip sound';

    let soundEnabled = true;

    muteBtn.addEventListener('click', () => {
        soundEnabled = toggleCardFlipSound();
        muteBtn.textContent = soundEnabled ? '🔊' : '🔇';
    });

    container.appendChild(muteBtn);

    return container;
};