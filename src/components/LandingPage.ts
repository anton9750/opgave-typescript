export const createLandingPage = (onContinue: () => void): HTMLElement => {
  const landing = document.createElement('div');
  landing.className = 'fixed inset-0 bg-[#1a0f08] flex items-center justify-center z-50 overflow-hidden';

  landing.innerHTML = `
    <div class="relative max-w-4xl mx-auto text-center px-6">
      <!-- Background image or gradient -->
      <div class="absolute inset-0 bg-[radial-gradient(at_center,#4a2c0f_0%,transparent_70%)] opacity-60"></div>
      
      <div class="relative">
        <h1 class="text-7xl font-black tracking-tighter text-amber-100 mb-4 drop-shadow-2xl">
          GAMING MEMORY
        </h1>
        
        <p class="text-xl text-amber-200/90 mb-8 max-w-md mx-auto">
          Find all matching card pairs.<br>
          Flip two cards at a time and remember their positions.
        </p>

        <div class="mb-10">
          <input 
            id="player-name" 
            type="text" 
            placeholder="Enter your name" 
            class="w-80 bg-white/10 border border-amber-400/50 text-white placeholder:text-amber-300/70 rounded-full px-8 py-4 text-lg focus:outline-none focus:border-amber-400"
          >
        </div>

        <button 
          id="continue-btn"
          class="bg-amber-500 hover:bg-amber-400 active:scale-95 transition-all text-slate-950 font-bold text-xl px-12 py-4 rounded-full shadow-xl shadow-amber-500/30"
        >
          CONTINUE TO GAME →
        </button>
      </div>
    </div>
  `;

  // Add continue functionality
  setTimeout(() => {
    const btn = landing.querySelector('#continue-btn') as HTMLButtonElement;
    const nameInput = landing.querySelector('#player-name') as HTMLInputElement;

    btn?.addEventListener('click', () => {
      const playerName = nameInput?.value.trim() || "Player";
      localStorage.setItem('playerName', playerName); // optional: save name
      landing.remove();
      onContinue();
    });
  }, 100);

  return landing;
};