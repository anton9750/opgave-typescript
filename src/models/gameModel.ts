import { cardData } from "../data/cardData";
import type { Goal } from "../types/goal";

class GameModel {
    // Antal klik brugeren har lavet i alt
    clicks: number = 0;

    // Antal "turns" (hver gang der er vendt 2 kort)
    turns: number = 0;

    // Hvor mange par brugeren har fundet indtil nu
    matchesFound: number = 0;

    // Total antal par i spillet (læses fra cardData)
    totalPairs: number = cardData.length;

    // Holder styr på de kort der er vendt op lige nu (max 2)
    flippedCards: HTMLElement[] = [];

    // Forhindrer at man kan klikke på flere kort mens animationer kører
    isLockBoard: boolean = false;

    // Timer: hvor mange sekunder spillet har kørt
    secondsElapsed: number = 0;

    // Holder ID på intervallet, så vi kan stoppe timeren senere
    timerIntervalId: number | null = null;

   
    getList(): Goal[] {
        return [...cardData]; // spread
    }

    /**
     * Nulstiller 
     */
    reset() {
        this.clicks = 0;
        this.turns = 0;
        this.matchesFound = 0;
        this.flippedCards = [];        // tøm
        this.isLockBoard = false;
        this.secondsElapsed = 0;

        // Stop time
        if (this.timerIntervalId) {
            clearInterval(this.timerIntervalId);
            this.timerIntervalId = null;
        }
    }
}

export const gameModel = new GameModel();