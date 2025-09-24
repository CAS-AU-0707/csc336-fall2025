
const STORAGE_KEY = "irl-quest-log";
/** @type {Array<{id:string,title:string,description:string,section:string,repeats:boolean,color?:string,done:boolean,createdAt:number}>} */
let quests = [];

const form = document.querySelector("#quest-form");
const els = {
  title: document.querySelector("#title"),
  description: document.querySelector("#description"),
  section: document.querySelector("#section"),
  repeats: document.querySelector("#repeats"),
  color: document.querySelector("#labelColor"),
  errors: document.querySelector("#errors"),
  lists: {
    daily: document.querySelector("#daily-list"),
    weekly: document.querySelector("#weekly-list"),
    monthly: document.querySelector("#monthly-list"),
    main: document.querySelector("#main-list"),
  },
};

function save() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(quests)); } catch { } }
function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) quests = JSON.parse(raw);
  } catch { }
}
load();
renderAll();

function setError(msgs) { els.errors.innerHTML = msgs.map(m => `<div>• ${m}</div>`).join(""); }
function clearError() { els.errors.textContent = ""; }
function uid() { return Math.random().toString(36).slice(2, 10); }

function validate() {
  const errors = [];
  const title = els.title.value.trim();
  if (!title) errors.push("Title is required.");
  if (title && title.length < 3) errors.push("Title must be at least 3 characters.");

  const section = els.section.value;
  if (!section) errors.push("Choose a section.");
  return errors;
}

function renderAll() {
  for (const key of Object.keys(els.lists)) { els.lists[key].innerHTML = ""; }
  for (const q of quests) {
    const li = document.createElement("li");
    li.className = "quest" + (q.done ? " done" : "");
    li.dataset.id = q.id;
    li.style.borderLeft = q.color ? `6px solid ${q.color}` : "6px solid transparent";

    const title = document.createElement("div");
    title.className = "title";
    title.textContent = q.title;

    const meta = document.createElement("div");
    meta.className = "meta";
    const bits = [];
    if (q.repeats) bits.push("Repeats");
    meta.innerHTML = bits.map(b => `<span class="badge">${b}</span>`).join(" ");

    const desc = document.createElement("div");
    desc.className = "desc";
    desc.textContent = q.description || "";

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "REMOVE";
    removeBtn.className = "remove-btn";
    removeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      quests = quests.filter(item => item.id !== q.id);
      save();
      renderAll();
    });

    li.appendChild(title);
    if (q.repeats) li.appendChild(meta);
    if (q.description) li.appendChild(desc);
    li.appendChild(removeBtn);

    const ul = els.lists[q.section];
    if (ul) ul.appendChild(li);
  }
}

document.addEventListener("click", (e) => {
  const li = e.target.closest(".quest");
  if (!li) return;
  const id = li.dataset.id;
  const q = quests.find(q => q.id === id);
  if (!q) return;
  q.done = !q.done;
  save();
  renderAll();
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const problems = validate();
  if (problems.length) { setError(problems); return; }
  clearError();

  const quest = {
    id: uid(),
    title: els.title.value.trim(),
    description: els.description.value.trim(),
    section: els.section.value,
    repeats: !!els.repeats.checked,
    color: els.color.value || undefined,
    done: false,
    createdAt: Date.now(),
  };

  quests.push(quest);
  save();

  els.title.value = "";
  els.description.value = "";
  els.repeats.checked = false;
  renderAll();
});
