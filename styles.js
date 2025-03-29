
//<script>
// Simple calendar display (for demonstration purposes)
const calendarDiv = document.getElementById('calendar');
const today = new Date();
calendarDiv.innerHTML = `<p>${today.toDateString()}</p>`;

// Clock display with seconds
function updateClock() {
    const clockDiv = document.getElementById('clock');
    const now = new Date();
    clockDiv.innerHTML = `<p>${now.toLocaleTimeString()}</p>`;
}
setInterval(updateClock, 1000);
updateClock();

// Quote changer
const quotes = [
    "Life is what happens when you're busy making other plans. - John Lennon",
    "Do what you can, with what you have, where you are. - Theodore Roosevelt",
    "Success is not the key to happiness. Happiness is the key to success. - Albert Schweitzer",
    "Turn your wounds into wisdom. - Oprah Winfrey",
    "The only way to do great work is to love what you do. - Steve Jobs",
    "Believe you can and you're halfway there. - Theodore Roosevelt",
    "It does not matter how slowly you go as long as you do not stop. - Confucius",
    "Everything you've ever wanted is on the other side of fear. - George Addair"
];

document.getElementById('new-quote').addEventListener('click', function () {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    document.getElementById('quote').innerHTML = `"${randomQuote}"`;
});

// Easter Egg: Long press title to change background color
const title = document.getElementById('title');
let pressTimer;

title.addEventListener('mousedown', function () {
    pressTimer = setTimeout(() => {
        document.body.style.backgroundColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
        document.getElementById('hidden-message').style.display = 'block';
    }, 1000); // 1 second press
});

title.addEventListener('mouseup', function () {
    clearTimeout(pressTimer);
});

// Mood Tracker
const moodIcons = document.querySelectorAll('.mood-icon');
const moodMessages = {
    'happy': "Wonderful! Your happiness brightens everyone's day!",
    'good': "That's great! Keep that positive energy flowing!",
    'okay': "Hanging in there! Remember, every day has something good in it.",
    'sad': "It's okay to feel down sometimes. Tomorrow is a new day!",
    'tired': "Take some time to rest and recharge. You deserve it!"
};

moodIcons.forEach(icon => {
    icon.addEventListener('click', function () {
        // Remove selected class from all icons
        moodIcons.forEach(i => i.classList.remove('selected'));

        // Add selected class to clicked icon
        this.classList.add('selected');

        // Display message based on mood
        const mood = this.getAttribute('data-mood');
        document.getElementById('mood-message').textContent = moodMessages[mood];

        // Save mood to localStorage
        localStorage.setItem('lastMood', mood);
    });
});

// Check if there's a saved mood
const lastMood = localStorage.getItem('lastMood');
if (lastMood) {
    const savedMoodIcon = document.querySelector(`.mood-icon[data-mood="${lastMood}"]`);
    if (savedMoodIcon) {
        savedMoodIcon.classList.add('selected');
        document.getElementById('mood-message').textContent = moodMessages[lastMood];
    }
}

// Memory Card Game
const memoryCards = document.getElementById('memory-cards');
const startGameBtn = document.getElementById('start-game');
const gameMessage = document.getElementById('game-message');

// Card symbols (emojis)
const cardSymbols = ['🐱', '🐶', '🐼', '🦊', '🐰', '🦁', '🐯', '🐨'];
let cards = [];
let flippedCards = [];
let matchedPairs = 0;

// Initialize game
function initGame() {
    // Reset variables
    cards = [];
    flippedCards = [];
    matchedPairs = 0;
    memoryCards.innerHTML = '';
    gameMessage.textContent = '';

    // Create card pairs
    const cardPairs = [...cardSymbols, ...cardSymbols];

    // Shuffle cards
    for (let i = cardPairs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cardPairs[i], cardPairs[j]] = [cardPairs[j], cardPairs[i]];
    }

    // Create card elements
    cardPairs.forEach((symbol, index) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.dataset.symbol = symbol;
        card.dataset.index = index;
        card.addEventListener('click', flipCard);
        memoryCards.appendChild(card);
        cards.push(card);
    });
}

// Flip card
function flipCard() {
    const selectedCard = this;

    // Ignore if card is already flipped or matched
    if (selectedCard.classList.contains('flipped') ||
        selectedCard.classList.contains('matched') ||
        flippedCards.length >= 2) {
        return;
    }

    // Flip card
    selectedCard.classList.add('flipped');
    selectedCard.textContent = selectedCard.dataset.symbol;
    flippedCards.push(selectedCard);

    // Check for match if two cards are flipped
    if (flippedCards.length === 2) {
        setTimeout(checkForMatch, 500);
    }
}

