# 🔗 External Services

Third-party services and resources used by the **Currency Converter**. None of them need an API key.

---

## 🌐 Currency API (exchange rates)

- **Provider:** [fawazahmed0/exchange-api](https://github.com/fawazahmed0/exchange-api) (free, updated daily)
- **Main URL:** `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/{base}.json`
- **Backup URL:** `https://latest.currency-api.pages.dev/v1/currencies/{base}.json` (used automatically if the main one fails)
- `{base}` is a lowercase currency code, such as `usd`.

Example response (shortened):

```json
{
  "date": "2026-11-05",
  "usd": {
    "pkr": 276.55,
    "eur": 0.86
  }
}
```

---

## 🏳️ flagcdn (flags)

- **URL:** `https://flagcdn.com/w40/{country}.png`, where `{country}` is a lowercase country code (`us`, `pk`, `eu`).
- Shows the flag for the selected currency. The currency-to-country map is in `currencies.js`.

---

## 🎨 Font Awesome (icons)

- **Version:** 6.6.0, from cdnjs
- Icons for the logo, swap button, dropdown arrows, refresh and errors.

```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css" />
```

---

## 🔤 Google Fonts

- **Font:** [Inter](https://fonts.google.com/specimen/Inter) (weights 400–700)
