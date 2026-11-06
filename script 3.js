/* ===== EDIT THIS BLOCK FIRST ===== */
const CONFIG = {
  contactEmail: "miaskylerdaniels@gmail.com",
  formEndpoint: "",                       // e.g. a Formspree URL. Leave empty to open the visitor's email app instead.
  paypalLink: "https://www.paypal.me/YOURNAME", // your PayPal.me link
  eft: "Bank: YOUR BANK\nAccount name: YOUR NAME\nAccount no: ADD HERE\nBranch code: ADD HERE\nReference: your email address",
  crypto: [{ coin: "Bitcoin (BTC)", address: "ADD YOUR BTC ADDRESS" }, { coin: "USDT (TRC20)", address: "ADD YOUR USDT ADDRESS" }],
};

const SERVICES = [
  ["Editing and proofreading", "A careful read that tightens your manuscript and fixes the slips."],
  ["Kindle cover design", "Covers that look right in the Amazon thumbnail."],
  ["KDP formatting", "Your book laid out and ready to upload."],
  ["Blurbs, bios and outreach", "Descriptions and pitch emails to readers, agents and publishers."],
  ["CVs and cover letters", "Clear, confident documents that get you interviews."],
  ["Pitches and proposals", "Elevator pitches, presentation scripts and business proposals."]
];

// [title, Amazon ID, Kindle price, direct price]. Leave prices as null until you set them: the direct-buy button stays hidden.
const BOOKS = [
  ["Nothing Can Hold Us", "B0HN8485NB", 1.49, null],
  ["The Last Library", "B0H8XJQBFJ", 1.99, null],
  ["Post Meridian", "B0H7Z19VJZ", 2.00, null],
  ["My Reasons Why", "B0H4YQ773G", 2.99, null],
  ["Rethinking Racism", "B0H512CGKP", 3.01, null],
  ["The Cost of Hope", "B0H5384MZ8", 2.99, null],
  ["Mad Monday", "B0H4X4BKRB", 2.99, null],
  ["The Boy Called Uncle", "B0H4X1681D", 2.99, null],
  ["When the World Forgot", "B0H7Z8MBTK", 1.79, null],
  ["The Things I Wanted You to Know", "B0H9KS61RQ", 1.48, null],
  ["The Other History", "B0HKW1WXM2", 1.29, null]
];

const QUOTES = [ // PLACEHOLDERS: replace with real quotes
  ["Replace this with a real client quote about a problem you solved.", "Client name, town"],
  ["Short and specific works best: what was stuck, and how it felt afterwards.", "Client name, town"],
  ["Ask permission before you publish anyone's words or name.", "Client name, town"]
];

const POSTS = [
  { t: "Ysense: paid surveys and tasks", d: "Answer surveys and do small online tasks for cash. Payouts are modest and some countries get fewer offers, so check availability before you sign up.", url: "https://www.ysense.com/?rb=YOUR_REFERRAL_ID", cta: "Visit Ysense" },
  { t: "Your next free-money site", d: "Add another review here: what it pays, how to withdraw, and what to watch out for.", url: "#", cta: "Add link" },
  { t: "Sell more of your own books", d: "Add a post about what has worked for you: Kindle keywords, covers, and where to find readers.", url: "#contact", cta: "Get help launching" }
];

/* ===== CODE ===== */
const $ = (s, r = document) => r.querySelector(s);
const money = n => "$" + n.toFixed(2);
const el = (h) => { const t = document.createElement("template"); t.innerHTML = h.trim(); return t.content.firstChild; };
const esc = s => s.replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

$("#serviceGrid").append(...SERVICES.map(([t, d]) => el(`<article class="card"><h3>${esc(t)}</h3><p>${esc(d)}</p></article>`)));
$("#quotes").append(...QUOTES.map(([q, n]) => el(`<figure class="quote" style="margin:0"><p>“${esc(q)}”</p><figcaption><b>${esc(n)}</b></figcaption></figure>`)));
$("#posts").append(...POSTS.map(p => el(`<article class="post"><h3>${esc(p.t)}</h3><p>${esc(p.d)}</p><a class="btn small" href="${p.url}" ${p.url.startsWith("http") ? 'target="_blank" rel="sponsored noopener"' : ""}>${esc(p.cta)}</a></article>`)));
$("#bookGrid").append(...BOOKS.map(b => { const [t, id] = b; return el(`<article class="book"><div class="cover">${esc(t)}</div><h3>${esc(t)}</h3>
  <small>${b[3] ? `Kindle ${money(b[2])} · Direct ${money(b[3])}` : (b[2] ? `Kindle ${money(b[2])}` : "Price on Amazon")}</small>
  <a class="btn ghost" href="https://www.amazon.com/dp/${id}" target="_blank" rel="noopener">Buy on Kindle</a>
  ${b[3] ? `<button class="btn" data-add="${id}">Buy direct</button>` : ""}</article>`); }));

