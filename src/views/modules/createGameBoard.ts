import { createElement } from "../atoms";
import { createCardElement } from "../atoms/cardElement";
import { gridController } from "../../controllers/gridController";
import { gridModel } from "../../models/gridModel";     // ← Added this import
import type { Goal } from "../../types/goal";

export const createGameBoard = (originalCards: Goal[], onCardClick: (el: HTMLElement) => void): HTMLElement => {
  
  const allCards = [...originalCards, ...originalCards].sort(() => Math.random() - 0.5);

  const boardContainer = createElement("div", "flex flex-col items-center gap-6");

  let currentBoard: HTMLElement | null = null;

  const createBoard = (cols: number) => {
    if (currentBoard) currentBoard.remove();

    currentBoard = createElement(
      "div",
      `grid gap-3 justify-center mx-auto p-4 bg-slate-800/30 rounded-3xl shadow-2xl`
    );
    
    currentBoard.style.gridTemplateColumns = `repeat(${cols}, minmax(0, 1fr))`;
    
    const maxWidth = cols === 5 ? "560px" : cols === 8 ? "720px" : "960px";
    currentBoard.style.maxWidth = maxWidth;

    allCards.forEach(card => {
      currentBoard!.appendChild(createCardElement(card, onCardClick));
    });

    boardContainer.appendChild(currentBoard);
  };

  // Grid selector from controller
  const selector = gridController.createGridSelector((newCols) => {
    createBoard(newCols);
  });

  boardContainer.appendChild(selector);
  createBoard(gridModel.currentCols);   // ← Now it knows gridModel

  return boardContainer;
};