(() => {
  "use strict";

  const expressionEl = document.getElementById("expression");
  const resultEl = document.getElementById("result");
  const messageEl = document.getElementById("display-message");
  const modeLabel = document.getElementById("mode-label");
  const copyButton = document.getElementById("copy-btn");
  const toast = document.getElementById("toast");
  const keypad = document.querySelector(".keypad");

  let expression = "0";
  let justCalculated = false;
  let hasError = false;
  let toastTimer;

  const operators = ["+", "−", "×", "÷"];

  function prettyNumber(value) {
    if (!Number.isFinite(value)) throw new Error("Invalid result");
    if (Object.is(value, -0)) value = 0;
    const rounded = Number(value.toPrecision(12));
    return String(rounded);
  }

  function calculate(input) {
    // A small parser keeps calculations safe; it never uses eval().
    const source = input.replace(/×/g, "*").replace(/÷/g, "/").replace(/−/g, "-").replace(/\s/g, "");
    const tokens = source.match(/(?:\d+\.?\d*|\.\d+)|[+\-*/]/g);
    if (!tokens || tokens.join("") !== source) throw new Error("Incomplete expression");

    let position = 0;
    function parseExpression() {
      let value = parseTerm();
      while (tokens[position] === "+" || tokens[position] === "-") {
        const op = tokens[position++];
        const right = parseTerm();
        value = op === "+" ? value + right : value - right;
      }
      return value;
    }
    function parseTerm() {
      let value = parseUnary();
      while (tokens[position] === "*" || tokens[position] === "/") {
        const op = tokens[position++];
        const right = parseUnary();
        if (op === "/" && right === 0) throw new Error("Cannot divide by zero");
        value = op === "*" ? value * right : value / right;
      }
      return value;
    }
    function parseUnary() {
      if (tokens[position] === "+") { position++; return parseUnary(); }
      if (tokens[position] === "-") { position++; return -parseUnary(); }
      const token = tokens[position++];
      if (token === undefined || !/^(?:\d+\.?\d*|\.\d+)$/.test(token)) throw new Error("Incomplete expression");
      return Number(token);
    }

    const result = parseExpression();
    if (position !== tokens.length) throw new Error("Incomplete expression");
    if (!Number.isFinite(result)) throw new Error("Result is too large");
    return result;
  }

  function currentPreview() {
    let candidate = expression;
    while (candidate && (operators.includes(candidate.slice(-1)) || candidate.endsWith("."))) {
      candidate = candidate.slice(0, -1);
    }
    if (!candidate || candidate === "-") return null;
    try { return calculate(candidate); } catch { return null; }
  }

  function render() {
    expressionEl.textContent = expression;
    if (hasError) {
      resultEl.textContent = "—";
      messageEl.textContent = "Please check your calculation";
      modeLabel.textContent = "NEEDS ATTENTION";
      return;
    }
    const preview = currentPreview();
    if (justCalculated) {
      resultEl.textContent = expression;
      messageEl.textContent = "Calculation complete";
      modeLabel.textContent = "RESULT";
    } else if (preview !== null) {
      resultEl.textContent = prettyNumber(preview);
      messageEl.textContent = "";
      modeLabel.textContent = "LIVE RESULT";
    } else {
      resultEl.textContent = "0";
      messageEl.textContent = "";
      modeLabel.textContent = "LIVE RESULT";
    }
  }

  function clear() {
    expression = "0";
    justCalculated = false;
    hasError = false;
    render();
  }

  function append(value) {
    if (hasError) clear();
    if (justCalculated && !operators.includes(value)) expression = "0";
    justCalculated = false;

    if (/^\d$/.test(value)) {
      if (expression === "0") expression = value;
      else if (expression.endsWith("0") && /[+\-×÷]0$/.test(expression)) expression = expression.slice(0, -1) + value;
      else expression += value;
    } else if (value === ".") {
      const currentNumber = expression.split(/[+\-×÷]/).pop();
      if (!currentNumber.includes(".")) expression += currentNumber === "" ? "0." : ".";
    } else if (operators.includes(value)) {
      if (expression === "0" && value !== "−") return;
      if (operators.includes(expression.slice(-1))) expression = expression.slice(0, -1) + value;
      else expression += value;
    }
    render();
  }

  function toggleSign() {
    if (hasError) clear();
    justCalculated = false;
    const match = expression.match(/(\d*\.?\d+)$/);
    if (!match) {
      if (expression === "0") expression = "−";
      else if (operators.includes(expression.slice(-1))) expression += "−";
      render();
      return;
    }
    const start = match.index;
    const before = expression.slice(0, start);
    const number = match[0];
    const previous = before.slice(-1);
    if (previous === "−" && (before.length === 1 || operators.includes(before.slice(-2, -1)))) {
      expression = before.slice(0, -1) + number;
    } else {
      expression = before + "−" + number;
    }
    render();
  }

  function backspace() {
    if (hasError || justCalculated) { clear(); return; }
    expression = expression.length > 1 ? expression.slice(0, -1) : "0";
    if (expression === "−" || expression === "") expression = "0";
    render();
  }

  function equals() {
    if (hasError) { clear(); return; }
    try {
      const result = calculate(expression);
      expression = prettyNumber(result);
      justCalculated = true;
      hasError = false;
      render();
    } catch (error) {
      hasError = true;
      messageEl.textContent = error.message === "Cannot divide by zero" ? "Division by zero is undefined" : "Complete the expression first";
      render();
      messageEl.textContent = error.message === "Cannot divide by zero" ? "Division by zero is undefined" : "Complete the expression first";
    }
  }

  function showToast(text) {
    toast.textContent = text;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 1800);
  }

  keypad.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    const { action, value } = button.dataset;
    if (action === "clear") clear();
    else if (action === "sign") toggleSign();
    else if (action === "backspace") backspace();
    else if (action === "equals") equals();
    else if (value !== undefined) append(value);
  });

  document.addEventListener("keydown", (event) => {
    if (/^\d$/.test(event.key)) append(event.key);
    else if (event.key === ".") append(".");
    else if (event.key === "+") append("+");
    else if (event.key === "-") append("−");
    else if (event.key === "*") append("×");
    else if (event.key === "/") { event.preventDefault(); append("÷"); }
    else if (event.key === "Enter" || event.key === "=") { event.preventDefault(); equals(); }
    else if (event.key === "Escape") clear();
    else if (event.key === "Backspace") backspace();
  });

  copyButton.addEventListener("click", async () => {
    const value = hasError ? "" : (justCalculated ? expression : (currentPreview() === null ? "" : prettyNumber(currentPreview())));
    if (!value) { showToast("Nothing to copy yet"); return; }
    try {
      await navigator.clipboard.writeText(value);
      showToast("Result copied to clipboard");
    } catch {
      showToast("Clipboard access unavailable in this browser");
    }
  });

  render();
})();
