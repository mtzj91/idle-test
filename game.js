// Game Engine for Idle Test

// Variables
let points = 0;
let income = 0;
const cursors = { cost: 10, count: 0, income: 1 };
const miners = { cost: 100, count: 0, income: 5 };
const farms = { cost: 1000, count: 0, income: 20 };

// HTML Elements
const pointsSpan = document.getElementById('points');
const incomeSpan = document.getElementById('income');
const clickButton = document.getElementById('click-button');
const shopDiv = document.querySelector('.shop');

// Initialize game
function initializeGame() {
    loadGame();
    updateDisplay();
    setInterval(addPassiveIncome, 1000);
}

// Click handling
clickButton.addEventListener('click', () => {
    points += 1;
    updateDisplay();
    autoSave();
});

// Buy functionality
function buyUpgrade(upgradeName) {
    const upgradeMap = { 'Cursor': cursors, 'Miner': miners, 'Farm': farms };
    const upgrade = upgradeMap[upgradeName];
    
    if (points >= upgrade.cost) {
        points -= upgrade.cost;
        upgrade.count++;
        upgrade.cost = Math.floor(upgrade.cost * 1.15);
        updateDisplay();
        autoSave();
    }
}

// Passive income
function addPassiveIncome() {
    income = (cursors.income * cursors.count) + (miners.income * miners.count) + (farms.income * farms.count);
    points += income;
    updateDisplay();
}

// Update display
function updateDisplay() {
    pointsSpan.textContent = Math.floor(points);
    incomeSpan.textContent = income.toFixed(1);
    renderShop();
}

// Shop rendering
function renderShop() {
    // Remove old shop items
    const oldItems = shopDiv.querySelectorAll('.shop-item');
    oldItems.forEach(item => item.remove());
    
    // Create shop items
    const upgrades = [
        { obj: cursors, name: 'Cursor' },
        { obj: miners, name: 'Miner' },
        { obj: farms, name: 'Farm' }
    ];
    
    upgrades.forEach(({ obj, name }) => {
        const item = document.createElement('div');
        item.className = 'shop-item';
        const canAfford = points >= obj.cost;
        
        item.innerHTML = `
            <strong>${name}</strong> (Owned: ${obj.count})<br>
            Cost: ${obj.cost} points | +${obj.income}/sec<br>
            <button class="buy-btn" onclick="buyUpgrade('${name}')" ${canAfford ? '' : 'disabled'}>
                ${canAfford ? 'Buy' : 'Cannot Afford'}
            </button>
        `;
        shopDiv.appendChild(item);
    });
}

// Auto-save to localStorage
function autoSave() {
    const gameData = {
        points: points,
        cursors: cursors.count,
        miners: miners.count,
        farms: farms.count
    };
    localStorage.setItem('idleGameData', JSON.stringify(gameData));
}

// Load game from localStorage
function loadGame() {
    const savedData = localStorage.getItem('idleGameData');
    if (savedData) {
        const data = JSON.parse(savedData);
        points = data.points;
        cursors.count = data.cursors;
        miners.count = data.miners;
        farms.count = data.farms;
    }
}

// Start the game when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeGame);
} else {
    initializeGame();
}
