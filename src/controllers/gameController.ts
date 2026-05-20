import { createGameBoard } from "../views/modules/createGameBoard";
import { gameModel } from "../models/gameModel";

/**
 * gameController er spillets centrale hjerne (Controller i MVC).
 * Den håndterer initialisering af spillet og reagerer på spillerens handlinger (klik).
 */
export const gameController = {
  // initialiserer (starter) et helt nyt spil
  initGame: (): HTMLElement => {
    // 1. Nulstil alle data i modellen (klik, vendinger, fundne matche, kørende timere)
    gameModel.reset();
    
    // 2. Hent listen over de unikke kort/billeder fra modellen
    const cards = gameModel.getList(); 
    console.log(`📊 Spillet starter med ${cards.length} unikke billeder`);

    // 3. Generer HTML-brættet ved at sende kortdataene og klik-funktionen videre
    const gameBoard = createGameBoard(cards, handleCardClick);
    
    // 4. Returner det færdige bræt, så det kan rendres på skærmen i main.ts
    return gameBoard;
  }
};

// Holder styr på JavaScripts indbyggede setTimeout-timer, når to forkerte kort vises i 1 sekund
let unflipTimeoutId: number | null = null;

/**
 * Håndterer det vigtige klik-event, hver gang en spiller trykker på et kort.
 * @param innerCard Det specifikke kort-element (.relative div), som spilleren har klikket på
 */
function handleCardClick(innerCard: HTMLElement) {
  // TJEK A: Hvis det er det ALLERFØRSTE klik i hele spillet, så start stopuret med det samme
  if (gameModel.clicks === 0 && gameModel.timerIntervalId === null) {
    startTimer();
  }

  // TJEK B: Hvis der allerede hænger 2 forkerte kort, og spilleren klikker på et 3. kort,
  // så tvinges de to gamle kort øjeblikkeligt rundt for at rydde op på brættet.
  if (gameModel.flippedCards.length === 2) {
    forceUnflip();
  }

  // TJEK C: Sikkerhedstjek så man ikke kan klikke på det samme kort to gange i træk,
  // eller klikke på et kort, som allerede ER blevet godkendt som et korrekt match.
  if (gameModel.flippedCards.includes(innerCard)) return;
  if (innerCard.classList.contains("is-matched")) return;

  // Opdater spildata: Læg 1 til det samlede antal klik i modellen
  gameModel.clicks++;
  
  // Opdater UI: Find klik-tælleren i scoreboardet og opdater teksten på skærmen
  const clickCountEl = document.getElementById("click-count");
  if (clickCountEl) {
    // Vi viser både det rå antal klik og beregningen for reelle vendinger (runder)
    clickCountEl.innerHTML = `${gameModel.clicks} <span class="text-xs text-slate-400">(Vendinger: ${gameModel.turns})</span>`;
  }

  // Visuel animation: Tilføj Tailwind-klassen der roterer kortet 180 grader, så forsiden ses
  innerCard.classList.add("[transform:rotateY(180deg)]");
  
  // Gem kortet i modellens midlertidige liste over kort, der er vendt i denne runde
  gameModel.flippedCards.push(innerCard);

  // Hvis listen nu indeholder præcis 2 kort, er runden slut, og de skal tjekkes
  if (gameModel.flippedCards.length === 2) {
    // Læg 1 til antal runder/vendinger (turns), da to kort nu er åbne
    gameModel.turns++;
    // Kald funktionen der undersøger om kortene er ens
    checkForMatch();
  }
}

/**
 * Undersøger om de to aktuelt vendte kort gemmer på den samme karakter.
 */
function checkForMatch() {
  // Split arrayet op i to særskilte variabler (card1 og card2)
  const [card1, card2] = gameModel.flippedCards;
  
  // Sammenlign de unikke id'er (som blev sat via dataset.id i cardElement.ts)
  const isMatch = card1.dataset.id === card2.dataset.id;

  if (isMatch) {
    // Hvis id'erne er ens, er det et succesfuldt match!
    disableCards(card1, card2);
  } else {
    // Hvis id'erne er forskellige, var det en fejl, og de skal vendes om igen
    unflipCards(card1, card2);
  }
}

/**
 * Håndterer logikken når spilleren har fundet to ens kort.
 */
