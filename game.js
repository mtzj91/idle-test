// Game Engine for Idle Test
document.addEventListener('DOMContentLoaded', function() {
    let points = 0;
    let income = 0;
    const cursors = { cost: 10, count: 0, income: 1 };
    const miners = { cost: 100, count: 0, income: 5 };
    const farms = { cost: 1000, count: 0, income: 20 };

    const pointsSpan = document.getElementById('points');
    const incomeSpan = document.getElementById('income');
    const clickButton = document.getElementById('click-button');
    const shopDiv = document.querySelector('.shop');

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
        pointsSpan.textContent = Math.floor(points);
        incomeSpan.textContent = income.toFixed(1);
        renderShop();
    }

    function renderShop() {
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
                <button class="buy-btn" onclick="window.buyUpgrade('${name}')" ${canAfford ? '' : 'disabled'}>
                    ${canAfford ? 'Buy' : 'Cannot Afford'}
                </button>
            `;
            shopDiv.appendChild(item);
        });
    }

    function autoSave() {
        localStorage.setItem('idleGameData', JSON.stringify({
            points,
            cursors: { count: cursors.count, cost: cursors.cost },
            miners: { count: miners.count, cost: miners.cost },
            farms: { count: farms.count, cost: farms.cost }
        }));
    }

    function loadGame() {
        const saved = localStorage.getItem('idleGameData');
        if (saved) {
            const data = JSON.parse(saved);
            points = data.points;
            
            // Load counts and costs
            cursors.count = data.cursors.count;
            cursors.cost = data.cursors.cost;
            miners.count = data.miners.count;
            miners.cost = data.miners.cost;
            farms.count = data.farms.count;
            farms.cost = data.farms.cost;
        }
    }

    // Expose buyUpgrade globally for onclick handlers
    window.buyUpgrade = buyUpgrade;

    // Initialize
    clickButton.addEventListener('click', () => {
        points += 1;
        updateDisplay();
        autoSave();
    });

    loadGame();
    updateDisplay();
    setInterval(addPassiveIncome, 1000);
});
