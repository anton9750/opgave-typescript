import { createElement } from "../atoms/index";
import { createCardElement } from "../atoms/cardElement";
import type { Goal } from "../../types/goal";

export const createGameBoard = (originalCards: Goal[], onCardClick: (el: HTMLElement) => void): HTMLElement => {
  
  let allCards = [...originalCards, ...originalCards];
  allCards = allCards.sort(() => Math.random() - 0.5);

  const board = createElement(
    "div",
    "grid grid-cols-5 gap-2 justify-center mx-auto p-4 max-w-[560px] bg-slate-800/30 rounded-3xl shadow-2xl"
  );

  console.log(`🎴 Opretter ${allCards.length} kort`);

  allCards.forEach(card => {
    board.appendChild(createCardElement(card, onCardClick));
  });

  return board;
};