/* cart */
const price = id => BOOKS.find(b => b[1] === id)[3] || 0;
const sum = () => cart.reduce((t, id) => t + price(id), 0);
let cart = [];
try { cart = JSON.parse(localStorage.getItem("cart") || "[]"); } catch (e) { cart = []; }
const save = () => { try { localStorage.setItem("cart", JSON.stringify(cart)); } catch (e) {} };
const drawer = $("#drawer"), scrim = $("#scrim");
function render() {
  $("#cartCount").textContent = cart.length;
  const list = $("#cartList");
  list.replaceChildren(...(cart.length ? cart.map(id => el(`<li><span>${esc(BOOKS.find(b => b[1] === id)[0])} (ebook)</span><span>${money(price(id))} <button data-rm="${id}">Remove</button></span></li>`)) : [el("<li>Your cart is empty. Add a book to get started.</li>")]));
  $("#cartTotal").textContent = money(sum());
  $("#checkout").disabled = !cart.length;
  if (!cart.length) $("#pay").hidden = true;
}
const toggle = open => { drawer.classList.toggle("open", open); drawer.setAttribute("aria-hidden", !open); scrim.hidden = !open; if (open) $("#cartClose").focus(); };
document.addEventListener("click", e => {
  const a = e.target.closest("[data-add]"), r = e.target.closest("[data-rm]"), p = e.target.closest("[data-pay]");
  if (a && !cart.includes(a.dataset.add)) { cart.push(a.dataset.add); save(); render(); toggle(true); }
  else if (a) toggle(true);
  if (r) { cart = cart.filter(x => x !== r.dataset.rm); save(); render(); }
  if (p) {
    const total = money(sum()), names = cart.map(id => BOOKS.find(b => b[1] === id)[0]).join(", ");
    $("#payInfo").innerHTML = p.dataset.pay === "eft"
      ? `<b>Pay ${total} by bank transfer</b><br>${esc(CONFIG.eft).replace(/\n/g, "<br>")}<br>Then email proof of payment to ${esc(CONFIG.contactEmail)}.`
      : `<b>Send the equivalent of ${total}</b><br>${CONFIG.crypto.map(c => `${esc(c.coin)}: ${esc(c.address)}`).join("<br>")}<br>Then email the transaction ID and "${esc(names)}" to ${esc(CONFIG.contactEmail)}.`;
  }
  if (e.target.closest("[data-plan]")) $("select[name=plan]").value = e.target.closest("[data-plan]").dataset.plan;
});
$("#cartOpen").onclick = () => toggle(true);
$("#cartClose").onclick = scrim.onclick = () => toggle(false);
document.addEventListener("keydown", e => { if (e.key === "Escape") toggle(false); });
$("#checkout").onclick = () => { $("#pay").hidden = false; $("#payPaypal").href = CONFIG.paypalLink + "/" + sum().toFixed(2) + "USD"; $("#payInfo").innerHTML = ""; };

/* nav, form, footer */
const nav = $("#nav"), burger = $("#burger");
burger.onclick = () => burger.setAttribute("aria-expanded", nav.classList.toggle("open"));
nav.addEventListener("click", e => { if (e.target.tagName === "A") { nav.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); } });
$("#yr").textContent = new Date().getFullYear();
$("#mailLink").textContent = CONFIG.contactEmail; $("#mailLink").href = "mailto:" + CONFIG.contactEmail;
$("#contactForm").addEventListener("submit", async e => {
  e.preventDefault();
  const f = e.target, msg = $("#formMsg");
  if (!f.checkValidity()) { msg.textContent = "Please fill in your name, a valid email and the problem."; return; }
  const d = Object.fromEntries(new FormData(f));
  if (CONFIG.formEndpoint) {
    try { const r = await fetch(CONFIG.formEndpoint, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(d) }); if (!r.ok) throw 0; msg.textContent = "Thanks. We'll reply with a price and plan soon."; f.reset(); }
    catch (x) { msg.textContent = "Couldn't send. Please email " + CONFIG.contactEmail + " instead."; }
  } else {
    location.href = `mailto:${CONFIG.contactEmail}?subject=${encodeURIComponent("Request: " + d.plan)}&body=${encodeURIComponent(d.msg + "\n\n" + d.name + " (" + d.email + ")")}`;
    msg.textContent = "Your email app should open. Press send to finish.";
  }
});
render();
