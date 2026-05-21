// Henter nødvendige funktioner, controllers, modeller og typer ind i filen
import { createElement } from "../atoms";
import { createCardElement } from "../atoms/cardElement";
import { gridController } from "../../controllers/gridController";
import { gridModel } from "../../models/gridModel"; 
import type { Goal } from "../../types/goal";

// Eksporterer hovedfunktionen, som bygger og returnerer det samlede spil-interfaceee
export const createGameBoard = (originalCards: Goal[], onCardClick: (el: HTMLElement) => void): HTMLElement => {
  
  // SPREAD 
  const allCards = [...originalCards, ...originalCards].sort(() => Math.random() - 0.5);

  // Opretter hoved-containeren (en div med Tailwind CSS-klasser til styling)
  const boardContainer = createElement("div", "flex flex-col items-center gap-6");

  // En variabel til at holde styr på det nuværende bræt (starter som tom/null)
  let currentBoard: HTMLElement | null = null;

  // En intern hjælpefunktion, der bygger selve kort-gitteret (grid) ud fra et antal kolonner (cols)
  const createBoard = (cols: number) => {
    // Hvis der allerede findes et bræt på skærmen, slettes det (så vi kan bygge et nyt med ny størrelse)
    if (currentBoard) currentBoard.remove();

  
    currentBoard = createElement(
      "div",
      `grid gap-3 justify-center mx-auto p-4 bg-slate-800/30 rounded-3xl shadow-2xl`
    );
    
    // TEMPLATE 
    currentBoard.style.gridTemplateColumns = `repeat(${cols}, minmax(0, 1fr))`;
    
    // TERNARY  
    const maxWidth = cols === 5 ? "560px" : cols === 8 ? "720px" : "960px";
    currentBoard.style.maxWidth = maxWidth;

  
    allCards.forEach(card => {
  
      currentBoard!.appendChild(createCardElement(card, onCardClick));
    });

    // Put til sidst det færdige bræt ind i hoved-containeren
    boardContainer.appendChild(currentBoard);
  };

  // Opretter en grid-vælger (f.eks. en dropdown eller knapper) via vores controller.
  // Når brugeren vælger noget nyt, modtager vi 'newCols' og kalder 'createBoard' på ny.
  const selector = gridController.createGridSelector((newCols) => {
    createBoard(newCols);
  });

  // Tilføjer vælgeren (kontrolpanelet) til toppen af hoved-containeren
  boardContainer.appendChild(selector);
  
  // Starter spillet op første gang ved at kigge i 'gridModel' for at se standard-antallet af kolonner
  createBoard(gridModel.currentCols);

  // Returnerer hele molevitten, klar til at blive sat ind på hjemmesiden
  return boardContainer;
};