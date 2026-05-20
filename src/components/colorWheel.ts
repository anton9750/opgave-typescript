import { createElement } from "../utils/dom";

export const createColorWheel = (): HTMLElement => {
  // 1. Hovedcontainer placeret fixed ude i venstre side (ligesom temaerne)
  const container = createElement(
    "div",
    "fixed left-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-3 p-4 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-700 shadow-2xl z-50 w-48"
  );

  const title = createElement("div", "text-xs uppercase tracking-wider text-slate-300 font-black text-center mb-1");
  title.textContent = "Custom Hue";
  container.appendChild(title);

  // 2. Opret Canvas elementet til farvehjulet
  const size = 130; // Hjulets diameter i pixels
  const canvas = createElement("canvas") as HTMLCanvasElement;
  canvas.width = size;
  canvas.height = size;
  canvas.className = "cursor-crosshair rounded-full shadow-inner border border-slate-600";
  container.appendChild(canvas);

  // 3. Tegn farvehjulet på vores canvas (Matematisk HSL-spektrum)
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const radius = size / 2;
    // Løb igennem hver eneste pixel på canvasset
    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        // Find distancen fra centrum (koordinat-matematik)
        const dx = x - radius;
        const dy = y - radius;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Hvis pixlet er inden for cirklens radius, giv det en farve
        if (distance <= radius) {
          // Beregn vinklen i radianer for at finde farvetonen (Hue)
          let angle = Math.atan2(dy, dx) * (180 / Math.PI);
          if (angle < 0) angle += 360;

          // HSL: Hue = vinkel, Saturation = distance til kant, Lightness = 50%
          const saturation = (distance / radius) * 100;
          ctx.fillStyle = `hsl(${angle}, ${saturation}%, 50%)`;
          ctx.fillRect(x, y, 1, 1);
        }
      }
    }
  }

  // 4. Opret et lille visuelt preview-felt, så man kan se farven inden man trykker confirm
  const preview = createElement("div", "w-full h-6 rounded-lg border border-white/20 bg-transparent transition-colors duration-150");
  const previewText = createElement("div", "text-[10px] font-mono text-slate-400 text-center mt-[-4px]");
  previewText.textContent = "Klik på hjulet";
  container.appendChild(preview);
  container.appendChild(previewText);

  // Variabel til at gemme den aktuelt valgte RGB-farve
  let selectedColor = "";

  // 5. Lyt efter klik på koordinaterne i canvasset
  canvas.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect();
    // Udregn de præcise $x$ og $y$ koordinater relativt til canvasset
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const canvasCtx = canvas.getContext("2d");
    if (canvasCtx) {
      // Hent billeddata (RGBA) for præcis det klikkede pixelkoordinat (1x1 pixel)
      const pixel = canvasCtx.getImageData(x, y, 1, 1).data;
      
      // Hvis pixlet ikke er gennemsigtigt (altså uden for cirklen)
      if (pixel[3] !== 0) {
        selectedColor = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
        
        // Opdater min preview boks
        preview.style.backgroundColor = selectedColor;
        previewText.textContent = `RGB(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
      }
    }
  });

  // 6. Opret "Confirm" knappen
  const confirmBtn = createElement(
    "button",
    "w-full py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg shadow-md cursor-pointer transition-all duration-200 active:scale-95 uppercase tracking-wider"
  );
  confirmBtn.textContent = "Confirm";
  container.appendChild(confirmBtn);

  // 7. Ved tryk på Confirm skydes farven direkte på document.body
  confirmBtn.addEventListener("click", () => {
    if (selectedColor) {
      // Fjern eventuelle gamle faste tema-klasser hvis de forstyrrer
      document.body.className = ""; 
      
      // Sæt den rå inline baggrundsfarve
      document.body.style.backgroundColor = selectedColor;
    }
  });

  return container;
};