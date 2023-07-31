var buttons = document.querySelectorAll('.button-juego');
var scoreDisplay = document.getElementById('score');
var levelDisplay = document.getElementById('level');
var startButton = document.getElementById('start');
var resetButton = document.getElementById('reset');
var nameForm = document.getElementById('name-form');
var playerNameInput = document.getElementById('player-name');
var startGameButton = document.getElementById('start-game');
var timerDisplay = document.getElementById('timer');
var gameOverModal = document.getElementById('game-over-modal');
var closeModalButton = document.getElementById('close-modal');
var showRankingButton = document.getElementById('show-ranking');

var sequence = [];
var playerSequence = [];
var level = 1;
var score = 0;
var canClick = false;
var currentTime = 0;
var timerInterval;
var timePenalty = currentTime;



// Generar un color aleatorio y agregarlo a la secuencia
function generateButtonSequence() {
  var randomButton = buttons[Math.floor(Math.random() * buttons.length)];
  sequence.push(randomButton.id);
}

// Reproducir la secuencia de colores
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


function activateButton(button) {
  button.classList.add('active');
  setTimeout(function() {
    button.classList.remove('active');
  }, 500);
}
function checkSequence() {
  for (var i = 0; i < playerSequence.length; i++) {
    if (playerSequence[i] !== sequence[i]) {

      // Aplicar la penalización por tiempo antes de llamar a la función gameOver()
      var finalScore = calculateFinalScore();
      scoreDisplay.textContent = finalScore;
      gameOver(); 
      return;
    }
  }

  if (playerSequence.length === sequence.length) {
    score += playerSequence.length; 
    level++; 
    scoreDisplay.textContent = score; 
    levelDisplay.textContent = level; 
    playerSequence = [];
    generateButtonSequence();
    setTimeout(playSequence, 1000);
  }
}

// Juego terminado
function gameOver() {
  // Guardar el resultado del juego en el LocalStorage después de reiniciar el juego
  
  stopTimer();
  timePenalty = currentTime; 
  var finalScore = calculateFinalScore();
  scoreDisplay.textContent = finalScore; 
  gameOverModal.classList.add('active');
  saveGameResult(playerNameInput.value.trim(), finalScore, level, currentTime);
  showGameOverModal(playerNameInput.value.trim(), finalScore, level, currentTime);
  setTimeout(function() {
    resetGame();
  }, 0);
}

// Calcular el puntaje final restando la penalización por tiempo
function calculateFinalScore() {
  var finalScore = score - timePenalty * 0.1; 
  return finalScore >= 0 ? finalScore : 0; 
}


// Detener el temporizador
function stopTimer() {
  clearInterval(timerInterval);
}

// Iniciar la cuenta ascendente del temporizador
function startTimer() {
  timerInterval = setInterval(function() {
    currentTime++;
    timerDisplay.textContent = currentTime + ' segundos';
  }, 1000);
}

// Función para mostrar el modal de juego terminado
function showGameOverModal(playerName, score, level, currentTime) {
  var modal = document.getElementById('game-over-modal');
  var gameOverName = document.getElementById('game-over-name');
  var gameOverScore = document.getElementById('game-over-score');
  var gameOverLevel = document.getElementById('game-over-level');
  var gameOverTime = document.getElementById('game-over-time');
  var gameOverDatetime = document.getElementById('game-over-datetime');

  // Mostrar la información de la partida en el modal
  gameOverName.textContent = playerName;
  gameOverScore.textContent = score; 
  gameOverLevel.textContent = level;
  gameOverTime.textContent = currentTime + ' segundos';
  gameOverDatetime.textContent = new Date().toLocaleString();

  
  // Mostrar el modal de juego terminado
  modal.classList.add('active');
}


// Event listeners para clic en los botones de colores
for (var i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener('click', function() {
    if (canClick) {
      var button = this;
      activateButton(button);
      playerSequence.push(button.id);
      checkSequence();
       // Llamar a la función gameOver() si el jugador pierde
       if (!canClick) {
        gameOver();
      }
    }
  });
}

// Evento click en el botón "Comenzar"
startButton.addEventListener('click', function() {
  startButton.classList.add('hidden');
  nameForm.classList.remove('hidden');
});

