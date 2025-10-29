// ---- original helpers (unchanged) ----
async function getJSON(url) {
    const r = await fetch(url);
    return r.json();
}
async function postJSON(url, body) {
    const r = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
    return r.json();
}
function formToObj(form) {
    const d = new FormData(form);
    const o = {};
    for (const [k, v] of d.entries()) o[k] = (v || "").toString().trim();
    return o;
}

// ---- static-site additions (kept, small tweak below) ----
let worldData = null;

function renderWorld(data) {
    const lines = [];
    (data.regions || []).forEach((r, ri) => {
        lines.push(`[${ri}] ${r.name} (${r.climate})`);
        (r.towns || []).forEach((t, ti) => {
            lines.push(`  [${ri}.${ti}] ${t.name}`);
            (t.notable_people || []).forEach((p, pi) => {
                lines.push(`    [${ri}.${ti}.${pi}] ${p.name} — ${p.role}`);
            });
        });
    });
    document.getElementById("worldDiv").textContent = lines.join("\n") || "(empty)";
}

async function loadWorld() {
    // Static-site: fetch local file next to index.html
    worldData = await getJSON("./world.json");
    renderWorld(worldData);
}

document.getElementById("refreshBtn").addEventListener("click", loadWorld);

const findForm = document.getElementById("findForm");
findForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const { find } = formToObj(findForm);
    const target = (find || "").toLowerCase();
    const results = [];

    if (target && worldData) {
        (worldData.regions || []).forEach((r) => {
            (r.towns || []).forEach((t) => {
                (t.notable_people || []).forEach((p) => {
                    if ((p.name || "").trim().toLowerCase() === target) {
                        results.push(`${t.name} -> ${r.name}`);
                    }
                });
            });
        });
    }

    document.getElementById("resultsBox").textContent =
        results.length ? results.join("\n") : "(no matches)";
});

const replaceForm = document.getElementById("replaceForm");
replaceForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const { find, replace } = formToObj(replaceForm);
    const target = (find || "").toLowerCase();
    const repl = (replace || "").trim();
    let changed = null;

    if (target && repl && worldData) {
        outer: for (let ri = 0; ri < (worldData.regions || []).length; ri++) {
            const r = worldData.regions[ri];
            for (let ti = 0; ti < (r.towns || []).length; ti++) {
                const t = r.towns[ti];
                for (let pi = 0; pi < (t.notable_people || []).length; pi++) {
                    const p = t.notable_people[pi];
                    if ((p.name || "").trim().toLowerCase() === target) {
                        p.name = repl;                 // update in-memory
                        changed = { town: t.name, region: r.name };
                        break outer;
                    }
                }
            }
        }
    }

    document.getElementById("resultsBox").textContent =
        changed ? `Changed first match at ${changed.town} -> ${changed.region}` : "(no change)";

    // KEY CHANGE: re-render from in-memory data; DO NOT re-fetch world.json
    renderWorld(worldData);
});

// Initial render
loadWorld();
