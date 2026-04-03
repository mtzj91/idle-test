'use strict';

// Resource management variables
let resources = {
    gold: 0,
    diamonds: 0,
};

// Upgrade variables
let upgrades = {
    clickMultiplier: 1,
    diamondCost: 10,
};

// Load resources from localStorage
function loadResources() {
    const savedResources = JSON.parse(localStorage.getItem('idleGameResources'));
    if (savedResources) {
        resources = savedResources;
    }
}

// Save resources to localStorage
function saveResources() {
    localStorage.setItem('idleGameResources', JSON.stringify(resources));
}

// Function to handle click
function handleClick() {
    resources.gold += upgrades.clickMultiplier;
    saveResources();
    updateDisplay();
}

// Upgrade functionality
function buyUpgrade() {
    if (resources.gold >= upgrades.diamondCost) {
        resources.gold -= upgrades.diamondCost;
        upgrades.clickMultiplier++;
        upgrades.diamondCost *= 1.5;  // Increase cost for next upgrade
        saveResources();
        updateDisplay();
    } else {
        alert('Not enough gold!');
    }
}

// UI update function
function updateDisplay() {
    document.getElementById('goldDisplay').innerText = 'Gold: ' + resources.gold;
    document.getElementById('upgradeDisplay').innerText = 'Upgrade Cost: ' + upgrades.diamondCost;
}

// Initialize game
function init() {
    loadResources();
    updateDisplay();
    document.getElementById('clickButton').addEventListener('click', handleClick);
    document.getElementById('upgradeButton').addEventListener('click', buyUpgrade);
}

init();