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

async function loadWorld() {
    const data = await getJSON("/world.json");
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

document.getElementById("refreshBtn").addEventListener("click", loadWorld);

const findForm = document.getElementById("findForm");
findForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const res = await postJSON("/find", body);
    const lines = (res.results || []).map(x => `${x.path}`);
    document.getElementById("resultsBox").textContent = lines.length ? lines.join("\n") : "(no matches)";
});

const replaceForm = document.getElementById("replaceForm");
replaceForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const body = formToObj(replaceForm);
    const res = await postJSON("/replace", body);
    if (res.changed) {
        document.getElementById("resultsBox").textContent =
            `Changed first match at ${res.changed.town} -> ${res.changed.region}`;
    } else {
        document.getElementById("resultsBox").textContent = "(no change)";
    }
    await loadWorld();
});

loadWorld();
