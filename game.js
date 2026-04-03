// Game Engine for Idle Test

let points = 0;
let income = 0;
const cursors = { cost: 10, count: 0, income: 1 };
const miners = { cost: 100, count: 0, income: 5 };
const farms = { cost: 1000, count: 0, income: 20 };

let pointsSpan, incomeSpan, clickButton, shopDiv;

function initializeGame() {
    console.log('Game initializing...');
    pointsSpan = document.getElementById('points');
    incomeSpan = document.getElementById('income');
    clickButton = document.getElementById('click-button');
    shopDiv = document.querySelector('.shop');
    
    console.log('Elements found:', { pointsSpan, incomeSpan, clickButton, shopDiv });
    
    if (!clickButton) {
        console.error('Click button not found!');
        return;
    }
    
    clickButton.addEventListener('click', () => {
        points += 1;
        updateDisplay();
        autoSave();
    });
    
    loadGame();
    updateDisplay();
    setInterval(addPassiveIncome, 1000);
}

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

function addPassiveIncome() {
    income = (cursors.income * cursors.count) + (miners.income * miners.count) + (farms.income * farms.count);
    points += income;
    updateDisplay();
}

function updateDisplay() {
    if (pointsSpan) pointsSpan.textContent = Math.floor(points);
    if (incomeSpan) incomeSpan.textContent = income.toFixed(1);
    renderShop();
}

function renderShop() {
    if (!shopDiv) return;
    const oldItems = shopDiv.querySelectorAll('.shop-item');
    oldItems.forEach(item => item.remove());
    
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

function autoSave() {
    localStorage.setItem('idleGameData', JSON.stringify({
        points, cursors: cursors.count, miners: miners.count, farms: farms.count
    }));
}

function loadGame() {
    const saved = localStorage.getItem('idleGameData');
    if (saved) {
        const data = JSON.parse(saved);
        points = data.points;
        cursors.count = data.cursors;
        miners.count = data.miners;
        farms.count = data.farms;
    }
}

// ONLY call initializeGame when DOM is ready
document.addEventListener('DOMContentLoaded', initializeGame);
