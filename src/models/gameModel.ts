import { cardData } from "../data/cardData";
import type { Goal } from "../types/goal";

class GameModel {
    public clicks: number = 0;
    public turns: number = 0; // 🌟 Ny: Tæller hver gang 2 kort er vendt
    public matchesFound: number = 0;
    public totalPairs: number = cardData.length;
    public flippedCards: HTMLElement[] = [];
    public isLockBoard: boolean = false;
    
    // Timer-relaterede data
    public secondsElapsed: number = 0; // 🌟 Ny
    public timerIntervalId: number | null = null; // 🌟 Ny

    public getList(): Goal[] {
        return [...cardData];
    }

    public reset() {
        this.clicks = 0;
        this.turns = 0;
        this.matchesFound = 0;
        this.flippedCards = [];
        this.isLockBoard = false;
        this.secondsElapsed = 0;
        
        // Stop timeren hvis den kørte i forvejen
        if (this.timerIntervalId) {
            clearInterval(this.timerIntervalId);
            this.timerIntervalId = null;
        }
    }
}

export const gameModel = new GameModel();