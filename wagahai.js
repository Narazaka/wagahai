// @ts-check
const titleCharsWagahai = "ワガママハイスペック".split("");
const titleCharsOc = "ワガママハイスペックOC".split("");
const ignoreIndex = 8;
const cycleInterval = 50;

/**
 *
 * @param {Array<string>} array
 */
function shuffle(array) {
    for (let i = array.length - 1; i >= 0; --i) {
        const rand = Math.floor(Math.random() * (i + 1));
        [array[i], array[rand]] = [array[rand], array[i]];
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const startButton = /** @type {HTMLButtonElement} */(document.querySelector(".start"));
    const ignoreCharCheckbox = /** @type {HTMLInputElement} */(document.querySelector(".ignoreChar"));
    const overclockCheckbox = /** @type {HTMLInputElement} */(document.querySelector(".overclock"));
    let charFields = Array.from(/** @type {NodeListOf<HTMLDivElement>} */(document.querySelectorAll(".char")));
    let stopButtons = Array.from(/** @type {NodeListOf<HTMLButtonElement>} */(document.querySelectorAll(".stop")));

    let titleChars = titleCharsWagahai;
    fillCharElements();

    /** @type {number} */
    let cycleIntervalId;
    /** @type {string[]} */
    let stoppedChars;
    /** @type {string[]} */
    let restChars;

    function initialize() {
        setButtonsStopState();
    }

    function setButtonsStopState() {
        for (const stopButton of stopButtons) {
            setStopButton(stopButton, false);
        }
        startButton.disabled = false;
        ignoreCharCheckbox.disabled = false;
        overclockCheckbox.disabled = false;
    }

    function setButtonsStartState() {
        for (const stopButton of stopButtons) {
            setStopButton(stopButton, true);
        }
        startButton.disabled = true;
        ignoreCharCheckbox.disabled = true;
        overclockCheckbox.disabled = true;
    }

    /**
     *
     * @param {HTMLButtonElement} stopButton
     * @param {boolean} enabled
     */
    function setStopButton(stopButton, enabled) {
        stopButton.disabled = !enabled;
        stopButton.textContent = enabled ? "〇" : "●";
    }

    function start() {
        stoppedChars = [];
        restChars = titleChars.slice();
        setButtonsStartState();
        displayChars();
        if (ignoreCharCheckbox.checked) {
            stopOne.call(stopButtons[ignoreIndex]);
        }
        cycleIntervalId = setInterval(cycle, cycleInterval);
    }

    function displayChars() {
        let restCharIndex = 0;
        for (let charIndex = 0; charIndex < titleChars.length; ++charIndex) {
            if (!stoppedChars[charIndex]) {
                charFields[charIndex].textContent = restChars[restCharIndex];
                ++restCharIndex;
            }
        }
    }

    function cycle() {
        shuffle(restChars);
        displayChars();
    }

    /**
     * @this {HTMLButtonElement}
     */
    function stopOne() {
        setStopButton(this, false);
        const charIndex = stopButtons.indexOf(this);
        const char = charFields[charIndex].textContent;
        stoppedChars[charIndex] = char;
        restChars.splice(restChars.indexOf(char), 1);
        if (restChars.length <= 1) {
            clearInterval(cycleIntervalId);
            setButtonsStopState();
        }
    }

    function fillCharElements() {
        const charsDiv = document.querySelector(".chars");
        const buttonsDiv = document.querySelector(".buttons");

        while (charsDiv.firstChild && buttonsDiv.firstChild){
            charsDiv.removeChild(charsDiv.firstChild);
            buttonsDiv.removeChild(buttonsDiv.firstChild);
        }
        for (let i of Array(titleChars.length).keys()) {
            const charDiv = document.createElement("div");
            charDiv.className = "char";
            charsDiv.appendChild(charDiv);
            const stopButton = document.createElement("button");
            stopButton.className = "stop";
            stopButton.addEventListener("click", stopOne);
            buttonsDiv.appendChild(stopButton);
        }
        charFields = Array.from((document.querySelectorAll(".char")));
        stopButtons = Array.from((document.querySelectorAll(".stop")));
    }

    function toggleOc() {
        console.log('toggleOc');
        titleChars = overclockCheckbox.checked ? titleCharsOc : titleCharsWagahai;
        fillCharElements();
        setButtonsStopState();
    }

    startButton.addEventListener("click", start);
    overclockCheckbox.addEventListener("change", toggleOc);
    for (const stopButton of stopButtons) {
        stopButton.addEventListener("click", stopOne);
    }

    initialize();
});
