import './style.css';
import { gameController } from './controllers/gameController';
import { createScoreBoard } from './components/scoreboard';
import { createColorWheel } from './components/colorWheel'; 
import { render } from './utils/dom';
import { createLandingPage } from './components/LandingPage';

const startApp = () => {
  // Show beautiful landing page first
  const landing = createLandingPage(() => {
    // This runs when player clicks "Continue"
    render('app', createScoreBoard());
    render('app', createColorWheel());
    
    const gameBoard = gameController.initGame();
    render('app', gameBoard);
  });

  document.getElementById('app')?.appendChild(landing);
};

startApp();