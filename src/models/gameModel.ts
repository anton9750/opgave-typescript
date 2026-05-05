import { cardData } from "../data/cardData";
import type { Goal } from "../types/goal";

class GameModel {
    /**
     * Henter listen over karakterer.
     * returnerer et array af Goal objekter.
     */
    public getList(): Goal[] {
        return cardData;
    }
}

export const gameModel = new GameModel();