document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const seedLengthInput = document.getElementById('seed-length');
    const customWordInput = document.getElementById('custom-word');
    const generateSeedButton = document.getElementById('generate-seed');
    const seedSentence = document.querySelector('.seed-sentence');
    const seedList = document.getElementById('seed-list');
    const lastSeedsContainer = document.querySelector('.last-seeds');
    const seedLengthDisplay = document.getElementById('seed-length-display');
    const customWordDisplay = document.getElementById('custom-word-display');
    const characterCounter = document.getElementById('character-counter');

    // Load and apply saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.classList.add(savedTheme);
        themeToggle.checked = savedTheme === 'theme-dark';
    }

    // Toggle theme
    themeToggle.addEventListener('change', () => {
        body.classList.toggle('theme-light');
        body.classList.toggle('theme-dark');
        localStorage.setItem('theme', body.classList.contains('theme-dark') ? 'theme-dark' : 'theme-light');
    });

    // Update sentence on input change
    seedLengthInput.addEventListener('input', () => {
        seedLengthDisplay.textContent = seedLengthInput.value;
        updateSentence();
    });

    customWordInput.addEventListener('input', () => {
        updateSentence();
        updateCharacterCounter();
    });

    function updateSentence() {
        const customWords = customWordInput.value.trim().split(/\s*,\s*/); // Split by comma with optional spaces
        let totalCharacters = 0;
        const filteredWords = customWords.filter(word => {
            const trimmedWord = word.trim();
            totalCharacters += trimmedWord.length;
            return trimmedWord.length > 0;
        });
        const wordsCount = filteredWords.length;

        if (wordsCount > 0 && totalCharacters <= 16) {
            customWordDisplay.textContent = wordsCount > 1 ?
                `the words ${filteredWords.map(word => `"${word}"`).join(', ')}`
                : `the word "${filteredWords[0]}"`;
        } else {
            customWordDisplay.textContent = 'nothing but numbers';
        }
    }

    function updateCharacterCounter() {
        const customWords = customWordInput.value.trim().split(/\s*,\s*/); // Split by comma with optional spaces
        let totalCharacters = 0;
        const filteredWords = customWords.filter(word => {
            const trimmedWord = word.trim();
            totalCharacters += trimmedWord.length;
            return trimmedWord.length > 0;
        });
        characterCounter.textContent = 16 - totalCharacters;
    }

    // Generate seed
    generateSeedButton.addEventListener('click', () => {
        const seedLength = parseInt(seedLengthInput.value, 10);
        const customWords = customWordInput.value.trim().split(/\s*,\s*/); // Split by comma with optional spaces
        const filteredWords = customWords.filter(word => word.trim().length > 0);
        let seed = '';

        if (filteredWords.length > 0) {
            seed = generateCustomSeed(seedLength, filteredWords);
        } else {
            seed = generateRandomSeed(seedLength);
        }

        addSeedToList(seed);
        updateSentence();
        updateCharacterCounter();
    });

    function generateRandomSeed(length) {
        const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }

    function generateCustomSeed(length, customWords) {
        let result = '';
        const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

        // Generate the seed with random positions for the custom words
        for (let i = 0; i < length; i++) {
            if (Math.random() < 0.5 && customWords.length > 0) {
                const randomIndex = Math.floor(Math.random() * customWords.length);
                const randomWord = customWords[randomIndex];
                if (randomWord.length <= length - result.length) {
                    result += randomWord;
                    // Remove the used word from the array to avoid repeating it
                    customWords.splice(randomIndex, 1);
                } else {
                    result += characters.charAt(Math.floor(Math.random() * characters.length));
                }
            } else {
                result += characters.charAt(Math.floor(Math.random() * characters.length));
            }
        }

        // Trim or pad the generated seed to match the desired length
        if (result.length > length) {
            result = result.substring(0, length);
        } else if (result.length < length) {
            const padding = characters.charAt(Math.floor(Math.random() * characters.length)).repeat(length - result.length);
            result += padding;
        }

        return result;
    }

    function addSeedToList(seed) {
        const li = document.createElement('li');
        li.textContent = seed;
        seedList.prepend(li);

        if (seedList.children.length > 5) {
            seedList.removeChild(seedList.lastChild);
        }

        if (!lastSeedsContainer.style.display) {
            lastSeedsContainer.style.display = 'block';
        }
    }
});