// Evento listener para click en el botón "Comenzar" dentro del formulario del nombre
startGameButton.addEventListener('click', function(e) {
  e.preventDefault();
  var playerName = playerNameInput.value.trim();
  if (playerName.length >= 3) {
    startButton.disabled = true;
    resetButton.disabled = false;
    nameForm.classList.add('hidden');
    generateButtonSequence();

    // Iniciar el temporizador
    currentTime = 0;
    timerDisplay.textContent = currentTime + ' segundos';
    startTimer();

    setTimeout(function() {
      playSequence();
    }, 1000);

    // Calcular el puntaje final restando la penalización por tiempo
    var finalScore = calculateFinalScore();


  } else {
    alert('El nombre debe tener al menos 3 letras.');
  }
  
});
// Evento listener para click en el botón "Reiniciar"
resetButton.addEventListener('click', function() {
  resetGame();
  nameForm.classList.remove('hidden');
  startButton.disabled = false;
  resetButton.disabled = true;
  stopTimer();
});


// Evento click en el botón "Cerrar" del modal de juego terminado
var closeModalButton = document.getElementById('close-modal');
closeModalButton.addEventListener('click', function() {
  var modal = document.getElementById('game-over-modal');
  modal.classList.remove('active');
  resetButton.disabled = false;
  nameForm.classList.add('hidden');
});

// Reiniciar el juego
function resetGame() {
  nameForm.classList.remove('hidden');
  sequence = [];
  playerSequence = [];
  level = 1;
  score = 0;
  scoreDisplay.textContent = score;
  levelDisplay.textContent = level;
  currentTime = 0; 
  timerDisplay.textContent = currentTime + ' segundos';
  startButton.disabled = true;
  resetButton.disabled = true;
  canClick = false;
}

// Variable para guardar la opción de ordenamiento actual
var currentOrderOption = 'score'; 

// Función para mostrar el ranking de partidas
function showRanking() {
  var rankingModal = document.getElementById('ranking-modal');
  var rankingList = document.getElementById('ranking-list');


  // Restablecer la lista del ranking
  rankingList.innerHTML = '';

  // Ordenar las partidas según la opción seleccionada (puntaje o fecha)
  if (currentOrderOption === 'score') {
    gameResults.sort((a, b) => b.score - a.score);
  } else if (currentOrderOption === 'date') {
    gameResults.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));
  }

  // Mostrar la lista de partidas en el ranking
  for (var i = 0; i < gameResults.length; i++) {
    var gameResult = gameResults[i];
    var listItem = document.createElement('p');
    listItem.innerHTML = `Jugador: <span>${gameResult.playerName}</span> | Puntaje: <span>${gameResult.score}</span> | Nivel: <span>${gameResult.level}</span> | Tiempo: <span>${gameResult.currentTime} segundos</span> | Fecha y hora: <span>${gameResult.dateTime}</span>`;
    rankingList.appendChild(listItem);
  }

  // Mostrar el modal de ranking
  rankingModal.classList.add('active');
}


// Evento click en el botón "Mostrar Ranking"
showRankingButton.addEventListener('click', function() {
  showRanking();
});

// Evento click en el botón "Ordenar por Puntaje"
var orderByScoreButton = document.getElementById('order-by-score');
orderByScoreButton.addEventListener('click', function() {
  currentOrderOption = 'score';
  showRanking();
});

// Evento click en el botón "Ordenar por Fecha"
var orderByDateButton = document.getElementById('order-by-date');
orderByDateButton.addEventListener('click', function() {
  currentOrderOption = 'date';
  showRanking();
});

// Evento click en el botón "Cerrar" del modal de ranking
var closeRankingModalButton = document.getElementById('close-ranking-modal');
closeRankingModalButton.addEventListener('click', function() {
  var rankingModal = document.getElementById('ranking-modal');
  rankingModal.classList.remove('active');
});


// Función para obtener las partidas del LocalStorage
function getGameResultsFromLocalStorage() {
  var gameResults = localStorage.getItem('gameResults');
  return gameResults ? JSON.parse(gameResults) : [];
}

// Función para guardar la información de la partida en el LocalStorage
function saveGameResult(playerName, score, level, currentTime, dateTime) {
  var gameResult = {
    playerName: playerName,
    score: score,
    level: level,
    currentTime: currentTime,
    dateTime: dateTime || new Date().toISOString(), 
  };
  

  var gameResults = getGameResultsFromLocalStorage();
  gameResults.push(gameResult);
  localStorage.setItem('gameResults', JSON.stringify(gameResults));
  
}

// Obtener las partidas del LocalStorage
var gameResults = getGameResultsFromLocalStorage();
console.log(gameResults); 







