// Deal Scout — view builders: one deal card and one deal detail page.
// All text comes from data.js; prices are formatted here so the discount
// shown always matches the two prices it is worked out from.
import { DEALS, META, VERDICTS, discountPct, money, saved } from "./data.js";

export function verdictBadge(d) {
  const v = VERDICTS[d.verdict];
  return `<span class="badge ${d.verdict}" title="${v.title}">${v.label}</span>`;
}

export function cardHTML(d) {
  return `<a class="card" href="#/deal/${d.id}" data-id="${d.id}">
    <span class="row"><span class="store">${d.store}</span>${verdictBadge(d)}</span>
    <h3>${d.name}</h3>
    <p class="cat">${d.category}</p>
    <span class="price"><span class="sale">${money(d.sale)}</span><span class="usual">${money(d.usual)}</span><span class="off">${discountPct(d)}% off</span></span>
    <span class="save-line">You save ${money(saved(d))}</span>
    <p class="note">${d.note}</p>
    <span class="store-link">View at ${d.store} &rarr;</span>
    <span class="checked-line">Checked ${META.checkedShort} &middot; ${d.source}</span>
  </a>`;
}

export function detailHTML(d) {
  const v = VERDICTS[d.verdict];
  const sameProduct = DEALS.filter((x) => x.name === d.name && x.id !== d.id);
  const compare = sameProduct.length
    ? `<dt>Same product elsewhere</dt><dd>${sameProduct
        .map((x) => `${x.store} ${money(x.sale)} (${discountPct(x)}% off)`)
        .join(" &middot; ")}</dd>`
    : "";
  return `<a class="back" href="#/">&larr; Back to all deals</a>
  <h2>${d.name}</h2>
  <p class="meta">${d.category} &middot; ${d.store}</p>
  <dl>
    <dt>Sale price</dt><dd><strong>${money(d.sale)}</strong></dd>
    <dt>Usual price</dt><dd>${money(d.usual)}</dd>
    <dt>Discount</dt><dd><strong>${discountPct(d)}% off — you save ${money(saved(d))}</strong></dd>
    <dt>Store</dt><dd>${d.store}</dd>
    <dt>Checked</dt><dd>${META.checkedShort}</dd>
    <dt>Source</dt><dd>${d.source}</dd>
    ${compare}
  </dl>
  <div class="verdict-box"><strong>${v.label}.</strong> ${v.title}. ${d.note}</div>
  <p><a class="store-link" href="${d.link}" target="_blank" rel="noopener">View this deal at ${d.store} &rarr;</a></p>
  <p class="checked-line">Prices move fast on Black Friday — check the price at the store before you buy.</p>`;
}
