const { invoke } = window.__TAURI__.core;

function getLineNumber(textarea, indicator) {
    const ln = textarea.value.substr(0, textarea.selectionStart).split("\n").length;
    const col = textarea.selectionStart - textarea.value.substr(0, textarea.selectionStart).lastIndexOf("\n") - 1;
    indicator.innerHTML = "Ln " + ln + ", Col " + col;
}

window.addEventListener("DOMContentLoaded", () => {
    console.log("Hello, World!");

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

});
