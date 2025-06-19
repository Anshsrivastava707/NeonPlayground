(() => {
  // Global state
  const appRoot = document.getElementById('app-root');
  let currentView = 'home'; // Track current view

  // Game list with metadata
  const games = [
    {
      id: 'tic-tac-toe',
      title: 'Tic Tac Toe',
      description: 'Classic 3x3 grid game. Get three in a row to win.',
      icon: 'grid_3x3',
      render: renderTicTacToe,
    },
    {
      id: 'snake',
      title: 'Snake',
      description: 'Control the snake to eat and grow longer.',
      icon: 'android',
      render: renderSnakeGame,
    },
    {
      id: 'breakout',
      title: 'Breakout',
      description: 'Break all the blocks with your paddle and ball.',
      icon: 'view_column',
      render: renderBreakout,
    },
    {
      id: 'minesweeper',
      title: 'Minesweeper',
      description: 'Clear the grid without detonating mines.',
      icon: 'warning',
      render: renderMinesweeper,
    },
    {
      id: 'whack-a-mole',
      title: 'Whack-a-Mole',
      description: 'Tap moles before they disappear.',
      icon: 'sports_mma',
      render: renderWhackAMole,
    },
    {
      id: 'simon-says',
      title: 'Simon Says',
      description: 'Repeat the colorful sequence.',
      icon: 'memory',
      render: renderSimonSays,
    },
    {
      id: 'tetris',
      title: 'Tetris',
      description: 'Classic block-stacking puzzle game.',
      icon: 'view_column',
      render: renderTetris,
    },
    {
      id: '2048',
      title: '2048',
      description: 'Join the numbers to reach 2048!',
      icon: 'filter_9_plus',
      render: render2048,
    },
    {
      id: 'sudoku',
      title: 'Sudoku',
      description: 'Fill the 9x9 grid so every row, column, and 3x3 box contains 1-9.',
      icon: 'grid_4x4',
      render: renderSudoku,
    },
  ];

  // Browser history management
  function updateHistory(view, gameId = null) {
    currentView = view;
    const url = gameId ? `#${gameId}` : '#';
    const title = gameId ? `NeonPlayground - ${games.find(g => g.id === gameId)?.title}` : 'NeonPlayground';
    
    if (window.history && window.history.pushState) {
      window.history.pushState({ view, gameId }, title, url);
    } else {
      // Fallback for older browsers
      window.location.hash = url;
    }
  }

  function handlePopState(event) {
    if (event.state && event.state.view) {
      if (event.state.view === 'home') {
        renderGameSelection();
      } else if (event.state.gameId) {
        loadGame(event.state.gameId);
      }
    } else {
      // Handle direct URL access or fallback
      const hash = window.location.hash.slice(1);
      if (hash && games.find(g => g.id === hash)) {
        loadGame(hash);
      } else {
        renderGameSelection();
      }
    }
  }

  // Create game selection menu
  function renderGameSelection() {
    const container = document.createElement('section');
    container.className = 'game-selection';
    container.setAttribute('aria-label', 'Select a game to play');
    container.tabIndex = -1;

    games.forEach(({ id, title, description, icon }) => {
      const card = document.createElement('button');
      card.className = 'game-card';
      card.setAttribute('aria-label', `Play ${title}`);
      card.type = 'button';
      card.tabIndex = 0;

      // Icon
      const iconEl = document.createElement('span');
      iconEl.className = 'game-icon';
      iconEl.textContent = icon;
      iconEl.setAttribute('aria-hidden', 'true');
      card.appendChild(iconEl);

      // Title
      const titleEl = document.createElement('h3');
      titleEl.className = 'game-title';
      titleEl.textContent = title;
      card.appendChild(titleEl);

      // Description
      const descEl = document.createElement('p');
      descEl.className = 'game-description';
      descEl.textContent = description;
      card.appendChild(descEl);

      card.addEventListener('click', () => {
        loadGame(id);
      });

      container.appendChild(card);
    });

    // Add "More games incoming" card at the end
    const moreGamesCard = document.createElement('div');
    moreGamesCard.className = 'game-card more-games-card';
    moreGamesCard.setAttribute('aria-label', 'More games coming soon');
    moreGamesCard.tabIndex = 0;

    // Icon
    const moreIconEl = document.createElement('span');
    moreIconEl.className = 'game-icon more-games-icon';
    moreIconEl.textContent = 'add_circle';
    moreIconEl.setAttribute('aria-hidden', 'true');
    moreGamesCard.appendChild(moreIconEl);

    // Title
    const moreTitleEl = document.createElement('h3');
    moreTitleEl.className = 'game-title';
    moreTitleEl.textContent = 'More Games Incoming';
    moreGamesCard.appendChild(moreTitleEl);

    // Description
    const moreDescEl = document.createElement('p');
    moreDescEl.className = 'game-description';
    moreDescEl.textContent = 'Stay tuned for exciting new games coming soon!';
    moreGamesCard.appendChild(moreDescEl);

    // Add pulsing animation indicator
    const pulseIndicator = document.createElement('div');
    pulseIndicator.className = 'pulse-indicator';
    pulseIndicator.innerHTML = '<span>🚀</span>';
    moreGamesCard.appendChild(pulseIndicator);

    container.appendChild(moreGamesCard);

    appRoot.innerHTML = '';
    appRoot.appendChild(container);
    container.focus();
    updateHistory('home');
  }

  // Load a game by id
  function loadGame(gameId) {
    const game = games.find(g => g.id === gameId);
    if (!game) {
      alert('Game not found.');
      return;
    }
    appRoot.innerHTML = '';
    const gameUI = game.render();
    appRoot.appendChild(gameUI);
    updateHistory('game', gameId);
  }

  // Common back button
  function createBackButton() {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'back-btn';
    btn.textContent = 'Back to Games';
    btn.addEventListener('click', () => {
      renderGameSelection();
    });
    return btn;
  }

  // Common restart button
  function createRestartButton(onRestart) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'restart-btn';
    btn.textContent = 'Restart Game';
    btn.addEventListener('click', onRestart);
    return btn;
  }

  ////////////////////////////////
  // Tic Tac Toe Implementation //
  ////////////////////////////////

  function renderTicTacToe() {
    const container = document.createElement('section');
    container.className = 'game-container';
    container.setAttribute('aria-label', 'Tic Tac Toe game');
    container.tabIndex = -1;

    // Header
    const header = document.createElement('div');
    header.className = 'game-header';
    const title = document.createElement('h2');
    title.textContent = 'Tic Tac Toe';
    header.appendChild(title);
    
    // Add restart button
    const restartBtn = createRestartButton(() => {
      resetGame();
    });
    header.appendChild(restartBtn);
    
    header.appendChild(createBackButton());
    container.appendChild(header);

    const playArea = document.createElement('div');
    playArea.className = 'game-play-area';
    container.appendChild(playArea);

    // Game stats
    const statsDisplay = document.createElement('div');
    statsDisplay.className = 'ttt-stats';
    playArea.appendChild(statsDisplay);

    // Game area
    const gameArea = document.createElement('div');
    gameArea.className = 'ttt-game-area';
    playArea.appendChild(gameArea);

    // Board
    const board = document.createElement('div');
    board.className = 'tic-tac-toe-board';
    gameArea.appendChild(board);

    // Status
    const status = document.createElement('div');
    status.className = 'game-status';
    container.appendChild(status);

    // Game logic
    const cells = [];
    let currentPlayer = 'X';
    let boardState = Array(9).fill(null);
    let gameOver = false;
    let xWins = 0;
    let oWins = 0;
    let draws = 0;
    let totalGames = 0;

    function updateStats() {
      statsDisplay.innerHTML = `
        <div class="stat-item">
          <span class="stat-label">X Wins</span>
          <span class="stat-value x-wins">${xWins}</span>
        </div>
        <div class="stat-divider">|</div>
        <div class="stat-item">
          <span class="stat-label">O Wins</span>
          <span class="stat-value o-wins">${oWins}</span>
        </div>
        <div class="stat-divider">|</div>
        <div class="stat-item">
          <span class="stat-label">Draws</span>
          <span class="stat-value draws">${draws}</span>
        </div>
        <div class="stat-divider">|</div>
        <div class="stat-item">
          <span class="stat-label">Games</span>
          <span class="stat-value total">${totalGames}</span>
        </div>
      `;
    }

    function checkWin(player) {
      const wins = [
        [0,1,2], [3,4,5], [6,7,8], // rows
        [0,3,6], [1,4,7], [2,5,8], // cols
        [0,4,8], [2,4,6],          // diagonals
      ];
      return wins.some(line =>
        line.every(i => boardState[i] === player)
      );
    }

    function getWinningCells(player) {
      const wins = [
        [0,1,2], [3,4,5], [6,7,8], // rows
        [0,3,6], [1,4,7], [2,5,8], // cols
        [0,4,8], [2,4,6],          // diagonals
      ];
      
      for (let line of wins) {
        if (line.every(i => boardState[i] === player)) {
          return line;
        }
      }
      return null;
    }

    function checkDraw() {
      return boardState.every(cell => cell !== null);
    }

    function updateStatus() {
      if(gameOver) return;
      status.textContent = `Player ${currentPlayer}'s turn`;
      status.className = `game-status ${currentPlayer.toLowerCase()}-turn`;
    }

    function highlightWinningLine(winningCells) {
      winningCells.forEach(index => {
        cells[index].classList.add('winning-cell');
      });
    }

    function endGame(message, winner = null, winningCells = null) {
      gameOver = true;
      status.textContent = message;
      status.className = 'game-status game-over';
      
      if (winner) {
        if (winner === 'X') xWins++;
        else if (winner === 'O') oWins++;
        totalGames++;
        if (winningCells) {
          highlightWinningLine(winningCells);
        }
      } else {
        draws++;
        totalGames++;
      }
      
      updateStats();
      cells.forEach(cell => cell.classList.add('disabled'));
    }

    function resetGame() {
      currentPlayer = 'X';
      boardState = Array(9).fill(null);
      gameOver = false;
      cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('disabled', 'winning-cell');
      });
      updateStatus();
    }

    function handleClick(idx) {
      if (gameOver || boardState[idx] !== null) return;
      
      boardState[idx] = currentPlayer;
      cells[idx].textContent = currentPlayer;
      cells[idx].classList.add('disabled', 'animate-move');
      
      setTimeout(() => {
        cells[idx].classList.remove('animate-move');
      }, 300);

      // Check for win
      if (checkWin(currentPlayer)) {
        const winningCells = getWinningCells(currentPlayer);
        endGame(`Player ${currentPlayer} wins!`, currentPlayer, winningCells);
        return;
      }
      
      // Check for draw
      if (checkDraw()) {
        endGame(`It's a draw!`);
        return;
      }
      
      // Switch player
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      updateStatus();
    }

    // Create cells
    for(let i=0; i<9; i++) {
      const cell = document.createElement('button');
      cell.className = 'tic-tac-toe-cell';
      cell.type = 'button';
      cell.setAttribute('aria-label', `Square ${i + 1}`);
      cell.tabIndex = 0;
      cell.addEventListener('click', () => handleClick(i));
      cells.push(cell);
      board.appendChild(cell);
    }

    updateStats();
    updateStatus();
    container.focus();

    return container;
  }

  //////////////////////////////
  // Snake Game Implementation //
  //////////////////////////////

  function renderSnakeGame() {
    const container = document.createElement('section');
    container.className = 'game-container';
    container.setAttribute('aria-label', 'Snake game');
    container.tabIndex = -1;

    const header = document.createElement('div');
    header.className = 'game-header';
    const title = document.createElement('h2');
    title.textContent = 'Snake';
    header.appendChild(title);
    
    // Add restart button
    const restartBtn = createRestartButton(() => {
      startGame();
    });
    header.appendChild(restartBtn);
    
    header.appendChild(createBackButton());
    container.appendChild(header);

    const playArea = document.createElement('div');
    playArea.className = 'game-play-area';
    container.appendChild(playArea);

    // Game stats
    const statsDisplay = document.createElement('div');
    statsDisplay.className = 'snake-stats';
    playArea.appendChild(statsDisplay);

    // Game area
    const gameArea = document.createElement('div');
    gameArea.className = 'snake-game-area';
    playArea.appendChild(gameArea);

    // Canvas setup
    const canvas = document.createElement('canvas');
    const scale = 20;
    const rows = 16;
    const cols = 16;
    canvas.width = cols * scale;
    canvas.height = rows * scale;
    canvas.className = 'snake-canvas';
    gameArea.appendChild(canvas);

    const ctx = canvas.getContext('2d');

    // Game state
    let snake = [{x:8, y:8}];
    let trail = []; // Trail effect
    let food = null;
    let direction = {x:0, y:0};
    let nextDirection = {x:0, y:0};
    let score = 0;
    let highScore = localStorage.getItem('snakeHighScore') || 0;
    let gameOver = false;
    let lastTime = 0;
    let moveInterval = 150; // Milliseconds between moves
    let animationId;
    let glowEffect = false; // Track glow effect
    let glowTimer = 0; // Timer for glow effect
    let gameStartTime = Date.now();
    let gameTime = 0;
    let isPaused = false;

    function updateStats() {
      const minutes = Math.floor(gameTime / 60);
      const seconds = gameTime % 60;
      const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      
      statsDisplay.innerHTML = `
        <div class="stat-item">
          <span class="stat-label">Score</span>
          <span class="stat-value score">${score}</span>
        </div>
        <div class="stat-divider">|</div>
        <div class="stat-item">
          <span class="stat-label">High Score</span>
          <span class="stat-value high-score">${highScore}</span>
        </div>
        <div class="stat-divider">|</div>
        <div class="stat-item">
          <span class="stat-label">Length</span>
          <span class="stat-value length">${snake.length}</span>
        </div>
        <div class="stat-divider">|</div>
        <div class="stat-item">
          <span class="stat-label">Time</span>
          <span class="stat-value time">${timeString}</span>
        </div>
      `;
    }

    function randomFood() {
      let newFood;
      do {
        newFood = {
          x: Math.floor(Math.random() * cols),
          y: Math.floor(Math.random() * rows)
        };
      } while (snake.some(s => s.x === newFood.x && s.y === newFood.y));
      return newFood;
    }

    function drawRect(x, y, color, alpha = 1) {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      ctx.fillRect(x * scale, y * scale, scale - 1, scale - 1);
      ctx.restore();
    }

    function drawCircle(x, y, color, alpha = 1) {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x * scale + scale/2, y * scale + scale/2, scale/2 - 1, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw grid pattern
      ctx.strokeStyle = 'rgba(0, 255, 136, 0.1)';
      ctx.lineWidth = 0.5;
      for (let i = 0; i <= cols; i++) {
        ctx.beginPath();
        ctx.moveTo(i * scale, 0);
        ctx.lineTo(i * scale, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i <= rows; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * scale);
        ctx.lineTo(canvas.width, i * scale);
        ctx.stroke();
      }

      // Draw trail with fading effect
      trail.forEach((segment, idx) => {
        const alpha = 0.3 * (1 - idx / trail.length);
        if (alpha > 0.05) {
          drawRect(segment.x, segment.y, '#00ff88', alpha);
        }
      });

      // Draw food with pulsing effect
      if (food) {
        const pulse = Math.sin(Date.now() * 0.01) * 0.2 + 0.8;
        drawCircle(food.x, food.y, '#ff4444', pulse);
      }

      // Draw snake with gradient effect
      snake.forEach((segment, idx) => {
        const intensity = 1 - (idx * 0.1);
        const color = idx === 0 ? '#00ff88' : `rgba(0, 255, 136, ${intensity})`;
        drawRect(segment.x, segment.y, color);
        
        // Add glow effect to head only when eating food
        if (idx === 0 && glowEffect) {
          ctx.save();
          ctx.shadowColor = '#00ff88';
          ctx.shadowBlur = 15;
          drawRect(segment.x, segment.y, '#00ff88');
          ctx.restore();
        }
      });
    }

    function moveSnake() {
      if (gameOver || isPaused) return;
      
      direction = nextDirection.x || nextDirection.y ? nextDirection : direction;
      if (direction.x === 0 && direction.y === 0) {
        return; // Not moving yet
      }
      
      const head = snake[0];
      const newHead = {x: head.x + direction.x, y: head.y + direction.y};

      // Check collisions
      if (
        newHead.x < 0 || newHead.y < 0 ||
        newHead.x >= cols || newHead.y >= rows ||
        snake.some((seg, i) => i !== 0 && seg.x === newHead.x && seg.y === newHead.y)
      ) {
        stopGame();
        showStatus('Game Over! Your score: ' + score);
        return;
      }

      // Add current head to trail
      trail.push({...head});
      if (trail.length > 10) {
        trail.shift();
      }

      snake.unshift(newHead);

      // Eating food
      if (newHead.x === food.x && newHead.y === food.y) {
        score += 10;
        placeFood();
        // Speed up slightly
        moveInterval = Math.max(80, moveInterval - 5);
        // Activate glow effect
        glowEffect = true;
        glowTimer = 30; // Glow for 30 frames (about 0.5 seconds at 60fps)
        
        showStatus(`Score: ${score}`);
        updateStats();
      } else {
        // Remove tail unless eating
        snake.pop();
      }
    }

    function placeFood() {
      food = randomFood();
    }

    function gameLoop(currentTime) {
      if (gameOver || isPaused) {
        if (!gameOver) {
          // Continue the loop even when paused to maintain responsiveness
          requestAnimationFrame(gameLoop);
        }
        return;
      }

      // Update game time
      gameTime = Math.floor((Date.now() - gameStartTime) / 1000);

      if (currentTime - lastTime > moveInterval) {
        moveSnake();
        lastTime = currentTime;
      }

      // Update glow effect timer
      if (glowEffect && glowTimer > 0) {
        glowTimer--;
        if (glowTimer === 0) {
          glowEffect = false;
        }
      }

      draw();
      updateStats();
      animationId = requestAnimationFrame(gameLoop);
    }

    function startGame() {
      if (animationId) cancelAnimationFrame(animationId);
      snake = [{x:8, y:8}];
      trail = [];
      direction = {x:0, y:0};
      nextDirection = {x:0, y:0};
      score = 0;
      gameOver = false;
      moveInterval = 150;
      glowEffect = false;
      glowTimer = 0;
      gameStartTime = Date.now();
      gameTime = 0;
      isPaused = false;
      placeFood();
      draw();
      showStatus('Use arrow keys or swipe to start!');
      updateStats();
      lastTime = performance.now();
      animationId = requestAnimationFrame(gameLoop);
    }

    function stopGame() {
      gameOver = true;
      if (animationId) cancelAnimationFrame(animationId);
      
      // Update high score
      if (score > highScore) {
        highScore = score;
        localStorage.setItem('snakeHighScore', highScore);
        updateStats();
      }
    }

    function showStatus(text) {
      status.textContent = text;
    }

    // Control handlers - keyboard and swipe

    function handleKeyDown(e) {
      if (gameOver) return;
      
      // Prevent page scrolling for arrow keys
      if(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }
      
      switch(e.key) {
        case 'ArrowUp':
          if (direction.y === 1) break;
          nextDirection = {x: 0, y: -1};
          break;
        case 'ArrowDown':
          if (direction.y === -1) break;
          nextDirection = {x: 0, y: 1};
          break;
        case 'ArrowLeft':
          if (direction.x === 1) break;
          nextDirection = {x: -1, y: 0};
          break;
        case 'ArrowRight':
          if (direction.x === -1) break;
          nextDirection = {x: 1, y: 0};
          break;
        case 'p':
        case 'P':
          isPaused = !isPaused;
          if (isPaused) {
            showStatus('Game Paused - Press P to resume');
          } else {
            showStatus('Game resumed');
            lastTime = performance.now(); // Reset drop timer when resuming
          }
          break;
      }
    }

    // Touch controls for swipe
    let touchStartX = null;
    let touchStartY = null;

    function handleTouchStart(e) {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    }

    function handleTouchEnd(e) {
      if (!touchStartX || !touchStartY) return;
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;

      const diffX = touchEndX - touchStartX;
      const diffY = touchEndY - touchStartY;

      if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 30 && direction.x !== -1) {
          nextDirection = {x: 1, y: 0};
        } else if (diffX < -30 && direction.x !== 1) {
          nextDirection = {x: -1, y: 0};
        }
      } else {
        if (diffY > 30 && direction.y !== -1) {
          nextDirection = {x: 0, y: 1};
        } else if (diffY < -30 && direction.y !== 1) {
          nextDirection = {x: 0, y: -1};
        }
      }

      touchStartX = null;
      touchStartY = null;
    }

    // Status display
    const status = document.createElement('div');
    status.className = 'game-status';
    status.setAttribute('aria-live', 'polite');
    container.appendChild(status);

    // Attach event listeners
    window.addEventListener('keydown', handleKeyDown);
    canvas.addEventListener('touchstart', handleTouchStart, {passive:true});
    canvas.addEventListener('touchend', handleTouchEnd);

    // Start on render
    startGame();
    container.focus();

    // Cleanup on back button
    createBackButton().addEventListener('click', () => {
      stopGame();
      window.removeEventListener('keydown', handleKeyDown);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchend', handleTouchEnd);
    });

    return container;
  }

  ////////////////////////////////
  // Memory Match Implementation //
  ////////////////////////////////

  function renderMemoryGame() {
    const container = document.createElement('section');
    container.className = 'game-container';
    container.setAttribute('aria-label', 'Memory Match game');
    container.tabIndex = -1;

    // Header
    const header = document.createElement('div');
    header.className = 'game-header';
    const title = document.createElement('h2');
    title.textContent = 'Memory Match';
    header.appendChild(title);
    
    // Add restart button
    const restartBtn = createRestartButton(() => {
      resetMemoryGame();
    });
    header.appendChild(restartBtn);
    
    header.appendChild(createBackButton());
    container.appendChild(header);

    const playArea = document.createElement('div');
    playArea.className = 'memory-play-area';
    container.appendChild(playArea);

    // Game stats
    const statsDisplay = document.createElement('div');
    statsDisplay.className = 'memory-stats';
    playArea.appendChild(statsDisplay);

    // Game area
    const gameArea = document.createElement('div');
    gameArea.className = 'memory-game-area';
    playArea.appendChild(gameArea);

    // Start button
    const startButton = document.createElement('button');
    startButton.className = 'memory-start-btn';
    startButton.textContent = 'Start Game';
    startButton.addEventListener('click', startMemoryGame);
    gameArea.appendChild(startButton);

    const grid = document.createElement('div');
    grid.className = 'memory-grid';
    gameArea.appendChild(grid);

    // Game state
    let hasFlippedCard = false;
    let firstCard = null;
    let lockBoard = false;
    let matchedPairs = 0;
    let moves = 0;
    let startTime = null;
    let gameTimer = null;
    let elapsedTime = 0;
    let isGameActive = false;
    let isPreviewMode = false;
    let gameStarted = false;

    const icons = [
      '🌟', '❤️', '⚡', '😊', '⭐', '🔔', '🐾', '🏠', '🎮', '🎨', '🎵', '🎪'
    ];
    // Each icon twice for pairs
    const cardIcons = icons.concat(icons);

    function updateStats() {
      const minutes = Math.floor(elapsedTime / 60);
      const seconds = elapsedTime % 60;
      const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      
      statsDisplay.innerHTML = `
        <div class="stat-item">
          <span class="stat-label">Pairs</span>
          <span class="stat-value">${matchedPairs}/${icons.length}</span>
        </div>
        <div class="stat-divider">|</div>
        <div class="stat-item">
          <span class="stat-label">Moves</span>
          <span class="stat-value">${moves}</span>
        </div>
        <div class="stat-divider">|</div>
        <div class="stat-item">
          <span class="stat-label">Time</span>
          <span class="stat-value">${timeString}</span>
        </div>
      `;
    }

    function startTimer() {
      if (!isGameActive) {
        isGameActive = true;
        startTime = Date.now();
        gameTimer = setInterval(() => {
          elapsedTime = Math.floor((Date.now() - startTime) / 1000);
          updateStats();
        }, 1000);
      }
    }

    function stopTimer() {
      if (gameTimer) {
        clearInterval(gameTimer);
        gameTimer = null;
      }
      isGameActive = false;
    }

    function startMemoryGame() {
      if (gameStarted) return;
      
      gameStarted = true;
      startButton.style.display = 'none';
      
      // Show all cards for 5 seconds
      isPreviewMode = true;
      const cards = grid.querySelectorAll('.memory-card');
      cards.forEach(card => {
        card.classList.add('flipped');
      });
      
      // After 5 seconds, hide all cards and start the game
      setTimeout(() => {
        isPreviewMode = false;
        cards.forEach(card => {
          card.classList.remove('flipped');
        });
        startTimer();
        showStatus('Game started! Find the matching pairs.');
      }, 5000);
    }

    function resetMemoryGame() {
      // Clear existing cards
      grid.innerHTML = '';
      
      // Reset game state
      hasFlippedCard = false;
      firstCard = null;
      lockBoard = false;
      matchedPairs = 0;
      moves = 0;
      elapsedTime = 0;
      isGameActive = false;
      isPreviewMode = false;
      gameStarted = false;
      
      // Stop timer
      stopTimer();
      
      // Show start button
      startButton.style.display = 'block';
      
      // Update stats
      updateStats();
      
      // Shuffle and create new cards
      const shuffled = cardIcons.sort(() => 0.5 - Math.random());
      createCards(shuffled);
      
      showStatus('Click Start Game to begin!');
    }

    function createCards(shuffledIcons) {
      shuffledIcons.forEach((iconName, index) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.tabIndex = 0;
        card.dataset.icon = iconName;
        card.dataset.index = index;
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `Memory card ${index + 1}`);

        const cardFront = document.createElement('div');
        cardFront.className = 'card-front';
        cardFront.innerHTML = '<div class="card-star">⭐</div>';

        const cardBack = document.createElement('div');
        cardBack.className = 'card-back';
        cardBack.textContent = iconName;

        card.appendChild(cardFront);
        card.appendChild(cardBack);

        card.addEventListener('click', flipCard);
        card.addEventListener('keydown', e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            card.click();
          }
        });

        grid.appendChild(card);
      });
    }

    function flipCard() {
      if (lockBoard || this.classList.contains('flipped') || this.classList.contains('matched') || isPreviewMode || !gameStarted) return;
      
      this.classList.add('flipped');
      this.classList.add('animate-flip');

      if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
      }

      // Second card flipped
      moves++;
      updateStats();
      
      if (this.dataset.icon === firstCard.dataset.icon) {
        // Match
        this.classList.add('matched');
        firstCard.classList.add('matched');
        matchedPairs++;
        
        // Add match animation
        this.classList.add('match-animation');
        firstCard.classList.add('match-animation');
        
        setTimeout(() => {
          this.classList.remove('match-animation');
          firstCard.classList.remove('match-animation');
        }, 1000);
        
        resetBoard();

        if (matchedPairs === icons.length) {
          setTimeout(() => {
            stopTimer();
            showGameComplete();
          }, 500);
        }
      } else {
        // Not match
        lockBoard = true;
        setTimeout(() => {
          this.classList.remove('flipped');
          firstCard.classList.remove('flipped');
          resetBoard();
        }, 1000);
      }
    }

    function resetBoard() {
      hasFlippedCard = false;
      lockBoard = false;
      firstCard = null;
    }

    function showGameComplete() {
      const minutes = Math.floor(elapsedTime / 60);
      const seconds = elapsedTime % 60;
      const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      
      const message = `🎉 Congratulations! You completed the game in ${timeString} with ${moves} moves!`;
      
      // Create completion overlay
      const overlay = document.createElement('div');
      overlay.className = 'memory-completion-overlay';
      overlay.innerHTML = `
        <div class="completion-content">
          <div class="completion-icon">🎉</div>
          <h3>Memory Master!</h3>
          <p>${message}</p>
          <div class="completion-stats">
            <div class="completion-stat">
              <span class="stat-label">Time</span>
              <span class="stat-value">${timeString}</span>
            </div>
            <div class="completion-stat">
              <span class="stat-label">Moves</span>
              <span class="stat-value">${moves}</span>
            </div>
          </div>
          <button class="play-again-btn" onclick="this.closest('.memory-completion-overlay').remove()">Play Again</button>
        </div>
      `;
      
      gameArea.appendChild(overlay);
    }

    // Status display
    const status = document.createElement('div');
    status.className = 'game-status';
    status.setAttribute('aria-live', 'polite');
    container.appendChild(status);

    function showStatus(text) {
      status.textContent = text;
    }

    // Initialize game
    resetMemoryGame();
    container.focus();
    return container;
  }

  ///////////////////////////////////
  // Rock Paper Scissors Component //
  ///////////////////////////////////

  function renderRPSGame() {
    const container = document.createElement('section');
    container.className = 'game-container';
    container.setAttribute('aria-label', 'Rock Paper Scissors game');
    container.tabIndex = -1;

    const header = document.createElement('div');
    header.className = 'game-header';
    const title = document.createElement('h2');
    title.textContent = 'Rock Paper Scissors';
    header.appendChild(title);
    
    // Add restart button
    const restartBtn = createRestartButton(() => {
      resetGame();
    });
    header.appendChild(restartBtn);
    
    header.appendChild(createBackButton());
    container.appendChild(header);

    const playArea = document.createElement('div');
    playArea.className = 'rps-play-area';
    container.appendChild(playArea);

    // Score display
    const scoreDisplay = document.createElement('div');
    scoreDisplay.className = 'rps-score';
    playArea.appendChild(scoreDisplay);

    // Game area
    const gameArea = document.createElement('div');
    gameArea.className = 'rps-game-area';
    playArea.appendChild(gameArea);

    // Player choice display
    const playerChoice = document.createElement('div');
    playerChoice.className = 'rps-choice player-choice';
    gameArea.appendChild(playerChoice);

    // VS display
    const vsDisplay = document.createElement('div');
    vsDisplay.className = 'rps-vs';
    vsDisplay.textContent = 'VS';
    gameArea.appendChild(vsDisplay);

    // Computer choice display
    const computerChoice = document.createElement('div');
    computerChoice.className = 'rps-choice computer-choice';
    gameArea.appendChild(computerChoice);

    // Result display
    const resultDisplay = document.createElement('div');
    resultDisplay.className = 'rps-result';
    playArea.appendChild(resultDisplay);

    // Choice buttons
    const buttonsDiv = document.createElement('div');
    buttonsDiv.className = 'rps-buttons';
    playArea.appendChild(buttonsDiv);

    const choices = [
      { name: 'Rock', icon: 'rock', emoji: '🪨', beats: 'Scissors' },
      { name: 'Paper', icon: 'description', emoji: '📄', beats: 'Rock' },
      { name: 'Scissors', icon: 'content_cut', emoji: '✂️', beats: 'Paper' },
    ];

    // Game state
    let playerScore = 0;
    let computerScore = 0;
    let rounds = 0;
    let isAnimating = false;

    function updateScore() {
      scoreDisplay.innerHTML = `
        <div class="score-item">
          <span class="score-label">You</span>
          <span class="score-value">${playerScore}</span>
        </div>
        <div class="score-divider">|</div>
        <div class="score-item">
          <span class="score-label">Computer</span>
          <span class="score-value">${computerScore}</span>
        </div>
        <div class="rounds">Round ${rounds}</div>
      `;
    }

    function resetGame() {
      playerScore = 0;
      computerScore = 0;
      rounds = 0;
      isAnimating = false;
      
      playerChoice.innerHTML = '<div class="choice-placeholder">?</div>';
      computerChoice.innerHTML = '<div class="choice-placeholder">?</div>';
      resultDisplay.textContent = 'Choose your weapon!';
      resultDisplay.className = 'rps-result';
      
      updateScore();
      
      // Re-enable buttons
      buttonsDiv.querySelectorAll('.rps-button').forEach(btn => {
        btn.disabled = false;
        btn.classList.remove('disabled');
      });
    }

    function getRandomChoice() {
      return choices[Math.floor(Math.random() * choices.length)];
    }

    function decideWinner(player, computer) {
      if (player === computer) return 'tie';
      if (choices.find(c => c.name === player)?.beats === computer) {
        return 'win';
      }
      return 'lose';
    }

    function animateChoice(choiceElement, choice, isPlayer) {
      choiceElement.innerHTML = `
        <div class="choice-content">
          <div class="choice-emoji">${choice.emoji}</div>
          <div class="choice-name">${choice.name}</div>
        </div>
      `;
      
      choiceElement.classList.add('animate-in');
      setTimeout(() => {
        choiceElement.classList.remove('animate-in');
      }, 500);
    }

    function showResult(result, playerChoice, computerChoice) {
      let message = '';
      let resultClass = '';
      
      switch(result) {
        case 'win':
          message = `You win! ${playerChoice} beats ${computerChoice}`;
          resultClass = 'win';
          playerScore++;
          break;
        case 'lose':
          message = `You lose! ${computerChoice} beats ${playerChoice}`;
          resultClass = 'lose';
          computerScore++;
          break;
        case 'tie':
          message = `It's a tie! Both chose ${playerChoice}`;
          resultClass = 'tie';
          break;
      }
      
      rounds++;
      resultDisplay.textContent = message;
      resultDisplay.className = `rps-result ${resultClass}`;
      updateScore();
    }

    function playRound(playerChoiceName) {
      if (isAnimating) return;
      
      isAnimating = true;
      const playerChoiceObj = choices.find(c => c.name === playerChoiceName);
      const computerChoiceObj = getRandomChoice();
      
      // Disable buttons during animation
      buttonsDiv.querySelectorAll('.rps-button').forEach(btn => {
        btn.disabled = true;
        btn.classList.add('disabled');
      });
      
      // Animate choices
      animateChoice(playerChoice, playerChoiceObj, true);
      
      // Delay computer choice for dramatic effect
      setTimeout(() => {
        animateChoice(computerChoice, computerChoiceObj, false);
        
        setTimeout(() => {
          const result = decideWinner(playerChoiceName, computerChoiceObj.name);
          showResult(result, playerChoiceName, computerChoiceObj.name);
          
          // Re-enable buttons after a short delay
          setTimeout(() => {
            isAnimating = false;
            buttonsDiv.querySelectorAll('.rps-button').forEach(btn => {
              btn.disabled = false;
              btn.classList.remove('disabled');
            });
          }, 1000);
        }, 600);
      }, 300);
    }

    // Create choice buttons
    choices.forEach(choice => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'rps-button';
      btn.title = choice.name;
      btn.setAttribute('aria-label', `Play ${choice.name}`);

      btn.innerHTML = `
        <div class="button-content">
          <div class="button-emoji">${choice.emoji}</div>
          <div class="button-name">${choice.name}</div>
        </div>
      `;

      btn.addEventListener('click', () => {
        if (!isAnimating) {
          playRound(choice.name);
        }
      });

      btn.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (!isAnimating) {
            playRound(choice.name);
          }
        }
      });

      buttonsDiv.appendChild(btn);
    });

    // Initialize
    updateScore();
    resultDisplay.textContent = 'Choose your weapon!';
    playerChoice.innerHTML = '<div class="choice-placeholder">?</div>';
    computerChoice.innerHTML = '<div class="choice-placeholder">?</div>';

    container.focus();
    return container;
  }

  //////////////////////////////
  // Minesweeper Implementation //
  //////////////////////////////

  function renderMinesweeper() {
    const container = document.createElement('section');
    container.className = 'game-container';
    container.setAttribute('aria-label', 'Minesweeper game');
    container.tabIndex = -1;

    const header = document.createElement('div');
    header.className = 'game-header';
    const title = document.createElement('h2');
    title.textContent = 'Minesweeper';
    header.appendChild(title);
    
    // Add restart button
    const restartBtn = createRestartButton(() => {
      resetMinesweeper();
    });
    header.appendChild(restartBtn);
    
    header.appendChild(createBackButton());
    container.appendChild(header);

    const playArea = document.createElement('div');
    playArea.className = 'game-play-area';
    container.appendChild(playArea);

    // Game stats
    const statsDisplay = document.createElement('div');
    statsDisplay.className = 'minesweeper-stats';
    playArea.appendChild(statsDisplay);

    // Game area
    const gameArea = document.createElement('div');
    gameArea.className = 'minesweeper-game-area';
    playArea.appendChild(gameArea);

    const gridSize = 9;
    const numMines = 10;

    const grid = document.createElement('div');
    grid.className = 'minesweeper-grid';
    gameArea.appendChild(grid);

    // Game state
    let cells = [];
    let mines = new Set();
    let openCount = 0;
    let gameOver = false;
    let gameWon = false;
    let gameStartTime = null;
    let gameTimer = null;
    let elapsedTime = 0;
    let flagCount = 0;
    let isGameActive = false;

    function updateStats() {
      const timeString = gameStartTime ? 
        `${Math.floor(elapsedTime / 60).toString().padStart(2, '0')}:${(elapsedTime % 60).toString().padStart(2, '0')}` : 
        '00:00';
      
      statsDisplay.innerHTML = `
        <div class="stat-item">
          <span class="stat-label">Mines</span>
          <span class="stat-value mines-left">${numMines - flagCount}</span>
        </div>
        <div class="stat-divider">|</div>
        <div class="stat-item">
          <span class="stat-label">Opened</span>
          <span class="stat-value opened">${openCount}</span>
        </div>
        <div class="stat-divider">|</div>
        <div class="stat-item">
          <span class="stat-label">Flags</span>
          <span class="stat-value flags">${flagCount}</span>
        </div>
        <div class="stat-divider">|</div>
        <div class="stat-item">
          <span class="stat-label">Time</span>
          <span class="stat-value time">${timeString}</span>
        </div>
      `;
    }

    function startTimer() {
      if (!isGameActive && gameStartTime) {
        isGameActive = true;
        gameTimer = setInterval(() => {
          elapsedTime = Math.floor((Date.now() - gameStartTime) / 1000);
          updateStats();
        }, 1000);
      }
    }

    function stopTimer() {
      if (gameTimer) {
        clearInterval(gameTimer);
        gameTimer = null;
      }
      isGameActive = false;
    }

    function resetMinesweeper() {
      // Clear existing cells
      grid.innerHTML = '';
      cells = [];
      
      // Reset game state
      mines.clear();
      openCount = 0;
      gameOver = false;
      gameWon = false;
      flagCount = 0;
      elapsedTime = 0;
      gameStartTime = null;
      
      // Stop timer
      stopTimer();
      
      // Update stats
      updateStats();
      
      // Create new cells and place mines
      createCells();
      placeMines();
    }

    function createCells() {
      for(let y=0; y<gridSize; y++) {
        for(let x=0; x<gridSize; x++) {
          const cell = document.createElement('button');
          cell.className = 'ms-cell';
          cell.type = 'button';
          cell.style.userSelect = 'none';
          cell.tabIndex = 0;
          cell.setAttribute('aria-label', `Cell ${x+1}, ${y+1}`);
          cell.addEventListener('click', e => handleClickCell(e,x,y));
          cell.addEventListener('contextmenu', e => toggleFlag(e,x,y));
          cell.addEventListener('keydown', e => {
            if(e.key === 'Enter') handleClickCell(e,x,y);
            if(e.key === ' '){
              toggleFlag(e,x,y);
            }
          });

          cells.push(cell);
          grid.appendChild(cell);
        }
      }
    }

    // Helpers
    function index(x, y) {
      return y * gridSize + x;
    }

    function neighbors(x, y) {
      const coords = [];
      for(let dx=-1; dx <=1; dx++) {
        for(let dy=-1; dy<=1; dy++) {
          if(dx === 0 && dy === 0) continue;
          const nx = x + dx;
          const ny = y + dy;
          if(nx>=0 && ny>=0 && nx<gridSize && ny<gridSize) {
            coords.push({x: nx, y: ny});
          }
        }
      }
      return coords;
    }

    // Generate mines
    function placeMines() {
      mines.clear();
      while(mines.size < numMines) {
        const x = Math.floor(Math.random()*gridSize);
        const y = Math.floor(Math.random()*gridSize);
        mines.add(index(x,y));
      }
    }

    // Count adjacent mines
    function countMines(x,y) {
      return neighbors(x,y).filter(({x:nx, y:ny}) => mines.has(index(nx, ny))).length;
    }

    // Reveal cells recursively
    function revealCell(x,y) {
      const i = index(x,y);
      const cell = cells[i];
      if(cell.classList.contains('open') || cell.classList.contains('flagged')) return;
      
      // Start timer on first click
      if (!gameStartTime) {
        gameStartTime = Date.now();
        startTimer();
      }
      
      cell.classList.add('open');
      openCount++;
      
      if(mines.has(i)) {
        cell.classList.add('mine');
        gameOverState(false);
        return;
      }
      
      const mineCount = countMines(x,y);
      if(mineCount > 0) {
        cell.textContent = mineCount;
        cell.classList.add(`mine-count-${mineCount}`);
      } else {
        // reveal neighbors
        neighbors(x,y).forEach(({x:nx,y:ny}) => revealCell(nx, ny));
      }
      
      if(openCount === gridSize*gridSize - numMines) {
        gameOverState(true);
      }
      
      updateStats();
    }

    // Game over handling
    function gameOverState(won) {
      gameOver = true;
      gameWon = won;
      stopTimer();
      
      if(won) {
        // Flag all mines correctly
        cells.forEach((cell, i) => {
          if(mines.has(i) && !cell.classList.contains('flagged')) {
            cell.classList.add('flagged', 'correct-flag');
          }
        });
        showStatus('Congratulations! You cleared all mines!');
      } else {
        // reveal all mines
        cells.forEach((c,i) => {
          if(mines.has(i)) {
            c.classList.add('mine');
            if (c.classList.contains('flagged')) {
              c.classList.add('wrong-flag');
            }
          }
        });
        showStatus('Game Over! You hit a mine.');
      }
      
      // disable further interaction
      cells.forEach(c => c.style.cursor = 'default');
    }

    // Toggle flag on right click or long press (for accessibility)
    function toggleFlag(e, x,y) {
      e.preventDefault();
      if(gameOver) return;
      const cell = e.currentTarget;
      if(cell.classList.contains('open')) return;
      
      if(cell.classList.contains('flagged')) {
        cell.classList.remove('flagged');
        flagCount--;
      } else {
        cell.classList.add('flagged');
        flagCount++;
      }
      
      updateStats();
    }

    // Handle left click
    function handleClickCell(e, x,y) {
      if(gameOver) return;
      const cell = e.currentTarget;
      if(cell.classList.contains('flagged')) return;
      revealCell(x,y);
    }

    function showStatus(text) {
      status.textContent = text;
    }

    // Status display
    const status = document.createElement('div');
    status.className = 'game-status';
    status.setAttribute('aria-live', 'polite');
    container.appendChild(status);

    // Initialize game
    createCells();
    placeMines();
    updateStats();
    showStatus('Left click to reveal, right click to flag');

    container.focus();
    return container;
  }

  /////////////////////////////////
  // Whack-a-Mole Implementation //
  /////////////////////////////////

  function renderWhackAMole() {
    const container = document.createElement('section');
    container.className = 'game-container';
    container.setAttribute('aria-label', 'Whack-a-Mole game');
    container.tabIndex = -1;

    const header = document.createElement('div');
    header.className = 'game-header';
    const title = document.createElement('h2');
    title.textContent = 'Whack-a-Mole';
    header.appendChild(title);
    // Add restart button
    const restartBtn = createRestartButton(() => {
      stopGame();
      showStartButton();
    });
    header.appendChild(restartBtn);
    header.appendChild(createBackButton());
    container.appendChild(header);

    const whackArea = document.createElement('div');
    whackArea.className = 'whack-area';
    container.appendChild(whackArea);

    let holes = [];
    let score = 0;
    let intervalId;
    let gameOver = false;
    const moleTime = 1000;
    let startBtn = null;

    // Create holes
    for(let i=0; i<9; i++) {
      const hole = document.createElement('div');
      hole.className = 'mole-hole';
      hole.tabIndex = 0;
      hole.setAttribute('role', 'button');
      hole.setAttribute('aria-label', 'Mole hole');
      hole.style.position = 'relative';

      const mole = document.createElement('div');
      mole.className = 'mole';
      hole.appendChild(mole);

      hole.addEventListener('click', () => {
        if (gameOver) return;
        if(mole.classList.contains('visible')) {
          // Hit the mole
          score++;
          mole.classList.remove('visible');
          mole.classList.add('hit');
          setTimeout(() => mole.classList.remove('hit'), 200);
          showStatus(`Score: ${score}`);
        } else {
          // Missed - game over
          gameOver = true;
          stopGame();
          showStatus(`Game Over! You missed! Final score: ${score}`);
          hole.classList.add('miss');
          setTimeout(() => hole.classList.remove('miss'), 500);
        }
      });
      hole.addEventListener('keydown', e => {
        if(e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          hole.click();
        }
      });
      holes.push({hole, mole});
      whackArea.appendChild(hole);
    }

    // Status display
    const status = document.createElement('div');
    status.className = 'game-status';
    container.appendChild(status);

    function showStatus(text) {
      status.textContent = text;
    }

    function showRandomMole() {
      if (gameOver) return;
      holes.forEach(({mole}) => mole.classList.remove('visible'));
      const index = Math.floor(Math.random() * holes.length);
      holes[index].mole.classList.add('visible');
    }

    function startGame() {
      score = 0;
      gameOver = false;
      showStatus('Score: 0 - Click only on moles!');
      holes.forEach(({hole, mole}) => {
        hole.classList.remove('miss');
        mole.classList.remove('hit', 'visible');
      });
      intervalId = setInterval(showRandomMole, moleTime);
      if (startBtn) startBtn.style.display = 'none';
    }

    function stopGame() {
      clearInterval(intervalId);
      holes.forEach(({mole}) => mole.classList.remove('visible'));
    }

    function showStartButton() {
      if (!startBtn) {
        startBtn = document.createElement('button');
        startBtn.className = 'restart-btn';
        startBtn.textContent = 'Start Game';
        startBtn.addEventListener('click', startGame);
        whackArea.appendChild(startBtn);
      }
      startBtn.style.display = 'block';
      showStatus('Click Start Game to begin!');
    }

    showStartButton();

    // Cleanup on back
    createBackButton().addEventListener('click', () => {
      stopGame();
    });

    container.focus();
    return container;
  }

  /////////////////////////////////
  // Simon Says Implementation //
  /////////////////////////////////

  function renderSimonSays() {
    const container = document.createElement('section');
    container.className = 'game-container';
    container.setAttribute('aria-label', 'Simon Says game');
    container.tabIndex = -1;

    const header = document.createElement('div');
    header.className = 'game-header';
    const title = document.createElement('h2');
    title.textContent = 'Simon Says';
    
    // Add restart button
    const restartBtn = createRestartButton(() => {
      resetGame();
    });
    header.appendChild(restartBtn);
    
    header.appendChild(createBackButton());
    container.appendChild(header);

    const playArea = document.createElement('div');
    playArea.className = 'simon-play-area';
    container.appendChild(playArea);

    // Game stats
    const statsDisplay = document.createElement('div');
    statsDisplay.className = 'simon-stats';
    playArea.appendChild(statsDisplay);

    // Game area
    const gameArea = document.createElement('div');
    gameArea.className = 'simon-game-area';
    playArea.appendChild(gameArea);

    const simon = document.createElement('div');
    simon.className = 'simon-game';
    gameArea.appendChild(simon);

    const center = document.createElement('div');
    center.className = 'simon-center';
    center.textContent = 'Simon';
    simon.appendChild(center);

    const buttons = [];
    const colors = [
      {name:'green', className:'simon-top-left', sound: 261.6, color: '#00ff88'}, // C4
      {name:'yellow', className:'simon-top-right', sound: 329.6, color: '#ffaa00'}, // E4
      {name:'red', className:'simon-bottom-left', sound: 392.0, color: '#ff4444'}, // G4
      {name:'blue', className:'simon-bottom-right', sound: 523.3, color: '#0080ff'}, // C5
    ];

    colors.forEach(({name, className}, i) => {
      const btn = document.createElement('button');
      btn.className = 'simon-button ' + className;
      btn.tabIndex = 0;
      btn.setAttribute('aria-label', `${name} color button`);
      simon.appendChild(btn);
      buttons.push(btn);
    });

    // Web Audio for sound
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioCtx = new AudioContext();

    function playTone(freq, duration = 400) {
      if(audioCtx.state === 'suspended') audioCtx.resume();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type = 'sine';
      oscillator.frequency.value = freq;
      oscillator.start();
      gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration / 1000);
      oscillator.stop(audioCtx.currentTime + duration / 1000);
    }

    // Game Logic
    let sequence = [];
    let userSequence = [];
    let waitingForUser = false;
    let level = 0;
    let strictMode = false;
    let gameStartTime = Date.now();
    let gameTime = 0;
    let bestLevel = localStorage.getItem('simonBestLevel') || 0;
    let gamesPlayed = 0;
    let totalScore = 0;

    function updateStats() {
      const minutes = Math.floor(gameTime / 60);
      const seconds = gameTime % 60;
      const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      
      statsDisplay.innerHTML = `
        <div class="stat-item">
          <span class="stat-label">Level</span>
          <span class="stat-value level">${level}</span>
        </div>
        <div class="stat-divider">|</div>
        <div class="stat-item">
          <span class="stat-label">Best</span>
          <span class="stat-value best">${bestLevel}</span>
        </div>
        <div class="stat-divider">|</div>
        <div class="stat-item">
          <span class="stat-label">Games</span>
          <span class="stat-value games">${gamesPlayed}</span>
        </div>
        <div class="stat-divider">|</div>
        <div class="stat-item">
          <span class="stat-label">Time</span>
          <span class="stat-value time">${timeString}</span>
        </div>
      `;
    }

    // Show message
    const msg = document.createElement('div');
    msg.className = 'game-status';
    container.appendChild(msg);

    function animateButton(idx) {
      buttons[idx].classList.add('active');
      playTone(colors[idx].sound);
      setTimeout(() => {
        buttons[idx].classList.remove('active');
      }, 400);
    }

    function playSequence() {
      waitingForUser = false;
      userSequence = [];
      let i = 0;
      msg.textContent = `Level ${level} - Watch the sequence`;
      const interval = setInterval(() => {
        animateButton(sequence[i]);
        i++;
        if(i >= sequence.length) {
          clearInterval(interval);
          waitingForUser = true;
          msg.textContent = `Your turn - Repeat the sequence`;
        }
      }, 800);
    }

    function nextLevel() {
      level++;
      const next = Math.floor(Math.random() * 4);
      sequence.push(next);
      
      // Update best level
      if (level > bestLevel) {
        bestLevel = level;
        localStorage.setItem('simonBestLevel', bestLevel);
      }
      
      updateStats();
      playSequence();
    }

    function resetGame() {
      sequence = [];
      userSequence = [];
      level = 0;
      waitingForUser = false;
      gameStartTime = Date.now();
      gameTime = 0;
      gamesPlayed++;
      totalScore += level;
      updateStats();
      msg.textContent = 'Press any color to start';
    }

    function handleUserInput(idx) {
      if(!waitingForUser) return;
      animateButton(idx);
      userSequence.push(idx);

      for(let i = 0; i < userSequence.length; i++) {
        if(userSequence[i] !== sequence[i]) {
          msg.textContent = `Game Over! You reached level ${level}. Final score: ${level}`;
          waitingForUser = false;
          
          // Update best level if current level is higher
          if (level > bestLevel) {
            bestLevel = level;
            localStorage.setItem('simonBestLevel', bestLevel);
          }
          
          // End the game and reset after a delay
          setTimeout(() => {
            resetGame();
          }, 2000);
          return;
        }
      }

      if(userSequence.length === sequence.length) {
        msg.textContent = 'Correct! Next level...';
        waitingForUser = false;
        setTimeout(nextLevel, 1000);
      }
    }

    // Update game time
    function updateGameTime() {
      gameTime = Math.floor((Date.now() - gameStartTime) / 1000);
      updateStats();
    }

    // Event listeners
    buttons.forEach((btn, i) => {
      btn.addEventListener('click', () => {
        if(level === 0) nextLevel();
        handleUserInput(i);
      });
      btn.addEventListener('keydown', e => {
        if(e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          btn.click();
        }
      });
    });

    // Start timer
    setInterval(updateGameTime, 1000);

    resetGame();
    container.focus();
    return container;
  }

  /////////////////////////////////
  // Tetris Implementation //
  /////////////////////////////////

  function renderTetris() {
    const container = document.createElement('section');
    container.className = 'game-container';
    container.setAttribute('aria-label', 'Tetris game');
    container.tabIndex = -1;

    const header = document.createElement('div');
    header.className = 'game-header';
    const title = document.createElement('h2');
    title.textContent = 'Tetris';
    header.appendChild(title);
    
    // Add restart button
    const restartBtn = createRestartButton(() => {
      resetTetris();
    });
    header.appendChild(restartBtn);
    
    header.appendChild(createBackButton());
    container.appendChild(header);

    const playArea = document.createElement('div');
    playArea.className = 'game-play-area';
    container.appendChild(playArea);

    // Game stats
    const statsDisplay = document.createElement('div');
    statsDisplay.className = 'tetris-stats';
    playArea.appendChild(statsDisplay);

    // Game area
    const gameArea = document.createElement('div');
    gameArea.className = 'tetris-game-area';
    playArea.appendChild(gameArea);

    // Canvas setup
    const canvas = document.createElement('canvas');
    const blockSize = 25;
    const cols = 10;
    const rows = 20;
    canvas.width = cols * blockSize;
    canvas.height = rows * blockSize;
    canvas.className = 'snake-canvas';
    gameArea.appendChild(canvas);

    const ctx = canvas.getContext('2d');

    // Game state
    let board = Array(rows).fill().map(() => Array(cols).fill(0));
    let currentPiece = null;
    let nextPiece = null;
    let heldPiece = null;
    let canHold = true;
    let score = 0;
    let level = 1;
    let lines = 0;
    let gameOver = false;
    let dropTime = 0;
    let dropInterval = 1000;
    let gameStartTime = Date.now();
    let isPaused = false;
    let particles = [];
    let combo = 0;
    let maxCombo = 0;
    let tetrisCount = 0;
    let totalPieces = 0;

    function updateStats() {
      const gameTime = Math.floor((Date.now() - gameStartTime) / 1000);
      const minutes = Math.floor(gameTime / 60);
      const seconds = gameTime % 60;
      const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      
      statsDisplay.innerHTML = `
        <div class="stat-item">
          <span class="stat-label">Score</span>
          <span class="stat-value score">${score.toLocaleString()}</span>
        </div>
        <div class="stat-divider">|</div>
        <div class="stat-item">
          <span class="stat-label">Level</span>
          <span class="stat-value level">${level}</span>
        </div>
        <div class="stat-divider">|</div>
        <div class="stat-item">
          <span class="stat-label">Lines</span>
          <span class="stat-value lines">${lines}</span>
        </div>
        <div class="stat-divider">|</div>
        <div class="stat-item">
          <span class="stat-label">Combo</span>
          <span class="stat-value combo">${combo}</span>
        </div>
        <div class="stat-divider">|</div>
        <div class="stat-item">
          <span class="stat-label">Time</span>
          <span class="stat-value time">${timeString}</span>
        </div>
      `;
    }

    function resetTetris() {
      board = Array(rows).fill().map(() => Array(cols).fill(0));
      score = 0;
      level = 1;
      lines = 0;
      gameOver = false;
      dropInterval = 1000;
      gameStartTime = Date.now();
      gameTime = 0;
      isPaused = false;
      particles = [];
      combo = 0;
      maxCombo = 0;
      tetrisCount = 0;
      totalPieces = 0;
      heldPiece = null;
      canHold = true;
      currentPiece = createPiece();
      nextPiece = createPiece();
      dropTime = performance.now();
      showStatus('Use arrow keys to move, up/space to rotate, C to hold, P to pause');
      updateStats();
    }

    // Tetromino shapes
    const pieces = [
      [[1,1,1,1]], // I
      [[1,1],[1,1]], // O
      [[1,1,1],[0,1,0]], // T
      [[1,1,1],[1,0,0]], // L
      [[1,1,1],[0,0,1]], // J
      [[1,1,0],[0,1,1]], // S
      [[0,1,1],[1,1,0]]  // Z
    ];

    const colors = ['#00f5ff', '#ffff00', '#a000f0', '#ffa500', '#0000ff', '#00ff00', '#ff0000'];
    const pieceNames = ['I', 'O', 'T', 'L', 'J', 'S', 'Z'];

    function createPiece() {
      const pieceIndex = Math.floor(Math.random() * pieces.length);
      return {
        shape: pieces[pieceIndex],
        color: colors[pieceIndex],
        name: pieceNames[pieceIndex],
        x: Math.floor(cols / 2) - Math.floor(pieces[pieceIndex][0].length / 2),
        y: 0
      };
    }

    function createParticle(x, y, color) {
      return {
        x: x * blockSize + blockSize/2,
        y: y * blockSize + blockSize/2,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8,
        life: 1,
        decay: 0.02,
        color: color,
        size: Math.random() * 4 + 2
      };
    }

    function drawBlock(x, y, color, alpha = 1, glow = false) {
      ctx.save();
      ctx.globalAlpha = alpha;
      
      if (glow) {
        ctx.shadowColor = color;
        ctx.shadowBlur = 15;
      }
      
      ctx.fillStyle = color;
      ctx.fillRect(x * blockSize, y * blockSize, blockSize - 1, blockSize - 1);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.strokeRect(x * blockSize, y * blockSize, blockSize - 1, blockSize - 1);
      
      // Add highlight
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.fillRect(x * blockSize + 1, y * blockSize + 1, blockSize - 3, 3);
      
      ctx.restore();
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw background grid
      ctx.strokeStyle = 'rgba(0, 255, 136, 0.1)';
      ctx.lineWidth = 0.5;
      for (let i = 0; i <= cols; i++) {
        ctx.beginPath();
        ctx.moveTo(i * blockSize, 0);
        ctx.lineTo(i * blockSize, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i <= rows; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * blockSize);
        ctx.lineTo(canvas.width, i * blockSize);
        ctx.stroke();
      }

      // Draw board with glow effect
      for(let y = 0; y < rows; y++) {
        for(let x = 0; x < cols; x++) {
          if(board[y][x]) {
            drawBlock(x, y, board[y][x]);
          }
        }
      }

      // Draw particles
      particles.forEach(particle => {
        ctx.save();
        ctx.globalAlpha = particle.life;
        ctx.fillStyle = particle.color;
        ctx.fillRect(particle.x - particle.size/2, particle.y - particle.size/2, particle.size, particle.size);
        ctx.restore();
      });

      // Draw current piece with shadow
      if(currentPiece) {
        // Draw ghost piece
        let ghostY = currentPiece.y;
        while(isValid(currentPiece, 0, ghostY - currentPiece.y + 1)) {
          ghostY++;
        }
        currentPiece.shape.forEach((row, y) => {
          row.forEach((value, x) => {
            if(value) {
              drawBlock(currentPiece.x + x, ghostY + y, currentPiece.color, 0.3);
            }
          });
        });

        // Draw current piece
        currentPiece.shape.forEach((row, y) => {
          row.forEach((value, x) => {
            if(value) {
              drawBlock(currentPiece.x + x, currentPiece.y + y, currentPiece.color, 1, true);
            }
          });
        });
      }
    }

    function isValid(piece, dx = 0, dy = 0) {
      return piece.shape.every((row, y) => {
        return row.every((value, x) => {
          const newX = piece.x + x + dx;
          const newY = piece.y + y + dy;
          return !value || (newX >= 0 && newX < cols && newY < rows && 
                 (newY < 0 || !board[newY][newX]));
        });
      });
    }

    function placePiece() {
      currentPiece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
          if(value) {
            board[currentPiece.y + y][currentPiece.x + x] = currentPiece.color;
          }
        });
      });

      // Check for complete lines
      let linesCleared = 0;
      let linesToClear = [];
      
      for(let y = rows - 1; y >= 0; y--) {
        if(board[y].every(cell => cell !== 0)) {
          linesToClear.push(y);
          linesCleared++;
        }
      }

      if(linesCleared > 0) {
        // Create particles for cleared lines
        linesToClear.forEach(lineY => {
          for(let x = 0; x < cols; x++) {
            for(let i = 0; i < 3; i++) {
              particles.push(createParticle(x, lineY, board[lineY][x]));
            }
          }
        });

        // Remove lines
        linesToClear.forEach(lineY => {
          board.splice(lineY, 1);
          board.unshift(Array(cols).fill(0));
        });

        lines += linesCleared;
        
        // Calculate score with combo system
        let lineScore = 0;
        switch(linesCleared) {
          case 1: lineScore = 100; break;
          case 2: lineScore = 300; break;
          case 3: lineScore = 500; break;
          case 4: 
            lineScore = 800; 
            tetrisCount++;
            break;
        }
        
        combo++;
        if (combo > maxCombo) maxCombo = combo;
        
        score += lineScore * level * (1 + combo * 0.1);
        level = Math.floor(lines / 10) + 1;
        dropInterval = Math.max(50, 1000 - (level - 1) * 100);
        
        showStatus(`Score: ${score.toLocaleString()} | Level: ${level} | Lines: ${lines} | Combo: ${combo}`);
        updateStats();
      } else {
        combo = 0;
      }

      currentPiece = nextPiece;
      nextPiece = createPiece();
      totalPieces++;
      canHold = true;
      
      if(!isValid(currentPiece)) {
        gameOver = true;
        showStatus(`Game Over! Final Score: ${score.toLocaleString()}`);
      }
    }

    function rotatePiece() {
      const rotated = currentPiece.shape[0].map((_, i) => 
        currentPiece.shape.map(row => row[i]).reverse()
      );
      const originalShape = currentPiece.shape;
      currentPiece.shape = rotated;
      if(!isValid(currentPiece)) {
        currentPiece.shape = originalShape;
      }
    }

    function holdPiece() {
      if (!canHold) return;
      
      if (heldPiece) {
        const temp = heldPiece;
        heldPiece = currentPiece;
        currentPiece = temp;
        currentPiece.x = Math.floor(cols / 2) - Math.floor(currentPiece.shape[0].length / 2);
        currentPiece.y = 0;
      } else {
        heldPiece = currentPiece;
        currentPiece = nextPiece;
        nextPiece = createPiece();
      }
      
      canHold = false;
    }

    function gameLoop(timestamp) {
      if(gameOver || isPaused) {
        if (!gameOver) {
          // Continue the loop even when paused to maintain responsiveness
          requestAnimationFrame(gameLoop);
        }
        return;
      }

      // Update game time
      gameTime = Math.floor((Date.now() - gameStartTime) / 1000);

      // Update particles
      particles = particles.filter(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life -= particle.decay;
        return particle.life > 0;
      });

      if(timestamp - dropTime > dropInterval) {
        if(isValid(currentPiece, 0, 1)) {
          currentPiece.y++;
        } else {
          placePiece();
        }
        dropTime = timestamp;
      }

      draw();
      updateStats();
      requestAnimationFrame(gameLoop);
    }

    function showStatus(text) {
      status.textContent = text;
    }

    // Controls
    function handleKeyDown(e) {
      if(gameOver) return;
      
      // Prevent page scrolling for arrow keys
      if(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }
      
      switch(e.key) {
        case 'ArrowLeft':
          if(!isPaused && isValid(currentPiece, -1, 0)) currentPiece.x--;
          break;
        case 'ArrowRight':
          if(!isPaused && isValid(currentPiece, 1, 0)) currentPiece.x++;
          break;
        case 'ArrowDown':
          if(!isPaused && isValid(currentPiece, 0, 1)) currentPiece.y++;
          break;
        case 'ArrowUp':
        case ' ':
          if(!isPaused) rotatePiece();
          break;
        case 'p':
        case 'P':
          isPaused = !isPaused;
          if (isPaused) {
            showStatus('Game Paused - Press P to resume');
          } else {
            showStatus('Game resumed');
            dropTime = performance.now(); // Reset drop timer when resuming
          }
          break;
        case 'c':
        case 'C':
          if(!isPaused) holdPiece();
          break;
      }
    }

    // Status display
    const status = document.createElement('div');
    status.className = 'game-status';
    status.setAttribute('aria-live', 'polite');
    container.appendChild(status);

    // Start game
    currentPiece = createPiece();
    nextPiece = createPiece();
    gameStartTime = Date.now();
    gameTime = 0;
    dropTime = performance.now();
    showStatus('Use arrow keys to move, up/space to rotate, C to hold, P to pause');
    updateStats();
    window.addEventListener('keydown', handleKeyDown);
    requestAnimationFrame(gameLoop);

    // Cleanup
    createBackButton().addEventListener('click', () => {
      gameOver = true;
      window.removeEventListener('keydown', handleKeyDown);
    });

    container.focus();
    return container;
  }

  /////////////////////////////////
  // Pong Implementation //
  /////////////////////////////////

  function renderPong() {
    const container = document.createElement('section');
    container.className = 'game-container';
    container.setAttribute('aria-label', 'Pong game');
    container.tabIndex = -1;

    const header = document.createElement('div');
    header.className = 'game-header';
    const title = document.createElement('h2');
    title.textContent = 'Pong';
    header.appendChild(title);
    
    // Add restart button
    const restartBtn = createRestartButton(() => {
      resetPong();
    });
    header.appendChild(restartBtn);
    
    header.appendChild(createBackButton());
    container.appendChild(header);

    const playArea = document.createElement('div');
    playArea.className = 'game-play-area';
    container.appendChild(playArea);

    // Game stats
    const statsDisplay = document.createElement('div');
    statsDisplay.className = 'pong-stats';
    playArea.appendChild(statsDisplay);

    // Canvas setup
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 300;
    canvas.className = 'snake-canvas';
    playArea.appendChild(canvas);

    const ctx = canvas.getContext('2d');

    // Game state
    let playerY = canvas.height / 2 - 30;
    let aiY = canvas.height / 2 - 30;
    let playerTargetY = canvas.height / 2 - 30; // Target position for smooth movement
    let ballX = canvas.width / 2;
    let ballY = canvas.height / 2;
    let ballSpeedX = 1.8;
    let ballSpeedY = 1.2;
    let playerScore = 0;
    let aiScore = 0;
    let gameRunning = true;
    let rallyCount = 0;
    let maxRally = 0;
    let gameTime = 0;
    let startTime = Date.now();
    let particles = [];
    let powerUp = null;
    let powerUpTimer = 0;
    let powerUpActive = false;
    let powerUpType = '';
    let ballTrail = [];
    let paddleGlow = false;
    let glowTimer = 0;

    const paddleHeight = 60;
    const paddleWidth = 10;
    const ballSize = 8;
    const playerSpeed = 3; // Speed for smooth movement

    function updateStats() {
      const minutes = Math.floor(gameTime / 60);
      const seconds = gameTime % 60;
      const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      
      statsDisplay.innerHTML = `
        <div class="stat-item">
          <span class="stat-label">Player</span>
          <span class="stat-value player-score">${playerScore}</span>
        </div>
        <div class="stat-divider">|</div>
        <div class="stat-item">
          <span class="stat-label">AI</span>
          <span class="stat-value ai-score">${aiScore}</span>
        </div>
        <div class="stat-divider">|</div>
        <div class="stat-item">
          <span class="stat-label">Rally</span>
          <span class="stat-value rally">${rallyCount}</span>
        </div>
        <div class="stat-divider">|</div>
        <div class="stat-item">
          <span class="stat-label">Time</span>
          <span class="stat-value time">${timeString}</span>
        </div>
      `;
    }

    function resetPong() {
      playerY = canvas.height / 2 - 30;
      aiY = canvas.height / 2 - 30;
      ballX = canvas.width / 2;
      ballY = canvas.height / 2;
      ballSpeedX = 1.8;
      ballSpeedY = 1.2;
      playerScore = 0;
      aiScore = 0;
      rallyCount = 0;
      maxRally = 0;
      gameTime = 0;
      startTime = Date.now();
      gameRunning = true;
      particles = [];
      powerUp = null;
      powerUpTimer = 0;
      powerUpActive = false;
      powerUpType = '';
      ballTrail = [];
      paddleGlow = false;
      glowTimer = 0;
      showStatus('Use up/down arrows or drag to move your paddle');
    }

    function createParticle(x, y, color) {
      return {
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        life: 1,
        decay: 0.02,
        color: color,
        size: Math.random() * 3 + 1
      };
    }

    function spawnPowerUp() {
      if (Math.random() < 0.005 && !powerUp) { // 0.5% chance per frame
        powerUp = {
          x: Math.random() * (canvas.width - 20) + 10,
          y: Math.random() * (canvas.height - 20) + 10,
          type: Math.random() < 0.5 ? 'speed' : 'size',
          size: 8
        };
      }
    }

    function draw() {
      // Clear canvas with fade effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw background grid
      ctx.strokeStyle = 'rgba(0, 255, 136, 0.1)';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += 20) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      // Draw center line with animation
      ctx.strokeStyle = 'rgba(0, 255, 136, 0.4)';
      ctx.setLineDash([5, 15]);
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, 0);
      ctx.lineTo(canvas.width / 2, canvas.height);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw ball trail
      ballTrail.forEach((pos, idx) => {
        const alpha = 0.3 * (1 - idx / ballTrail.length);
        ctx.fillStyle = `rgba(251, 191, 36, ${alpha})`;
        ctx.fillRect(pos.x - ballSize/2, pos.y - ballSize/2, ballSize, ballSize);
      });

      // Draw particles
      particles.forEach(particle => {
        ctx.save();
        ctx.globalAlpha = particle.life;
        ctx.fillStyle = particle.color;
        ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
        ctx.restore();
      });

      // Draw power-up
      if (powerUp) {
        const pulse = Math.sin(Date.now() * 0.01) * 0.3 + 0.7;
        ctx.save();
        ctx.globalAlpha = pulse;
        ctx.fillStyle = powerUp.type === 'speed' ? '#ffaa00' : '#ff0080';
        ctx.fillRect(powerUp.x - powerUp.size/2, powerUp.y - powerUp.size/2, powerUp.size, powerUp.size);
        
        // Draw power-up icon
        ctx.fillStyle = 'white';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(powerUp.type === 'speed' ? '⚡' : '🔴', 
                    powerUp.x, 
                    powerUp.y + 4);
        ctx.restore();
      }

      // Draw paddles with glow effect
      const playerGlow = paddleGlow && glowTimer > 0 ? 15 : 5;
      const aiGlow = paddleGlow && glowTimer > 0 ? 15 : 5;
      
      ctx.shadowColor = '#00ff88';
      ctx.shadowBlur = playerGlow;
      ctx.fillStyle = '#00ff88';
      ctx.fillRect(10, playerY, paddleWidth, paddleHeight);
      
      ctx.shadowColor = '#ff0080';
      ctx.shadowBlur = aiGlow;
      ctx.fillStyle = '#ff0080';
      ctx.fillRect(canvas.width - 20, aiY, paddleWidth, paddleHeight);
      ctx.shadowBlur = 0;

      // Draw ball with glow
      ctx.shadowColor = '#fbbf24';
      ctx.shadowBlur = 10;
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(ballX - ballSize/2, ballY - ballSize/2, ballSize, ballSize);
      ctx.shadowBlur = 0;

      // Draw scores with glow
      ctx.fillStyle = '#00ff88'; // Changed to neon green for better visibility
      ctx.font = 'bold 24px Inter';
      ctx.textAlign = 'center';
      ctx.fillText(playerScore, canvas.width / 4, 50);
      ctx.fillText(aiScore, 3 * canvas.width / 4, 50);
    }

    function update() {
      if(!gameRunning) return;

      // Update game time
      gameTime = Math.floor((Date.now() - startTime) / 1000);

      // Smooth player movement
      if (playerY < playerTargetY) {
        playerY = Math.min(playerTargetY, playerY + playerSpeed);
      } else if (playerY > playerTargetY) {
        playerY = Math.max(playerTargetY, playerY - playerSpeed);
      }

      // Update particles
      particles = particles.filter(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life -= particle.decay;
        return particle.life > 0;
      });

      // Update ball trail
      ballTrail.push({x: ballX, y: ballY});
      if (ballTrail.length > 5) {
        ballTrail.shift();
      }

      // Update power-up timer
      if (powerUpActive && powerUpTimer > 0) {
        powerUpTimer--;
        if (powerUpTimer === 0) {
          powerUpActive = false;
          powerUpType = '';
          showStatus('Power-up expired!');
        }
      }

      // Update glow timer
      if (paddleGlow && glowTimer > 0) {
        glowTimer--;
        if (glowTimer === 0) {
          paddleGlow = false;
        }
      }

      // Move ball
      ballX += ballSpeedX;
      ballY += ballSpeedY;

      // Ball collision with top and bottom
      if(ballY <= 0 || ballY >= canvas.height) {
        ballSpeedY = -ballSpeedY;
        // Create particles on wall hit
        for (let i = 0; i < 5; i++) {
          particles.push(createParticle(ballX, ballY, '#fbbf24'));
        }
      }

      // Ball collision with paddles
      if(ballX <= 20 && ballY >= playerY && ballY <= playerY + paddleHeight) {
        ballSpeedX = -ballSpeedX;
        ballSpeedX *= 1.05; // Gradual speed increase
        rallyCount++;
        if (rallyCount > maxRally) maxRally = rallyCount;
        
        // Create particles on paddle hit
        for (let i = 0; i < 8; i++) {
          particles.push(createParticle(ballX, ballY, '#00ff88'));
        }
        
        // Activate paddle glow
        paddleGlow = true;
        glowTimer = 20;
        
        updateStats();
      }
      if(ballX >= canvas.width - 20 && ballY >= aiY && ballY <= aiY + paddleHeight) {
        ballSpeedX = -ballSpeedX;
        ballSpeedX *= 1.05;
        rallyCount++;
        if (rallyCount > maxRally) maxRally = rallyCount;
        
        // Create particles on paddle hit
        for (let i = 0; i < 8; i++) {
          particles.push(createParticle(ballX, ballY, '#ff0080'));
        }
        
        updateStats();
      }

      // Power-up collision
      if (powerUp && Math.abs(ballX - powerUp.x) < powerUp.size && 
          Math.abs(ballY - powerUp.y) < powerUp.size) {
        if (powerUp.type === 'speed') {
          ballSpeedX *= 1.5;
          ballSpeedY *= 1.5;
          powerUpActive = true;
          powerUpType = 'speed';
          powerUpTimer = 300; // 5 seconds at 60fps
          showStatus('Speed boost activated!');
        } else if (powerUp.type === 'size') {
          powerUpActive = true;
          powerUpType = 'size';
          powerUpTimer = 300;
          showStatus('Size boost activated!');
        }
        
        // Create particles for power-up collection
        for (let i = 0; i < 15; i++) {
          particles.push(createParticle(powerUp.x, powerUp.y, '#ffaa00'));
        }
        
        powerUp = null;
      }

      // Score points
      if(ballX <= 0) {
        aiScore++;
        resetBall();
        rallyCount = 0;
        updateStats();
      }
      if(ballX >= canvas.width) {
        playerScore++;
        resetBall();
        rallyCount = 0;
        updateStats();
      }

      // AI movement with difficulty scaling
      const aiSpeed = 1.5 + (Math.min(playerScore + aiScore, 10) * 0.1);
      if(aiY + paddleHeight/2 < ballY - 10) {
        aiY += aiSpeed;
      } else if(aiY + paddleHeight/2 > ballY + 10) {
        aiY -= aiSpeed;
      }

      // Keep paddles in bounds
      playerY = Math.max(0, Math.min(canvas.height - paddleHeight, playerY));
      playerTargetY = Math.max(0, Math.min(canvas.height - paddleHeight, playerTargetY));
      aiY = Math.max(0, Math.min(canvas.height - paddleHeight, aiY));

      // Spawn power-ups
      spawnPowerUp();
    }

    function resetBall() {
      ballX = canvas.width / 2;
      ballY = canvas.height / 2;
      ballSpeedX = Math.random() > 0.5 ? 1.8 : -1.8;
      ballSpeedY = Math.random() > 0.5 ? 1.2 : -1.2;
      ballTrail = [];
    }

    function gameLoop() {
      update();
      draw();
      requestAnimationFrame(gameLoop);
    }

    function showStatus(text) {
      status.textContent = text;
    }

    // Controls
    function handleKeyDown(e) {
      if(!gameRunning) return;
      
      // Prevent page scrolling for arrow keys
      if(['ArrowUp', 'ArrowDown'].includes(e.key)) {
        e.preventDefault();
      }
      
      switch(e.key) {
        case 'ArrowUp':
          playerTargetY -= 15; // Set target position for smooth movement
          break;
        case 'ArrowDown':
          playerTargetY += 15; // Set target position for smooth movement
          break;
      }
    }

    // Mouse/Touch controls
    let isDragging = false;
    let dragStartY = 0;
    let dragStartPlayerY = 0;

    function handleMouseDown(e) {
      if(!gameRunning) return;
      
      const rect = canvas.getBoundingClientRect();
      const mouseY = e.clientY - rect.top;
      
      // Increased hold area - check if click is anywhere on the left side
      if(e.clientX - rect.left <= 50) { // Increased from 20 to 50
        isDragging = true;
        dragStartY = mouseY;
        dragStartPlayerY = playerTargetY; // Use target position for smooth movement
        e.preventDefault();
      }
    }

    function handleMouseMove(e) {
      if(!isDragging || !gameRunning) return;
      
      const rect = canvas.getBoundingClientRect();
      const mouseY = e.clientY - rect.top;
      const deltaY = mouseY - dragStartY;
      
      playerTargetY = Math.max(0, Math.min(canvas.height - paddleHeight, dragStartPlayerY + deltaY));
      e.preventDefault();
    }

    function handleMouseUp() {
      isDragging = false;
    }

    // Touch controls
    function handleTouchStart(e) {
      if(e.touches.length === 1) {
        handleMouseDown(e.touches[0]);
      }
    }

    function handleTouchMove(e) {
      if(e.touches.length === 1) {
        handleMouseMove(e.touches[0]);
      }
    }

    function handleTouchEnd() {
      handleMouseUp();
    }

    // Status display
    const status = document.createElement('div');
    status.className = 'game-status';
    status.setAttribute('aria-live', 'polite');
    container.appendChild(status);

    showStatus('Use up/down arrows or drag to move your paddle');
    window.addEventListener('keydown', handleKeyDown);
    
    // Add mouse and touch event listeners
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseUp);
    
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd);
    
    updateStats();
    gameLoop();

    // Cleanup
    createBackButton().addEventListener('click', () => {
      gameRunning = false;
      window.removeEventListener('keydown', handleKeyDown);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseUp);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
    });

    container.focus();
    return container;
  }

  //////////////////////////////
  // Breakout Implementation //
  //////////////////////////////

  function renderBreakout() {
    const container = document.createElement('section');
    container.className = 'game-container';
    container.setAttribute('aria-label', 'Breakout game');
    container.tabIndex = -1;

    const header = document.createElement('div');
    header.className = 'game-header';
    const title = document.createElement('h2');
    title.textContent = 'Breakout';
    header.appendChild(title);
    // Fix: Restart button should call resetBreakout()
    const restartBtn = createRestartButton(() => {
      resetBreakout();
    });
    header.appendChild(restartBtn);
    header.appendChild(createBackButton());
    container.appendChild(header);

    const playArea = document.createElement('div');
    playArea.className = 'game-play-area';
    container.appendChild(playArea);

    // Game stats
    const statsDisplay = document.createElement('div');
    statsDisplay.className = 'breakout-stats';
    playArea.appendChild(statsDisplay);

    // Canvas setup
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 400;
    canvas.className = 'snake-canvas';
    playArea.appendChild(canvas);

    const ctx = canvas.getContext('2d');

    // Game state
    let paddleX = canvas.width / 2 - 50;
    let paddleTargetX = canvas.width / 2 - 50;
    let ballX = canvas.width / 2;
    let ballY = canvas.height - 50;
    let ballSpeedX = 3;
    let ballSpeedY = -3;
    let score = 0;
    let lives = 3;
    let gameOver = false;
    let gameWon = false;
    let gameStartTime = Date.now();
    let gameTime = 0;
    let isPaused = false;
    let particles = [];
    let powerUps = [];
    let paddleWidth = 100;
    let paddleHeight = 10;
    let ballSize = 8;
    let blocks = [];
    let level = 1;
    let blocksDestroyed = 0;
    let totalBlocks = 0;
    let animationId = null;
    let startBtn = null;
    let started = false;

    // Block colors
    const blockColors = [
      '#ff4444', '#ff8800', '#ffaa00', '#00ff88', 
      '#0080ff', '#8000ff', '#ff0080', '#00ffff'
    ];

    function updateStats() {
      const minutes = Math.floor(gameTime / 60);
      const seconds = gameTime % 60;
      const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      
      statsDisplay.innerHTML = `
        <div class="stat-item">
          <span class="stat-label">Score</span>
          <span class="stat-value score">${score}</span>
        </div>
        <div class="stat-divider">|</div>
        <div class="stat-item">
          <span class="stat-label">Lives</span>
          <span class="stat-value lives">${lives}</span>
        </div>
        <div class="stat-divider">|</div>
        <div class="stat-item">
          <span class="stat-label">Level</span>
          <span class="stat-value level">${level}</span>
        </div>
        <div class="stat-divider">|</div>
        <div class="stat-item">
          <span class="stat-label">Blocks</span>
          <span class="stat-value blocks">${blocksDestroyed}/${totalBlocks}</span>
        </div>
        <div class="stat-divider">|</div>
        <div class="stat-item">
          <span class="stat-label">Time</span>
          <span class="stat-value time">${timeString}</span>
        </div>
      `;
    }

    function createBlocks() {
      blocks = [];
      const rows = 6;
      const cols = 10;
      const blockWidth = canvas.width / cols;
      const blockHeight = 25;
      const startY = 50;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          blocks.push({
            x: col * blockWidth,
            y: startY + row * blockHeight,
            width: blockWidth - 2,
            height: blockHeight - 2,
            color: blockColors[row % blockColors.length],
            health: 1,
            destroyed: false
          });
        }
      }
      totalBlocks = blocks.length;
      blocksDestroyed = 0;
    }

    function createParticle(x, y, color) {
      return {
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8,
        life: 1,
        decay: 0.02,
        color: color,
        size: Math.random() * 4 + 2
      };
    }

    function createPowerUp(x, y) {
      if (Math.random() < 0.3) { // 30% chance
        const types = ['wide', 'narrow', 'slow', 'fast'];
        const type = types[Math.floor(Math.random() * types.length)];
        powerUps.push({
          x: x,
          y: y,
          width: 20,
          height: 20,
          type: type,
          speed: 2,
          active: true
        });
      }
    }

    function resetBreakout() {
      paddleX = canvas.width / 2 - 50;
      paddleTargetX = canvas.width / 2 - 50;
      ballX = canvas.width / 2;
      ballY = canvas.height - 50;
      ballSpeedX = 3;
      ballSpeedY = -3;
      score = 0;
      lives = 3;
      gameOver = false;
      gameWon = false;
      gameStartTime = Date.now();
      gameTime = 0;
      isPaused = false;
      particles = [];
      powerUps = [];
      paddleWidth = 100;
      level = 1;
      blocksDestroyed = 0;
      createBlocks();
      showStatus('Use left/right arrows or mouse to move paddle');
      updateStats();
    }

    function draw() {
      // Clear canvas with fade effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw background grid
      ctx.strokeStyle = 'rgba(0, 255, 136, 0.1)';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 30) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += 30) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      // Draw particles
      particles.forEach(particle => {
        ctx.save();
        ctx.globalAlpha = particle.life;
        ctx.fillStyle = particle.color;
        ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
        ctx.restore();
      });

      // Draw power-ups
      powerUps.forEach(powerUp => {
        if (powerUp.active) {
          const pulse = Math.sin(Date.now() * 0.01) * 0.3 + 0.7;
          ctx.save();
          ctx.globalAlpha = pulse;
          ctx.fillStyle = powerUp.type === 'wide' ? '#00ff88' : 
                         powerUp.type === 'narrow' ? '#ff0080' : 
                         powerUp.type === 'slow' ? '#0080ff' : '#ffaa00';
          ctx.fillRect(powerUp.x, powerUp.y, powerUp.width, powerUp.height);
          
          // Draw power-up icon
          ctx.fillStyle = 'white';
          ctx.font = '12px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(powerUp.type === 'wide' ? '⬌' : 
                      powerUp.type === 'narrow' ? '⬍' : 
                      powerUp.type === 'slow' ? '⏱' : '⚡', 
                      powerUp.x + powerUp.width/2, 
                      powerUp.y + powerUp.height/2 + 4);
          ctx.restore();
        }
      });

      // Draw blocks
      blocks.forEach(block => {
        if (!block.destroyed) {
          ctx.save();
          ctx.shadowColor = block.color;
          ctx.shadowBlur = 10;
          ctx.fillStyle = block.color;
          ctx.fillRect(block.x, block.y, block.width, block.height);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
          ctx.strokeRect(block.x, block.y, block.width, block.height);
          ctx.restore();
        }
      });

      // Draw paddle with glow
      ctx.shadowColor = '#00ff88';
      ctx.shadowBlur = 15;
      ctx.fillStyle = '#00ff88';
      ctx.fillRect(paddleX, canvas.height - 20, paddleWidth, paddleHeight);
      ctx.shadowBlur = 0;

      // Draw ball with glow
      ctx.shadowColor = '#fbbf24';
      ctx.shadowBlur = 10;
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(ballX - ballSize/2, ballY - ballSize/2, ballSize, ballSize);
      ctx.shadowBlur = 0;

      // Draw game over or win message
      if (gameOver || gameWon) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = gameWon ? '#00ff88' : '#ff4444';
        ctx.font = 'bold 48px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(gameWon ? 'YOU WIN!' : 'GAME OVER', canvas.width/2, canvas.height/2 - 50);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = '24px Inter';
        ctx.fillText(`Final Score: ${score}`, canvas.width/2, canvas.height/2);
        ctx.fillText('Press Restart to play again', canvas.width/2, canvas.height/2 + 50);
      }
    }

    function update() {
      if (gameOver || gameWon || isPaused) return;

      // Update game time
      gameTime = Math.floor((Date.now() - gameStartTime) / 1000);

      // Smooth paddle movement
      const paddleSpeed = 8;
      if (paddleX < paddleTargetX) {
        paddleX = Math.min(paddleTargetX, paddleX + paddleSpeed);
      } else if (paddleX > paddleTargetX) {
        paddleX = Math.max(paddleTargetX, paddleX - paddleSpeed);
      }

      // Update particles
      particles = particles.filter(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life -= particle.decay;
        return particle.life > 0;
      });

      // Update power-ups
      powerUps = powerUps.filter(powerUp => {
        if (powerUp.active) {
          powerUp.y += powerUp.speed;
          
          // Check collision with paddle
          if (powerUp.y + powerUp.height > canvas.height - 20 && 
              powerUp.y < canvas.height &&
              powerUp.x + powerUp.width > paddleX && 
              powerUp.x < paddleX + paddleWidth) {
            
            // Apply power-up effect
            switch(powerUp.type) {
              case 'wide':
                paddleWidth = Math.min(150, paddleWidth + 20);
                break;
              case 'narrow':
                paddleWidth = Math.max(50, paddleWidth - 20);
                break;
              case 'slow':
                ballSpeedX *= 0.8;
                ballSpeedY *= 0.8;
                break;
              case 'fast':
                ballSpeedX *= 1.2;
                ballSpeedY *= 1.2;
                break;
            }
            powerUp.active = false;
            showStatus(`Power-up activated: ${powerUp.type}!`);
          }
          
          // Remove if off screen
          if (powerUp.y > canvas.height) {
            powerUp.active = false;
          }
        }
        return powerUp.active;
      });

      // Move ball
      ballX += ballSpeedX;
      ballY += ballSpeedY;

      // Ball collision with walls
      if (ballX <= 0 || ballX >= canvas.width) {
        ballSpeedX = -ballSpeedX;
        // Create particles on wall hit
        for (let i = 0; i < 3; i++) {
          particles.push(createParticle(ballX, ballY, '#fbbf24'));
        }
      }
      if (ballY <= 0) {
        ballSpeedY = -ballSpeedY;
        // Create particles on wall hit
        for (let i = 0; i < 3; i++) {
          particles.push(createParticle(ballX, ballY, '#fbbf24'));
        }
      }

      // Ball collision with paddle
      if (ballY + ballSize/2 >= canvas.height - 20 && 
          ballY - ballSize/2 <= canvas.height &&
          ballX + ballSize/2 >= paddleX && 
          ballX - ballSize/2 <= paddleX + paddleWidth) {
        
        ballSpeedY = -ballSpeedY;
        
        // Adjust ball direction based on where it hits the paddle
        const hitPos = (ballX - paddleX) / paddleWidth;
        ballSpeedX = (hitPos - 0.5) * 8;
        
        // Create particles on paddle hit
        for (let i = 0; i < 8; i++) {
          particles.push(createParticle(ballX, ballY, '#00ff88'));
        }
      }

      // Ball collision with blocks
      blocks.forEach(block => {
        if (!block.destroyed && 
            ballX + ballSize/2 >= block.x && 
            ballX - ballSize/2 <= block.x + block.width &&
            ballY + ballSize/2 >= block.y && 
            ballY - ballSize/2 <= block.y + block.height) {
          
          block.health--;
          if (block.health <= 0) {
            block.destroyed = true;
            blocksDestroyed++;
            score += 10;
            
            // Create particles for destroyed block
            for (let i = 0; i < 10; i++) {
              particles.push(createParticle(
                block.x + block.width/2, 
                block.y + block.height/2, 
                block.color
              ));
            }
            
            // Chance to spawn power-up
            createPowerUp(block.x + block.width/2, block.y + block.height/2);
          }
          
          ballSpeedY = -ballSpeedY;
          updateStats();
        }
      });

      // Check for level completion
      if (blocksDestroyed === totalBlocks) {
        level++;
        createBlocks();
        ballSpeedX *= 1.1;
        ballSpeedY *= 1.1;
        showStatus(`Level ${level} completed! Speed increased!`);
      }

      // Check for ball out of bounds
      if (ballY > canvas.height) {
        lives--;
        if (lives <= 0) {
          gameOver = true;
          showStatus(`Game Over! Final Score: ${score}`);
        } else {
          // Reset ball position
          ballX = canvas.width / 2;
          ballY = canvas.height - 50;
          ballSpeedX = 3;
          ballSpeedY = -3;
          showStatus(`Lives remaining: ${lives}`);
        }
        updateStats();
      }

      // Check for win condition (optional: win after certain levels)
      if (level > 5) {
        gameWon = true;
        showStatus(`Congratulations! You won with score: ${score}`);
      }
    }

    function gameLoop() {
      update();
      draw();
      requestAnimationFrame(gameLoop);
    }

    function showStatus(text) {
      status.textContent = text;
    }

    // Controls
    function handleKeyDown(e) {
      if (gameOver || gameWon) return;
      
      // Prevent page scrolling for arrow keys
      if(['ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }
      
      switch(e.key) {
        case 'ArrowLeft':
          paddleTargetX = Math.max(0, paddleTargetX - 20);
          break;
        case 'ArrowRight':
          paddleTargetX = Math.min(canvas.width - paddleWidth, paddleTargetX + 20);
          break;
        case 'p':
        case 'P':
          isPaused = !isPaused;
          if (isPaused) {
            showStatus('Game Paused - Press P to resume');
          } else {
            showStatus('Game resumed');
          }
          break;
      }
    }

    // Mouse/Touch controls
    function handleMouseMove(e) {
      if (gameOver || gameWon) return;
      
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      paddleTargetX = Math.max(0, Math.min(canvas.width - paddleWidth, mouseX - paddleWidth/2));
    }

    // Touch controls
    function handleTouchMove(e) {
      if (e.touches.length === 1) {
        handleMouseMove(e.touches[0]);
      }
    }

    // Status display
    const status = document.createElement('div');
    status.className = 'game-status';
    status.setAttribute('aria-live', 'polite');
    container.appendChild(status);

    showStatus('Use left/right arrows or mouse to move paddle');
    window.addEventListener('keydown', handleKeyDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    
    updateStats();
    gameLoop();

    // Cleanup
    createBackButton().addEventListener('click', () => {
      gameOver = true;
      window.removeEventListener('keydown', handleKeyDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('touchmove', handleTouchMove);
    });

    container.focus();
    return container;
  }

  // 2048 Game Implementation
  function render2048() {
    const container = document.createElement('section');
    container.className = 'game-container';
    container.setAttribute('aria-label', '2048 game');
    container.tabIndex = -1;

    // Header
    const header = document.createElement('div');
    header.className = 'game-header';
    const title = document.createElement('h2');
    title.textContent = '2048';
    header.appendChild(title);

    // Undo button
    const undoBtn = document.createElement('button');
    undoBtn.type = 'button';
    undoBtn.className = 'btn-primary';
    undoBtn.textContent = 'Undo';
    undoBtn.setAttribute('aria-label', 'Undo last move');
    header.appendChild(undoBtn);

    // Restart button
    const restartBtn = createRestartButton(() => {
      startGame();
    });
    header.appendChild(restartBtn);
    header.appendChild(createBackButton());
    container.appendChild(header);

    // Stats
    const statsDisplay = document.createElement('div');
    statsDisplay.className = 'game-2048-stats';
    container.appendChild(statsDisplay);

    // Game area
    const playArea = document.createElement('div');
    playArea.className = 'game-play-area';
    container.appendChild(playArea);

    // 2048 grid
    const gridContainer = document.createElement('div');
    gridContainer.className = 'game-2048-grid';
    playArea.appendChild(gridContainer);

    // Status
    const status = document.createElement('div');
    status.className = 'game-status';
    container.appendChild(status);

    // Overlay
    const overlay = document.createElement('div');
    overlay.className = 'game-2048-overlay';
    overlay.setAttribute('aria-live', 'polite');
    overlay.style.display = 'none';
    container.appendChild(overlay);

    // Game state
    const size = 4;
    let board = [];
    let score = 0;
    let bestScore = parseInt(localStorage.getItem('bestScore2048') || '0', 10);
    let gameOver = false;
    let won = false;
    let keepGoing = false;
    let prevBoard = null;
    let prevScore = 0;
    let animating = false;
    let newTilePos = null;
    let mergedTiles = [];

    function updateStats() {
      statsDisplay.innerHTML = `
        <div class="stat-item">
          <span class="stat-label">Score</span>
          <span class="stat-value score">${score}</span>
        </div>
        <div class="stat-divider">|</div>
        <div class="stat-item">
          <span class="stat-label">Best</span>
          <span class="stat-value best-score">${bestScore}</span>
        </div>
      `;
    }

    function emptyBoard() {
      board = [];
      for (let i = 0; i < size; i++) {
        board.push(Array(size).fill(0));
      }
    }

    function addRandomTile() {
      const empty = [];
      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          if (board[r][c] === 0) empty.push([r, c]);
        }
      }
      if (empty.length === 0) return;
      const [r, c] = empty[Math.floor(Math.random() * empty.length)];
      board[r][c] = Math.random() < 0.9 ? 2 : 4;
      newTilePos = [r, c];
    }

    function canMove() {
      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          if (board[r][c] === 0) return true;
          if (c < size - 1 && board[r][c] === board[r][c + 1]) return true;
          if (r < size - 1 && board[r][c] === board[r + 1][c]) return true;
        }
      }
      return false;
    }

    function deepCopyBoard(b) {
      return b.map(row => row.slice());
    }

    function move(dir) {
      if (animating || gameOver || (won && !keepGoing)) return;
      prevBoard = deepCopyBoard(board);
      prevScore = score;
      let moved = false;
      mergedTiles = [];
      function slide(row, rowIdx) {
        let arr = row.filter(x => x !== 0);
        for (let i = 0; i < arr.length - 1; i++) {
          if (arr[i] === arr[i + 1]) {
            arr[i] *= 2;
            score += arr[i];
            mergedTiles.push({
              value: arr[i],
              index: i,
              row: rowIdx
            });
            arr[i + 1] = 0;
            if (arr[i] === 2048) won = true;
          }
        }
        arr = arr.filter(x => x !== 0);
        while (arr.length < size) arr.push(0);
        return arr;
      }
      if (dir === 'left') {
        for (let r = 0; r < size; r++) {
          const old = board[r].slice();
          const newRow = slide(board[r], r);
          if (old.join() !== newRow.join()) moved = true;
          board[r] = newRow;
        }
      } else if (dir === 'right') {
        for (let r = 0; r < size; r++) {
          const old = board[r].slice();
          let rev = board[r].slice().reverse();
          rev = slide(rev, r).reverse();
          if (old.join() !== rev.join()) moved = true;
          board[r] = rev;
        }
      } else if (dir === 'up') {
        for (let c = 0; c < size; c++) {
          let col = [];
          for (let r = 0; r < size; r++) col.push(board[r][c]);
          const old = col.slice();
          col = slide(col, c);
          for (let r = 0; r < size; r++) {
            if (board[r][c] !== col[r]) moved = true;
            board[r][c] = col[r];
          }
        }
      } else if (dir === 'down') {
        for (let c = 0; c < size; c++) {
          let col = [];
          for (let r = 0; r < size; r++) col.push(board[r][c]);
          const old = col.slice();
          col = slide(col.reverse(), c).reverse();
          for (let r = 0; r < size; r++) {
            if (board[r][c] !== col[r]) moved = true;
            board[r][c] = col[r];
          }
        }
      }
      if (moved) {
        addRandomTile();
        if (score > bestScore) {
          bestScore = score;
          localStorage.setItem('bestScore2048', bestScore);
        }
        updateStats();
        renderBoard();
        if (!canMove()) {
          gameOver = true;
          showOverlay('Game Over!', 'Restart', startGame);
        } else if (won && !keepGoing) {
          showOverlay('You win! 🎉', 'Keep Going', () => { keepGoing = true; hideOverlay(); });
        } else {
          showStatus('');
        }
      }
    }

    function renderBoard() {
      gridContainer.innerHTML = '';
      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          const val = board[r][c];
          const tile = document.createElement('div');
          tile.className = 'game-2048-tile';
          tile.setAttribute('data-value', val);
          tile.textContent = val === 0 ? '' : val;
          if (newTilePos && newTilePos[0] === r && newTilePos[1] === c) {
            tile.classList.add('tile-new');
            setTimeout(() => tile.classList.remove('tile-new'), 200);
          }
          if (mergedTiles.some(m => m.row === r && board[r][c] === m.value)) {
            tile.classList.add('tile-merged');
            setTimeout(() => tile.classList.remove('tile-merged'), 200);
          }
          gridContainer.appendChild(tile);
        }
      }
      newTilePos = null;
    }

    function showStatus(text) {
      status.textContent = text;
    }

    function showOverlay(message, btnText, btnAction) {
      overlay.innerHTML = `<div class="overlay-content"><h3>${message}</h3><button class="btn-primary overlay-btn">${btnText}</button></div>`;
      overlay.style.display = 'flex';
      overlay.setAttribute('aria-modal', 'true');
      overlay.setAttribute('tabindex', '0');
      const btn = overlay.querySelector('button');
      btn.addEventListener('click', () => {
        btnAction();
      });
      btn.focus();
    }

    function hideOverlay() {
      overlay.style.display = 'none';
      overlay.innerHTML = '';
    }

    function startGame() {
      score = 0;
      won = false;
      keepGoing = false;
      gameOver = false;
      prevBoard = null;
      prevScore = 0;
      newTilePos = null;
      mergedTiles = [];
      emptyBoard();
      addRandomTile();
      addRandomTile();
      updateStats();
      renderBoard();
      showStatus('');
      hideOverlay();
    }

    // Controls
    function handleKeyDown(e) {
      if (gameOver || (won && !keepGoing)) return;
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
        if (e.key === 'ArrowUp') move('up');
        if (e.key === 'ArrowDown') move('down');
        if (e.key === 'ArrowLeft') move('left');
        if (e.key === 'ArrowRight') move('right');
      }
    }

    // Undo
    undoBtn.addEventListener('click', () => {
      if (prevBoard) {
        board = deepCopyBoard(prevBoard);
        score = prevScore;
        updateStats();
        renderBoard();
        showStatus('Undid last move');
        prevBoard = null;
      }
    });

    // Touch controls
    let touchStartX = null, touchStartY = null;
    function handleTouchStart(e) {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    }
    function handleTouchEnd(e) {
      if (touchStartX === null || touchStartY === null) return;
      const dx = e.changedTouches[0].clientX - touchStartX;
      const dy = e.changedTouches[0].clientY - touchStartY;
      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 30) move('right');
        else if (dx < -30) move('left');
      } else {
        if (dy > 30) move('down');
        else if (dy < -30) move('up');
      }
      touchStartX = null;
      touchStartY = null;
    }

    window.addEventListener('keydown', handleKeyDown);
    gridContainer.addEventListener('touchstart', handleTouchStart, { passive: true });
    gridContainer.addEventListener('touchend', handleTouchEnd);

    // Start game
    startGame();
    container.focus();

    // Cleanup on back
    createBackButton().addEventListener('click', () => {
      window.removeEventListener('keydown', handleKeyDown);
      gridContainer.removeEventListener('touchstart', handleTouchStart);
      gridContainer.removeEventListener('touchend', handleTouchEnd);
    });

    return container;
  }

  // Sudoku Game Implementation
  function renderSudoku() {
    const container = document.createElement('section');
    container.className = 'game-container';
    container.setAttribute('aria-label', 'Sudoku game');
    container.tabIndex = -1;

    // Header
    const header = document.createElement('div');
    header.className = 'game-header';
    const title = document.createElement('h2');
    title.textContent = 'Sudoku';
    header.appendChild(title);
    // Add resetSudoku function
    function resetSudoku() {
      userGrid = puzzle.map(row => row.slice());
      selected = {row: 0, col: 0};
      finished = false;
      clearInterval(timerId);
      startTime = Date.now();
      timerId = setInterval(updateStats, 1000);
      updateStats();
      renderGrid();
    }
    // Fix: Restart button should call resetSudoku()
    const restartBtn = createRestartButton(() => {
      resetSudoku();
    });
    header.appendChild(restartBtn);
    header.appendChild(createBackButton());
    container.appendChild(header);

    // Play area
    const playArea = document.createElement('div');
    playArea.className = 'game-play-area';
    container.appendChild(playArea);

    // Stats
    const stats = document.createElement('div');
    stats.className = 'sudoku-stats';
    playArea.appendChild(stats);

    // Sudoku grid
    const grid = document.createElement('div');
    grid.className = 'sudoku-grid';
    playArea.appendChild(grid);

    // Generate a puzzle (simple static for now, can be randomized later)
    // 0 = empty
    const puzzle = [
      [5,3,0,0,7,0,0,0,0],
      [6,0,0,1,9,5,0,0,0],
      [0,9,8,0,0,0,0,6,0],
      [8,0,0,0,6,0,0,0,3],
      [4,0,0,8,0,3,0,0,1],
      [7,0,0,0,2,0,0,0,6],
      [0,6,0,0,0,0,2,8,0],
      [0,0,0,4,1,9,0,0,5],
      [0,0,0,0,8,0,0,7,9],
    ];
    // Deep copy for user state
    let userGrid = puzzle.map(row => row.slice());
    let selected = {row: 0, col: 0};
    let startTime = Date.now();
    let timerId = null;
    let finished = false;

    function updateStats() {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const min = String(Math.floor(elapsed/60)).padStart(2,'0');
      const sec = String(elapsed%60).padStart(2,'0');
      stats.innerHTML = `<span class="stat-label">Time</span> <span class="stat-value">${min}:${sec}</span>`;
    }

    function isFixedCell(r, c) {
      return puzzle[r][c] !== 0;
    }

    function checkConflict(r, c, val) {
      if (!val) return false;
      // Row/col
      for (let i = 0; i < 9; i++) {
        if (i !== c && userGrid[r][i] === val) return true;
        if (i !== r && userGrid[i][c] === val) return true;
      }
      // 3x3 box
      const boxRow = Math.floor(r/3)*3, boxCol = Math.floor(c/3)*3;
      for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
        const rr = boxRow+i, cc = boxCol+j;
        if ((rr !== r || cc !== c) && userGrid[rr][cc] === val) return true;
      }
      return false;
    }

    function isComplete() {
      for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) {
        if (!userGrid[r][c] || checkConflict(r, c, userGrid[r][c])) return false;
      }
      return true;
    }

    function renderGrid() {
      grid.innerHTML = '';
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          const cell = document.createElement('div');
          cell.className = 'sudoku-cell';
          if (isFixedCell(r, c)) cell.classList.add('fixed');
          if (selected.row === r && selected.col === c) cell.classList.add('selected');
          if (!isFixedCell(r, c) && userGrid[r][c] && checkConflict(r, c, userGrid[r][c])) cell.classList.add('conflict');
          if (userGrid[r][c]) cell.textContent = userGrid[r][c];
          cell.tabIndex = 0;
          cell.setAttribute('aria-label', `Row ${r+1} Column ${c+1}`);
          cell.addEventListener('click', () => {
            selected = {row: r, col: c};
            renderGrid();
          });
          cell.addEventListener('keydown', e => {
            if (finished) return;
            if (e.key >= '1' && e.key <= '9' && !isFixedCell(r, c)) {
              userGrid[r][c] = Number(e.key);
              if (isComplete()) finishGame();
              renderGrid();
            } else if ((e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') && !isFixedCell(r, c)) {
              userGrid[r][c] = 0;
              renderGrid();
            } else if (e.key === 'ArrowUp' && r > 0) {
              selected = {row: r-1, col: c};
              renderGrid();
            } else if (e.key === 'ArrowDown' && r < 8) {
              selected = {row: r+1, col: c};
              renderGrid();
            } else if (e.key === 'ArrowLeft' && c > 0) {
              selected = {row: r, col: c-1};
              renderGrid();
            } else if (e.key === 'ArrowRight' && c < 8) {
              selected = {row: r, col: c+1};
              renderGrid();
            }
          });
          grid.appendChild(cell);
        }
      }
    }

    function finishGame() {
      finished = true;
      clearInterval(timerId);
      setTimeout(() => {
        alert('Congratulations! You solved the Sudoku!');
      }, 100);
    }

    // Keyboard input for selected cell
    function handleKey(e) {
      if (finished) return;
      const {row, col} = selected;
      if (!isFixedCell(row, col)) {
        if (e.key >= '1' && e.key <= '9') {
          userGrid[row][col] = Number(e.key);
          if (isComplete()) finishGame();
          renderGrid();
        } else if ((e.key === 'Backspace' || e.key === 'Delete' || e.key === '0')) {
          userGrid[row][col] = 0;
          renderGrid();
        }
      }
      if (e.key === 'ArrowUp' && row > 0) {
        selected = {row: row-1, col};
        renderGrid();
      } else if (e.key === 'ArrowDown' && row < 8) {
        selected = {row: row+1, col};
        renderGrid();
      } else if (e.key === 'ArrowLeft' && col > 0) {
        selected = {row, col: col-1};
        renderGrid();
      } else if (e.key === 'ArrowRight' && col < 8) {
        selected = {row, col: col+1};
        renderGrid();
      }
    }

    // Timer
    timerId = setInterval(updateStats, 1000);
    updateStats();
    renderGrid();
    window.addEventListener('keydown', handleKey);
    container.focus();
    // Cleanup
    createBackButton().addEventListener('click', () => {
      clearInterval(timerId);
      window.removeEventListener('keydown', handleKey);
    });
    return container;
  }

  // Initial load
  renderGameSelection();

  // Set up browser history management
  window.addEventListener('popstate', handlePopState);

  // Initialize history for the home page
  if (window.history && window.history.replaceState) {
    window.history.replaceState({ view: 'home' }, 'NeonPlayground', '#');
  }

  // Global event listener to prevent page scrolling during games
  document.addEventListener('keydown', (e) => {
    // Prevent scrolling for arrow keys and space when games are active
    if(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
      // Only prevent default if we're in a game (not on the main menu)
      const gameContainer = document.querySelector('.game-container');
      if (gameContainer) {
        e.preventDefault();
      }
    }
  });
})(); 