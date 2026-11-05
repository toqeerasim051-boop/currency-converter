# 💱 Currency Converter

A clean, responsive **currency converter** that uses live exchange rates for **150 world currencies**. Built with plain **HTML, CSS and JavaScript**, with no frameworks and no API key.

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

---

## ✨ Features

- **Live conversion**: the result updates as you type or change a currency (no page reload).
- **150 currencies** with flags and full names (for example "PKR — Pakistani Rupee").
- **One-click swap** of the From and To currencies.
- **Popular conversions** (USD → PKR, EUR → USD, GBP → PKR, AED → PKR, SAR → PKR).
- **Exchange rate both ways**, for example `1 USD = 276.55 PKR · 1 PKR = 0.003616 USD`, plus the date of the rates.
- **Reliable**: a backup API address, an 8-second timeout, rates cached per currency, and a clear error message with **Try again**.
- **Input validation**: empty, negative or huge amounts show a message next to the field.
- **Remembers** your last currency pair (LocalStorage).
- **Responsive and accessible**: works from 320px phones to desktops, has **automatic dark mode**, labelled fields, keyboard focus rings, results announced to screen readers, and respects reduced motion.

---

## 🛠️ Tech Stack

- HTML5, CSS3 (custom properties, Grid, Flexbox, media queries)
- JavaScript (ES6+): `fetch`, `async/await`, `AbortController`, `Intl.NumberFormat`, `Intl.DisplayNames`
- [Currency API](https://github.com/fawazahmed0/exchange-api) for exchange rates (free, no key)
- [flagcdn](https://flagcdn.com) for flags, [Font Awesome](https://fontawesome.com) for icons, [Inter](https://fonts.google.com/specimen/Inter) font

📄 See [EXTERNALS.md](./EXTERNALS.md) for details on the external services.

---

## 🚀 Run it

No build step is needed.

1. Download or clone the repo:
   ```bash
   git clone https://github.com/toqeerasim051-boop/currency-converter.git
   ```
2. Open `index.html` in your browser, or use a local server such as the VS Code **Live Server** extension.

---

## 📁 Project Structure

```
currency-converter/
├── index.html      # page layout
├── style.css       # design, dark mode, responsive rules
├── app.js          # fetching rates, conversion, events
├── currencies.js   # currency code -> flag country code
├── favicon.svg
├── EXTERNALS.md    # external services used
└── License
```

---

## ⚙️ How it works

1. `currencies.js` lists every supported currency with the country used for its flag.
2. `app.js` fills both dropdowns, adding full names with `Intl.DisplayNames`.
3. When the amount or a currency changes, it loads `…/currencies/{from}.json` (one request per base currency, then cached) and multiplies the amount by the rate.
4. If the main API address fails, it tries the backup address. If both fail, it shows an error with a **Try again** button.

---

## 👤 Author

**Touqeer Asim**: [GitHub](https://github.com/toqeerasim051-boop) · [LinkedIn](https://www.linkedin.com/in/touqeer-asim-960b06395/)

## 📄 License

This project is licensed under the **MIT License**: you are free to use, modify and distribute it.