function disableCards(card1: HTMLElement, card2: HTMLElement) {
  // 1. Lås kortene visuelt ved at give dem en 'is-matched' klasse (bruges også til sikkerhedstjek)
  card1.classList.add("is-matched");
  card2.classList.add("is-matched");

  // 2. Registrer i modellen, at der er fundet endnu et par
  gameModel.matchesFound++;
  
  // 3. Tøm listen over vendte kort med det samme, så brættet er klar til en ny runde
  gameModel.flippedCards = [];

  // 4. Sejrstjek: Hvis antallet af fundne par matcher det totale antal par i spillet, er spillet slut!
  if (gameModel.matchesFound === gameModel.totalPairs) {
    stopTimer(); // Stop stopuret med det samme, så tiden fryses præcist
    
    // Vis en velfortjent pop-up besked efter 0,5 sekunder, så den sidste kort-animation kan nå at færdiggøres
    setTimeout(() => {
      alert(`🎉 SEJR! 🎉\n\n⏱️ Tid: ${formatTime(gameModel.secondsElapsed)}\n🎯 Antal vendinger: ${gameModel.turns}\n💥 Totale klik: ${gameModel.clicks}`);
    }, 500);
  }
}

/**
 * Vender de to forkerte kort tilbage til bagsiden efter en tidsforsinkelse på 1 sekund.
 */
function unflipCards(card1: HTMLElement, card2: HTMLElement) {
  // Start en timer på 1000 millisekunder (1 sekund)
  unflipTimeoutId = window.setTimeout(() => {
    // Når sekundet er gået, fjernes Tailwind-klassen, og kortene flipper tilbage til bagsiden
    card1.classList.remove("[transform:rotateY(180deg)]");
    card2.classList.remove("[transform:rotateY(180deg)]");
    
    // Sikkerhedstjek: Tøm kun listen, hvis spilleren ikke i mellemtiden har klikket på et 3. kort
    if (gameModel.flippedCards.length === 2 && gameModel.flippedCards.includes(card1)) {
      gameModel.flippedCards = [];
    }
    // Nulstil timer-id'et da timeren nu har kørt færdig
    unflipTimeoutId = null;
  }, 1000);
}

/**
 * Tvinger de to forrige forkerte kort rundt med det samme. 
 * Bruges hvis spilleren klikker hurtigt videre uden at vente på 1-sekunds timeren.
 */
function forceUnflip() {
  // Hvis 1-sekunds timeren er i gang med at tælle ned, afbryder og sletter vi den med det samme
  if (unflipTimeoutId) {
    clearTimeout(unflipTimeoutId);
    unflipTimeoutId = null;
  }
  
  // Gennemgå de to forkerte kort og vend dem om til bagsiden med det samme
  gameModel.flippedCards.forEach(card => {
    card.classList.remove("[transform:rotateY(180deg)]");
  });
  
  // Tøm listen fuldstændig, så den er klar til at modtage det nye klik
  gameModel.flippedCards = [];
}

// =========================================================================
// ⏱️ TIMER FUNKTIONER
// =========================================================================

/**
 * Starter spillets stopur, som tikker hvert sekund.
 */
function startTimer() {
  // Hent HTML-elementet hvor tiden skal vises fra scoreboardet
  const timerEl = document.getElementById("game-timer");
  
  // Sæt et interval der kører uendeligt hvert 1000. millisekund (1 sekund)
  gameModel.timerIntervalId = window.setInterval(() => {
    // Læg 1 sekund til den samlede tid i modellen
    gameModel.secondsElapsed++;
    
    // Hvis elementet findes på skærmen, formateres sekunderne til en flot tekst (00:00:00)
    if (timerEl) {
      timerEl.textContent = formatTime(gameModel.secondsElapsed);
    }
  }, 1000);
}

/**
 * Stopper spillets stopur (f.eks. ved sejr eller genstart).
 */
function stopTimer() {
  // Hvis der findes et aktivt kørende interval, så slet det
  if (gameModel.timerIntervalId) {
    clearInterval(gameModel.timerIntervalId);
    // Nulstil referencen i modellen
    gameModel.timerIntervalId = null;
  }
}

/**
 * Hjælpefunktion der omregner rå sekunder til et letlæseligt ur-format.
 * @param totalSeconds Antal sekunder (f.eks. 75)
 * @returns En streng formateret som "timer:minutter:sekunder" (f.eks. "00:01:15")
 */
function formatTime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600); // Beregn hele timer
  const minutes = Math.floor((totalSeconds % 3600) / 60); // Beregn resterende minutter
  const seconds = totalSeconds % 60; // Beregn resterende sekunder

  // Lille funktion der sikrer, at tal under 10 altid har et 0 foran (f.eks. "05" i stedet for "5")
  const pad = (num: number) => String(num).padStart(2, "0");
  
  // Returner det samlede resultat adskilt af kolon
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}