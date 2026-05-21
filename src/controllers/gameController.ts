import { createGameBoard } from "../views/modules/createGameBoard";
import { gameModel } from "../models/gameModel";

/**
 * gameController er spillets centrale hjerne (Controller i MVC).
 */
export const gameController = {
  // initialiserer (starter) et helt nyt spil
  initGame: (): HTMLElement => {
    gameModel.reset();
    
    //  SPREAD 
    const cards = [...gameModel.getList()]; 
    console.log(`📊 Spillet starter med ${cards.length} unikke billeder`);

    const gameBoard = createGameBoard(cards, handleCardClick);
    return gameBoard;
  }
};

let unflipTimeoutId: number | null = null;

/**
 
 *ASYNC:
 */
async function handleCardClick(innerCard: HTMLElement) {
  // TJEK A: Start timer ved første klik
  if (gameModel.clicks === 0 && gameModel.timerIntervalId === null) {
    startTimer();
  }

  // TJEK B: Tving unflip hvis der klikkes på et 3. kort
  if (gameModel.flippedCards.length === 2) {
    forceUnflip();
  }

  // TJEK C: Sikkerhedstjek
  if (gameModel.flippedCards.includes(innerCard) || innerCard.classList.contains("is-matched")) return;

  gameModel.clicks++;
  
  const clickCountEl = document.getElementById("click-count");
  if (clickCountEl) {
    clickCountEl.innerHTML = `${gameModel.clicks} <span class="text-xs text-slate-400">(Vendinger: ${gameModel.turns})</span>`;
  }

  innerCard.classList.add("[transform:rotateY(180deg)]");
  gameModel.flippedCards.push(innerCard);

  if (gameModel.flippedCards.length === 2) {
    gameModel.turns++;
    // 🌟 AWAIT:
    await checkForMatch();
  }
}

/**
 * 
 * 🌟 ASYNC
 */
async function checkForMatch() {
  const [card1, card2] = gameModel.flippedCards;
  const isMatch = card1.dataset.id === card2.dataset.id;

  // Ternary
  isMatch 
    ? disableCards(card1, card2) 
    : await unflipCards(card1, card2);
}

/**
 * Håndterer logikken når spilleren har fundet to ens kort.
 */
function disableCards(card1: HTMLElement, card2: HTMLElement) {
  card1.classList.add("is-matched");
  card2.classList.add("is-matched");

  gameModel.matchesFound++;
  gameModel.flippedCards = [];

  if (gameModel.matchesFound === gameModel.totalPairs) {
    stopTimer();
    
    // 🌟 PROMISE-BASERET TIMEOUT: Venter 500ms før alert vises uden grimme indlejrede callbacks
    delay(500).then(() => {
      alert(`SEJR! \n\n⏱ Tid: ${formatTime(gameModel.secondsElapsed)}\n Antal vendinger: ${gameModel.turns}\n Totale klik: ${gameModel.clicks}`);
    });
  }
}

/**
 * Vender de to forkerte kort tilbage til bagsiden.
 * 🌟 PROMISE
 */
function unflipCards(card1: HTMLElement, card2: HTMLElement): Promise<void> {
  // jeg gemmer en reference, så forceUnflip stadig kan afbryde hvis nødvendigt
  return new Promise((resolve) => {
    unflipTimeoutId = window.setTimeout(() => {
      card1.classList.remove("[transform:rotateY(180deg)]");
      card2.classList.remove("[transform:rotateY(180deg)]");
      
      if (gameModel.flippedCards.length === 2 && gameModel.flippedCards.includes(card1)) {
        gameModel.flippedCards = [];
      }
      unflipTimeoutId = null;
      resolve(); //  Fortæller controlleren, at nu er animationen færdig!
    }, 1000);
  });
}

/**
 * Tvinger de to forrige forkerte kort rundt med det samme.
 */
function forceUnflip() {
  if (unflipTimeoutId) {
    clearTimeout(unflipTimeoutId);
    unflipTimeoutId = null;
  }
  
  // 🌟 SPREAD 
  [...gameModel.flippedCards].forEach(card => {
    card.classList.remove("[transform:rotateY(180deg)]");
  });
  
  gameModel.flippedCards = [];
}



/**
 *  HJÆLPE-PROMISE (Delay): Gør det muligt at pause koden asynkront
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

function startTimer() {
  const timerEl = document.getElementById("game-timer");
  
  gameModel.timerIntervalId = window.setInterval(() => {
    gameModel.secondsElapsed++;
    if (timerEl) {
      timerEl.textContent = formatTime(gameModel.secondsElapsed);
    }
  }, 1000);
}

function stopTimer() {
  if (gameModel.timerIntervalId) {
    clearInterval(gameModel.timerIntervalId);
    gameModel.timerIntervalId = null;
  }
}

function formatTime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (num: number) => String(num).padStart(2, "0");
  
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}