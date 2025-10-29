document.addEventListener("DOMContentLoaded", () => {
  const findForm = document.getElementById("findForm");
  const replaceForm = document.getElementById("replaceForm");
  const worldBox = document.getElementById("worldBox");
  const resultsBox = document.getElementById("resultsBox");
  const statusEl = document.getElementById("status");

  const setStatus = (msg, isError = false) => {
    if (!statusEl) return;
    statusEl.textContent = msg || "";
    statusEl.style.color = isError ? "crimson" : "";
  };

  const formToObj = (form) => {
    const obj = {};
    new FormData(form).forEach((v, k) => (obj[k] = typeof v === "string" ? v.trim() : v));
    return obj;
  };

  const getJSON = async (url) => {
    const res = await fetch(url, { headers: { "Accept": "application/json" } });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return res.json();
  };

  const postJSON = async (url, bodyObj) => {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(bodyObj || {}),
    });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    const text = await res.text();
    return text ? JSON.parse(text) : {};
  };

  const renderWorld = (data) => {
    if (!worldBox) return;
    worldBox.textContent = JSON.stringify(data, null, 2);
  };

  const renderFindResults = (results) => {
    if (!resultsBox) return;
    if (!Array.isArray(results) || results.length === 0) {
      resultsBox.textContent = "(no matches)";
      return;
    }
    const lines = results.map((r) => (r.path ?? JSON.stringify(r)));
    resultsBox.textContent = lines.join("\n");
  };

  const loadWorld = async () => {
    try {
      setStatus("Loading world...");
      const data = await getJSON("/world");
      renderWorld(data);
      setStatus("Loaded.");
    } catch (err) {
      setStatus(`Failed to load world: ${err.message}`, true);
      console.error(err);
    }
  };

  if (findForm) {
    findForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      try {
        setStatus("Searching...");
        const body = formToObj(findForm);
        const res = await postJSON("/find", body);
        renderFindResults(res.results || []);
        setStatus("Search complete.");
      } catch (err) {
        setStatus(`Find failed: ${err.message}`, true);
        console.error(err);
      }
    });
  }

  if (replaceForm) {
    replaceForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      try {
        setStatus("Applying replace...");
        const body = formToObj(replaceForm);
        const res = await postJSON("/replace", body);
        if (typeof res.replacedCount === "number") {
          setStatus(`Replaced ${res.replacedCount} occurrence(s).`);
        } else {
          setStatus("Replace complete.");
        }
        await loadWorld();
      } catch (err) {
        setStatus(`Replace failed: ${err.message}`, true);
        console.error(err);
      }
    });
  }

  loadWorld();
});
