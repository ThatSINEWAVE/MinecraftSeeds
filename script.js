// Get DOM elements
const themeToggle = document.getElementById('theme-toggle');
const wordInput = document.getElementById('word-input');
const characterCount = document.getElementById('character-count');
const seedLengthSlider = document.getElementById('seed-length');
const seedLengthValue = document.getElementById('seed-length-value');
const generateBtn = document.getElementById('generate-btn');
const lastSeedsContainer = document.getElementById('last-seeds-container');
const lastSeedsList = document.getElementById('last-seeds-list');
const copyAllBtn = document.getElementById('copy-all-btn');
const sentence = document.getElementById('sentence');

// Initialize variables
let lastSeeds = [];
let darkMode = false;

// Load theme from localStorage
const storedTheme = localStorage.getItem('theme');
if (storedTheme === 'dark') {
    darkMode = true;
    document.body.classList.add('dark-mode');
    themeToggle.checked = true;
}

// Update character count
const updateCharacterCount = () => {
    const inputValue = wordInput.value.replace(/[^a-zA-Z,\s]/g, '');
    const words = inputValue.split(/[,\s]+/).filter(Boolean);
    const validChars = words.join('').length;
    characterCount.textContent = `${validChars}/16`;
    wordInput.value = words.join(', ');
};

// Generate random seed
const generateSeed = (length, words) => {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let seed = '';
    let wordIndex = 0;

    for (let i = 0; i < length; i++) {
        if (words.length > 0 && wordIndex < words.length && Math.random() < 0.2) {
            seed += words[wordIndex];
            wordIndex++;
        } else {
            seed += characters.charAt(Math.floor(Math.random() * characters.length));
        }
    }

    return seed;
};

// Update sentence
const updateSentence = () => {
    const seedLength = seedLengthSlider.value;
    const words = wordInput.value.replace(/[^a-zA-Z,\s]/g, '').split(/[,\s]+/);
    const wordsText = words.length > 0 ? `the word${words.length > 1 ? 's' : ''} ${words.join(', ')}` : 'nothing but numbers';
    const sentenceText = `I want a ${seedLength} characters long seed that contains ${wordsText} and a nice cup of tea.`;
    sentence.textContent = sentenceText;
};

// Generate new seed
const generateNewSeed = () => {
    const seedLength = seedLengthSlider.value;
    const words = wordInput.value.replace(/[^a-zA-Z,\s]/g, '').split(/[,\s]+/);
    const newSeed = generateSeed(seedLength, words);
    lastSeeds.unshift(newSeed);
    lastSeeds = lastSeeds.slice(0, 5);
    updateLastSeedsList();
    lastSeedsContainer.classList.remove('hidden');
};

// Update last seeds list
const updateLastSeedsList = () => {
    lastSeedsList.innerHTML = '';
    lastSeeds.forEach(seed => {
        const seedBox = document.createElement('div');
        seedBox.className = 'seed-box';

        const seedSpan = document.createElement('span');
        seedSpan.textContent = seed;
        seedBox.appendChild(seedSpan);

        const copyBtn = document.createElement('button');
        copyBtn.textContent = 'Copy';
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(seed);
            alert(`Seed "${seed}" copied to clipboard!`);
        });
        seedBox.appendChild(copyBtn);

        lastSeedsList.appendChild(seedBox);
    });
};

// Copy all seeds
const copyAllSeeds = () => {
    const seedsText = lastSeeds.join('\n');
    navigator.clipboard.writeText(seedsText);
    alert('All seeds copied to clipboard!');
};

// Event listeners
wordInput.addEventListener('input', updateCharacterCount);
seedLengthSlider.addEventListener('input', () => {
    seedLengthValue.textContent = seedLengthSlider.value;
    updateSentence();
});
generateBtn.addEventListener('click', generateNewSeed);
copyAllBtn.addEventListener('click', copyAllSeeds);
themeToggle.addEventListener('change', () => {
    darkMode = !darkMode;
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
});

// Initialize
updateCharacterCount();
updateSentence();