function itemsToText(items = []) {
worldDiv.replaceChildren(container);
document.getElementById("storyBox").textContent = tellTheStory(world);
}


async function postJSON(url, body) {
const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
if (!res.ok) throw new Error(`${url} failed: ${res.status}`);
return res.json();
}


function getFormDataObj(form) {
const data = new FormData(form);
const obj = {};
for (const [k, v] of data.entries()) {
obj[k] = isNaN(v) ? v : Number(v);
}
return obj;
}


// Wire up form actions
const form = document.getElementById("updateForm");
form.addEventListener("submit", async (e) => {
e.preventDefault();
const body = getFormDataObj(form);
try {
await postJSON("/update", body);
await loadWorld();
form.reset();
} catch (err) {
alert("Update failed: " + err.message);
}
});


// Excite button (append !!!)
document.getElementById("exciteBtn").addEventListener("click", async () => {
const body = getFormDataObj(form);
try {
await postJSON("/excite", body);
await loadWorld();
} catch (err) {
alert("Excite failed: " + err.message);
}
});


// Manual refresh
document.getElementById("refreshBtn").addEventListener("click", loadWorld);


// Initial load
loadWorld();