import './style.css';
import { gameController } from './controllers/gameController';
import { createScoreBoard } from './components/scoreboard';
import { createColorWheel } from './components/colorWheel'; // 🌟 Importér her
import { render } from './utils/dom';

const startApp = () => {
    // 1. Overskrift
    const header = document.createElement('h1');
    header.textContent = 'GAMING MEMORY';
    header.className = 'text-5xl font-black text-white text-center py-8 tracking-tighter';
    render('app', header, true);

    // 2. Scoreboard
    render('app', createScoreBoard());

    // 3. Det avancerede farvehjul i siden 🌟
    render('app', createColorWheel());

    // 4. Spilbrættet
    const gameBoard = gameController.initGame();
    render('app', gameBoard);
};

startApp();