// Check if flipped cards match
function checkForMatch() {
    const [card1, card2] = flippedCards;

    if (card1.dataset.symbol === card2.dataset.symbol) {
        // Cards match
        card1.classList.add('matched');
        card2.classList.add('matched');
        matchedPairs++;

        // Check if all pairs are matched
        if (matchedPairs === cardSymbols.length) {
            gameMessage.textContent = 'Congratulations! You found all matches!';
        }
    } else {
        // Cards don't match, flip back
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
        card1.textContent = '';
        card2.textContent = '';
    }

    // Reset flipped cards
    flippedCards = [];
}

// Start game button
startGameBtn.addEventListener('click', initGame);

// Initialize game on page load
window.addEventListener('load', initGame);




// Whack-a-Mole Game

const moleContainer = document.getElementById('mole-container');
const startMoleGame = document.getElementById('start-mole-game');
const moleScore = document.getElementById('mole-score');
const whackTimer = document.getElementById('whack-timer'); // 修改 ID

let moleInterval, countdownInterval;
let score = 0, timeLeft = 10;
let countdownStarted = false, gameRunning = false;

function startWhackAMole() {
    if (gameRunning) return; // 防止重复启动
    gameRunning = true;
    countdownStarted = false; // 重置倒计时状态

    // 初始化游戏
    moleContainer.innerHTML = '';
    score = 0;
    moleScore.textContent = 'Score: 0';
    whackTimer.textContent = `Countdown: --.--s`; // 修改 ID

    // 创建 9 个地鼠洞
    for (let i = 0; i < 9; i++) {
        const div = document.createElement('div');
        div.className = 'mole-hole';
        moleContainer.appendChild(div);
    }

    function spawnMole() {
        document.querySelectorAll('.mole-hole').forEach(hole => hole.innerHTML = '');
        const randomHole = document.querySelectorAll('.mole-hole')[Math.floor(Math.random() * 9)];
        const mole = document.createElement('div');
        mole.className = 'mole';
        mole.addEventListener('click', firstMoleClick);
        randomHole.appendChild(mole);
    }

    function firstMoleClick() {
        if (!countdownStarted) {
            countdownStarted = true;
            timeLeft = 9;
            startCountdown();
        }
        this.removeEventListener('click', firstMoleClick); // 防止重复触发
        this.addEventListener('click', increaseScore);
        increaseScore.call(this);
    }

    function increaseScore() {
        score++;
        moleScore.textContent = 'Score: ' + score;
        this.remove();
    }

    // **倒计时逻辑**
    function startCountdown() {
        whackTimer.textContent = `Countdown: ${timeLeft.toFixed(2)}s`; // 修改 ID
        countdownInterval = setInterval(() => {
            timeLeft -= 0.1;
            whackTimer.textContent = `Countdown: ${timeLeft.toFixed(2)}s`; // 修改 ID

            if (timeLeft <= 0) {
                clearInterval(countdownInterval);
                clearInterval(moleInterval);
                whackTimer.textContent = "Time's up!"; // 修改 ID
                gameRunning = false;
                document.querySelectorAll('.mole').forEach(mole => mole.remove()); // 清空所有地鼠
            }
        }, 100);
    }

    // 开始生成地鼠
    moleInterval = setInterval(spawnMole, 1000);
}

// 绑定按钮事件
startMoleGame.addEventListener('click', startWhackAMole);




// Schulte Table Game with Only Running Timer
const schulteGrid = document.getElementById('schulte-grid');
const startSchulte = document.getElementById('start-schulte');
const runningStopwatch = document.getElementById('running-stopwatch');

let schulteNumbers = [];
let currentNumber = 1;
let startTime;
let stopwatchInterval;
let gameStarted = false;

function startSchulteGame() {
    // 重置游戏状态
    schulteGrid.innerHTML = '';
    schulteNumbers = Array.from({ length: 25 }, (_, i) => i + 1).sort(() => Math.random() - 0.5);
    currentNumber = 1;
    gameStarted = false;
    runningStopwatch.textContent = 'Running Time: 0.00s';

    // 清除计时器
    clearInterval(stopwatchInterval);

    // 生成 5x5 随机数字方格
    schulteNumbers.forEach(num => {
        const cell = document.createElement('div');
        cell.className = 'schulte-cell';
        cell.textContent = num;
        cell.addEventListener('click', () => {
            if (parseInt(cell.textContent) === currentNumber) {
                if (currentNumber === 1 && !gameStarted) {
                    // 第一次点击数字 1，开始计时
                    startTime = Date.now();
                    gameStarted = true;
                    stopwatchInterval = setInterval(updateStopwatch, 100);
                }

                currentNumber++;
                cell.style.visibility = 'hidden';

                // 游戏结束，停止计时
                if (currentNumber > 25) {
                    clearInterval(stopwatchInterval);
                }
            }
        });
        schulteGrid.appendChild(cell);
    });
}

// 更新秒表显示
function updateStopwatch() {
    if (gameStarted) {
        const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2);
        runningStopwatch.textContent = 'Total Time Used: ' + elapsedTime + 's';
    }
}

// 绑定开始按钮
startSchulte.addEventListener('click', startSchulteGame);

//</script>