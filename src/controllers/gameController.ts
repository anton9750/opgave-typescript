import { createGameBoard } from "../views/modules/createGameBoard";
import { cardData } from "../data/cardData";
import type { Goal } from "../types/goal";

export const gameController = {
  initGame: () => {
    console.log(`📊 cardData har ${cardData.length} unikke billeder`); // debug

    const gameBoard = createGameBoard(cardData, handleCardClick);
    return gameBoard;
  }
};

function handleCardClick(el: HTMLElement) {
  console.log("Kort klikket:", el.dataset.id);
  // Senere: match-logik
}