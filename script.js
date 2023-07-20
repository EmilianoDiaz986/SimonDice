var buttons = document.querySelectorAll('.button');
var scoreDisplay = document.getElementById('score');
var levelDisplay = document.getElementById('level');
var startButton = document.getElementById('start');
var resetButton = document.getElementById('reset');

var sequence = [];
var playerSequence = [];
var level = 1;
var score = 0;
var canClick = false;

// Generate a random button and add it to the sequence
function generateButtonSequence() {
  var randomButton = buttons[Math.floor(Math.random() * buttons.length)];
  sequence.push(randomButton.id);
}

// Play the button sequence
function playSequence() {
  canClick = false;
  var i = 0;
  var intervalId = setInterval(function() {
    if (i < sequence.length) {
      var buttonId = sequence[i];
      var button = document.getElementById(buttonId);
      activateButton(button);
      i++;
    } else {
      clearInterval(intervalId);
      canClick = true;
    }
  }, 1000);
}

// Activate a button (add the 'active' class)
function activateButton(button) {
  button.classList.add('active');
  setTimeout(function() {
    button.classList.remove('active');
  }, 500);
}

// Check if the player's sequence matches the game sequence
function checkSequence() {
  for (var i = 0; i < playerSequence.length; i++) {
    if (playerSequence[i] !== sequence[i]) {
      gameOver();
      return;
    }
  }

  if (playerSequence.length === sequence.length) {
    score++;
    level++;
    scoreDisplay.textContent = score;
    levelDisplay.textContent = level;
    playerSequence = [];
    generateButtonSequence();
    setTimeout(playSequence, 1000);
  }
}


// Game over
function gameOver() {
  var modal = document.getElementById('game-over-modal');
  modal.classList.add('active');
  resetGame();
}

// Cerrar el mensaje de juego terminado
var closeModalButton = document.getElementById('close-modal');
closeModalButton.addEventListener('click', function() {
  var modal = document.getElementById('game-over-modal');
  modal.classList.remove('active');
});

// Reset the game
function resetGame() {
  sequence = [];
  playerSequence = [];
  level = 1;
  score = 0;
  scoreDisplay.textContent = score;
  levelDisplay.textContent = level;
  canClick = false;
}

// Event listeners for button clicks
for (var i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener('click', function() {
    if (canClick) {
      var button = this;
      activateButton(button);
      playerSequence.push(button.id);
      checkSequence();
    }
  });
}

// Event listener for the start button
startButton.addEventListener('click', function() {
  startButton.disabled = true;
  resetButton.disabled = false;
  generateButtonSequence();
  setTimeout(function() {
    playSequence();
  }, 1000);
});

// Event listener for the reset button
resetButton.addEventListener('click', function() {
  startButton.disabled = false;
  resetButton.disabled = true;
  resetGame();
});
