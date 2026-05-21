import { createElement, createImage } from "./index";
import type { Goal } from "../../types/goal";

export const createCardElement = (goal: Goal, onClick: (el: HTMLElement) => void): HTMLElement => {
  const card = createElement(
    "div", 
    "group w-16 h-24 cursor-pointer"
  );

  const inner = createElement(
    "div",
    "relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d]"
  );
  inner.dataset.id = goal.id;

  // Front (bagside) - Card Back
  const front = createElement("div", "absolute inset-0 rounded-xl overflow-hidden shadow-md [backface-visibility:hidden] border border-slate-700");
  front.append(
    createImage(
      `${import.meta.env.BASE_URL}images/17goals/doomslayer.jpg`, 
      "Card Back", 
      "w-full h-full object-cover"
    )
  );

  // Back (forside) - The actual game card
  const back = createElement("div", "absolute inset-0 rounded-xl overflow-hidden shadow-md [backface-visibility:hidden] [transform:rotateY(180deg)] border border-amber-400");
  back.append(
    createImage(
      goal.image, 
      goal.title, 
      "w-full h-full object-cover"
    )
  );

  inner.append(front, back);
  card.append(inner);

  card.addEventListener("click", () => {
    inner.classList.toggle("[transform:rotateY(180deg)]");
    onClick(inner);
  });

  return card;
};