import { createElement } from "../utils/dom"; // Vi bruger din dom-util her!

// Definer de 5 temaer med deres interne klassenavn og den farve, knappen skal have
const themes = [
  { name: "Mørk", className: "", btnColor: "bg-slate-700" },
  { name: "Grøn", className: "theme-emerald", btnColor: "bg-emerald-600" },
  { name: "Rød", className: "theme-rose", btnColor: "bg-rose-600" },
  { name: "Lilla", className: "theme-purple", btnColor: "bg-purple-600" },
  { name: "Retro", className: "theme-retro", btnColor: "bg-amber-700" }
];

export const createThemeSwitcher = (): HTMLElement => {
  // Opret en lodret container fixed ude i venstre side
  const container = createElement(
    "div", 
    "fixed left-4 top-1/2 -translate-y-1/2 flex flex-col gap-3 p-3 bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-700 shadow-2xl z-50"
  );

  // Tilføj en lille titel over knapperne
  const title = createElement("div", "text-[10px] uppercase tracking-wider text-slate-400 text-center font-bold mb-1");
  title.textContent = "Tema";
  container.appendChild(title);

  // Generer en knap for hvert tema
  themes.forEach(theme => {
    const btn = createElement(
      "button", 
      `w-10 h-10 rounded-xl cursor-pointer shadow-md transition-all duration-300 hover:scale-110 active:scale-95 ${theme.btnColor} border-2 border-white/20 hover:border-white`
    );
    
    // Vis tekst eller tooltip (eller bare lad farven tale for sig selv)
    btn.title = theme.name;

    // Klik-logik: Skift klassen på selve body-elementet
    btn.addEventListener("click", () => {
      // 1. Fjern alle nuværende tema-klasser fra body
      themes.forEach(t => {
        if (t.className) document.body.classList.remove(t.className);
      });

      // 2. Tilføj det nye tema (hvis det ikke er standard mørk, som har "")
      if (theme.className) {
        document.body.classList.add(theme.className);
      }
    });

    container.appendChild(btn);
  });

  return container;
};