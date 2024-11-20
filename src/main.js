const { invoke } = window.__TAURI__.core;

function getLineNumber(textarea, indicator) {
    const ln = textarea.value.substr(0, textarea.selectionStart).split("\n").length;
    const col = textarea.selectionStart - textarea.value.substr(0, textarea.selectionStart).lastIndexOf("\n") - 1;
    indicator.innerHTML = "Ln " + ln + ", Col " + col;
}

window.addEventListener("DOMContentLoaded", () => {
    invoke("set_window_title", {title: "Unamed.txt"});

    document.querySelector("#save").addEventListener("click", () => {
        const content = document.querySelector("#editor").value;
        invoke("save_file", {content});
    });

    document.querySelector("#clear").addEventListener("click", () => {
        document.querySelector("#editor").value = "";    
    });


    document.querySelector("#open").addEventListener("click", () => {
        console.log("open");
        invoke("open_file").then((content) => {
            document.querySelector("#editor").value = content;
        });
    });

    document.querySelector("#new").addEventListener("click", () => {
        document.querySelector("#editor").value = "";
        invoke("set_window_title", {title: "Unamed.txt"});
    });

    let prevTime = performance.now();


    // setInterval(() => {
    //     console.log("update");
    //     const now = performance.now();
    //     const fps = Math.round(1000 / (now - prevTime));
    //     prevTime = now;
    //     const fpsCounter = document.getElementById("fps-counter");
    //     fpsCounter.innerHTML = `FPS ${fps}`;
    // }, 1000 / 60);

    const textarea = document.getElementById('textarea');
    const lineNumbersEle = document.getElementById('line-numbers');

    const displayLineNumbers = () => {
        const lines = textarea.value.split('\n');
        lineNumbersEle.innerHTML = Array.from({
            length: lines.length,
        }, (_, i) => `<div id="line-numbering">${i + 1}</div>`).join('');
    }

    displayLineNumbers();

    const textareaStyles = window.getComputedStyle(textarea);
    [
        'fontFamily',
        'fontSize',
        'fontWeight',
        'letterSpacing',
        'lineHeight',
        'padding',
    ].forEach((property) => {
        lineNumbersEle.style[property] = textareaStyles[property];
    });

    const calculateNumLines = (str) => {
        // Returns the total number of lines
        // a given string takes up in the text area
    };

    const calculateLineNumbers = () => {
        const lines = textarea.value.split('\n');
        const numLines = lines.map((line) => calculateNumLines(line));

        let lineNumbers = [];
        let i = 1;
        while (numLines.length > 0) {
            const numLinesOfSentence = numLines.shift();
            lineNumbers.push(i);
            if (numLinesOfSentence > 1) {
                Array(numLinesOfSentence - 1)
                    .fill('')
                    .forEach((_) => lineNumbers.push(''));
            }
            i++;
        }

        return lineNumbers;
    };

    // This shit doesnt work
    // const displayLineNumbers = () => {
    // const lineNumbers = calculateLineNumbers();
    // lineNumbersEle.innerHTML = Array.from({
    //     length: lineNumbers.length
    // }, (_, i) => `<div>${lineNumbers[i] || '&nbsp;'}</div>`).join('');
    // };

    textarea.addEventListener('scroll', () => {
        lineNumbersEle.scrollTop = textarea.scrollTop;
    });

    textarea.addEventListener('input', () => {
        displayLineNumbers();
    });
});