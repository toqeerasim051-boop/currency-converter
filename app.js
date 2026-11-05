// Currency Converter: live rates from the free Currency API (no key needed).
// Docs: https://github.com/fawazahmed0/exchange-api
const API_URLS = [
  (base) => `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${base}.json`,
  (base) => `https://latest.currency-api.pages.dev/v1/currencies/${base}.json`, // fallback
];
const TIMEOUT_MS = 8000;
const STORAGE_KEY = 'currency-converter:pair';

const form = document.getElementById('converter');
const amountInput = document.getElementById('amount');
const amountCode = document.getElementById('amount-code');
const amountError = document.getElementById('amount-error');
const fromSelect = document.getElementById('from');
const toSelect = document.getElementById('to');
const fromFlag = document.getElementById('from-flag');
const toFlag = document.getElementById('to-flag');
const swapButton = document.getElementById('swap');
const result = document.getElementById('result');
const resultFrom = document.getElementById('result-from');
const resultValue = document.getElementById('result-value');
const resultRate = document.getElementById('result-rate');
const resultError = document.getElementById('result-error');
const retryButton = document.getElementById('retry');
const updated = document.getElementById('updated');

const currencyNames = (() => {
  try {
    return new Intl.DisplayNames(['en'], { type: 'currency' });
  } catch {
    return null;
  }
})();
const nameOf = (code) => currencyNames?.of(code) ?? code;

// ---------- Rates (cached per base currency) ----------
const ratesCache = new Map(); // 'usd' -> Promise<{ date, rates }>

async function fetchJson(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

async function loadRates(base) {
  let lastError;
  for (const buildUrl of API_URLS) {
    try {
      const data = await fetchJson(buildUrl(base));
      if (!data[base]) throw new Error('Unexpected response');
      return { date: data.date, rates: data[base] };
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}

function getRates(base, { refresh = false } = {}) {
  const key = base.toLowerCase();
  if (refresh || !ratesCache.has(key)) {
    const request = loadRates(key);
    request.catch(() => ratesCache.delete(key)); // don't cache failures
    ratesCache.set(key, request);
  }
  return ratesCache.get(key);
}

// ---------- Formatting ----------
function formatNumber(value) {
  const abs = Math.abs(value);
  const options =
    abs === 0 || abs >= 1
      ? { minimumFractionDigits: 2, maximumFractionDigits: 2 }
      : { maximumSignificantDigits: 4 };
  return new Intl.NumberFormat('en', options).format(value);
}

function formatDate(isoDate) {
  const date = new Date(`${isoDate}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return isoDate;
  return new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeZone: 'UTC' }).format(date);
}

// ---------- UI ----------
function fillSelect(select, selected) {
  const codes = Object.keys(CURRENCY_FLAGS);
  select.replaceChildren(
    ...codes.map((code) => new Option(`${code} — ${nameOf(code)}`, code, false, code === selected)),
  );
}

function updateFlags() {
  fromFlag.src = `https://flagcdn.com/w40/${CURRENCY_FLAGS[fromSelect.value]}.png`;
  toFlag.src = `https://flagcdn.com/w40/${CURRENCY_FLAGS[toSelect.value]}.png`;
  amountCode.textContent = fromSelect.value;
}

function readAmount() {
  const raw = amountInput.value.trim();
  const amount = Number(raw);
  let message = '';
  if (raw === '') message = 'Enter an amount.';
  else if (!Number.isFinite(amount) || amount < 0) message = 'Enter a positive number.';
  else if (amount > 1e12) message = 'That amount is too large.';
  amountError.textContent = message;
  amountInput.setAttribute('aria-invalid', String(Boolean(message)));
  return message ? null : amount;
}

function showError(isError) {
  resultError.hidden = !isError;
  result.classList.toggle('result--error', isError);
}

let latestRequest = 0;

async function convert({ refresh = false } = {}) {
  const amount = readAmount();
  const from = fromSelect.value;
  const to = toSelect.value;
  savePair(from, to);
  updateFlags();
  if (amount === null) return;

  const requestId = ++latestRequest;
  result.setAttribute('aria-busy', 'true');
  result.classList.add('result--loading');
  showError(false);

  try {
    const { date, rates } = await getRates(from, { refresh });
    if (requestId !== latestRequest) return; // a newer conversion started meanwhile
    const rate = from === to ? 1 : rates[to.toLowerCase()];
    if (typeof rate !== 'number') throw new Error(`No rate for ${to}`);

    resultFrom.textContent = `${formatNumber(amount)} ${nameOf(from)} =`;
    resultValue.textContent = `${formatNumber(amount * rate)} ${to}`;
    resultRate.textContent = `1 ${from} = ${formatNumber(rate)} ${to} · 1 ${to} = ${formatNumber(1 / rate)} ${from}`;
    updated.textContent = `Rates updated ${formatDate(date)}`;
  } catch (error) {
    if (requestId !== latestRequest) return;
    console.error(error);
    resultFrom.textContent = ' ';
    resultValue.textContent = '—';
    resultRate.textContent = ' ';
    showError(true);
  } finally {
    if (requestId === latestRequest) {
      result.setAttribute('aria-busy', 'false');
      result.classList.remove('result--loading');
    }
  }
}

// ---------- Remember the last pair ----------
function savePair(from, to) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ from, to }));
  } catch {
    /* storage may be disabled; not important */
  }
}

function loadPair() {
  try {
    const pair = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (pair && CURRENCY_FLAGS[pair.from] && CURRENCY_FLAGS[pair.to]) return pair;
  } catch {
    /* ignore corrupt or blocked storage */
  }
  return { from: 'USD', to: 'PKR' };
}

// ---------- Events ----------
let typingTimer;
amountInput.addEventListener('input', () => {
  clearTimeout(typingTimer);
  typingTimer = setTimeout(convert, 250);
});
fromSelect.addEventListener('change', () => convert());
toSelect.addEventListener('change', () => convert());

swapButton.addEventListener('click', () => {
  [fromSelect.value, toSelect.value] = [toSelect.value, fromSelect.value];
  swapButton.classList.toggle('swap--turned');
  convert();
});

document.querySelectorAll('.chip').forEach((chip) => {
  chip.addEventListener('click', () => {
    fromSelect.value = chip.dataset.from;
    toSelect.value = chip.dataset.to;
    convert();
  });
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  convert({ refresh: true });
});
retryButton.addEventListener('click', () => convert({ refresh: true }));

// ---------- Start ----------
const pair = loadPair();
fillSelect(fromSelect, pair.from);
fillSelect(toSelect, pair.to);
convert();
