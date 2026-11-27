// Deal Scout — app state: search, filters, sorting, hash routing.
// The list is the single source of truth; every control re-renders it.
import { CATEGORIES, DEALS, META, STORES, discountPct, money, saved } from "./data.js";
import { cardHTML, detailHTML } from "./views.js";

const grid = document.getElementById("grid");
const detail = document.getElementById("detail");
const empty = document.getElementById("empty");
const count = document.getElementById("count");
const best = document.getElementById("best");
const search = document.getElementById("search");
const chips = document.getElementById("category-chips");
const storeFilter = document.getElementById("store-filter");
const discountFilter = document.getElementById("discount-filter");
const sort = document.getElementById("sort");

const state = { q: "", category: "All", store: "All stores", minPct: 0, sort: "pct" };
const VERDICT_RANK = { "new-low": 0, strong: 1, routine: 2 };

function moneyWhole(n) {
  return "$" + Math.round(n).toLocaleString("en-US");
}

function renderStats() {
  const totalSaved = DEALS.reduce((s, d) => s + saved(d), 0);
  const avg = Math.round(DEALS.reduce((s, d) => s + discountPct(d), 0) / DEALS.length);
  const newLows = DEALS.filter((d) => d.verdict === "new-low").length;
  document.getElementById("stats").innerHTML = `
    <div class="stat"><b>${DEALS.length}</b><span>verified deals</span></div>
    <div class="stat"><b>${avg}%</b><span>average discount</span></div>
    <div class="stat"><b>${moneyWhole(totalSaved)}</b><span>total savings if you bought them all</span></div>
    <div class="stat"><b>${newLows}</b><span>at their lowest price ever</span></div>`;
  document.getElementById("checked-line").textContent =
    `Prices checked ${META.checked} · ${META.saleWindow}`;
}

function renderBest() {
  const top = [...DEALS].sort((a, b) => saved(b) - saved(a)).slice(0, 5);
  best.innerHTML = `<h2>Best deals of the day — biggest dollars saved</h2><ol>${top
    .map(
      (d, i) =>
        `<li><span><span class="rank">#${i + 1}</span><a href="#/deal/${d.id}">${d.name}</a> · ${d.store}</span><span class="save">save ${money(saved(d))}</span></li>`,
    )
    .join("")}</ol>`;
}

function applyFilters() {
  const q = state.q.trim().toLowerCase();
  let list = DEALS.filter((d) => {
    if (state.category !== "All" && d.category !== state.category) return false;
    if (state.store !== "All stores" && d.store !== state.store) return false;
    if (discountPct(d) < state.minPct) return false;
    if (q && !(d.name + " " + d.store + " " + d.category).toLowerCase().includes(q)) return false;
    return true;
  });
  const by = {
    pct: (a, b) => discountPct(b) - discountPct(a) || saved(b) - saved(a),
    saved: (a, b) => saved(b) - saved(a),
    price: (a, b) => a.sale - b.sale,
    verdict: (a, b) => VERDICT_RANK[a.verdict] - VERDICT_RANK[b.verdict] || discountPct(b) - discountPct(a),
  };
  list.sort(by[state.sort]);
  return list;
}

function renderList() {
  const list = applyFilters();
  grid.innerHTML = list.map(cardHTML).join("");
  count.textContent = `${list.length} of ${DEALS.length} deals · sorted by ${sort.options[sort.selectedIndex].text.toLowerCase()}`;
  empty.hidden = list.length > 0;
  grid.hidden = false;
  detail.hidden = true;
}

function renderDetail(id) {
  const d = DEALS.find((x) => x.id === id);
  if (!d) {
    location.hash = "#/";
    return;
  }
  grid.hidden = true;
  best.hidden = true;
  count.textContent = "";
  empty.hidden = true;
  detail.innerHTML = detailHTML(d);
  detail.hidden = false;
  window.scrollTo(0, 0);
}

function route() {
  const m = location.hash.match(/^#\/deal\/([\w-]+)$/);
  if (m) {
    renderDetail(m[1]);
  } else {
    best.hidden = false;
    renderList();
  }
}

function buildControls() {
  chips.innerHTML = CATEGORIES.map(
    (c) => `<button class="chip" type="button" data-cat="${c}" aria-pressed="${c === "All"}">${c}</button>`,
  ).join("");
  chips.addEventListener("click", (e) => {
    const b = e.target.closest(".chip");
    if (!b) return;
    state.category = b.dataset.cat;
    chips.querySelectorAll(".chip").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    renderList();
  });
  storeFilter.innerHTML = STORES.map((s) => `<option>${s}</option>`).join("");
  search.addEventListener("input", () => {
    state.q = search.value;
    renderList();
  });
  storeFilter.addEventListener("change", () => {
    state.store = storeFilter.value;
    renderList();
  });
  discountFilter.addEventListener("change", () => {
    state.minPct = Number(discountFilter.value);
    renderList();
  });
  sort.addEventListener("change", () => {
    state.sort = sort.value;
    renderList();
  });
  window.addEventListener("hashchange", route);
}

function applyQueryParams() {
  // Shareable views: ?cat=Tech&store=Amazon&min=40&sort=saved&q=dyson
  // also lets a screenshot show a filter visibly working.
  const p = new URLSearchParams(location.search);
  const cat = p.get("cat");
  if (cat && CATEGORIES.includes(cat)) state.category = cat;
  const store = p.get("store");
  if (store && STORES.includes(store)) state.store = store;
  const min = Number(p.get("min"));
  if ([20, 40, 50].includes(min)) state.minPct = min;
  const s = p.get("sort");
  if (["pct", "saved", "price", "verdict"].includes(s)) state.sort = s;
  const q = p.get("q");
  if (q) state.q = q;
  search.value = state.q;
  storeFilter.value = state.store;
  discountFilter.value = String(state.minPct);
  sort.value = state.sort;
  chips.querySelectorAll(".chip").forEach((x) =>
    x.setAttribute("aria-pressed", String(x.dataset.cat === state.category)),
  );
}

renderStats();
renderBest();
buildControls();
applyQueryParams();
route();
