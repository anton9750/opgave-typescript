import { gridModel } from "../models/gridModel";

export const gridController = {
  createGridSelector: (
    onGridChange: (cols: number) => void
  ): HTMLElement => {
    
    const selector = document.createElement("div");
    selector.className = "flex gap-3 mb-4";

    const options = gridModel.getOptions();

    options.forEach(({ cols, label }) => {
      const btn = document.createElement("button");
      btn.textContent = label;
      btn.className = `px-6 py-2.5 rounded-2xl font-medium transition-all hover:scale-105 active:scale-95 ${
        cols === gridModel.getCurrentCols() 
          ? "bg-amber-500 text-slate-950" 
          : "bg-slate-700 hover:bg-slate-600"
      }`;

      btn.addEventListener("click", () => {
        gridModel.setCols(cols);
        
        // Update all buttons
        selector.querySelectorAll("button").forEach(b => {
          const isActive = b.textContent === label;
          b.classList.toggle("bg-amber-500", isActive);
          b.classList.toggle("text-slate-950", isActive);
          b.classList.toggle("bg-slate-700", !isActive);
          b.classList.toggle("hover:bg-slate-600", !isActive);
        });

        onGridChange(cols);
      });

      selector.appendChild(btn);
    });

    return selector;
  }
};