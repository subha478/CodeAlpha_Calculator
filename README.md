# Nova — Smart Calculator

A polished, responsive calculator built with **HTML, CSS, and vanilla JavaScript**. No frameworks or build tools required.

## Features

- Addition, subtraction, multiplication, and division
- Live result preview while entering an expression
- Clear (`AC`), toggle sign (`+/−`), decimal point, and backspace
- Keyboard support: digits, `.`, `+`, `-`, `*`, `/`, `Enter`, `=`, `Escape`, and `Backspace`
- Copy-result button
- Responsive premium dark UI with violet and cyan accents
- Accessible labels, focus states, and reduced-motion support
- Safe arithmetic parser — does not use `eval()`

## Run locally

1. Download or clone this repository.
2. Open `index.html` in your browser.

Optional: use the **Live Server** extension in VS Code for a local development server.

## Push to GitHub

Create an empty repository on GitHub, then run these commands inside this project folder:

```bash
git init
git add .
git commit -m "Build Nova premium calculator"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

Replace `YOUR-USERNAME` and `YOUR-REPOSITORY` with your GitHub details.

## Project structure

```text
premium-calculator/
├── index.html
├── style.css
├── script.js
└── README.md
```

## Keyboard shortcuts

| Key | Action |
|---|---|
| `0`–`9` | Enter a digit |
| `.` | Decimal point |
| `+` `-` `*` `/` | Arithmetic operators |
| `Enter` or `=` | Calculate |
| `Backspace` | Delete the last character |
| `Escape` | Clear the calculator |

## Notes

- The Google Fonts import is optional; system fallbacks are included.
- This is a front-end project. It does not require an API, database, or environment variables.
